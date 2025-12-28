import React, { createContext, useState, useEffect } from 'react';
import { supplierService } from '../services/supplierService';
import PropTypes from 'prop-types';
import { products as mockProducts } from '../data/mockData'; // Keeping for fallback if needed, or just remove usage

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('shoppingCart');
    }
  }, [cart]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      let fakeStoreData = [];
      let dummyJsonData = { products: [] };
      const customProducts = [
        {
          id: 1001,
          title: 'Samsung Galaxy S23 Ultra 5G',
          price: 89999,
          category: 'smartphones',
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
          rating: { rate: 4.7, count: 1250 }
        },
        {
          id: 1002,
          title: 'LG 55" 4K Smart TV',
          price: 45999,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
          rating: { rate: 4.5, count: 890 }
        },
        {
          id: 1003,
          title: 'Whirlpool 265L Refrigerator',
          price: 24999,
          category: 'appliances',
          image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
          rating: { rate: 4.3, count: 567 }
        },
        {
          id: 1004,
          title: 'Philips LED Smart Bulb',
          price: 599,
          category: 'lighting',
          image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400',
          rating: { rate: 4.2, count: 2340 }
        },
        {
          id: 1005,
          title: 'Milton Thermosteel Water Bottle 1L',
          price: 799,
          category: 'home & kitchen',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
          rating: { rate: 4.6, count: 3450 }
        },
        {
          id: 1006,
          title: 'Prestige Induction Cooktop',
          price: 2499,
          category: 'appliances',
          image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400',
          rating: { rate: 4.4, count: 1890 }
        },
        {
          id: 1007,
          title: 'Seiko Wall Clock',
          price: 1299,
          category: 'home decor',
          image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400',
          rating: { rate: 4.5, count: 890 }
        },
        {
          id: 1008,
          title: 'Wooden Photo Frame Set of 3',
          price: 899,
          category: 'home decor',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400',
          rating: { rate: 4.3, count: 670 }
        },
        {
          id: 1009,
          title: 'Ceramic Water Jug with Glasses',
          price: 1499,
          category: 'home & kitchen',
          image: 'https://images.unsplash.com/photo-1584627904-1bc1c0c3c7d9?w=400',
          rating: { rate: 4.4, count: 450 }
        },
        {
          id: 1010,
          title: 'Bajaj Table Fan 400mm',
          price: 1899,
          category: 'appliances',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          rating: { rate: 4.2, count: 1200 }
        }
      ];

      try {
        const results = await Promise.allSettled([
          fetch('https://fakestoreapi.com/products').then(res => res.json()),
          fetch('https://dummyjson.com/products?limit=50').then(res => res.json())
        ]);

        if (results[0].status === 'fulfilled') {
          fakeStoreData = results[0].value;
        } else {
          console.error('Failed to fetch from FakeStoreAPI:', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          dummyJsonData = results[1].value;
        } else {
          console.error('Failed to fetch from DummyJSON:', results[1].reason);
        }

        // Fetch Supplier Products
        const supplierProducts = supplierService.getAllProducts();
        const formattedSupplierProducts = supplierProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          originalPrice: Number(p.originalPrice || p.price),
          category: p.category,
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400',
          rating: 0,
          sold: 0,
          supplierId: p.supplierId,
          supplierName: p.supplierName,
          description: p.description
        }));

        // Combine all products
        const allProducts = [...fakeStoreData, ...(dummyJsonData.products || []), ...customProducts, ...formattedSupplierProducts];

        // Find max price (default to 1000 if no products found, to avoid -Infinity)
        const maxOriginalPrice = allProducts.length > 0
          ? Math.max(...allProducts.map(item => item.price))
          : 1000;

        // Adapt all products to uniform format
        const adaptedProducts = allProducts.map((item, index) => {
          // Robustly get rating as a number
          let ratingValue = 4.0;
          if (item && item.rating) {
            if (typeof item.rating === 'number') ratingValue = item.rating;
            else if (typeof item.rating === 'object' && typeof item.rating.rate === 'number') ratingValue = item.rating.rate;
          }

          // Robustly get sold count
          let soldValue = 0;
          if (item) {
            if (typeof item.stock === 'number') soldValue = item.stock;
            else if (item.rating && typeof item.rating.count === 'number') soldValue = item.rating.count;
            else soldValue = Math.floor(Math.random() * 1000);
          }

          return {
            id: item.id || (2000 + index),
            name: item.title || item.name || 'Unnamed Product',
            price: Number(200 + (((item.price || 0) / (maxOriginalPrice || 1)) * (50000 - 200))),
            category: item.category || 'Uncategorized',
            image: item.image || item.thumbnail || 'https://via.placeholder.com/400',
            rating: Number(ratingValue),
            sold: Number(soldValue)
          };
        });

        setProducts(adaptedProducts);
      } catch (err) {
        console.error("Critical error in product fetching:", err);
        // Fallback to minimal custom products if everything crashes
        setProducts(customProducts.map((item, index) => ({
          id: item.id || (2000 + index),
          name: item.title,
          price: item.price,
          category: item.category,
          image: item.image,
          rating: item.rating.rate,
          sold: item.rating.count
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
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
    setCart(prev => {
      // Check if product already exists in cart
      const existingItemIndex = prev.findIndex(item => item.id === product.id);

      if (existingItemIndex !== -1) {
        // Product exists, increase quantity
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // New product, add with quantity 1 and unique cart ID
        return [...prev, {
          ...product,
          quantity: 1,
          cartId: `${product.id}-${Date.now()}`
        }];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prev => prev.map(item =>
      item.cartId === cartId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToHistory = (productId) => {
    setViewHistory(prev => {
      // Keep last 10 items
      const newHistory = [productId, ...prev.filter(id => id !== productId)];
      return newHistory.slice(0, 10);
    });
  };

  const trackPurchase = (productId) => {
    console.log(`Purchase tracked for product ID: ${productId}`);
    // Implement actual tracking logic here if needed (e.g., analytics)
  };

  const getSimilarProductsForItem = React.useCallback((productId, n = 6) => {
    console.log('Getting similar products for product ID:', productId);
    const product = products.find(p => p.id === productId);

    if (!product) {
      console.log('Product not found');
      return [];
    }

    const similar = products
      .filter(p => p.category === product.category && p.id !== productId)
      .slice(0, n);

    console.log(`Found ${similar.length} similar products in category: ${product.category}`);
    return similar;
  }, [products]);

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      recommendations,
      addToHistory,
      trackPurchase,
      getSimilarProductsForItem
    }}>
      {children}
    </ShopContext.Provider>
  );
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
