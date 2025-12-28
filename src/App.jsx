
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SupplierProvider } from './context/SupplierContext'; // Import Supplier Provider
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ToastContainer from './components/Common/Toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SupplierDashboard from './pages/SupplierDashboard'; // Supplier Routes
import SupplierSignup from './pages/SupplierSignup';
import AddProduct from './pages/AddProduct';
import SupplierStore from './pages/SupplierStore';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SupplierProvider>
          <ShopProvider>
            <Router>
              <div className="app">
                <Header />
                <ToastContainer />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/cart" element={<Cart />} />

                  {/* Supplier Routes */}
                  <Route path="/supplier/signup" element={<SupplierSignup />} />
                  <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
                  <Route path="/supplier/add-product" element={<AddProduct />} />
                  <Route path="/store/:supplierId" element={<SupplierStore />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                </Routes>
                <Footer />
              </div>
            </Router>
          </ShopProvider>
        </SupplierProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
