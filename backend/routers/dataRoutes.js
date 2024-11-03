// routers/dataRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../controllers/userController'); // Import the controller
//Afsana added
const { bucket } = require('../config/firebase');

const upload = require('../middleware/uploadImage'); 



//Dessy added
const fundraisingController = require('../controllers/fundraisingController');
const withdrawalController = require('../controllers/withdrawalController');

const app = express();
app.use(cors());

// Define the route and link it to the controller function
// User Routes
router.get('/users/:id', userController.getUserById);
router.get('/users', (req, res) => {
    console.log('GET /users route hit');
    userController.getAllUsers(req, res);
});
// You can add more routes related to users here using the same controller



//Dessy added
// Fundraising Routes
router.get('/fundraising', fundraisingController.getAllFundraisings);
router.get('/fundraising/:id', fundraisingController.getPostById);
router.get('/fundraising/user/:userId', fundraisingController.getAllFundraisingsByUserId);
router.delete('/fundraising', fundraisingController.deleteFundraising);


router.post('/fundraising', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Ensure userId is sent in the request body
        const userId = req.body.userId || "p8v0JBWhlfNZ13DzpBFN"; // Use default if not provided

        console.log('Request Body:', req.body);
        console.log('User ID:', userId);

        console.log(`Uploading file to fundraising/${userId}/:`, req.file.originalname);

        // Correct the upload path to fundraising/{userId}/
        const blob = bucket.file(`fundraising/${userId}/${req.file.originalname}`);
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
            req.body.fundraisingImg = imageUrl;

            console.log('Image uploaded successfully. Image URL:', imageUrl);

            // Create the fundraising entry
            await fundraisingController.createFundraising(req, res);
        });

        // End the stream and upload the file
        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error during fundraising creation:', error);
        res.status(500).send('Error creating fundraising.');
    }
});
// The route stays the same as it doesn't need to specify param handling in the URL
router.put('/fundraising', upload, fundraisingController.editFundraising);


// Withdrawal Routes
router.post('/withdrawals', upload, withdrawalController.createWithdrawal);
router.get('/withdrawals', withdrawalController.getAllWithdrawals);

module.exports = router;
