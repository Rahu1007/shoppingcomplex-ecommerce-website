import React from 'react';
import { categories } from '../../data/mockData';
import './CategorySidebar.css';

const CategorySidebar = () => {
    return (
        <div className="category-sidebar">
            <h3>My Markets</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map(cat => (
                    <li key={cat.id} className="category-item">
                        <span className="cat-name">{cat.name}</span>
                        <div className="sub-menu">
                            <h4>{cat.name}</h4>
                            <div className="chip-container">
                                {cat.sub.map(s => (
                                    <div
                                        key={s}
                                        className="sub-item-chip"
                                        onClick={() => window.location.href = `/category/${encodeURIComponent(s)}`}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;
