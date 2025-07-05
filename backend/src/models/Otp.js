// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ["email_verification", "password_reset"],
        default: "email_verification"
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model("Otp", otpSchema);
