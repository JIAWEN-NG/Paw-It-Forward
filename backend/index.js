const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const upload = require('./middleware/uploadImage'); // Import the Multer middleware
const { db, admin, bucket } = require('./config/firebase'); // Import Firebase setup

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed

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

// Define route for updating user profile by ID
app.put('/api/user/:id', async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    await db.collection('Users').doc(userId).update(userData);
    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).send({ error: "Failed to update user" });
  }
});

// Define route for uploading user profile photos
app.post('/api/user/:id/upload', upload, async (req, res) => {
  const userId = req.params.id; // Get user ID from request parameters
  console.log(`Received upload request for user ID: ${userId}`);

  try {
    if (!req.file) {
      console.error("No file uploaded!");
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const fileBuffer = req.file.buffer; // Get the uploaded file buffer
    console.log(`File uploaded successfully. File size: ${fileBuffer.length} bytes`);

    const fileName = `profilePhotos/${userId}.png`; // Create a file name based on user ID
    const file = bucket.file(fileName); // Create a file object in the bucket

    // Upload the file buffer to Firebase Storage
    await file.save(fileBuffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
      public: true // Make it public (optional)
    });

    const photoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`; // Get the file's public URL
    console.log(`Uploaded file URL: ${photoURL}`);

    // Update Firestore with the new photo URL
    await db.collection('Users').doc(userId).update({
      profileImage: photoURL // Update the user's profile image URL
    });

    res.status(200).json({ message: 'File uploaded and URL saved!', photoURL });
  } catch (error) {
    console.error("Error uploading photo:", error.message);
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Start server on specified port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
