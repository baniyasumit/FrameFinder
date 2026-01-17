import Booking from "../models/Booking.js";
import Portfolio from "../models/Portfolio.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";

import mongoose from "mongoose"
const { ObjectId } = mongoose.Types;

import Stripe from "stripe";
import Wallet from "../models/Wallet.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getBookingDates = async (req, res) => {
    try {
        const { currentMonth, currentYear, portfolioId } = req.query;
        const today = new Date();
        const month = currentMonth || today.getMonth() + 1;
        const year = currentYear || today.getFullYear();

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const bookings = await Booking.find({
            portfolio: portfolioId,
            sessionStartDate: { $lt: endDate },
            sessionEndDate: { $gte: startDate },
            "bookingStatus.status": { $nin: ["declined", "cancelled"] },
            "payment.status": { $ne: "unpaid" }
        }).select('sessionStartDate sessionEndDate bookingStatus.status');
        return res.status(200).json({
            message: "Booking Dates fetched succesfully",
            bookings: bookings
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const portfolioId = req.params.portfolioId;
        const { sessionType, sessionStartTime, sessionStartDate, sessionEndDate,
            venueName,
            city,
            state,
            firstName,
            lastName,
            email,
            phoneNumber,
            guestNumber,
            eventDescription,
            specialRequest,
            duration,
        } = req.body;

        const portfolio = await Portfolio.findById(portfolioId)
            .select('standardCharge')
        const service = await Service.findById(sessionType)
            .select('title description features price');

        // Do some validation to check if it already exists
        const startDateTime = new Date(`${sessionStartDate}T${sessionStartTime}:00`);
        const totalCharge = {
            'standardCharge': portfolio.standardCharge,
            'packageCharge': service.price,
            'duration': duration
        }
        const payment = {
            'remaining': (service.price * duration) + portfolio.standardCharge
        }
        const booking = new Booking({
            user: userId,
            portfolio: portfolioId,
            service: {
                title: service.title,
                description: service.description,
                features: service.features
            },
            sessionStartDate: startDateTime,
            sessionEndDate,
            venueName,
            city,
            state,
            firstName,
            lastName,
            email,
            phoneNumber,
            guestNumber,
            eventDescription,
            specialRequest,
            totalCharge,
            payment
        });

        await booking.save();

        return res.status(201).json({ message: "Booking Created", bookingId: booking._id })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}


export const getTotalBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingStatus = '' } = req.query;

        const limit = 20;

        let filter = {};
        filter["user"] = userId;
        if (bookingStatus && bookingStatus !== 'declined') {
            filter["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            const status = ["declined", "cancelled"];
            filter["bookingStatus.status"] = { $in: status };
        } else if (bookingStatus === 'upcoming') {
            const today = new Date();
            filter["bookingStatus.status"] = 'accepted';
            filter["sessionStartDate"] = { $gte: today };
        }
        const total = await Booking.countDocuments(filter);
        return res.status(200).json({
            message: "Booking List retrived successfully",
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getTotalBookingsPhotographer = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new ObjectId(userId);
        const { bookingStatus = '' } = req.query;

        const limit = 20;
        const today = new Date();
        let matchStage = { "payment.status": { $ne: "unpaid" } };

        if (bookingStatus === 'completed' || bookingStatus === 'pending') {
            matchStage["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            matchStage["bookingStatus.status"] = { $in: ["declined", "cancelled"] };
        } else if (bookingStatus === 'upcoming') {
            matchStage["bookingStatus.status"] = 'accepted';
            matchStage["sessionStartDate"] = { $gte: today };
        }

        const totalResult = await Booking.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "portfolios",
                    localField: "portfolio",
                    foreignField: "_id",
                    as: "portfolio"
                }
            },
            { $unwind: "$portfolio" },
            { $match: { "portfolio.user": userObjectId } },
            { $count: "total" }
        ]);
        const total = totalResult[0]?.total || 0;
        return res.status(200).json({
            message: "Booking List retrived successfully",
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { pageNum = 1, bookingStatus = '' } = req.query;

        const page = parseInt(pageNum);
        const limit = 20;
        const skip = (page - 1) * limit;

        let filter = {};
        filter["user"] = userId;
        if (bookingStatus && bookingStatus !== 'declined') {
            console.log("Booking Status", bookingStatus);
            filter["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            const status = ["declined", "cancelled"];
            filter["bookingStatus.status"] = { $in: status };
        } else if (bookingStatus === 'upcoming') {
            const today = new Date();
            filter["bookingStatus.status"] = 'accepted';
            filter["sessionStartDate"] = { $gte: today };
        }

        let query = Booking.find(filter).populate({
            path: "portfolio",
            select: "user",
            populate: {
                path: "user",
                model: "User",
                select: "firstname lastname picture"
            }
        }).skip(skip).limit(limit);

        if (bookingStatus === 'upcoming') {
            query = query.sort({ sessionStartDate: 1 });
        }
        else {
            query = query.sort({ createdAt: -1 });
        }

        const bookings = await query;

        return res.status(200).json({
            message: "Booking List retrived successfully",
            bookings
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getBookingsPhotographer = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new ObjectId(userId);
        const { pageNum = 1, bookingStatus = '', pageLimit = 20 } = req.query;
        const page = parseInt(pageNum);
        const limit = parseInt(pageLimit);
        const skip = (page - 1) * limit;

        const today = new Date();
        let matchStage = { "payment.status": { $ne: "unpaid" } };

        if (bookingStatus === 'completed' || bookingStatus === 'pending') {
            matchStage["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            matchStage["bookingStatus.status"] = { $in: ["declined", "cancelled"] };
        } else if (bookingStatus === 'upcoming') {
            matchStage["bookingStatus.status"] = 'accepted';
            matchStage["sessionStartDate"] = { $gte: today };
        }

        // Get bookings
        const bookings = await Booking.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "portfolios",
                    localField: "portfolio",
                    foreignField: "_id",
                    as: "portfolio"
                }
            },
            { $unwind: "$portfolio" },
            { $match: { "portfolio.user": userObjectId } },

            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { firstname: 1, lastname: 1, picture: 1 } }
                    ],
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $sort: bookingStatus === 'upcoming' ? { sessionStartDate: 1 } : { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

        ]);

        return res.status(200).json({
            message: "Booking List retrieved successfully",
            bookings,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}


export const getBookingInformation = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" })

        const photographerPortfolio = await Portfolio.findById(booking.portfolio).select('user ratingStats').populate({
            path: 'user',
            select: '-password -_id -__v -pictureSecretUrl -resetPasswordToken -resetPasswordExpires -role'
        });

        if (!photographerPortfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        let payment = {}
        if (booking.bookingStatus.status === 'cancelled') {
            payment = await Payment.findOne({ booking: booking._id })
                .select(
                    "-_id paymentStatus paymentType amount platformFee netAmount createdOn lastUpdated refundInfo"
                )
                .sort({ createdOn: -1 });
        }
        const refundInfo = payment?.refundInfo
        const finalBooking = {
            booking,
            photographerPortfolio,
            refundInfo
        };
        return res.status(200).json({ message: "Photographer Portfolio retrieved Successfully", bookingInformation: finalBooking });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getBookingInformationPhotographer = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId)
            .populate('user', 'picture')
            .lean();
        if (!booking) return res.status(404).json({ message: "Booking not found" })

        return res.status(200).json({
            message: "Photographer Portfolio retrieved Successfully", bookingInformation: booking
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const changeBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { status } = req.body;
        if (!status || status === undefined) return res.status(400).json({ message: "Status required" })
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" })

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { 'bookingStatus.status': status },
            { new: true }
        );

        if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
        return res.status(200).json({
            message: "Book status updated"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}


export const cancelDeclineBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = req.booking;
        const role = req.user.role;

        const { status } = req.body;
        if (!status || status === undefined) return res.status(400).json({ message: "Status required" })

        const payment = await Payment.findOne({ booking: bookingId })
        let refundAmount;
        let reason;
        if (role === 'photographer') {
            refundAmount = payment.amount;
            reason = "cancelled_by_photographer"
        } else if (role === 'client') {
            refundAmount = payment.netAmount;
            reason = "cancelled_by_client"
        }

        let stripeRefund
        try {
            stripeRefund = await stripe.refunds.create({
                payment_intent: payment.stripePaymentIntentId,
                amount: refundAmount * 100
            });
        } catch (stripeError) {
            console.error("Stripe refund failed:", stripeError);
            return res.status(500).json({ message: "Stripe refund failed" });
        }

        booking.bookingStatus.status = status;
        payment.paymentStatus = "refunded";
        payment.refundInfo = {
            amount: refundAmount,
            refundedOn: new Date(),
            stripeRefundId: stripeRefund.id,
            reason: reason
        };

        const wallet = await Wallet.findOne({ user: payment.receiver });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet Not found"
            });
        }

        wallet.onHold -= payment.netAmount;

        await booking.save();
        await payment.save()
        await wallet.save()

        return res.status(200).json({
            message: "Book Cancelled"
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}


export const endBookedEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.bookingId;
        const booking = req.booking;

        const wallet = await Wallet.findOne({ user: userId })
        if (!wallet) return res.status(404).json({ message: "Wallet not found" })

        const payment = await Payment.findOne({ booking: bookingId })
        booking.bookingStatus.status = 'completed'
        wallet.onHold -= payment.netAmount;
        wallet.availableBalance += payment.netAmount;

        await booking.save()
        await wallet.save()

        return res.status(200).json({
            message: "Booking Completed and wallet updated"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}





