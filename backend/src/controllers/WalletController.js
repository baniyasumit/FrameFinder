import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Stripe from "stripe";
import Withdraw from "../models/Withdraw.js";
import Payment from "../models/Payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const URL = process.env.FRONTEND_URL;

export const getWalletDetails = async (req, res) => {
    try {

        const userId = req.user.id
        let wallet = await Wallet.findOne({ user: userId })

        if (!wallet) {
            wallet = await Wallet.create({
                user: userId,
            });
        }

        return res.status(200).json({
            message: "Wallet Fetched successfully.",
            wallet: wallet
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Error creating payment" });
    }
}

export const checkTransferability = async (req, res) => {
    try {

        const userId = req.user.id
        const wallet = await Wallet.findOne({ user: userId })
        const stripeId = wallet.stripeId
        if (stripeId === '') {
            return res.status(404).json({
                message: "Stripe account not found"
            });

        }


        const account = await stripe.accounts.retrieve(stripeId);

        let linkType = 'account_onboarding';

        // Check if account is fully onboarded (payouts active, details submitted)
        if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
            linkType = 'account_update';
        }

        const transfersActive = account.capabilities.transfers === "active";

        const externalAccounts = await stripe.accounts.listExternalAccounts(stripeId);
        const hasPayoutMethod = externalAccounts.data.length > 0;

        const verified = transfersActive && hasPayoutMethod

        if (!verified) {
            const accountLink = await stripe.accountLinks.create({
                account: stripeId,
                refresh_url: URL,
                return_url: `${URL}/photographer/wallet`,
                type: linkType
            });
            return res.status(200).json({ verified: verified, url: accountLink.url });
        }

        return res.status(200).json({
            message: "Transferability Check.",
            verified: verified,
            transfersActive,
            hasPayoutMethod,
            externalAccounts: externalAccounts.data,
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Error creating payment" });
    }
}

export const createStripeAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = User.findById(userId);

        const email = user?.email;
        const wallet = await Wallet.findOne({ user: userId })

        const account = await stripe.accounts.create({
            type: "express",
            country: "AU",
            business_type: 'individual',
            email,
            capabilities: {
                transfers: { requested: true },
            },
        });


        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found."
            });
        }

        wallet.stripeId = account.id;
        await wallet.save();

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: URL,
            return_url: URL,
            type: "account_onboarding",
        });
        return res.status(201).json({
            message: "Stripe account created succesfully.",
            url: accountLink.url
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

export const withdraw = async (req, res) => {
    try {
        const { amount } = req.body;

        const parsedAmount = parseFloat(amount)
        const userId = req.user.id
        const wallet = await Wallet.findOne({ user: userId })
        const accountId = wallet.stripeId;

        const balance = await stripe.balance.retrieve();

        if (balance.available[0].amount < Math.round(parsedAmount * 100)) {
            return res.status(400).json({ message: "Insufficient funds in platform balance" });
        }

        const transfer = await stripe.transfers.create({
            amount: Math.round(parsedAmount * 100),
            currency: "aud",
            destination: accountId,
            transfer_group: "Photographer_Withdrawal",
        });

        if (transfer) {
            wallet.totalWithdrawn += parsedAmount
            wallet.availableBalance -= parsedAmount


            await Withdraw.create({
                user: userId,
                amount: parsedAmount
            })
            wallet.save();
        }
        return res.status(201).json({
            message: "Money transfered.",
            transfer,
            wallet
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}


export const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            type = "all",
            start = new Date(new Date().setMonth(new Date().getMonth() - 1))
                .toISOString()
                .split("T")[0],
            end = new Date().toISOString().split("T")[0],
        } = req.query;

        // Convert to Date objects
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        // Filters
        const withdrawFilter = {
            user: userId,
            createdOn: { $gte: startDate, $lte: endDate },
        };

        const paymentFilter = {
            receiver: userId,
            createdOn: { $gte: startDate, $lte: endDate },
            paymentStatus: { $ne: 'pending' }
        };

        let transactions = [];

        // Withdrawals
        if (type === "withdraw" || type === "all") {
            const withdraws = await Withdraw.find(withdrawFilter).lean();
            const formattedWithdraws = withdraws.map((w) => ({
                _id: w._id,
                amount: w.amount,
                createdOn: w.createdOn,
                lastUpdated: w.lastUpdated,
                type: "withdraw",
            }));
            transactions.push(...formattedWithdraws);
        }

        // Payments (received)
        if (type === "payment" || type === "all") {
            const payments = await Payment.find(paymentFilter)
                .populate("sender", "firstname lastname profilepicture")
                .lean();

            const formattedPayments = payments.map((p) => ({
                _id: p._id,
                booking: p.booking,
                status: p.paymentStatus,
                amount: p.netAmount,
                sender: p.sender,
                createdOn: p.createdOn,
                lastUpdated: p.lastUpdated,
                type: "payment",
                modified: p.lastUpdated?.getTime() !== p.createdOn?.getTime(),
            }));
            transactions.push(...formattedPayments);
        }

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching transactions",
            error: error.message,
        });
    }
};
