// fundraisingController.js
const { db, admin } = require('../config/firebase');

// Function to create a new fundraising campaign
const createFundraising = async (req, res) => {
    const { title, description, targetAmount, petType, userId } = req.body; // Accept userId from frontend

    try {
        // Validate required fields
        if (!title || !description || !targetAmount || !petType || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure the user exists in the Users collection
        const userRef = db.collection('Users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure an image is uploaded
        let fundraisingImg = '';
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Handle image upload
        const bucket = admin.storage().bucket();
        const fileName = `fundraising/${userId}/${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(fileName);

        try {
            // Upload the image to Firebase Storage
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
                resumable: false,
            });

            // Get the file's public URL
            fundraisingImg = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
        } catch (uploadError) {
            console.error('Error uploading image:', uploadError.message);
            return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
        }

        // Create a new fundraising document in the Fundraising collection
        const newFundraising = {
            userId,
            title,
            description,
            petType: petType || "Unknown",
            targetAmount: parseFloat(targetAmount),
            amountRaised: 0,
            createdAt: admin.firestore.Timestamp.now(),
            fundraisingImg
        };

        // Add new fundraising to the Fundraising collection
        const fundraisingRef = await db.collection('Fundraising').add(newFundraising);
        const createdFundraising = { id: fundraisingRef.id, ...newFundraising };

        // Return the newly created fundraising campaign with the auto-generated ID
        res.status(201).json(createdFundraising);
    } catch (error) {
        console.error('Error creating fundraising:', error.message);
        res.status(500).json({ error: error.message });
    }
};


// Function to get all fundraising campaigns
const getAllFundraisings = async (req, res) => {
    const { userId } = req.query;

    try {
        let fundraisingsRef = db.collection('Fundraising');

        if (userId) {
            fundraisingsRef = fundraisingsRef.where('userId', '==', userId);
        }

        const snapshot = await fundraisingsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No fundraising campaigns found' });
        }

        const fundraisings = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                title: data.title,
                description: data.description,
                petType: data.petType || "Unknown",
                targetAmount: data.targetAmount,
                amountRaised: data.amountRaised,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
                fundraisingImg: data.fundraisingImg || ""
            };
        });

        res.status(200).json(fundraisings);
    } catch (error) {
        console.error('Error fetching fundraising campaigns:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to get a specific fundraising campaign by ID
const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const fundraisingRef = db.collection('Fundraising').doc(id);
        const doc = await fundraisingRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Fundraising campaign not found' });
        }

        const data = doc.data();
        const fundraising = {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            petType: data.petType || "Unknown",
            targetAmount: data.targetAmount,
            amountRaised: data.amountRaised,
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
            fundraisingImg: data.fundraisingImg || ""
        };

        res.status(200).json(fundraising);
    } catch (error) {
        console.error('Error fetching fundraising campaign by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to get all fundraising campaigns for a specific user by user ID
const getAllFundraisingsByUserId = async (req, res) => {
    const { userId } = req.params; // Expect userId to be in the URL parameters

    try {
        const fundraisingsRef = db.collection('Fundraising').where('userId', '==', userId);
        const snapshot = await fundraisingsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No fundraising campaigns found for this user' });
        }

        const fundraisings = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                title: data.title,
                description: data.description,
                petType: data.petType || "Unknown",
                targetAmount: data.targetAmount,
                amountRaised: data.amountRaised,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
                fundraisingImg: data.fundraisingImg || ""
            };
        });

        res.status(200).json(fundraisings);
    } catch (error) {
        console.error('Error fetching fundraising campaigns by user ID:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const deleteFundraising = async (req, res) => {
    const { id, userId } = req.body; // Accept userId from the request body

    try {
        if (!id || !userId) {
            return res.status(400).json({ message: 'Fundraising campaign ID and user ID are required' });
        }

        const fundraisingRef = db.collection('Fundraising').doc(id);

        // Check if the fundraising campaign exists
        const doc = await fundraisingRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Fundraising campaign not found' });
        }

        // Check if the requesting user is authorized to delete the campaign
        const data = doc.data();
        if (data.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this campaign' });
        }

        // Delete the fundraising campaign
        await fundraisingRef.delete();
        res.status(200).json({ message: 'Fundraising campaign deleted successfully' });
    } catch (error) {
        console.error('Error deleting fundraising campaign:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to edit a fundraising campaign with dynamic userId from request
const editFundraising = async (req, res) => {
    const { id, title, description, petType, targetAmount, userId } = req.body;

    if (!id || !title || !description || !petType || !targetAmount || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const fundraisingRef = db.collection('Fundraising').doc(id);
        const doc = await fundraisingRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Fundraising post not found' });
        }

        const data = doc.data();
        if (data.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this post' });
        }

        const updatedData = { title, description, petType, targetAmount: parseFloat(targetAmount) };

        if (req.file) {
            const bucket = admin.storage().bucket();
            const fileName = `fundraising/${userId}/${Date.now()}_${req.file.originalname}`;
            const file = bucket.file(fileName);

            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
                resumable: false,
            });

            updatedData.fundraisingImg = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
        }

        await fundraisingRef.update(updatedData);
        res.status(200).json({ message: 'Fundraising post updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating fundraising post:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFundraising,
    getAllFundraisings,
    getPostById,
    getAllFundraisingsByUserId,
    deleteFundraising,
    editFundraising
};

