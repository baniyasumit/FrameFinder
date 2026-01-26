import Booking from "../models/Booking.js";
import Portfolio from "../models/Portfolio.js";
import Review from "../models/Review.js";
import mongoose from "mongoose"

export const checkReviewStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const booking = await Booking.findById(bookingId).select('bookingStatus');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (booking.bookingStatus.status !== 'completed') {
            return res.status(400).json({
                message: 'Cannot add review. Booking not completed yet'
            });
        }

        const reviewStatus = await Review.findOne({ 'booking': bookingId })

        if (reviewStatus) {
            return res.status(400).json({ message: "Cannot add review. Reviewed already" })
        }


        return res.status(200).json({ message: "Can Review. Booking completed and not reviewed" })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const createReview = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { rating, description } = req.body;

        const booking = await Booking.findById(bookingId).select('portfolio');
        const portfolioId = portfoiod._id;
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const review = new Review({
            booking: bookingId,
            portfolio: portfolioId,
            rating,
            description
        });

        await review.save();


        const result = await Review.aggregate([
            {
                $match: {
                    portfolio: new mongoose.Types.ObjectId(portfolioId)
                }
            },
            {
                $group: {
                    _id: '$portfolio',
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalReviews: 1,
                    averageRating: { $round: ['$averageRating', 1] }
                }
            }
        ]);


        const overallRating = result[0] || { averageRating: 0, totalReviews: 0 };


        const portfolioAfterRating = await Portfolio.findByIdAndUpdate(portfolioId, { ratingStats: overallRating }, { new: true })

        return res.status(201).json({ message: "Review Successful" })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}