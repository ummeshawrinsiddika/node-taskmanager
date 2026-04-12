 const express = require("express");
const { registration, verifyOTP, login, userProfile } = require("../controllars/authController");
const { authMiddleware } = require("./middleware");
const router = express.Router();

router.post("/registration", registration);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/profile", authMiddleware, userProfile);

module.exports = router;
