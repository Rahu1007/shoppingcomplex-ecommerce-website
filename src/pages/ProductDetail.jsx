import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import SimilarProducts from '../components/Product/SimilarProducts';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, addToHistory, trackPurchase, loading } = useContext(ShopContext);
    const { showSuccess } = useToast();

    // Use loose equality to match both string and number IDs
    const product = products.find(p => p.id == id);

    // Track product view when component mounts
    useEffect(() => {
        if (product) {
            addToHistory(product.id);
        }
    }, [product, addToHistory]);

    if (loading) {
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

    const handleBuyNow = () => {
        // Instant navigation with product data - no delays
        navigate(`/checkout/${product.id}`, {
            state: { product },
            replace: false
        });
    };

    const handleAddToCart = () => {
        addToCart(product);
        showSuccess(`${product.name} added to cart successfully!`);
    };

    const handleBack = () => {
        // Instant navigation to home - no checks needed
        navigate('/', { replace: false });
    };

    return (
        <div className="product-detail-container">
            <div className="container">
                <button onClick={handleBack} className="back-button" style={{ position: 'relative', zIndex: 1100 }}>← Back</button>

                <div className="product-detail-content">
                    <div className="product-detail-image">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-detail-info">
                        <h1 className="product-detail-title">{product.name}</h1>
                        <p className="product-detail-category">{product.category}</p>

                        <div className="product-detail-price">₹ {(product.price || 0).toFixed(2)}</div>

                        <div className="product-detail-description">
                            <h3>Product Description</h3>
                            <p>
                                Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches)
                                in the padded sleeve, your everyday essentials in the main compartment, and small items in the
                                front zippered pocket. This versatile {product.category} item is designed for comfort and durability.
                            </p>
                        </div>

                        <div className="product-detail-meta">
                            <span>⭐ {product.rating} Rating</span>
                            <span>📦 {product.sold} sold</span>
                            {product.supplierId && (
                                <span className="supplier-link">
                                    🏪 Sold by: <span onClick={() => navigate(`/store/${product.supplierId}`)} style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}>
                                        {product.supplierName || 'Verified Supplier'}
                                    </span>
                                </span>
                            )}
                        </div>

                        <div className="product-detail-actions">
                            <button onClick={handleAddToCart} className="btn btn-outline-large">
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="btn btn-primary-large">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                <SimilarProducts productId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetail;

