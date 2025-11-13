import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import { checkTransferability, createStripeAccount, getTransactions, getWalletDetails, withdraw } from './../controllers/WalletController.js';

const router = express.Router();

router.get('/get-wallet', authMiddleware, authorizeRoles('photographer'), getWalletDetails)
router.get('/check-transferability', authMiddleware, authorizeRoles('photographer'), checkTransferability)
router.post('/create-stripe-account', authMiddleware, authorizeRoles('photographer'), createStripeAccount)
router.post('/withdraw', authMiddleware, authorizeRoles('photographer'), withdraw)
router.get('/transactions', authMiddleware, authorizeRoles('photographer'), getTransactions)




export default router