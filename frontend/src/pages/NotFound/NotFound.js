import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you’re looking for doesn’t exist.</p>
            <button
                onClick={() => navigate("/")}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "20px",
                }}
            >
                Go to Home Page
            </button>
        </div>
    );
};

export default NotFound;
