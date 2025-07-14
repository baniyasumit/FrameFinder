import React, { useEffect, useState } from 'react';
import './Auth.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuthStore from '../../stateManagement/useAuthStore';

const Register = ({ handleSubmit }) => {
    const { user } = useAuthStore();
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const from = location.state?.from?.pathname || "/";
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));

    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstname.trim() || !formData.lastname.trim()) newErrors.fullname = "Both first and last name is required";

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be 10 digits";
        }

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

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        handleSubmit(formData);
    };

    return (
        <main className="auth-container">
            <form className="auth-form" onSubmit={onSubmit}>

                <div className="auth-header">
                    <h1 className="auth-title">Create an account</h1>
                </div>

                <span className='auth-message'>Welcome! Please register a new account.</span>

                <div className='name-container'>
                    <input
                        className='auth-inputs'
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                    <input
                        className='auth-inputs'
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                </div>
                {errors.fullname && <div className="auth-error">{errors.fullname}</div>}

                <input
                    className='auth-inputs'
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <div className="auth-error">{errors.email}</div>}

                <input
                    className='auth-inputs'
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
                {errors.phoneNumber && <div className="auth-error">{errors.phoneNumber}</div>}
                <div className='passwords-verify-container'>
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
                    </div>
                </div>

                {errors.password && <div className="auth-error">{errors.password}</div>}
                {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}

                {errors.general && <div className="auth-error">{errors.general}</div>}

                <button type="submit" className="submit-btn">Register</button>

                <div className='auth-redirect-option'>
                    <span>Already have an account? </span>
                    <Link
                        className='auth-redirect-link'
                        to="/login"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
        </main>
    );
}

export default Register;
