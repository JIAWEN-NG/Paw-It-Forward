const admin = require('firebase-admin');
const db = admin.firestore();

const UserController = {
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      console.log("Fetching user data for ID:", userId);

      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        console.error("No document found for ID:", userId);
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userDoc.data();
      // Extract only the necessary fields
      const { role, profileImage, petDescription, name, email } = userData;

      // Send the data to the frontend
      res.json({ role, profileImage, petDescription, name, email });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      res.status(500).json({ error: 'Error fetching user data', message: error.message });
    }
  },
};

module.exports = UserController;
