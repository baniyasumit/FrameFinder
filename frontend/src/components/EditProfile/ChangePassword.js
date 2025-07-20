import React, { useEffect, useRef, useState } from 'react'
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import './EditProfile.css'
import { changePassword } from '../../services/AuthServices';
import { toast } from 'sonner';

export const ChangePassword = ({ setShowChangePassword }) => {
    const modelRef = useRef();
    const [visible, setVisible] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);
    const [visibleNewConfirm, setVisibleNewConfirm] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',

    })

    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setShowChangePassword(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowChangePassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));

    };

    const validate = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Password is required";
        } else if (passwordData.currentPassword.length < 10) {
            newErrors.currentPassword = "Password must be at least 10 characters";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (passwordData.newPassword.length < 10) {
            newErrors.newPassword = "Password must be at least 10 characters";
        } else if (passwordData.confirmNewPassword !== passwordData.newPassword) {
            newErrors.newPassword = "Passwords do not match";
        }

        if (!passwordData.confirmNewPassword) {
            newErrors.confirmNewPassword = "Confirm new password is required";
        } else if (passwordData.confirmNewPassword.length < 10) {
            newErrors.confirmNewPassword = "Password must be at least 10 characters";
        } else if (passwordData.confirmNewPassword !== passwordData.newPassword) {
            newErrors.confirmNewPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
            console.log("Password changed successful:", response);
            toast.success("Changed password successfully!", { position: 'top-center' });
            setShowChangePassword(false);
        } catch (err) {
            console.error("Reset error:", err);
            toast.error(err);
        }
    }


    return (
        <div className="change-password-overlay">
            <form className="change-password-modal" ref={modelRef} onSubmit={handleChangePassword}>
                <button className="close-icon" onClick={() => setShowChangePassword(false)}>
                    ×
                </button>
                <div className="change-password-header">
                    <h1 className="change-password-title">Change Password</h1>
                </div>

                <span className="change-password-message">Enter your new password.</span>
                <div className="password-container">
                    <input
                        className="change-password-inputs"
                        type={visible ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="visibility-container"
                    >
                        {visible ? <FaRegEye className="password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
                    </button>
                    {errors.currentPassword && <div className="password-error">{errors.currentPassword}</div>}
                </div>
                <div className="password-container">
                    <input
                        className="change-password-inputs"
                        type={visibleNew ? "text" : "password"}
                        name="newPassword"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() => setVisibleNew(!visibleNew)}
                        className="visibility-container"
                    >
                        {visibleNew ? <FaRegEye className="password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
                    </button>
                    {errors.newPassword && <div className="password-error">{errors.newPassword}</div>}
                </div>
                <div className="password-container">
                    <input
                        className="change-password-inputs"
                        type={visibleNewConfirm ? "text" : "password"}
                        name="confirmNewPassword"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmNewPassword}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setVisibleNewConfirm(!visibleNewConfirm)}
                        className="visibility-container"
                    >
                        {visibleNewConfirm ? <FaRegEye className="password-visibility" /> : <FaRegEyeSlash className="password-visibility" />}
                    </button>
                    {errors.confirmNewPassword && <div className="password-error">{errors.confirmNewPassword}</div>}
                </div>
                <button type="submit" className="submit-btn">Change Password</button>
            </form>
        </div>
    )
}

