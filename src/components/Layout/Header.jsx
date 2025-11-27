import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { ThemeContext } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
    const { cart } = useContext(ShopContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [topMenuOpen, setTopMenuOpen] = useState(false);

    return (
        <header className="header">
            {/* Top Menu Bar */}
            <div className="top-menu-bar">
                <div className="container top-menu-content">
                    <button
                        className="top-menu-hamburger"
                        onClick={() => setTopMenuOpen(!topMenuOpen)}
                        aria-label="Toggle navigation"
                    >
                        ☰
                    </button>
                    <button
                        className="dark-mode-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* Expandable Navigation Section */}
            {topMenuOpen && (
                <div className="top-nav-expanded">
                    <div className="container">
                        {/* Search Bar */}
                        <div className="expanded-search">
                            <select className="search-select">
                                <option>Products</option>
                                <option>Suppliers</option>
                            </select>
                            <input
                                type="text"
                                placeholder="What are you looking for..."
                                className="expanded-search-input"
                            />
                            <button className="expanded-search-btn">Search</button>
                        </div>

                        {/* Navigation Items */}
                        <div className="expanded-nav-items">
                            <Link to="/login" className="expanded-nav-item" onClick={() => setTopMenuOpen(false)}>
                                <span className="nav-icon">👤</span>
                                <span>Login / Signup</span>
                            </Link>
                            <div className="expanded-nav-item">
                                <span className="nav-icon">💬</span>
                                <span>Messages</span>
                            </div>
                            <div className="expanded-nav-item">
                                <span className="nav-icon">🛒</span>
                                <span>Cart ({cart.length})</span>
                            </div>
                            <div className="expanded-nav-item">
                                <span className="nav-icon">📦</span>
                                <span>Orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="mobile-menu">
                    <div className="mobile-menu-item">
                        <div className="search-bar-mobile">
                            <input type="text" placeholder="Search products..." />
                            <button className="search-btn">🔍</button>
                        </div>
                    </div>
                    <Link to="/login" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                        <span className="icon">👤</span>
                        <span>Login</span>
                    </Link>
                    <Link to="/signup" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                        <span className="icon">✍️</span>
                        <span>Signup</span>
                    </Link>
                    <div className="mobile-menu-item">
                        <span className="icon">💬</span>
                        <span>Messages</span>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
