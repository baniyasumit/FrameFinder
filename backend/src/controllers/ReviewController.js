import Booking from "../models/Booking.js";
import Portfolio from "../models/Portfolio.js";
import Review from "../models/Review.js";

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

        const review = new Review({
            booking: bookingId,
            rating,
            description
        });

        await review.save();

        const booking = await Booking.findById(bookingId).select('portfolio');
        const portfolioId = booking.portfolio;
        console.log('Portfolio ID:', portfolioId);

        const result = await Review.aggregate([
            // 1️⃣ Join Booking data
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'booking',
                    foreignField: '_id',
                    as: 'booking'
                }
            },
            // 2️⃣ Flatten the booking array
            { $unwind: '$booking' },
            // 3️⃣ Match only the target portfolio
            {
                $match: {
                    'booking.portfolio': portfolioId
                }
            },
            // 4️⃣ Group and calculate average rating (no rounding yet)
            {
                $group: {
                    _id: '$booking.portfolio',
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            // 5️⃣ Round the average rating (expression stage)
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