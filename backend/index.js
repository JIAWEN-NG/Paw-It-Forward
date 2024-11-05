// index.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routers/dataRoutes'); // Import the router
//afsana added
const { db } = require('./config/firebase'); // Firebase configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe initialization
const Payment = require('./models/paymentModel'); // Import the Payment model
const imageRoutes = require('./routers/imageRoutes');
const userRoutes = require('./routers/dataRoutes'); // Import the router
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const PORT = 8000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow the frontend to connect
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

app.use(express.json());
app.use(cors());

// console.log('Router is being mounted');
app.use('/api', dataRoutes); // Use the imported router
app.use('/api', imageRoutes);
app.use('/api', userRoutes); // Use the imported router
app.use(bodyParser.json()); // To parse JSON request bodies

// Health check endpoint
app.get('/get-data', async (req, res) => {
    try {
        const snapshot = await db.collection('Users').get();
        const data = snapshot.docs.map(doc => doc.data());
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Attach the Socket.IO instance to the Express app
app.set('socketio', io);
// WebSocket connection setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

// Helper function to update amountRaised in Fundraising collection
async function updateFundraisingAmount(postId, amount) {
    const fundraisingRef = db.collection('Fundraising').doc(postId);

    try {
        // Run transaction to safely update amountRaised
        const transactionResult = await db.runTransaction(async (transaction) => {
            const fundraisingDoc = await transaction.get(fundraisingRef);
            if (!fundraisingDoc.exists) {
                console.error("Fundraising document not found for postId:", postId);
                return { success: false, error: 'Fundraising document not found' };
            }

            const currentAmountRaised = fundraisingDoc.data().amountRaised || 0;
            const newAmountRaised = currentAmountRaised + amount;
            console.log(`Current amountRaised: ${currentAmountRaised}, New amountRaised: ${newAmountRaised}`);

            // Update amountRaised in the Fundraising document
            transaction.update(fundraisingRef, { amountRaised: newAmountRaised });
            return { success: true, newAmountRaised };
        });

        // Check transaction result
        if (!transactionResult.success) {
            console.error("Transaction failed:", transactionResult.error);
            return { error: transactionResult.error };
        }

        console.log("Updated amountRaised in Fundraising for postId:", postId);
        return { success: true, newAmountRaised: transactionResult.newAmountRaised };

    } catch (error) {
        console.error("Error in transaction for updating amountRaised:", error);
        return { error: error.message };
    }
}

// Stripe checkout session creation
app.post('/create-checkout-session', async (req, res) => {
    const { postName, price, userId, postId, postImage } = req.body;

    console.log("Creating checkout session with metadata:", { postName, price, userId, postId, postImage });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'paynow'],
            line_items: [
                {
                    price_data: {
                        currency: 'sgd',
                        product_data: {
                            name: postName,
                            images: [postImage],
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:8080/donation-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:8080/cancel',
            payment_intent_data: {
                metadata: {
                    userId: userId || 'unknown_user',
                    postId: postId || 'unknown_post',
                    postImage: postImage || 'no_image_provided',
                },
            },
        });

        console.log("Session created successfully:", session);
        
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Endpoint to retrieve checkout session, store payment, and update fundraising
app.get('/get-checkout-session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent'],
        });
        console.log("Retrieved session from Stripe:", session);

        // Extracting data from session
        const amount = session.amount_total / 100; // Convert from cents to SGD
        const metadata = session.payment_intent ? session.payment_intent.metadata : {};
        const userId = metadata.userId || 'No metadata found';
        const postId = metadata.postId || 'No metadata found';
        const paymentIntentId = session.payment_intent ? session.payment_intent.id : sessionId;

        // Validate data
        if (!amount || !userId || !postId) {
            console.error("Invalid data. Required fields are missing:", { amount, userId, postId });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Store payment in the Payment collection
        const payment = new Payment(paymentIntentId, amount, userId, postId, new Date());
        await db.collection('Payment').doc(paymentIntentId).set(payment.toFirestore());
        console.log("Donation recorded with ID:", paymentIntentId);

        // Update amountRaised in the Fundraising collection
        const updateResult = await updateFundraisingAmount(postId, amount);
        if (updateResult.error) {
            return res.status(500).json({ error: updateResult.error });
        }

        // Respond with updated amount
        res.json({ amount, postId, documentId: paymentIntentId, newAmountRaised: updateResult.newAmountRaised });

    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ error: 'Failed to process donation' });
    }
});

app.listen(PORT, () => {
    console.log(`[SYSTEM] Server started on port ${PORT}...`);
});
    // Example: Listen for a message event from the client
    socket.on('joinChat', (chatId) => {
        socket.join(chatId); // Join a room for the specific chat
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// In index.js or main server file
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('testEvent', { message: 'Hello from server' });
});


// app.listen(PORT, () => {
//     console.log(`[SYSTEM] Server started on port ${PORT}...`);
    
// });
// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`[SYSTEM] Server started on port ${PORT}...`);
    });
}

module.exports = app; // Export the app instance for testing


