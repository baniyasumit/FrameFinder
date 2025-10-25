import Message from "../models/Message.js";
import User from "../models/User.js";

export const createMessage = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookingId = req.params.bookingId;
        const booking = req.booking;

        const { text } = req.body;
        if (text.trim() === "" || text === undefined) return res.status(400).json({ message: "Empty message is not accepted" })

        let receiver;
        if (booking.user.toString() === userId) {
            receiver = booking.portfolio?.user._id;
        } else {
            receiver = booking.user;
        }

        const message = new Message({
            booking: bookingId,
            sender: userId,
            receiver,
            text
        });

        await message.save();

        return res.status(201).json({ message: "Message Created", newMessage: message })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.bookingId;
        const { pageNum = 1 } = req.query;
        const booking = req.booking;
        const page = parseInt(pageNum);
        const limit = 15;
        const skip = (page - 1) * limit;

        let chatBuddyId;
        let chatBuddy = null;

        if (booking.user.toString() === userId) {
            chatBuddyId = booking.portfolio?.user._id;
        } else {
            chatBuddyId = booking.user;
        }

        if (page === 1) {
            chatBuddy = await User.findById(chatBuddyId)
                .select("firstname lastname profilepicture");
        }
        const messages = (await Message.find({ booking: bookingId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit))
            .reverse()
        return res.status(200).json({
            message: "Message Fetched", messages,
            chatBuddy,
            hasMore: messages.length === limit
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}