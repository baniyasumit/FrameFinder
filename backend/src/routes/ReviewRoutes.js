import express from "express";
import { changeBookingStatus, checkAvailability, createBooking, getBookingInformation, getBookingInformationPhotographer, getBookings, getBookingsPhotographer, getTotalBookings } from "../controllers/BookingController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import { checkReviewStatus, createReview } from "../controllers/ReviewController.js";

const router = express.Router();

router.get('/check-review-status/:bookingId', authMiddleware, authorizeRoles('client'), checkReviewStatus)
router.post('/create-review/:bookingId', authMiddleware, authorizeRoles('client'), createReview)


export default router