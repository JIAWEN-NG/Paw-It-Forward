const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK using credentials from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

// Define route for fetching user data by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching user data for ID:", userId);

    // Retrieve user document from Firestore
    const userDoc = await db.collection('Users').doc(userId).get();

    if (!userDoc.exists) {
      console.error("No document found for ID:", userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return relevant fields from Firestore document
    const userData = userDoc.data();
    const { role, profileImage, petDescription, name, email } = userData;
    res.json({ role, profileImage, petDescription, name, email });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Define route for updating user profile by ID
app.put('/api/user/:id', async (req, res) => {
  const userId = req.params.id; // Get user ID from request parameters
  const userData = req.body; // Get user data from request body

  try {
    // Update user document in Firestore
    await db.collection('Users').doc(userId).update(userData);
    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).send({ error: "Failed to update user" });
  }
});

// Start server on specified port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
