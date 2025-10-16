

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

// Send OTP Email
export const sendOtpEmail = async (toEmail, otpCode) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MAIL_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_USER || 'example@brevo.com', name: "FrameFinder" },
        to: [{ email: toEmail }],
        subject: "Your OTP Code - FrameFinder",
        htmlContent: `
          <div style="text-align: center;">
              <h2>Email Verification</h2>
              <p>Your OTP code is:</p>
              <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otpCode}</div>
              <p>This OTP will expire in 5 minutes.</p>
          </div>
        `,
      }),
    });


    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending OTP email:", errorData);
      throw new Error(errorData.message || "Failed to send OTP email");
    }

    const data = await response.json();
    console.log("OTP email sent successfully", data);
    return data;
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw error;
  }
};

// Send Password Reset Email
export const sendResetEmail = async (toEmail, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MAIL_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_USER || 'example@brevo.com', name: "FrameFinder" },
        to: [{ email: toEmail }],
        subject: "Reset Password - FrameFinder",
        htmlContent: `
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
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending OTP email:", errorData);
      throw new Error(errorData.message || "Failed to send OTP email");
    }

    const data = await response.json();
    console.log("Reset password email sent successfully", data);
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw error;
  }
};
