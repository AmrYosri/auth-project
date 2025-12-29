const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Remove the dot before /

router.post('/register', authController.signUp);

module.exports = router;