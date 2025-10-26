import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import { createMessage, getMessageList, getMessages, getTotalMessages } from "../controllers/MessageController.js";
import bookingMiddlware from "../middlewares/BookingMiddleware.js";

const router = express.Router();

router.post('/create-message/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), bookingMiddlware, createMessage)
router.get('/get-messages/:bookingId', authMiddleware, authorizeRoles('client', 'photographer'), bookingMiddlware, getMessages)
router.get('/get-message-list', authMiddleware, authorizeRoles('client', 'photographer'), getMessageList)
router.get('/get-total-messages', authMiddleware, authorizeRoles('client', 'photographer'), getTotalMessages)



export default router