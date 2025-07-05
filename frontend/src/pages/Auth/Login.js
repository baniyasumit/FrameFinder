import React, { useEffect, useState } from "react";
import "./Auth.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuthStore from "../../stateManagement/useAuthStore";
import { loginUser, refreshUser } from "../../services/AuthServices";
import { toast } from "sonner";

function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const [visible, setVisible] = useState(false);
    const location = useLocation();


    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const from = location.state?.from?.pathname || "/";
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 10) {
            newErrors.password = "Password must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await loginUser(formData);
            console.log("Login success:", response);
            const userData = await refreshUser();
            if (userData.userRole === 'photographer') {
                navigate('/dashboard');
            }
            setUser(userData);
            toast.success('Logged in successfully');
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err, {
                position: 'top-center', // or 'bottom-right', 'top-left', etc.
            });
        }
    };

    return (
        <main className="auth-container" style={{ backgroundImage: `url(/authBackground.jpg)`, }}>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-header">
                    <h1 className="auth-title">Login</h1>
                </div>

                <span className="auth-message">Welcome! Please log in to your account.</span>

                <input
                    className="auth-inputs"
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <div className="auth-error">{errors.email}</div>}

                <div className="auth-password-container">
                    <input
                        className="auth-inputs"
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={() => setVisible(!visible)} className="visibility-container">
                        {visible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
                    </button>
                </div>
                {errors.password && <div className="auth-error">{errors.password}</div>}

                <div className="auth-options">
                    <Link className="auth-options-button">Forget password?</Link>
                </div>
                <button type="submit" className="submit-btn">Login</button>

                <div className="auth-redirect-option">
                    <span>Don't have an account? </span>
                    <Link
                        className="auth-redirect-link"
                        to="/register"
                    >
                        Create one
                    </Link>
                </div>
            </form>
        </main>
    );
}

export default Login;
