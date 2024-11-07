// withdrawalController.js
const { db, admin } = require('../config/firebase');

// Function to create a new withdrawal request
const createWithdrawal = async (req, res) => {
    const { accountNo, amountWithdraw, postId, reason, userId } = req.body; // Accept userId from frontend

    // Check for missing fields
    if (!accountNo || !amountWithdraw || !postId || !reason || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure the user exists in the Users collection
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the username from the user's document
    const { name } = userDoc.data();

    // Handle image upload if provided
    let proofImg = '';
    if (!req.file) {
        return res.status(400).json({ message: 'Proof document image is required' });
    }

    const bucket = admin.storage().bucket();
    const fileName = `withdrawals/${userId}/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    try {
        await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype },
            resumable: false,
        });
        proofImg = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
    } catch (uploadError) {
        console.error('Error uploading image:', uploadError.message);
        return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
    }

    // Create a new withdrawal document with status and username
    const newWithdrawal = {
        userId,
        name, // Include username in the document
        accountNo,
        amountWithdraw: parseFloat(amountWithdraw),
        proofImg,
        postId,
        reason,
        status: 'Pending', // Default status
        requestedAt: admin.firestore.Timestamp.now(),
    };

    try {
        const withdrawalRef = await db.collection('Withdrawals').add(newWithdrawal);
        res.status(201).json({ id: withdrawalRef.id, ...newWithdrawal });
    } catch (error) {
        console.error('Error creating withdrawal:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to get all withdrawals
const getAllWithdrawals = async (req, res) => {
    try {
        const snapshot = await db.collection('Withdrawals').get();
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No withdrawals found' });
        }
        const withdrawals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(withdrawals);
    } catch (error) {
        console.error('Error fetching withdrawals:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createWithdrawal,
    getAllWithdrawals,
};
