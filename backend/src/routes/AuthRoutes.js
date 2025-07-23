import express from "express";
import { changePassword, deleteAccount, editProfile, getUserProfile, loginUser, logoutUser, registerUser, resetEmail, resetPassword, sendOTPEmail, uploadProfilePicture, verifyOtp } from "../controllers/AuthController.js"
import authMiddleware from "../middlewares/AuthMiddleware.js";
import { uploadMiddleware } from "../middlewares/UploadMiddleware.js";

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
router.delete('/delete-account', authMiddleware, deleteAccount)
router.patch('/upload-profile-picture', authMiddleware, uploadMiddleware.single('profile'), uploadProfilePicture)

export default router;
