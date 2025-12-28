import React, { useContext, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import './Checkout.css';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { products, trackPurchase, loading } = useContext(ShopContext);
    const { showSuccess, showError } = useToast();

    // INSTANT LOAD: Use product from navigation state if available (passed from Buy Now)
    // This makes checkout load instantly without waiting for context
    const passedProduct = location.state?.product;
    const product = passedProduct || products.find(p => p.id == id);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    const [quantity, setQuantity] = useState(1);

    // Skip loading screen if we have product from navigation state (instant load!)
    if (loading && !passedProduct) {
        return (
            <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>
                <h2>Product not found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">Go Back Home</button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
            showError('Please fill in all required fields');
            return;
        }

        // Track purchase
        trackPurchase(product.id);

        // Show success message
        showSuccess('Order placed successfully! You will receive a confirmation email shortly.');

        // Navigate to home after a delay
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const totalPrice = (product.price || 0) * (quantity || 1);
    const formattedPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
    const formattedTotal = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00';

    const handleBack = () => {
        // Instant navigation to home
        navigate('/', { replace: false });
    };

    return (
        <div className="checkout-container">
            <div className="container">
                <button onClick={handleBack} className="back-button" style={{ position: 'relative', zIndex: 1100 }}>← Back</button>

                <h1 className="checkout-title">Checkout</h1>

                <div className="checkout-content">
                    {/* Order Summary */}
                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="order-product">
                            <img src={product.image} alt={product.name} />
                            <div className="order-product-info">
                                <h3>{product.name}</h3>
                                <p className="order-product-category">{product.category}</p>
                                <p className="order-product-price">₹ {formattedPrice}</p>
                            </div>
                        </div>

                        <div className="quantity-selector">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button onClick={() => handleQuantityChange(-1)}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>

                        <div className="order-pricing">
                            <div className="pricing-row">
                                <span>Subtotal:</span>
                                <span>₹ {formattedTotal}</span>
                            </div>
                            <div className="pricing-row">
                                <span>Shipping:</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="pricing-row total">
                                <span>Total:</span>
                                <span>₹ {formattedTotal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="checkout-form-container">
                        <h2>Shipping Information</h2>

                        <form onSubmit={handlePlaceOrder} className="checkout-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit mobile number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="House No., Building Name, Street"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode *</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="6-digit pincode"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Payment Method *</label>
                                <div className="payment-methods">
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                        />
                                        <span>Cash on Delivery</span>
                                    </label>
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleInputChange}
                                        />
                                        <span>Credit/Debit Card</span>
                                    </label>
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === 'upi'}
                                            onChange={handleInputChange}
                                        />
                                        <span>UPI</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary-large place-order-btn">
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
