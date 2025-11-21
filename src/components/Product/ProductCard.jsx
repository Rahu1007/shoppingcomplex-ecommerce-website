import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ShopContext } from '../../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToHistory, addToCart } = useContext(ShopContext);
    const navigate = useNavigate();

    const handleClick = () => {
        addToHistory(product.id);
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-card" onClick={handleClick}>
            <div className="product-img">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <div className="product-price">₹{product.price.toFixed(2)}</div>
                <div className="product-meta">
                    <span>★ {product.rating}</span>
                    <span>{product.sold} sold</span>
                </div>
                <button
                    className="add-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        sold: PropTypes.number.isRequired,
    }).isRequired,
};

export default ProductCard;
