
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { supplierService } from '../services/supplierService';
import './SupplierStore.css';

const SupplierStore = () => {
    const { supplierId } = useParams();
    const { products, addToCart } = useContext(ShopContext);
    const [supplier, setSupplier] = useState(null);
    const [storeProducts, setStoreProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreData = async () => {
            setLoading(true);
            try {
                // Get supplier info
                const supplierInfo = supplierService.getSupplierById(supplierId);
                setSupplier(supplierInfo);

                // Filter products for this supplier
                // Note: ShopContext products already have supplierId from our previous edit
                const relevantProducts = products.filter(p => p.supplierId === supplierId);
                setStoreProducts(relevantProducts);
            } catch (error) {
                console.error("Error loading store:", error);
            } finally {
                setLoading(false);
            }
        };

        if (products.length > 0) {
            fetchStoreData();
        }
    }, [supplierId, products]);

    if (loading) return <div className="store-loading">Loading Store...</div>;

    if (!supplier) return (
        <div className="store-not-found">
            <h2>Store Not Found</h2>
            <p>The supplier you are looking for does not exist or has been removed.</p>
            <Link to="/" className="btn-home">Go Home</Link>
        </div>
    );

    return (
        <div className="supplier-store-page">
            <div className="store-banner">
                <div className="container">
                    <div className="store-profile">
                        <div className="store-avatar">
                            {supplier.businessName?.charAt(0) || 'S'}
                        </div>
                        <div className="store-info">
                            <h1>{supplier.businessName}</h1>
                            <p className="store-meta">
                                <span>📍 {supplier.address || 'Verified Supplier'}</span>
                                <span>📅 Joined {new Date(supplier.joinedDate).toLocaleDateString()}</span>
                                <span>⭐ 4.5 Rating</span>
                            </p>
                        </div>
                        <div className="store-actions">
                            <button className="btn-follow">Follow Store</button>
                            <button className="btn-message">Message</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container store-content">
                <div className="store-sidebar">
                    <h3>Categories</h3>
                    <ul className="store-cats">
                        <li>All Products ({storeProducts.length})</li>
                        {/* Dynamic categories could go here */}
                    </ul>
                </div>

                <div className="store-main">
                    <h2>All Products</h2>
                    {storeProducts.length > 0 ? (
                        <div className="store-grid">
                            {storeProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <Link to={`/product/${product.id}`} className="product-img-link">
                                        <img src={product.image} alt={product.name} />
                                    </Link>
                                    <div className="product-info">
                                        <div className="cat-name">{product.category}</div>
                                        <Link to={`/product/${product.id}`} className="prod-title">
                                            {product.name}
                                        </Link>
                                        <div className="prod-price">
                                            ₹{product.price}
                                            {product.originalPrice > product.price && (
                                                <span className="orig-price">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                        <button
                                            className="add-cart-btn"
                                            onClick={() => addToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-store">
                            <p>This supplier hasn't added any products yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierStore;
