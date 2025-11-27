import React, { useState, useEffect } from 'react';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, onClose }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');

    // Close popup on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateInput = (value) => {
        // Check if it's a valid mobile number (10 digits) or email
        const mobileRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (mobileRegex.test(value) || emailRegex.test(value)) {
            setError('');
            return true;
        } else if (value.length > 0) {
            setError('Please enter a valid 10-digit mobile number or email');
            return false;
        }
        return false;
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMobileNumber(value);
        if (value.length > 0) {
            validateInput(value);
        } else {
            setError('');
        }
    };

    const handleRequestOTP = () => {
        if (validateInput(mobileNumber)) {
            // Here you would typically make an API call to send OTP
            console.log('Requesting OTP for:', mobileNumber);
            alert(`OTP will be sent to ${mobileNumber}`);
            onClose();
        } else {
            setError('Please enter a valid mobile number or email');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="login-popup-overlay" onClick={onClose}>
            <div className="login-popup-card" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="popup-close-btn" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                {/* Animated Background Icons */}
                <div className="popup-bg-icons">
                    <span className="bg-icon icon-1">🛒</span>
                    <span className="bg-icon icon-2">🎁</span>
                    <span className="bg-icon icon-3">⭐</span>
                    <span className="bg-icon icon-4">💳</span>
                    <span className="bg-icon icon-5">📦</span>
                </div>

                {/* Header Section */}
                <div className="popup-header">
                    <div className="popup-logo">
                        <div className="logo-circle">
                            <span className="logo-icon">🛍️</span>
                        </div>
                    </div>
                    <h2 className="popup-title">Welcome to ShoppingComplex</h2>
                    <p className="popup-subtitle">Sign in to unlock exclusive deals and personalized shopping</p>
                </div>

                {/* Login Form */}
                <div className="popup-form">
                    <div className="input-wrapper">
                        <div className="input-icon">📱</div>
                        <input
                            type="text"
                            placeholder="Enter your mobile number or email"
                            value={mobileNumber}
                            onChange={handleInputChange}
                            className={`popup-input ${error ? 'input-error' : ''}`}
                        />
                    </div>
                    {error && (
                        <div className="error-box">
                            <span className="error-icon">⚠️</span>
                            <p className="error-text">{error}</p>
                        </div>
                    )}

                    <button
                        className="popup-submit-btn"
                        onClick={handleRequestOTP}
                    >
                        <span>Continue with OTP</span>
                        <span className="btn-arrow">→</span>
                    </button>

                    {/* Benefits Section */}
                    <div className="benefits-section">
                        <p className="benefits-title">Why sign in?</p>
                        <div className="benefits-list">
                            <div className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <span>Track your orders</span>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <span>Save your wishlist</span>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <span>Get personalized recommendations</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="popup-footer">
                        <p className="footer-text">
                            By continuing, you agree to our{' '}
                            <a href="/terms" className="footer-link">Terms</a>
                            {' & '}
                            <a href="/privacy" className="footer-link">Privacy Policy</a>
                        </p>
                        <div className="signup-text">
                            New here?{' '}
                            <a href="/signup" className="signup-link">Create an account</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;
