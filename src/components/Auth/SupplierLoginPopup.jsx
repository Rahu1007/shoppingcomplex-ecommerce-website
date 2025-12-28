
import React, { useState, useEffect } from 'react';
import { useSupplier } from '../../context/SupplierContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './SupplierLoginPopup.css';

const SupplierLoginPopup = ({ isOpen, onClose }) => {
    const [identifier, setIdentifier] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const { login } = useSupplier();
    const { showSuccess, showError } = useToast();
    const navigate = useNavigate();

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setIdentifier('');
            setOtpSent(false);
            setOtp(['', '', '', '', '', '']);
            setTimer(30);
        }
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (!identifier || identifier.length < 3) {
            showError('Please enter a valid Mobile Number or Email ID');
            return;
        }

        // Simulate OTP send
        setOtpSent(true);
        setTimer(30);

        // Mock OTP for demo
        const mockOtp = '123456';
        console.log(`%c [Supplier OTP] Code for ${identifier}: ${mockOtp}`, 'color: #8e44ad; font-weight: bold; font-size: 14px;');
        showSuccess(`OTP sent to ${identifier}. Use 123456 for testing.`);
    };

    const handleVerifyOTP = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            showError('Please enter the complete 6-digit OTP');
            return;
        }

        // Verify Mock OTP
        if (enteredOtp === '123456') {
            // Attempt login
            try {
                // If it's a new user flow, we might redirect to signup, but here we assume login
                // However, if login fails (user not found), we should suggest signup or auto-signup?
                // For this implementation, let's treat it as: if login fails, redirect to signup page

                // Note: The service currently throws error if not found. 
                // We'll wrap to check.
                const success = await login(identifier);
                if (success) {
                    onClose();
                    navigate('/supplier/dashboard');
                } else {
                    // If login failed (e.g. user not found), prompt to sign up
                    if (window.confirm('Supplier account not found. Do you want to register as a new supplier?')) {
                        onClose();
                        navigate('/supplier/signup');
                    }
                }
            } catch (err) {
                showError('Authentication failed');
            }
        } else {
            showError('Invalid OTP');
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`s-otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`s-otp-${index - 1}`).focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="supplier-popup-overlay" onClick={onClose}>
            <div className="supplier-popup-card" onClick={e => e.stopPropagation()}>
                <button className="supplier-close-btn" onClick={onClose}>✕</button>

                <div className="supplier-popup-left">
                    <div className="supplier-banner-content">
                        <h2>Grow your business</h2>
                        <p>Join our supplier network and reach millions of customers.</p>
                        <ul className="supplier-benefits">
                            <li>📈 Access to dashboard</li>
                            <li>📦 Easy product management</li>
                            <li>💰 0% Commission for first month</li>
                        </ul>
                    </div>
                </div>

                <div className="supplier-popup-right">
                    <div className="supplier-form-header">
                        <h3>Supplier Login</h3>
                        <p>Enter your details to access your seller account</p>
                    </div>

                    {!otpSent ? (
                        <form onSubmit={handleSendOTP} className="supplier-login-form">
                            <div className="form-group">
                                <label>Mobile Number / Email ID</label>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    placeholder="Enter mobile or email"
                                    className="supplier-input"
                                />
                            </div>
                            <button type="submit" className="supplier-auth-btn">
                                Continue
                            </button>
                            <div className="supplier-link-text">
                                New here? <span onClick={() => { onClose(); navigate('/supplier/signup'); }}>Create Supplier Account</span>
                            </div>
                        </form>
                    ) : (
                        <div className="supplier-otp-section">
                            <div className="otp-info">
                                Enter OTP sent to <b>{identifier}</b>
                                <button className="change-btn" onClick={() => setOtpSent(false)}>Change</button>
                            </div>

                            <div className="otp-inputs">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`s-otp-${idx}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={e => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={e => handleKeyDown(idx, e)}
                                    />
                                ))}
                            </div>

                            <button onClick={handleVerifyOTP} className="supplier-auth-btn">
                                Verify & Login
                            </button>

                            <div className="resend-timer">
                                {timer > 0 ? `Resend OTP in ${timer}s` : <span className="resend-link" onClick={handleSendOTP}>Resend OTP</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierLoginPopup;
