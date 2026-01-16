export const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
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
                to: [{ email: process.env.CONTACT_EMAIL }],
                subject: "New Contact Message - FrameFinder",
                htmlContent: `
                    <div style="background-color:#f8fafc;padding:30px;">
                        <table width="100%" cellpadding="0" cellspacing="0" 
                        style="max-width:600px;margin:auto;background:#ffffff;
                        border-radius:10px;font-family:Arial,Helvetica,sans-serif;
                        box-shadow:0 10px 25px rgba(0,0,0,0.08);">

                        <tr>
                            <td style="padding:20px 30px;background:#0f172a;
                            border-radius:10px 10px 0 0;color:#ffffff;">
                            <h2 style="margin:0;">📸 FrameFinder</h2>
                            <p style="margin:5px 0 0;font-size:14px;">
                                New Contact Message
                            </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:30px;color:#1f2933;">
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>

                            <div style="margin-top:20px;">
                                <p style="margin-bottom:8px;"><strong>Message:</strong></p>
                                <div style="background:#f1f5f9;padding:15px;
                                border-radius:6px;line-height:1.6;">
                                ${message}
                                </div>
                            </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:15px 30px;background:#f8fafc;
                            border-top:1px solid #e5e7eb;
                            font-size:12px;color:#6b7280;
                            text-align:center;">
                            © ${new Date().getFullYear()} FrameFinder · Contact Form
                            </td>
                        </tr>

                        </table>
                    </div>
                    `

            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Brevo API error:", errorText);
            return res
                .status(500)
                .json({ message: "Failed to send contact email" });
        }

        const data = await response.json();
        console.log("Contact email sent successfully:", data);

        return res.status(200).json({
            message: "Message sent successfully",
        });
    } catch (error) {
        console.error("Server error sending contact email:", error);
        return res.status(500).json({
            message: "Server error sending contact email",
        });
    }
};
