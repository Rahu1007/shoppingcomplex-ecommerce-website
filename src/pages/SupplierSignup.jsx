
import React, { useState } from 'react';
import { useSupplier } from '../context/SupplierContext';
import { useNavigate } from 'react-router-dom';
import './SupplierSignup.css';

const SupplierSignup = () => {
    const { signup } = useSupplier();
    const navigate = useNavigate();

    // Form Steps
    const [step, setStep] = useState(1);

    // Form Data
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        mobile: '',
        email: '',
        gst: '',
        address: '',
        password: '' // Optional if we stick to OTP only, but let's keep it minimal
    });

    const [errors, setErrors] = useState({});

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.businessName) newErrors.businessName = 'Business Name is required';
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact Person is required';
        if (!formData.mobile || formData.mobile.length !== 10) newErrors.mobile = 'Valid 10-digit Mobile is required';
        if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid Email is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.address) newErrors.address = 'Address is required';
        // GST optional for now
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep2()) {
            console.log('Submitting Supplier Registration:', formData);
            const success = await signup(formData);
            if (success) {
                navigate('/supplier/dashboard');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    return (
        <div className="supplier-signup-container">
            <div className="supplier-signup-card">
                <div className="signup-progress">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                </div>

                <div className="signup-header">
                    <h2>Become a Supplier</h2>
                    <p>Complete the form below to start selling</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    {step === 1 ? (
                        <div className="form-step slide-in">
                            <h3>Basic Information</h3>

                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter your company name" />
                                {errors.businessName && <span className="error-msg">{errors.businessName}</span>}
                            </div>

                            <div className="form-group">
                                <label>Contact Person</label>
                                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Your name" />
                                {errors.contactPerson && <span className="error-msg">{errors.contactPerson}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit number" maxLength="10" />
                                    {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                                    {errors.email && <span className="error-msg">{errors.email}</span>}
                                </div>
                            </div>

                            <button type="button" className="next-btn" onClick={handleNext}>Next Step →</button>
                        </div>
                    ) : (
                        <div className="form-step slide-in">
                            <h3>Business Details</h3>

                            <div className="form-group">
                                <label>GST Number (Optional)</label>
                                <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GSTIN" />
                            </div>

                            <div className="form-group">
                                <label>Business Address</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Full Registered Address" rows="3"></textarea>
                                {errors.address && <span className="error-msg">{errors.address}</span>}
                            </div>

                            <div className="btn-row">
                                <button type="button" className="prev-btn" onClick={() => setStep(1)}>← Back</button>
                                <button type="submit" className="submit-btn" onClick={handleSubmit}>Create Account</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SupplierSignup;
