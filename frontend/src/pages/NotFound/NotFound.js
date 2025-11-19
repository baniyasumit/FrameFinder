import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css"; // <-- external CSS

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-text">
                Oops! The page you're trying to reach doesn’t exist or may have been moved.
            </p>

            <button onClick={() => navigate("/")} className="notfound-btn">
                Go to Home Page
            </button>
        </div>
    );
};

export default NotFound;
