// routers/dataRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../contollers/userController'); // Import the controller
const { registerUser } = require('../contollers/userController');

const app = express();
app.use(cors());



// Define the route and link it to the controller function
router.get('/users/:id', userController.getUserById); // Use the controller's function
router.get("/users", userController.getAllUsers);
// You can add more routes related to users here using the same controller
router.post('/register', registerUser);



router.get("/users", (req, res) => {
    console.log('GET /users route hit');
    userController.getAllUsers(req, res);
});


module.exports = router;
