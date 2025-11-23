import express from "express";
import { getPortfolios, getPhotographerPortfolio, getPortfolio, getPortfolioPictures, savePortfolio, uploadPortfolioPictures, getServiceTypes } from "../controllers/PortfolioController.js";
import authMiddleware from './../middlewares/AuthMiddleware.js';
import authorizeRoles from './../middlewares/AuthorizeRoles.js';
import { memoryUpload } from "../config/multerConfig.js";


const router = express.Router();

router.patch("/save-portfolio", authMiddleware, authorizeRoles('photographer'), savePortfolio);
router.get("/get-portfolio", authMiddleware, authorizeRoles('photographer'), getPortfolio);
router.post("/upload-portfolio-pictures", authMiddleware, authorizeRoles('photographer'), memoryUpload.array('portfolio', 10), uploadPortfolioPictures);
router.get("/get-portfolio-pictures/:portfolioId", getPortfolioPictures);
router.get("/get-portfolio/:portfolioId", getPhotographerPortfolio);
router.get('/get-portfolios', getPortfolios)
router.get('/service-types', getServiceTypes)

export default router;