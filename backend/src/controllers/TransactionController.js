import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Wallet from "../models/Wallet.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPaymentStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId)

        let shouldPay = false;
        if (booking.bookingStatus.status !== 'pending') {
            return res.status(200).json({
                message: "Booking status is not pending",
                shouldPay: shouldPay,

            });
        }

        const payment = await Payment.findOne({ booking: bookingId, paymentType: 'booking_fee' })

        if (!payment) {
            return res.status(200).json({
                message: "No payment found — should initiate payment",
                shouldPay: true,
            });
        }

        if (payment?.paymentStatus === 'failed' || payment?.paymentStatus === 'pending') {
            shouldPay = true;
        } else if (payment?.paymentStatus === 'succeeded') {
            shouldPay = false;
        }

        return res.status(200).json({
            message: "Payment Status Retrieved",
            shouldPay: shouldPay,

        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Error creating payment" });
    }
}

export const intiatePayment = async (req, res) => {
    try {

        const bookingId = req.params.bookingId;
        const clientId = req.user.id;

        const booking = await Booking.findById(bookingId).populate({
            path: "portfolio",
            select: "user"
        });


        if (!booking) return res.status(404).json({ message: 'Booking not found.' });
        let paymentType = "booking_fee"
        const amount = booking.totalCharge.total * 0.30
        const platformFee = booking.totalCharge.total * 0.05;
        const netAmount = amount - platformFee;
        const photographerId = booking.portfolio.user.toString();

        if (booking.bookingStatus.status !== 'pending') paymentType = "final_payment"

        const existingPayment = await Payment.findOne({ booking: bookingId, paymentType: paymentType })

        let payment;
        if (existingPayment) {
            payment = existingPayment;
        } else {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round((amount + (amount * 0.04)) * 100),
                currency: "aud",
                metadata: {
                    bookingId,
                    photographerId,
                    clientId,
                    paymentType,
                },
                automatic_payment_methods: { enabled: true }
            });

            payment = await Payment.create({
                sender: clientId,
                receiver: photographerId,
                booking: bookingId,
                amount,
                platformFee,
                netAmount,
                stripePaymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                paymentType,
            });
        }

        return res.status(200).json({
            message: "Payment Initiated",
            clientSecret: payment.clientSecret,
            totalCharge: booking.totalCharge,
            paymentId: payment._id,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Error creating payment" });
    }
}

export const updateAfterPayment = async (req, res) => {
    try {

        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId)

        const payment = await Payment.findOne({ booking: bookingId, paymentType: 'booking_fee' })

        const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
        if (paymentIntent.status === 'succeeded' && payment.paymentStatus !== 'succeeded') {
            payment.paymentStatus = 'succeeded'
            payment.clientSecret = null

            booking.payment.status = 'partial'
            booking.payment.paid = payment.amount;
            booking.payment.remaining = payment.amount * (100 / 30) - payment.amount;

            const existingWallet = await Wallet.findOne({ user: payment.receiver })
            if (existingWallet) {
                existingWallet.totalEarned += payment.netAmount;
                existingWallet.onHold += payment.netAmount
                await existingWallet.save();
            } else {
                await Wallet.create({
                    user: payment.receiver,
                    totalEarned: payment.netAmount,
                    onHold: payment.netAmount
                });
            }
            await payment.save();
            await booking.save();
        }


        return res.status(200).json({
            message: "All the neccessary update has been made.",

        });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Error creating payment" });
    }
}


