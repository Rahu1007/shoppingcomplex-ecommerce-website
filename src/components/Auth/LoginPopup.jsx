import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, onClose }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const { showSuccess, showError } = useToast();

    // Close popup on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

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

    // Timer countdown for OTP resend
    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleClose = () => {
        setMobileNumber('');
        setError('');
        setOtpSent(false);
        setOtp(['', '', '', '', '', '']);
        setGeneratedOtp('');
        setTimer(30);
        setCanResend(false);
        onClose();
    };

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

    const generateOTP = () => {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    };

    const handleRequestOTP = async () => {
        if (validateInput(mobileNumber)) {
            try {
                // Check if it's an email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isEmail = emailRegex.test(mobileNumber);

                // Call backend API to send OTP
                const response = await fetch('http://localhost:8000/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: isEmail ? mobileNumber : null,
                        mobile: !isEmail ? mobileNumber : null
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // OTP sent successfully via backend
                    showSuccess(`✅ OTP sent to ${mobileNumber}! ${isEmail ? 'Check your email.' : 'Check your phone.'}`);

                    console.log('✅ OTP sent successfully via backend');
                    console.log(`📧 Sent to: ${mobileNumber}`);

                    setOtpSent(true);
                    setTimer(30);
                    setCanResend(false);
                } else {
                    // Backend error - fall back to local OTP for testing
                    console.warn('Backend not available, using local OTP');
                    const newOtp = generateOTP();
                    setGeneratedOtp(newOtp);

                    showSuccess(`📱 OTP for ${mobileNumber}:\n\n🔐 ${newOtp}\n\n(Backend not running - using test mode)`);

                    console.log('%c ═══════════════════════════════════════', 'color: #FF6A00; font-weight: bold');
                    console.log('%c 🔐 YOUR OTP CODE: ' + newOtp, 'color: #FF6A00; font-size: 20px; font-weight: bold; background: #fff5ed; padding: 10px');
                    console.log('%c ═══════════════════════════════════════', 'color: #FF6A00; font-weight: bold');

                    setOtpSent(true);
                    setTimer(30);
                    setCanResend(false);
                }
            } catch (error) {
                // Network error - fall back to local OTP
                console.error('Backend connection error:', error);
                const newOtp = generateOTP();
                setGeneratedOtp(newOtp);

                showSuccess(`📱 OTP for ${mobileNumber}:\n\n🔐 ${newOtp}\n\n(Offline mode - backend not connected)`);

                console.log('%c ═══════════════════════════════════════', 'color: #FF6A00; font-weight: bold');
                console.log('%c 🔐 YOUR OTP CODE: ' + newOtp, 'color: #FF6A00; font-size: 20px; font-weight: bold; background: #fff5ed; padding: 10px');
                console.log('%c ═══════════════════════════════════════', 'color: #FF6A00; font-weight: bold');

                setOtpSent(true);
                setTimer(30);
                setCanResend(false);
            }
        } else {
            setError('Please enter a valid mobile number or email');
        }
    };

    const handleResendOTP = () => {
        if (canResend) {
            const newOtp = generateOTP();
            setGeneratedOtp(newOtp);

            console.log('🔐 New OTP Generated:', newOtp);
            console.log('📱 Resending OTP to:', mobileNumber);

            showSuccess(`New OTP sent! Check console: ${newOtp}`);

            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
        }
    };

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        const lastInput = document.getElementById(`otp-${lastIndex}`);
        if (lastInput) lastInput.focus();
    };

    const handleVerifyOTP = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            showError('Please enter complete 6-digit OTP');
            return;
        }

        try {
            // Try to verify with backend first
            const response = await fetch('http://localhost:8000/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: mobileNumber,
                    otp: enteredOtp
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Backend verification successful
                showSuccess('Login successful! Welcome to ShoppingComplex 🎉');
                localStorage.setItem('userPhone', mobileNumber);
                localStorage.setItem('isLoggedIn', 'true');
                handleClose();
            } else {
                // Backend says invalid OTP
                showError(data.detail || 'Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                document.getElementById('otp-0')?.focus();
            }
        } catch (error) {
            // Backend not available - fall back to local verification
            console.warn('Backend not available, using local verification');

            if (enteredOtp === generatedOtp) {
                showSuccess('Login successful! Welcome to ShoppingComplex 🎉');
                localStorage.setItem('userPhone', mobileNumber);
                localStorage.setItem('isLoggedIn', 'true');
                handleClose();
            } else {
                showError('Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                document.getElementById('otp-0')?.focus();
            }
        }
    };

    const handleEditNumber = () => {
        setOtpSent(false);
        setOtp(['', '', '', '', '', '']);
        setGeneratedOtp('');
        setTimer(30);
        setCanResend(false);
    };

    if (!isOpen) return null;

    return (
        <div className="login-popup-overlay" onClick={handleClose}>
            <div className="login-popup-card" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="popup-close-btn" onClick={handleClose} aria-label="Close">
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
                    <h2 className="popup-title">
                        {otpSent ? 'Verify OTP' : 'Welcome to ShoppingComplex'}
                    </h2>
                    <p className="popup-subtitle">
                        {otpSent
                            ? `Enter the 6-digit code sent to ${mobileNumber}`
                            : 'Sign in to unlock exclusive deals and personalized shopping'
                        }
                    </p>
                </div>

                {/* Login Form */}
                <div className="popup-form">
                    {!otpSent ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            {/* OTP Input Section */}
                            <div className="otp-input-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        className="otp-input"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {/* Timer and Resend */}
                            <div className="otp-timer-section">
                                {!canResend ? (
                                    <p className="timer-text">
                                        Resend OTP in <span className="timer-count">{timer}s</span>
                                    </p>
                                ) : (
                                    <button className="resend-btn" onClick={handleResendOTP}>
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            {/* Verify Button */}
                            <button
                                className="popup-submit-btn"
                                onClick={handleVerifyOTP}
                            >
                                <span>Verify & Continue</span>
                                <span className="btn-arrow">→</span>
                            </button>

                            {/* Edit Number */}
                            <button className="edit-number-btn" onClick={handleEditNumber}>
                                ← Change Number
                            </button>
                        </>
                    )}

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
