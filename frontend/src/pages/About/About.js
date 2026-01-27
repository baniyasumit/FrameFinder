import React from "react";
import "./About.css";
import aboutBackground from '../../assets/images/about-image.jpg';

const About = () => {
    return (
        <div className="about-wrapper" style={{ backgroundImage: `url(${aboutBackground})` }}>
            <div className="about-container fade-in">
                <h1 className="about-title">
                    About <span>FrameFinder</span>
                </h1>

                <p className="about-description">
                    FrameFinder connects talented photographers with clients looking for
                    the perfect shot. From events and portraits to creative projects,
                    we make discovering, booking, and reviewing photographers seamless.
                </p>

                <div className="about-grid">
                    <div className="about-card slide-up">
                        <h2>Our Mission</h2>
                        <p>
                            To empower photographers by showcasing their work and help clients
                            find trusted professionals effortlessly.
                        </p>
                    </div>

                    <div className="about-card slide-up delay">
                        <h2>Why FrameFinder?</h2>
                        <ul>
                            <li>Curated photographer portfolios</li>
                            <li>Easy bookings & secure payments</li>
                            <li>Honest reviews from real clients</li>
                            <li>Built for creatives & customers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
