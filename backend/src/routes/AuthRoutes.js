import express from "express";
import { changePassword, editProfile, getUserProfile, loginUser, logoutUser, registerUser, resetEmail, resetPassword, sendOTPEmail, verifyOtp } from "../controllers/AuthController.js"
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser)
router.get("/me", authMiddleware, getUserProfile)
router.post("/send-otp-email", authMiddleware, sendOTPEmail)
router.post('/verify-otp', authMiddleware, verifyOtp)
router.post('/reset-password-email', resetEmail)
router.patch('/reset-password/:token', resetPassword)
router.patch('/change-password', authMiddleware, changePassword)
router.patch('/edit-profile', authMiddleware, editProfile)

export default router;
