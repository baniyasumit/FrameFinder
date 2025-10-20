import express from "express";
import { cancelDeclineBooking, changeBookingStatus, checkAvailability, createBooking, getBookingInformation, getBookingInformationPhotographer, getBookings, getBookingsPhotographer, getTotalBookings, getTotalBookingsPhotographer } from "../controllers/BookingController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import bookingMiddlware from './../middlewares/BookingMiddleware.js';

const router = express.Router();

router.post("/create-booking/:portfolioId", authMiddleware, authorizeRoles('client'), createBooking);
router.get('/check-availability', checkAvailability)
router.get('/get-total-bookings', authMiddleware, authorizeRoles('client'), getTotalBookings)
router.get('/get-bookings', authMiddleware, authorizeRoles('client'), getBookings)
router.get('/photographer/get-total-bookings', authMiddleware, authorizeRoles('photographer'), getTotalBookingsPhotographer)
router.get('/photographer/get-bookings', authMiddleware, authorizeRoles('photographer'), getBookingsPhotographer)
router.get('/get-booking/:bookingId', authMiddleware, authorizeRoles('client'), getBookingInformation)
router.get('/photographer/get-booking/:bookingId', authMiddleware, authorizeRoles('photographer'), getBookingInformationPhotographer)
router.patch('/change-booking-status/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), changeBookingStatus)
router.patch('/cancel-decline-booking/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), bookingMiddlware, cancelDeclineBooking)
export default router