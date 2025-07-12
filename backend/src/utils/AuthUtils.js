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
        <div style="text-align: center;">
            <h2>Email Verification</h2>
            <p>Your OTP code is:</p>
            <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otpCode}</div>
            <p>This OTP will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
};

export const sendResetEmail = async (toEmail, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
        from: `"FrameFinder" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Reset Password - FrameFinder",
        html: `
        <div style="text-align: center;">
            <h2>Reset Password</h2>
            <p>Use the button below to reset your password:</p>
            <a href="${resetLink}" 
                style="
                display: inline-block;
                padding: 12px 24px;
                font-size: 18px;
                font-weight: bold;
                color: #fff;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
                ">
                Reset Password
            </a>
        </div>
        `
    };


    await transporter.sendMail(mailOptions);
};