const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routers/dataRoutes'); // Import the router
const { db } = require('./config/firebase'); // Firebase configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe initialization
const Payment = require('./models/paymentModel'); // Import the Payment model
const imageRoutes = require('./routers/imageRoutes');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
// const upload = require('./middleware/uploadImage'); // Import the Multer middleware

// thahmina added
const multer = require('multer');
const { getAllTestimonials, uploadTestimonial } = require('./controllers/testimonialController');

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


// thahmina added
app.use(bodyParser.json());
const upload = multer({ storage: multer.memoryStorage() });


// console.log('Router is being mounted');
app.use('/api', dataRoutes); // Use the imported router
app.use('/api', imageRoutes);

app.use(bodyParser.json()); // To parse JSON request bodies

// Testimonials routes
app.get('/testimonials', getAllTestimonials);
app.post('/upload-testimonial', upload.single('image'), uploadTestimonial);
// Define route for fetching user data by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching user data for ID:", userId);

    const userDoc = await db.collection('Users').doc(userId).get();

    if (!userDoc.exists) {
      console.error("No document found for ID:", userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const { role, profileImage, petDescription, name, email } = userData;
    res.json({ role, profileImage, petDescription, name, email });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
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
            success_url: 'http://localhost:3000/donation-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
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
}

module.exports = app; // Export the app instance for testing


// Define route for updating user profile by ID
// app.put('/api/user/:id', async (req, res) => {
//   const userId = req.params.id;
//   const userData = req.body;

//   try {
//     await db.collection('Users').doc(userId).update(userData);
//     res.status(200).send({ message: 'User updated successfully' });
//   } catch (error) {
//     console.error("Error updating user:", error.message);
//     res.status(500).send({ error: "Failed to update user" });
//   }
// });

// // Define route for uploading user profile photos
// app.post('/api/user/:id/upload', upload, async (req, res) => {
//   const userId = req.params.id; // Get user ID from request parameters
//   console.log(`Received upload request for user ID: ${userId}`);

//   try {
//     if (!req.file) {
//       console.error("No file uploaded!");
//       return res.status(400).json({ message: 'No file uploaded!' });
//     }

//     const fileBuffer = req.file.buffer; // Get the uploaded file buffer
//     console.log(`File uploaded successfully. File size: ${fileBuffer.length} bytes`);

//     const fileName = `profilePhotos/${userId}.png`; // Create a file name based on user ID
//     const file = bucket.file(fileName); // Create a file object in the bucket

//     // Upload the file buffer to Firebase Storage
//     await file.save(fileBuffer, {
//       metadata: {
//         contentType: req.file.mimetype,
//       },
//       public: true // Make it public (optional)
//     });

//     const photoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`; // Get the file's public URL
//     console.log(`Uploaded file URL: ${photoURL}`);

//     // Update Firestore with the new photo URL
//     await db.collection('Users').doc(userId).update({
//       profileImage: photoURL // Update the user's profile image URL
//     });

//     res.status(200).json({ message: 'File uploaded and URL saved!', photoURL });
//   } catch (error) {
//     console.error("Error uploading photo:", error.message);
//     res.status(500).json({ message: 'Error uploading photo', error: error.message });
//   }
// });


