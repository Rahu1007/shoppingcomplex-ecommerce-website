import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './Header.css';

const Header = () => {
    const { cart } = useContext(ShopContext);

    return (
        <header className="header">
            <div className="top-bar">
                <div className="container top-bar-content">
                    <span>Sourcing solutions services & membership help & community</span>
                    <div className="top-links">
                        <span>ShoppingComplex</span>
                        <span>Orders</span>
                        <span>Cart ({cart.length})</span>
                    </div>
                </div>
            </div>
            <div className="main-header container">
                <div className="logo">
                    <h1 style={{ color: 'var(--primary-orange)', fontStyle: 'italic' }}>ShoppingComplex</h1>
                </div>
                <div className="search-bar">
                    <div className="search-input-group">
                        <select className="search-select">
                            <option>Products</option>
                            <option>Suppliers</option>
                        </select>
                        <input type="text" placeholder="What are you looking for..." />
                        <button className="search-btn">Search</button>
                    </div>
                </div>
                <div className="user-actions">
                    <div className="action-item">
                        <span className="icon">👤</span>
                        <div className="text">
                            <Link to="/login" style={{ fontSize: '12px', color: 'var(--text-light)' }}>Login</Link>
                            <Link to="/signup" style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>Signup</Link>
                        </div>
                    </div>
                    <div className="action-item">
                        <span className="icon">💬</span>
                        <div className="text">
                            <small>Messages</small>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
