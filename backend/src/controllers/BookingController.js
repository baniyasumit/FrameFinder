import Booking from "../models/Booking.js";
import Portfolio from "../models/Portfolio.js";
import Service from "../models/Service.js";

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const portfolioId = req.params.portfolioId;
        const { sessionType, sessionStartTime, sessionStartDate, sessionEndDate,
            venueName,
            firstName,
            lastName,
            email,
            phoneNumber,
            guestNumber,
            eventDescription,
            specialRequest,
            totalCharge,
        } = req.body;

        const service = await Service.findById(sessionType)
            .select('title description features');
        // Do some validation to check if it already exists
        const startDateTime = new Date(`${sessionStartDate}T${sessionStartTime}:00`);

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
            firstName,
            lastName,
            email,
            phoneNumber,
            guestNumber,
            eventDescription,
            specialRequest,
            totalCharge
        });

        await booking.save();

        return res.status(201).json({ message: "Booking Created Successfully", bookingId: booking._id })
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
