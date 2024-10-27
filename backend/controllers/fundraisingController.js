// fundraisingController.js
const { db, admin } = require('../config/firebase');

// Function to create a new fundraising campaign
const createFundraising = async (req, res) => {
    const { title, description, targetAmount,petType } = req.body;
    const userId = "p8v0JBWhlfNZ13DzpBFN"; // Default user ID

    try {
        // Validate required fields
        if (!title || !description || !targetAmount ||!petType) {
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
       
        const bucket = admin.storage().bucket(); // Get the Firebase Storage bucket
        const fileName = `fundraising/${userId}/${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(fileName);

        try {
            // Upload the image to Firebase Storage
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
                resumable: false,
            });

            // Get the file's public URL using Firebase Storage format
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

// Function to delete a fundraising campaign with ID in the request body
const deleteFundraising = async (req, res) => {
    const { id } = req.body; // Expect fundraising campaign ID to be in the request body

    try {
        if (!id) {
            return res.status(400).json({ message: 'Fundraising campaign ID is required' });
        }

        const fundraisingRef = db.collection('Fundraising').doc(id);

        // Check if the fundraising campaign exists
        const doc = await fundraisingRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Fundraising campaign not found' });
        }

        // Optionally, check if the requesting user is authorized to delete the campaign
        const data = doc.data();
        const userId = "p8v0JBWhlfNZ13DzpBFN"; // Default user ID (you may want to replace this with the actual user from auth)
        if (data.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this campaign' });
        }

        // Delete the fundraising campaign
        await fundraisingRef.delete();

        // Return success message
        res.status(200).json({ message: 'Fundraising campaign deleted successfully' });
    } catch (error) {
        console.error('Error deleting fundraising campaign:', error.message);
        res.status(500).json({ error: error.message });
    }
};


// // Function to edit a fundraising campaign by ID
// const editFundraising = async (req, res) => {
//     const { id, title, description, targetAmount,petType } = req.body;

//     try {
//         // Validate required fields
//         if (!id || !title || !description || !targetAmount ||!petType) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         const fundraisingRef = db.collection('Fundraising').doc(id);

//         // Check if the fundraising campaign exists
//         const doc = await fundraisingRef.get();
//         if (!doc.exists) {
//             return res.status(404).json({ message: 'Fundraising campaign not found' });
//         }

//         // Optionally, check if the requesting user is authorized to edit the campaign
//         const data = doc.data();
//         const userId = "p8v0JBWhlfNZ13DzpBFN"; // Default user ID
//         if (data.userId !== userId) {
//             return res.status(403).json({ message: 'Unauthorized to edit this campaign' });
//         }

//         // Update the fundraising campaign
//         const updatedFundraising = {
//             title,
//             description,
//             petType,
//             targetAmount: parseFloat(targetAmount),
//             updatedAt: admin.firestore.Timestamp.now(),
//         };
//         await fundraisingRef.update(updatedFundraising);

//         res.status(200).json({ message: 'Fundraising campaign updated successfully', updatedFundraising });
//     } catch (error) {
//         console.error('Error updating fundraising campaign:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// };
// Add to fundraisingController.js
const editFundraising = async (req, res) => {
    const { id, title, description, petType, targetAmount } = req.body;

    // Basic field validation
    if (!id || !title || !description || !petType || !targetAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Retrieve the fundraising document
        const fundraisingRef = db.collection('Fundraising').doc(id);
        const doc = await fundraisingRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Fundraising post not found' });
        }

        // Check authorization
        const data = doc.data();
        const userId = "p8v0JBWhlfNZ13DzpBFN"; // Replace with actual user authentication
        if (data.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this post' });
        }

        // Prepare updated data
        const updatedData = { title, description, petType, targetAmount: parseFloat(targetAmount) };

        // If a new image is provided, handle the upload
        if (req.file) {
            const bucket = admin.storage().bucket();
            const fileName = `fundraising/${userId}/${Date.now()}_${req.file.originalname}`;
            const file = bucket.file(fileName);

            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
                resumable: false,
            });

            // Add the new image URL to the updatedData object
            updatedData.fundraisingImg = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
        }

        // Update the document
        await fundraisingRef.update(updatedData);

        // Respond with the updated data
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

