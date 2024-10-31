// controllers/userController.js
const { db } = require('../config/firebase'); // Adjust if necessary

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


module.exports = {
    getUserById,
    getAllUsers
};
