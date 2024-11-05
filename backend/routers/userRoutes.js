const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// Route to get user data by user ID
router.get('/:id', UserController.getUser);

module.exports = router;
