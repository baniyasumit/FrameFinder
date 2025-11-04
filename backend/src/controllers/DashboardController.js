import Booking from "../models/Booking.js";

import mongoose from "mongoose"
import Portfolio from "../models/Portfolio.js";
const { ObjectId } = mongoose.Types;

export const getTotals = async (req, res) => {
    try {
        const today = new Date();
        const userId = req.user.id;
        const userObjectId = new ObjectId(userId);

        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

        const bookings = await Booking.aggregate([
            // Match bookings that are paid and within the last 2 months
            {
                $match: {
                    "payment.status": { $ne: "unpaid" },
                    createdAt: { $gte: firstDayOfPreviousMonth, $lte: lastDayOfCurrentMonth }
                }
            },

            // Lookup portfolio to filter by photographer
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

            // Lookup user info (client)
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

            // Add a label for month category
            {
                $addFields: {
                    monthCategory: {
                        $cond: [
                            { $gte: ["$createdAt", firstDayOfCurrentMonth] },
                            "currentMonth",
                            "previousMonth"
                        ]
                    }
                }
            },

            // Group by month category to count bookings and sum total revenue for completed ones
            {
                $group: {
                    _id: "$monthCategory",
                    totalBookings: { $sum: 1 },
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ["$bookingStatus.status", "completed"] },
                                "$totalCharge.total",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const totalBookings = {
            currentMonth: bookings.find(b => b._id === "currentMonth")?.totalBookings || 0,
            previousMonth: bookings.find(b => b._id === "previousMonth")?.totalBookings || 0,
        };

        const totalRevenue = {
            currentMonth: bookings.find(b => b._id === "currentMonth")?.totalRevenue || 0,
            previousMonth: bookings.find(b => b._id === "previousMonth")?.totalRevenue || 0,
        };

        // 🧮 Helper for percentage change
        const calculatePercentageChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return (((current - previous) / previous) * 100).toFixed(2);
        };

        // 🧾 Add percentage changes
        totalBookings.percentageChange = calculatePercentageChange(
            totalBookings.currentMonth,
            totalBookings.previousMonth
        );

        totalRevenue.percentageChange = calculatePercentageChange(
            totalRevenue.currentMonth,
            totalRevenue.previousMonth
        );

        const portfolio = await Portfolio.findOne({ user: userId })


        return res.status(200).json({
            message: "Dashboard total data successfully fetched",
            totalBookings,
            totalRevenue,
            ratingStats: portfolio.ratingStats,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getTotalBookingsStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new ObjectId(userId);

        const bookingStatusAggregation = await Booking.aggregate([
            {
                $match: {
                    "payment.status": { $ne: "unpaid" }
                }
            },
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

            // ✅ Normalize status names (merge cancelled + declined)
            {
                $addFields: {
                    normalizedStatus: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$bookingStatus.status", "pending"] }, then: "Pending" },
                                { case: { $eq: ["$bookingStatus.status", "cancelled"] }, then: "Cancelled/Declined" },
                                { case: { $eq: ["$bookingStatus.status", "declined"] }, then: "Cancelled/Declined" },
                                { case: { $eq: ["$bookingStatus.status", "accepted"] }, then: "Accepted" },
                                { case: { $eq: ["$bookingStatus.status", "completed"] }, then: "Completed" },
                            ],
                            default: "Other"
                        }
                    }
                }
            },

            // ✅ Group and count by normalized status
            {
                $group: {
                    _id: "$normalizedStatus",
                    value: { $sum: 1 }
                }
            },

            // ✅ Map colors by name
            {
                $addFields: {
                    color: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", "Pending"] }, then: "#EAB308" },
                                { case: { $eq: ["$_id", "Cancelled/Declined"] }, then: "#EA4335" },
                                { case: { $eq: ["$_id", "Accepted"] }, then: "#3B82F6" },
                                { case: { $eq: ["$_id", "Completed"] }, then: "#10B981" },
                            ],
                            default: "#9E9E9E"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1,
                    color: 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Dashboard booking status data successfully fetched",
            bookingStatus: bookingStatusAggregation,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getRevenueData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new ObjectId(userId);
        // 1️⃣ Define the range dynamically
        const monthsRange = 6;
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // include all of today

        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - (monthsRange - 1));
        startDate.setDate(1); // first day of start month
        startDate.setHours(0, 0, 0, 0);

        // 2️⃣ Fetch revenue data from MongoDB
        const revenueDataFromDB = await Booking.aggregate([
            {
                $match: {
                    "payment.status": { $ne: "unpaid" },
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
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
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ["$bookingStatus.status", "completed"] },
                                "$totalCharge.total",
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // 3️⃣ Prepare all months in range
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const filledRevenueData = [];
        for (let i = 0; i < monthsRange; i++) {
            const currentMonth = new Date(startDate);
            currentMonth.setMonth(startDate.getMonth() + i);

            const month = monthNames[currentMonth.getMonth()];
            const year = currentMonth.getFullYear();

            // Find revenue from DB
            const found = revenueDataFromDB.find(
                r => r._id?.year === year && r._id?.month === currentMonth.getMonth() + 1
            );

            filledRevenueData.push({
                month,
                value: found ? found.totalRevenue : 0, // 0 if no bookings
            });
        }

        // 4️⃣ Return the final data
        return res.status(200).json({
            message: "Dashboard revenue data successfully fetched",
            revenueData: filledRevenueData,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}




