
import React, { useState, useEffect } from 'react';
import { useSupplier } from '../context/SupplierContext';
import { supplierService } from '../services/supplierService';
import { useNavigate, Link } from 'react-router-dom';
import './SupplierDashboard.css';

const SupplierDashboard = () => {
    const { supplier, logout, isLoading } = useSupplier();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !supplier) {
            navigate('/');
        }
    }, [isLoading, supplier, navigate]);

    // Load products
    useEffect(() => {
        if (supplier) {
            const myProducts = supplierService.getProducts(supplier.id);
            setProducts(myProducts);
        }
    }, [supplier, refreshTrigger]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            supplierService.deleteProduct(id);
            setRefreshTrigger(prev => prev + 1);
        }
    };

    if (isLoading || !supplier) return <div className="loading-screen">Loading...</div>;

    const stats = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status === 'active').length,
        totalRevenue: '₹0' // Placeholder
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="user-avatar">
                        {supplier.businessName?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h4>{supplier.businessName}</h4>
                        <span className="user-role">Supplier Account</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active">📊 Dashboard</a>
                    <a href="#" className="nav-item">📦 Products</a>
                    <a href="#" className="nav-item">💰 Orders <span className="badge">0</span></a>
                    <a href="#" className="nav-item">⚙️ Settings</a>
                </nav>

                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="main-header">
                    <h1>Dashboard Overview</h1>
                    <Link to="/supplier/add-product" className="add-product-btn">
                        + Add New Product
                    </Link>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon p-blue">📦</div>
                        <div className="stat-info">
                            <h3>{stats.totalProducts}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon p-green">✅</div>
                        <div className="stat-info">
                            <h3>{stats.activeProducts}</h3>
                            <p>Active Listed</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon p-orange">💰</div>
                        <div className="stat-info">
                            <h3>{stats.totalRevenue}</h3>
                            <p>Revenue</p>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <section className="products-section">
                    <div className="section-header">
                        <h2>Your Products</h2>
                    </div>

                    <div className="table-container">
                        {products.length > 0 ? (
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td className="product-cell">
                                                <div className="product-thumb">
                                                    {product.images && product.images[0] ? (
                                                        <img src={product.images[0]} alt={product.name} />
                                                    ) : (
                                                        <span className="no-img">Img</span>
                                                    )}
                                                </div>
                                                <div className="product-details">
                                                    <span className="p-name">{product.name}</span>
                                                    <span className="p-cat">{product.category}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="price-info">
                                                    <span className="curr-price">₹{product.price}</span>
                                                    {product.originalPrice && (
                                                        <span className="old-price">₹{product.originalPrice}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{product.stock || 0}</td>
                                            <td>
                                                <span className={`status-badge ${product.status}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="edit-btn">✎</button>
                                                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>🗑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📦</div>
                                <h3>No products added yet</h3>
                                <p>Start building your catalog by adding your first product.</p>
                                <Link to="/supplier/add-product" className="btn-primary">Add Product</Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SupplierDashboard;
