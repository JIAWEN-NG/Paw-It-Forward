// routers/dataRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../controllers/userController');
const { bucket } = require('../config/firebase');
const marketplaceController = require('../controllers/marketplaceController');
const upload = require('../middleware/uploadImage'); 
const requestController = require('../controllers/requestController');

const app = express();
app.use(cors());

// User Routes
router.get('/users/:id', userController.getUserById);
router.get('/users', (req, res) => {
    console.log('GET /users route hit');
    userController.getAllUsers(req, res);
});

// Donation Routes
// router.put('/marketplace', marketplaceController.editDonation);
// router.get('/marketplace/:id', marketplaceController.getDonationByDonationId);
router.put('/marketplace', upload, marketplaceController.editDonation);
router.delete('/marketplace', marketplaceController.deleteDonation);
router.get('/marketplace', marketplaceController.getAllDonations);
router.get('/marketplace/:id', marketplaceController.getDonationById);
router.post('/marketplace', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Ensure userId is sent in the request body
        const userId = req.body.userId || "p8v0JBWhlfNZ13DzpBFN"; // Use default if not provided

        // Log request body and userId to verify
        console.log('Request Body:', req.body);
        console.log('User ID:', userId);

        console.log(`Uploading file to donations/${userId}/:`, req.file.originalname);

        // Correct the upload path to donations/{userId}/
        const blob = bucket.file(`donations/${userId}/${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            console.error('Upload error:', err);
            return res.status(500).send('Error uploading file.');
        });

        blobStream.on('finish', async () => {
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(blob.name)}`;

            // Attach the image URL to the request body
            req.body.itemImage = imageUrl;

            console.log('Image uploaded successfully. Image URL:', imageUrl);

            // Create the donation entry
            await marketplaceController.createDonation(req, res);
        });

        // End the stream and upload the file
        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error during donation creation:', error);
        res.status(500).send('Error creating donation.');
    }
});


//requests routes 
router.post('/requests', requestController.createRequest);


module.exports = router;
