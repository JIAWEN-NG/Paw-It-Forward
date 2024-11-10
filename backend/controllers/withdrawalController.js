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

// Function to get all withdrawals by userId
const getAllWithdrawalsByUserId = async (req, res) => {
    const { userId } = req.params; // Expect userId to be in the URL parameters

    // Check if userId is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Query withdrawals collection for documents matching the userId
        const withdrawalsRef = db.collection('Withdrawals').where('userId', '==', userId);
        const snapshot = await withdrawalsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No withdrawals found for this user' });
        }

        const userWithdrawals = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                name: data.name,
                accountNo: data.accountNo,
                amountWithdraw: data.amountWithdraw,
                proofImg: data.proofImg || '',
                postId: data.postId,
                reason: data.reason,
                status: data.status,
                requestedAt: data.requestedAt ? data.requestedAt.toDate().toISOString() : null,
                processedAt: data.processedAt ? data.processedAt.toDate().toISOString() : null, // Include processedAt
                transactionId: data.transactionId || null, // Include transactionId
                rejectionReason: data.rejectionReason || null,
            };
        });

        res.status(200).json(userWithdrawals);
    } catch (error) {
        console.error('Error fetching withdrawals by user ID:', error.message);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createWithdrawal,
    getAllWithdrawals,
    getAllWithdrawalsByUserId,
};
