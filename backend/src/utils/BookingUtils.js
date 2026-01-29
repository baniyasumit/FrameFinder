export const sendSuccessfulEmail = async (
    toEmail,
    status, // "pending" | "accepted" | "declined"
    firstname,
    lastname,
    sessionDetails
) => {
    try {
        let subject = "";
        let heading = "";
        let emailMessage = "";

        if (status === "accepted") {
            subject = "Booking Confirmed | FrameFinder";
            heading = "📸 Booking Confirmed";
            emailMessage = `
                <p>Your photography session request with 
                <strong>${firstname} ${lastname}</strong> has been 
                <strong style="color:green;">accepted</strong>.</p>
            `;
        }
        else if (status === "declined") {
            subject = "Booking Declined | FrameFinder";
            heading = "❌ Booking Declined";
            emailMessage = `
                <p>Unfortunately, your photography session request with 
                <strong>${firstname} ${lastname}</strong> has been 
                <strong style="color:red;">declined</strong>.</p>
                <p>The paid amount will be refunded as per FrameFinder’s policy.</p>
            `;
        }
        else if (status === "cancelled") {
            subject = "Booking Cancelled | FrameFinder";
            heading = "⚠️ Booking Cancelled";
            emailMessage = `
                <p>Your photography session with 
                <strong>${firstname} ${lastname}</strong> has been 
                <strong style="color:#ff9800;">cancelled</strong>.</p>
                <p>If you have already made a payment, the refund will be processed according to our cancellation policy.</p>
            `;
        }
        else {
            subject = "Payment Successful - Booking Pending | FrameFinder";
            heading = "⏳ Booking Pending";
            emailMessage = `
                <p>You have successfully paid <strong>30%</strong> of the total amount.</p>
                <p>You will receive another email once the photographer responds.</p>
            `;
        }


        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.MAIL_API_KEY,
            },
            body: JSON.stringify({
                sender: {
                    email: process.env.EMAIL_USER || "example@brevo.com",
                    name: "FrameFinder",
                },
                to: [{ email: toEmail }],
                subject,
                htmlContent: `
                    <div style="font-family: Arial; max-width: 600px; margin: auto;">
                        <h2 style="text-align:center;">${heading}</h2>

                        ${emailMessage}

                        <hr />

                        <h3>📍 Session Details</h3>
                        <p><strong>Date:</strong> ${sessionDetails.date}</p>
                        <p><strong>Time:</strong> ${sessionDetails.time}</p>
                        <p><strong>Location:</strong> ${sessionDetails.location}</p>

                        <h3>💰 Payment Summary</h3>
                        <p><strong>Total Amount:</strong> ¥ ${sessionDetails.totalAmount}</p>
                        <p><strong>Paid:</strong> ¥ ${sessionDetails.paidAmount}</p>

                        ${status === "declined"
                        ? `<p style="color:#555;">Refund will be processed within 3–5 business days.</p>`
                        : ""
                    }

                        <br />
                        <p>Thank you for choosing <strong>FrameFinder</strong>.</p>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send booking email");
        }

        const data = await response.json();
        console.log(`Booking ${status} email sent successfully`, data);
        return data;

    } catch (error) {
        console.error("Error sending booking email:", error.message);
        throw error;
    }
};
