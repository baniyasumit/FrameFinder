import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, resetEmail, resetPassword, sendOTPEmail, verifyOtp } from "../controllers/AuthController.js"
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser)
router.get("/me", authMiddleware, getUserProfile)
router.post("/send-otp-email", authMiddleware, sendOTPEmail)
router.post('/verify-otp', authMiddleware, verifyOtp)
router.post('/reset-password-email', resetEmail)
router.post('/reset-password/:token', resetPassword)

export default router;
