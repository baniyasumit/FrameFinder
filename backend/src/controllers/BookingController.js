import Booking from "../models/Booking.js";
import Portfolio from "../models/Portfolio.js";
import Service from "../models/Service.js";

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

export const checkAvailability = async (req, res) => {
    try {
        const { bookingDate, selectedPackage } = req.query;
        if (bookingDate)
            return res.status(200).json({
                message: "The photographer is available"
            });
        else
            return res.status(404).json({
                message: "The photographer is not available"
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getTotalBookings = async (req, res) => {
    try {
        const { bookingStatus = '' } = req.query;

        const limit = 20;

        let filter = {};

        if (bookingStatus && bookingStatus !== 'declined') {
            filter["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            const status = ["declined", "cancelled"];
            filter["bookingStatus.status"] = { $in: status };
        } else if (bookingStatus === 'upcoming') {
            const today = new Date();
            filter = {
                "bookingStatus.status": "accepted",
                "sessionStartDate": { $gte: today },
            };
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

export const getBookings = async (req, res) => {
    try {
        const { pageNum = 1, bookingStatus = '' } = req.query;

        const page = parseInt(pageNum);
        const limit = 20;
        const skip = (page - 1) * limit;

        let filter = {};

        if (bookingStatus && bookingStatus !== 'declined') {
            console.log("Booking Status", bookingStatus);
            filter["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            const status = ["declined", "cancelled"];
            filter["bookingStatus.status"] = { $in: status };
        } else if (bookingStatus === 'upcoming') {
            const today = new Date();
            filter = {
                "bookingStatus.status": "accepted",
                "sessionStartDate": { $gte: today },
            };
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



        const total = await Booking.countDocuments(filter);
        return res.status(200).json({
            message: "Booking List retrived successfully",
            bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalBookings: total,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getBookingsPhotographer = async (req, res) => {
    try {
        const { pageNum = 1, bookingStatus = '' } = req.query;

        const page = parseInt(pageNum);
        const limit = 20;
        const skip = (page - 1) * limit;

        let filter = {};

        if (bookingStatus && bookingStatus !== 'declined') {
            console.log("Booking Status", bookingStatus);
            filter["bookingStatus.status"] = bookingStatus;
        } else if (bookingStatus === 'declined') {
            const status = ["declined", "cancelled"];
            filter["bookingStatus.status"] = { $in: status };
        } else if (bookingStatus === 'upcoming') {
            const today = new Date();
            filter = {
                "bookingStatus.status": "accepted",
                "sessionStartDate": { $gte: today },
            };
        }

        let query = Booking.find(filter).populate({
            path: "user",
            select: "picture",
        }).skip(skip).limit(limit);

        if (bookingStatus === 'upcoming') {
            query = query.sort({ sessionStartDate: 1 });
        }
        else {
            query = query.sort({ createdAt: -1 });
        }

        const bookings = await query;


        const total = await Booking.countDocuments(filter);
        return res.status(200).json({
            message: "Booking List retrived successfully",
            bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalBookings: total,
            },
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

        const finalBooking = {
            booking,
            photographerPortfolio,
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


