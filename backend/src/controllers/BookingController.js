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
            province,
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
            province,
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

        return res.status(201).json({ message: "Booked Succesfully", bookingId: booking._id })
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

export const getBookingInformation = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" })

        const photographerPortfolio = await Portfolio.findById(booking.portfolio).select('user').populate({
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

        booking.bookingStatus.status = status;
        await booking.save();
        return res.status(200).json({
            message: "Book status updated"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

