
import React, { useState } from 'react';
import { useSupplier } from '../context/SupplierContext';
import { supplierService } from '../services/supplierService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './AddProduct.css';

const AddProduct = () => {
    const { supplier } = useSupplier();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        category: 'Electronics',
        price: '',
        originalPrice: '',
        stock: '',
        description: '',
        brand: '',
        specifications: [{ key: '', value: '' }] // Dynamic specs
    });

    const categories = [
        'Electronics', 'Fashion', 'Home & Garden', 'Beauty',
        'Toys & Hobbies', 'Automotive', 'Sports', 'Books'
    ];

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            showError('max 5 images allowed');
            return;
        }

        const newImages = [];
        for (const file of files) {
            try {
                const base64 = await supplierService.convertImageToBase64(file);
                newImages.push(base64);
            } catch (err) {
                console.error('Error converting image', err);
            }
        }
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...product.specifications];
        newSpecs[index][field] = value;
        setProduct({ ...product, specifications: newSpecs });
    };

    const addSpec = () => {
        setProduct({
            ...product,
            specifications: [...product.specifications, { key: '', value: '' }]
        });
    };

    const removeSpec = (index) => {
        const newSpecs = product.specifications.filter((_, i) => i !== index);
        setProduct({ ...product, specifications: newSpecs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!product.name || !product.price || images.length === 0) {
            showError('Please fill required fields and add at least one image');
            setLoading(false);
            return;
        }

        const productData = {
            ...product,
            images: images,
            supplierId: supplier.id,
            supplierName: supplier.businessName,
            rating: 0,
            reviews: 0
        };

        try {
            supplierService.addProduct(productData);
            showSuccess('Product added successfully!');
            navigate('/supplier/dashboard');
        } catch (error) {
            showError('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-header">
                <h2>Add New Product</h2>
                <button className="cancel-btn" onClick={() => navigate('/supplier/dashboard')}>Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-section">
                    <h3>Basic Information</h3>

                    <div className="form-group">
                        <label>Product Name*</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            placeholder="e.g. Wireless Bluetooth Headphones"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category*</label>
                            <select
                                value={product.category}
                                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Brand</label>
                            <input
                                type="text"
                                value={product.brand}
                                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                                placeholder="Brand Name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            placeholder="Detailed product description..."
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Pricing & Inventory</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Selling Price (₹)*</label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Original Price (₹)</label>
                            <input
                                type="number"
                                value={product.originalPrice}
                                onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                value={product.stock}
                                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Product Images*</h3>
                    <div className="image-upload-area">
                        <input
                            type="file"
                            id="img-upload"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            hidden
                        />
                        <label htmlFor="img-upload" className="upload-placeholder">
                            <span className="upload-icon">☁️</span>
                            <span>Click to upload images</span>
                            <span className="upload-hint">(Max 5 images)</span>
                        </label>

                        <div className="image-preview-grid">
                            {images.map((img, idx) => (
                                <div key={idx} className="preview-card">
                                    <img src={img} alt={`preview ${idx}`} />
                                    <button type="button" className="remove-img" onClick={() => removeImage(idx)}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Specifications</h3>
                    <div className="specs-container">
                        {product.specifications.map((spec, idx) => (
                            <div key={idx} className="spec-row">
                                <input
                                    type="text"
                                    placeholder="Feature Name (e.g. Color)"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g. Red)"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                                />
                                <button type="button" className="remove-spec" onClick={() => removeSpec(idx)}>✕</button>
                            </div>
                        ))}
                        <button type="button" className="add-spec-btn" onClick={addSpec}>+ Add Specification</button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
