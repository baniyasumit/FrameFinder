import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/dbConfig.js';
import authRoutes from './routes/AuthRoutes.js';
import portfolioRoutes from './routes/PortfolioRoutes.js';
import bookingRoutes from './routes/BookingRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('FrameFinder backend is running')
})

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes)
app.use("/api/booking", bookingRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
