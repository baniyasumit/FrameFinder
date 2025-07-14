import React, { useEffect, useState } from "react";
import "./Auth.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuthStore from "../../stateManagement/useAuthStore";
import { toast } from "sonner";
import { resetPassword } from "../../services/AuthServices";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const location = useLocation();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });
    const { token } = useParams();


    const from = location.state?.from?.pathname || "/";
    useEffect(() => {
        if (user || !token) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from, token]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 10) {
            newErrors.password = "Password must be at least 10 characters";
        } else {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await resetPassword(formData.password, token);
            console.log("Reset Successful:", response);
            toast.success("Password reset successfully!", { position: 'top-center' });
            navigate('/login', { replace: true })
        } catch (err) {
            console.error("Reset error:", err);
            toast.error(err);
        }
    };


    return (
        <main className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-header">
                    <h1 className="auth-title">Reset Password</h1>
                </div>

                <span className="auth-message">Enter your new password.</span>
                <div className="auth-password-container">
                    <input
                        className="auth-inputs"
                        type={visible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="visibility-container"
                    >
                        {visible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
                    </button>
                    {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>
                <div className="auth-password-container">
                    <input
                        className="auth-inputs"
                        type={confirmVisible ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setConfirmVisible(!confirmVisible)}
                        className="visibility-container"
                    >
                        {confirmVisible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
                    </button>
                    {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
                </div>
                <div className="auth-options">
                    <Link className="auth-options-button" to='/login'>Password Remembered?</Link>
                </div>
                <button type="submit" className="submit-btn">Reset Password</button>
            </form >



        </main>
    );
}

export default ResetPassword;
