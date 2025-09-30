import express from "express";
import { changeBookingStatus, checkAvailability, createBooking, getBookingInformation, getBookingInformationPhotographer } from "../controllers/BookingController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";

const router = express.Router();

router.post("/create-booking/:portfolioId", authMiddleware, authorizeRoles('client'), createBooking);
router.get('/check-availability', checkAvailability)
router.get('/get-booking/:bookingId', authMiddleware, authorizeRoles('client'), getBookingInformation)
router.get('/get-booking-photographer/:bookingId', authMiddleware, authorizeRoles('photographer'), getBookingInformationPhotographer)
router.patch('/change-booking-status/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), changeBookingStatus)
export default router