// routers/dataRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');

const app = express();
app.use(cors());

const userController = require('../controllers/userController'); // Import the controller

//Afsana added
const { bucket } = require('../config/firebase');
const marketplaceController = require('../controllers/marketplaceController');
const upload = require('../middleware/uploadImage'); 
const requestController = require('../controllers/requestController');
const withdrawalController = require('../controllers/withdrawalController');

//Dessy added
const fundraisingController = require('../controllers/fundraisingController');
const { registerUser } = require('../controllers/userController');
const chatController = require('../controllers/chatController');

//thahmina added
const testimonialController = require('../controllers/testimonialController'); // Import the testimonial controller

// thahmina added
// Testimonial routes
router.get('/testimonials', testimonialController.getAllTestimonials); // Get all testimonials
router.post('/upload-testimonial', upload, testimonialController.uploadTestimonial); // Upload a new testimonial with an image



// user routes
router.get('/users/:id', userController.getUserById); // Use the controller's function
router.post('/register', registerUser);

//request routes
//router.post('/requests/sendRequest', requestController.createRequest); // Create a new request
router.put('/requests/:requestId/accept', requestController.acceptRequest); // Accept a request
router.put('/requests/:requestId/decline', requestController.declineRequest); // Decline a request
router.post('/requests', requestController.createRequest);

//jia wen added
const adminController = require('../controllers/adminController');

// Admin routes
router.patch('/admin/users/:userId/approve', adminController.approveUser);
router.patch('/admin/users/:userId/reject', adminController.rejectUser);
router.get('/admin/users', adminController.getUserByStatus);
router.get('/admin/withdrawals', adminController.getAllWithdrawals);
router.patch('/admin/withdrawals/:requestId/approve', adminController.approveWithdrawal);
router.patch('/admin/withdrawals/:requestId/reject', adminController.rejectWithdrawal);

// Chat routes
router.get('/chats/:chatId', chatController.getChatById); // Retrieve all chats
router.post('/chats/sendMessage', chatController.sendMessage); // Send a chat message
router.get('/chats/:chatId/messages', chatController.retrieveMessages); // Retrieve messages for a chat
router.get('/chats/user/:userId', chatController.getUserChats); // Retrieve chats for a user

//Dessy added
// Fundraising Routes
router.get('/fundraising', fundraisingController.getAllFundraisings);
router.get('/fundraising/:id', fundraisingController.getPostById);
router.get('/fundraising/user/:userId', fundraisingController.getAllFundraisingsByUserId);
router.delete('/fundraising', fundraisingController.deleteFundraising);
router.put('/fundraising', upload, fundraisingController.editFundraising);

// Withdrawal Routes
router.post('/withdrawals', upload, withdrawalController.createWithdrawal);
router.get('/withdrawals', withdrawalController.getAllWithdrawals);
router.get('/withdrawals/:userId', withdrawalController.getAllWithdrawalsByUserId);

//Afsana added 
// Donation Routes
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
        const userId = req.body.userId ; 

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

router.post('/fundraising', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Ensure userId is sent in the request body
        const userId = req.body.userId;

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

// Photo verification route
router.post('/photo-verification', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {

        const userId = req.body.userId; // Assume `userId` is provided in the request body

        console.log('Uploading verification photo for User ID:', userId);
        
        const blob = bucket.file(`verification/${userId}/${req.file.originalname}`);
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
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
            console.log('Verification photo uploaded successfully. Image URL:', imageUrl);

            // Store the image URL in the user's profile in Firestore for admin verification
            await userController.updateUserPhotoVerification(userId, imageUrl);
            // await userController.updateUserPhotoVerification(req, res);
            res.status(200).json({ message: 'Photo uploaded for verification.', imageUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading verification photo:', error);
        res.status(500).send('Server error: Unable to upload photo for verification.');
    }
});



module.exports = router;