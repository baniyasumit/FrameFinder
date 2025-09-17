import express from "express";
import { checkAvailability, createBooking } from "../controllers/BookingController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";

const router = express.Router();

router.post("/create-booking/:portfolioId", authMiddleware, authorizeRoles('client'), createBooking);
router.get('/check-availability', checkAvailability)

export default router