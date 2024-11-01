// routers/dataRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../controllers/userController'); // Import the controller
const chatController = require('../controllers/chatController');
const requestController = require('../controllers/requestController');




const app = express();
app.use(cors());



// Define the route and link it to the controller function
router.get('/users/:id', userController.getUserById); // Use the controller's function
router.get("/users", userController.getAllUsers);
// You can add more routes related to users here using the same controller

//request routes
router.post('/requests/sendRequest', requestController.createRequest); // Create a new request
router.put('/requests/:requestId/accept', requestController.acceptRequest); // Accept a request
router.put('/requests/:requestId/decline', requestController.declineRequest); // Decline a request


// Chat routes
router.get('/chats/:chatId', chatController.getChatById); // Retrieve all chats
router.post('/chats/sendMessage', chatController.sendMessage); // Send a chat message
// uter.post('/messages/sendRequestMessage', chatController.sendMessageForNewRequest); // Send a request messagero
router.get('/chats/:chatId/messages', chatController.retrieveMessages); // Retrieve messages for a chat
router.get('/chats/user/:userId', chatController.getUserChats); // Retrieve chats for a user



module.exports = router;
