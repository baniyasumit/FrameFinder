import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/User.js'
import { generateOTP, sendOtpEmail, sendResetEmail } from '../utils/AuthUtils.js';
import Otp from '../models/Otp.js';
import crypto from 'crypto';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "User Logged in Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const registerUser = async (req, res) => {
    try {

        const { firstname, lastname, email, phoneNumber, password, role = 'client' } =
            req.body;
        console.log(role)
        if (!firstname || !lastname || !email || !phoneNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingEmail = await User.findOne({
            email,
        });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingPhoneNumber = await User.findOne({
            phoneNumber,
        });
        if (existingPhoneNumber) {
            return res.status(400).json({ message: "Phone Number already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            email,
            phoneNumber,
            password: hashedPassword,
            role: role
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const logoutUser = async (req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const resetEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        await sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: "Email Sent in Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body
        const { token } = req.params;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: "Cannot use  previous used password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();


        res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getUserProfile = async (req, res) => {
    try {

        const userId = req.user.id
        const user = await User.findOne({ _id: userId }, { password: 0, _id: 0, __v: 0 });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({ user: user, message: "User Retrieved Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const sendOTPEmail = async (req, res) => {
    const { purpose } = req.body;
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        await Otp.deleteMany({ user: userId, used: false, purpose });

        const code = generateOTP();

        const salt = await bcrypt.genSalt(10);
        const hashedCode = await bcrypt.hash(code, salt);

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const otpDoc = await Otp.create({
            user: userId,
            code: hashedCode,
            expiresAt,
            purpose,
            used: false,
        });

        await sendOtpEmail(user.email, code);

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ message: "Server error sending OTP" });
    }
};


export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user.id;
        if (!otp || otp.length < 6) {
            return res.status(400).json({ message: "Invalid OTP provided." });
        }

        // Find the latest OTP record for this user
        const otpRecord = await Otp.findOne({ user: userId }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: "No OTP record found." });
        }

        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteMany({ userId }); // Clean up
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.code);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect OTP. Please try again." });
        }

        await User.findByIdAndUpdate(userId, { isVerified: true });

        await Otp.deleteMany({ userId });

        return res.status(200).json({ message: "Account verified successfully." });
    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user.id
        if (!newPassword || !currentPassword) {
            return res.status(400).json({ message: "Both current and new password is required" });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is invalid" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();


        res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber } = req.body
        const userId = req.user.id;
        const nameParts = fullname.trim().split(' ').filter(part => part.length > 0);
        const firstname = nameParts[0];
        const lastname = nameParts[1];
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.firstname === firstname && user.lastname === lastname && user.email === email && user.phoneNumber === phoneNumber) {
            return res.status(204).json({ message: "No changes were made." });
        }

        user.firstname = firstname;
        user.lastname = lastname;
        if (user.email !== email) {
            user.email = email;
            user.isVerified = false;
        }
        user.phoneNumber = phoneNumber;
        await user.save();


        res.status(200).json({ message: "Profile Updated Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

