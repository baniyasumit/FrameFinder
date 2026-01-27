import React, { useState } from "react";
import "./Contact.css";
import { sendContactEmail } from "../../services/InfoServices";
import contactBackground from '../../assets/images/contact-image.jpg';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await sendContactEmail(formData);
            setSuccess("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            setError(err || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-wrapper" style={{ backgroundImage: `url(${contactBackground})` }}>
            <div className="contact-container fade-in">
                <h1 className="contact-title">
                    Contact <span>Us</span>
                </h1>

                <p className="contact-description">
                    Have a question, feedback, or partnership idea?
                    We'd love to hear from you.
                </p>

                <div className="contact-grid">
                    {/* Info Section */}
                    <div className="contact-info slide-up">
                        <h2>Get in Touch</h2>
                        <p>Email: support@framefinder.com</p>
                        <p>Phone: +81 20XXXXXXXX</p>
                        <p>Location: Nepal</p>
                    </div>

                    {/* Form Section */}
                    <form
                        className="contact-form slide-up delay"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        {/* Feedback Messages */}
                        {error && <p className="form-error">{error}</p>}
                        {success && <p className="form-success">{success}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
