import express from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/AuthController.js"
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser)
router.get("/me", authMiddleware, getUserProfile)

export default router;
