import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal } = useContext(ShopContext);
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="cart-empty-container">
                <div className="cart-empty-content">
                    <div className="cart-empty-icon">🛒</div>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
        // In a real app, navigate to checkout page
    };

    return (
        <div className="cart-container">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <button onClick={clearCart} className="btn btn-text">
                        Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.cartId} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <p className="cart-item-category">{item.category}</p>
                                    <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                                            className="quantity-btn"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                                            className="quantity-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.cartId)}
                                        className="btn btn-remove"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                            <span>₹{getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>₹{getCartTotal().toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} className="btn btn-checkout">
                            Proceed to Checkout
                        </button>
                        <button onClick={() => navigate('/')} className="btn btn-continue">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
