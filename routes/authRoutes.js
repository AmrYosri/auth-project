const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // Remove the dot before /

router.post("/register", authController.signUp);
router.post("/login", authController.login);
router.get("/Me", authController.protect, authController.getMe);
module.exports = router;
