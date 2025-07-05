import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyOtp, changeEmail, sendOTPEmail } from "../../services/AuthServices";
import useAuthStore from "../../stateManagement/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Auth.css'
function OTP() {
    const { user, updateUser, hasSentOtp, setHasSentOtp } = useAuthStore();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [resendCooldown, setResendCooldown] = useState(0);
    const [changingEmail, setChangingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (!hasSentOtp) {
            sendOTPEmail()
                .then(() => {
                    toast.success("OTP sent to your email");
                    setHasSentOtp(true)
                })
                .catch((err) => {
                    console.error("Failed to send OTP:", err);
                    toast.error("Failed to send OTP");
                });
        }
    }, [setHasSentOtp, hasSentOtp]);

    const handleResend = async () => {
        try {
            setOtp('');
            await sendOTPEmail();
            toast.success("OTP has been resent to your email");
            setResendCooldown(30);
        } catch (err) {
            console.error(err);
            toast.error("Failed to resend OTP");
        }
    };

    useEffect(() => {
        let interval;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleChangeEmail = async () => {
        if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
            toast.error("Enter a valid new email");
            return;
        }

        try {
            /*   await changeEmail(newEmail);
              const updatedUser = await refreshUser();
              setUser(updatedUser);
              setChangingEmail(false);
              setResendCooldown(30); */
            toast.success("Email changed and OTP sent to new address");
        } catch (err) {
            console.error(err);
            toast.error("Failed to change email");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError("Please enter a valid OTP code");
            return;
        }

        setSubmitting(true);
        try {
            await verifyOtp(otp);
            updateUser({ isVerified: true });
            toast.success("Account verified successfully!");
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            toast.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-container" style={{ backgroundImage: `url(/authBackground.jpg)`, }}>
            <form className="auth-form" onSubmit={handleSubmit}>
                {changingEmail && (
                    <button type="button" className="back-icon" onClick={() => setChangingEmail(false)}>
                        ←
                    </button>
                )}
                <div className="auth-header">
                    <h1 className="auth-title">OTP Verification</h1>
                </div>

                {
                    !changingEmail ? (
                        <>
                            <span className="auth-message otp">
                                Please enter the OTP(One-Time-Password) send to your registered email to complete your verification.
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="auth-message">
                                Previous email : <b>{user.email}</b>
                            </span>
                            <input
                                className="auth-inputs"
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button
                                type="button"
                                className="submit-btn"
                                onClick={handleChangeEmail}
                            >
                                Update & Resend OTP
                            </button>
                        </>
                    )
                }

                {
                    !changingEmail && (
                        <>
                            <input
                                className="auth-inputs"
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value.toUpperCase());
                                    setError("");
                                }}
                            />
                            {error && <div className="auth-error">{error}</div>}
                            <div className="auth-options">

                                <Link className="auth-options-button" onClick={handleResend}
                                    disabled={resendCooldown > 0}>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}</Link>
                            </div>
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? "Verifying..." : "Verify OTP"}
                            </button>

                            <div className="auth-redirect-option">
                                <div>
                                    <span>Incorrect email? </span>
                                    <Link
                                        className="auth-redirect-link"
                                        onClick={() => setChangingEmail(true)}
                                    >
                                        Change
                                    </Link>
                                </div>
                            </div>
                        </>
                    )
                }
            </form >
        </main>
    );
}

export default OTP;
