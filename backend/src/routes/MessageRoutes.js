import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import { createMessage, getMessages } from "../controllers/MessageController.js";
import bookingMiddlware from "../middlewares/BookingMiddleware.js";

const router = express.Router();

router.post('/create-message/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), bookingMiddlware, createMessage)
router.get('/get-messages/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), bookingMiddlware, getMessages)


export default router