import express from "express";
import { GetPortfolio, SavePortfolio } from "../controllers/PortfolioController.js";
import authMiddleware from './../middlewares/AuthMiddleware.js';
import authorizeRoles from './../middlewares/AuthorizeRoles.js';


const router = express.Router();

router.patch("/save-portfolio", authMiddleware, authorizeRoles('photographer'), SavePortfolio);
router.get("/get-portfolio", authMiddleware, authorizeRoles('photographer'), GetPortfolio);

export default router;