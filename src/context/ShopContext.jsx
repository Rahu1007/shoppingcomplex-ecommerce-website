import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { products as mockProducts } from '../data/mockData'; // Keeping for fallback if needed, or just remove usage

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        // Find max price in the original data
        const maxOriginalPrice = Math.max(...data.map(item => item.price));

        const adaptedProducts = data.map(item => ({
          id: item.id,
          name: item.title,
          // Normalize price from 200 to max price (let's use 5000 as max)
          price: 200 + ((item.price / maxOriginalPrice) * (5000 - 200)),
          category: item.category,
          image: item.image,
          rating: item.rating.rate,
          sold: item.rating.count
        }));
        setProducts(adaptedProducts);
      })
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  // Simple recommendation logic: suggest products from categories user has viewed
  useEffect(() => {
    if (products.length === 0) return;

    if (viewHistory.length > 0) {
      const viewedCategories = new Set(viewHistory.map(id => {
        const p = products.find(prod => prod.id === id);
        return p ? p.category : null;
      }).filter(Boolean));

      const recs = products.filter(p => viewedCategories.has(p.category) && !viewHistory.includes(p.id));
      // If not enough recs, fill with random popular items
      if (recs.length < 5) {
        const others = products.filter(p => !viewHistory.includes(p.id) && !recs.includes(p));
        recs.push(...others.slice(0, 5 - recs.length));
      }
      setRecommendations(recs.slice(0, 10));
    } else {
      // Default recommendations
      setRecommendations(products.slice(0, 5));
    }
  }, [viewHistory, products]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const addToHistory = (productId) => {
    setViewHistory(prev => {
      // Keep last 10 items
      const newHistory = [productId, ...prev.filter(id => id !== productId)];
      return newHistory.slice(0, 10);
    });
  };

  return (
    <ShopContext.Provider value={{ products, cart, addToCart, recommendations, addToHistory }}>
      {children}
    </ShopContext.Provider>
  );
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
