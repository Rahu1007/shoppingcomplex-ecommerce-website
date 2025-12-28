import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    // Hide the product card if image fails to load
    if (imageError) {
        return null;
    }

    // Safety checks for product data
    if (!product || !product.id || !product.name) {
        return null;
    }

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image-container">
                <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    onError={handleImageError}
                    loading="lazy"
                />
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</div>
                <div className="product-meta">
                    <span className="product-rating">⭐ {product.rating || 0}</span>
                    <span className="product-sold">{product.sold || 0} sold</span>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        rating: PropTypes.number,
        sold: PropTypes.number
    }).isRequired
};

export default ProductCard;
