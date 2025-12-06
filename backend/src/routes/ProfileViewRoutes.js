import express from "express";
import { addProfileView } from "../controllers/ProfileViewController.js";


const router = express.Router();

router.post('/add', addProfileView)


export default router