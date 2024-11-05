// index.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routers/dataRoutes'); // Import the router
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
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

app.use(express.json());
app.use(cors());
app.use('/api', dataRoutes);
app.use('/api', imageRoutes);
app.use('/api', userRoutes);
app.use(bodyParser.json());

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

app.set('socketio', io);

// WebSocket connection setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });

    socket.emit('testEvent', { message: 'Hello from server' });
});

// Stripe checkout session creation
app.post('/create-checkout-session', async (req, res) => {
    const { postName, price, userId, postId, postImage } = req.body;

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
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent'],
        });

        const amount = session.amount_total / 100;
        const metadata = session.payment_intent ? session.payment_intent.metadata : {};
        const userId = metadata.userId || 'No metadata found';
        const postId = metadata.postId || 'No metadata found';
        const paymentIntentId = session.payment_intent ? session.payment_intent.id : sessionId;

        if (!amount || !userId || !postId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const payment = new Payment(paymentIntentId, amount, userId, postId, new Date());
        await db.collection('Payment').doc(paymentIntentId).set(payment.toFirestore());

        const updateResult = await updateFundraisingAmount(postId, amount);
        if (updateResult.error) {
            return res.status(500).json({ error: updateResult.error });
        }

        res.json({ amount, postId, documentId: paymentIntentId, newAmountRaised: updateResult.newAmountRaised });

    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ error: 'Failed to process donation' });
    }
});

// Helper function to update amountRaised in Fundraising collection
async function updateFundraisingAmount(postId, amount) {
    const fundraisingRef = db.collection('Fundraising').doc(postId);

    try {
        const transactionResult = await db.runTransaction(async (transaction) => {
            const fundraisingDoc = await transaction.get(fundraisingRef);
            if (!fundraisingDoc.exists) {
                return { success: false, error: 'Fundraising document not found' };
            }

            const currentAmountRaised = fundraisingDoc.data().amountRaised || 0;
            const newAmountRaised = currentAmountRaised + amount;

            transaction.update(fundraisingRef, { amountRaised: newAmountRaised });
            return { success: true, newAmountRaised };
        });

        return transactionResult.success ? { success: true, newAmountRaised: transactionResult.newAmountRaised } : { error: transactionResult.error };

    } catch (error) {
        return { error: error.message };
    }
}

// Start server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`[SYSTEM] Server started on port ${PORT}...`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
};

// In index.js or main server file
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('testEvent', { message: 'Hello from server' });
});


// app.listen(PORT, () => {
//     console.log(`[SYSTEM] Server started on port ${PORT}...`);
// });
// Only start the server if not in a test environment
// if (process.env.NODE_ENV !== 'test') {
//     server.listen(PORT, () => {
//         console.log(`[SYSTEM] Server started on port ${PORT}...`);
//     });
// }

module.exports = app; // Export the app instance for testing
