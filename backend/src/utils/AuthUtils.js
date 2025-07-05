import crypto from 'crypto'
import nodemailer from "nodemailer";

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

export const sendOtpEmail = async (toEmail, otpCode) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"FrameFinder" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your OTP Code - FrameFinder",
        html: `
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otpCode}</div>
        <p>This OTP will expire in 5 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);
};