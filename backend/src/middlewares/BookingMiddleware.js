//This will hold if the user belongs to the booking or not whether it is phtographer or client

import Booking from "../models/Booking.js";
import mongoose from "mongoose";

const bookingMiddlware = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;
    const role = req.user.role

    let booking;
    try {
        if (role === "client") {
            booking = await Booking.findOne({ _id: bookingId, user: userId });
        } else if (role === "photographer") {
            const bookingObjectId = new mongoose.Types.ObjectId(bookingId);
            const userObjectId = new mongoose.Types.ObjectId(userId);
            const bookings = await Booking.aggregate([
                { $match: { _id: bookingObjectId } },
                {
                    $lookup: {
                        from: "portfolios",
                        localField: "portfolio",
                        foreignField: "_id",
                        as: "portfolio",
                    },
                },
                { $unwind: "$portfolio" },
                { $match: { "portfolio.user": userObjectId } },
                { $limit: 1 },
            ]);
            if (bookings.length > 0) {
                // Convert plain object to Mongoose document
                booking = Booking.hydrate(bookings[0]);
            } else {
                booking = null;
            }
        }

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        req.booking = booking

        next();
    } catch (err) {
        return res.status(401).json({ message: "Server Error" });
    }
};

export default bookingMiddlware;