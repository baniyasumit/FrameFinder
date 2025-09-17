import Booking from "../models/Booking.js";

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
        // Do some validation to check if it already exists

        const booking = new Booking({
            user: userId,
            portfolio: portfolioId,
            service: sessionType,
            sessionStartTime,
            sessionStartDate,
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

        return res.status(201).json({ message: "Booking Created Successfully" })
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
