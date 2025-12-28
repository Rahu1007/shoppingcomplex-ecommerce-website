
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/Product/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { products } = useContext(ShopContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Decode and normalize category
        const decodedCategory = decodeURIComponent(categoryName);
        console.log(`Filtering for category/tag: ${decodedCategory}`);

        // Very basic flexible matching since we don't have tags in mock data yet
        // In a real app we would match against product.tags or product.subCategory
        const results = products.filter(p => {
            const searchLower = decodedCategory.toLowerCase();
            // Check category, name, or description for the tag
            return (
                p.category?.toLowerCase().includes(searchLower) ||
                p.name?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower)
            );
        });

        setFilteredProducts(results);
    }, [categoryName, products]);

    return (
        <div className="container category-page">
            <button onClick={() => navigate('/')} className="back-btn">← Back to Home</button>

            <div className="category-header">
                <h1>{decodeURIComponent(categoryName)}</h1>
                <p>Found {filteredProducts.length} items</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="empty-category">
                    <h3>No products found for "{decodeURIComponent(categoryName)}"</h3>
                    <p>Try searching for something else or browse our main categories.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">Browse All</button>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
