// controllers/userController.js
const { db,admin } = require('../config/firebase'); // Adjust if necessary

// Function to get a user by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;
   // console.log(`Received userId: ${userId}`); // Log the userId to verify // Assuming you're using the ID from the URL
    try {
        const userRef = db.collection('Users').doc(userId); // Adjust if collection name is different
        const doc = await userRef.get();
       

        if (!doc.exists) {
          console.log('User not found');
            return res.status(404).json({ message: 'User not found' }); // Proper JSON response
        }

        res.status(200).json(doc.data()); // Return user data
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error message
    }
};
const getAllUsers = async (req, res) => {
  try {
      const snapshot = await db.collection('Users').get(); // Ensure collection name matches Firestore
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(users);
  } catch (error) {
      console.error('Error in getAllUsers:', error.message);
      res.status(500).json({ error: error.message });
  }
};

// Controller for user registration
const registerUser = async (req, res) => {
    const { uid, name, email, petDescription, role, profileImage } = req.body;
    try {
      await db.collection('Users').doc(uid).set({
        name,
        email,
        petDescription: petDescription || '',
        role: role || 'user',
        profileImage: profileImage || '',
        isVerified: false,
        isPhotoVerified: false,
        rejectionReason: '',
      });
      res.status(200).json({ message: 'User successfully registered in Firestore.' });
    } catch (error) {
      console.log("Error saving user to Firestore:", error.message)
      res.status(500).json({ message: 'Error saving user to Firestore', error });
    }
  };
  
  const updateUserPhotoVerification = async (userId, imageUrl) => {
    try {
        const userRef = db.collection('Users').doc(userId);
        await userRef.update({
            verificationPhoto: imageUrl,
            isPhotoVerified: false, // Mark as not verified by default
        });
    } catch (error) {
        console.error('Error updating user with verification photo:', error);
        throw error;
    }
};

const uploadPhotoVerif = async (req, res) => {

  // Ensure the user exists in the Users collection
  const userRef = db.collection('Users').doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return res.status(404).json({ message: 'User not found' });
  }  
  let verificationPhoto='';
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }
  const bucket = admin.storage().bucket();
  const fileName = `verification/${userId}/${Date.now()}_${req.file.originalname}`;
  const file = bucket.file(fileName);

  try {
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      resumable: false,
    });
    verificationPhoto = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

    res.status(201).json({ message: 'File uploaded successfully', url: downloadURL });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};


module.exports = {
    getUserById,
    getAllUsers,
    registerUser,
    updateUserPhotoVerification,
};
