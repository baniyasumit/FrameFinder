import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import authorizeRoles from "../middlewares/AuthorizeRoles.js";
import { getRevenueData, getTotalBookingsStatus, getTotals } from "../controllers/DashboardController.js";

const router = express.Router();

router.get('/get-totals', authMiddleware, authorizeRoles('photographer'), getTotals)
router.get('/get-pie-chart-data', authMiddleware, authorizeRoles('photographer'), getTotalBookingsStatus)
router.get('/get-revenue-data', authMiddleware, authorizeRoles('photographer'), getRevenueData)


export default router