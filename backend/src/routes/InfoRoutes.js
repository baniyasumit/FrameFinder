import express from "express";

import { sendContactEmail } from "../controllers/InfoController.js";
import contactMiddleware from "../middlewares/ContactMiddleware.js";

const router = express.Router();

router.post('/send-contact-email', contactMiddleware, sendContactEmail)


export default router