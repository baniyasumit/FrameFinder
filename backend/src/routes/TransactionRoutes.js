import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import { getPaymentStatus, intiatePayment, updateAfterPayment } from "../controllers/TransactionController.js";

const router = express.Router();

router.get('/payment-status/:bookingId', authMiddleware, authorizeRoles('client'), getPaymentStatus)
router.post('/initiate-payment/:bookingId', authMiddleware, authorizeRoles('client'), intiatePayment)
router.patch('/update-after-payment/:bookingId', authMiddleware, authorizeRoles('client'), updateAfterPayment)


export default router