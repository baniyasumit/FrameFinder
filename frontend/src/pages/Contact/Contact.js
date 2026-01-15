import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can connect this to backend later
        console.log(formData);
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="contact-wrapper">
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
                        <p>Phone: +977 98XXXXXXX</p>
                        <p>Location: Nepal</p>
                    </div>

                    {/* Form Section */}
                    <form className="contact-form slide-up delay" onSubmit={handleSubmit}>
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

                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
