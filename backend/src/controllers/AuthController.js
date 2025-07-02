import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/User.js'


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

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
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, phoneNumber, password } =
            req.body;

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
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
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
        console.error(error);
        res.status(500).json({ message: error.message });
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
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

