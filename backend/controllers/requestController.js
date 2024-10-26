//requestController.js
//need a post request to db function

const { db } = require('../config/firebase');

const createRequest = async (req, res) => {
    const { donorId, itemImage, itemsDonated, receiverId, requestMessage, status = "pending" } = req.body;

    try {
        // Check required fields and log any missing ones
        if (!donorId || !itemImage || !itemsDonated || !receiverId || !requestMessage) {
            console.error('Missing required fields:', { donorId, itemImage, itemsDonated, receiverId, requestMessage });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure donor exists in Users collection
        const donorRef = db.collection('Users').doc(donorId);
        const donorDoc = await donorRef.get();

        if (!donorDoc.exists) {
            console.error('Donor not found in Users collection for donorId:', donorId);
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Create request document in Requests collection
        const newRequest = {
            donorId,
            itemImage,
            itemsDonated,
            receiverId,
            requestMessage,
            status,
            createdAt: new Date(),
        };

        await db.collection('Requests').add(newRequest);

        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Error creating request', error });
    }
};

module.exports = {
    createRequest,
};

