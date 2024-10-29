const express = require('express');
const { storage } = require('../config/firebase');
const router = express.Router();

// Endpoint to retrieve image URLs from Firebase Storage
router.get('/images', async (req, res) => {
    const { fileName } = req.query; // Expect a filename query parameter

    try {
        if (!fileName) {
            return res.status(400).json({ error: 'Filename is required' });
        }
    
        // Get the file reference using the exact path to the file
        const file = storage.file(`about/${fileName}`); // Adjust 'about/' to your folder path if needed
    
        // Get a signed URL for the specific file
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '01-01-2030', // Set expiration date as needed
        });

            res.status(200).json({ url }); // Send the URL to the client
        } catch (error) {
            console.error("Error retrieving image URL:", error);
            res.status(500).json({ error: 'Failed to retrieve image' });
        }
});

module.exports = router;
