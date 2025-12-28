
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supplierService } from '../services/supplierService';
import { useToast } from './ToastContext';

const SupplierContext = createContext();

export const useSupplier = () => {
    const context = useContext(SupplierContext);
    if (!context) {
        throw new Error('useSupplier must be used within a SupplierProvider');
    }
    return context;
};

export const SupplierProvider = ({ children }) => {
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();

    // Check for existing session on load
    useEffect(() => {
        const session = supplierService.getCurrentSupplier();
        if (session) {
            setSupplier(session);
        }
        setLoading(false);
    }, []);

    const login = async (identifier) => {
        try {
            const supplierData = supplierService.loginSupplier(identifier);
            supplierService.createSession(supplierData);
            setSupplier(supplierData);
            showSuccess(`Welcome back, ${supplierData.businessName || supplierData.name}!`);
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    };

    const signup = async (data) => {
        try {
            const newSupplier = supplierService.registerSupplier(data);
            supplierService.createSession(newSupplier);
            setSupplier(newSupplier);
            showSuccess('Supplier account created successfully!');
            return true;
        } catch (error) {
            showError(error.message);
            return false;
        }
    };

    const logout = () => {
        supplierService.logout();
        setSupplier(null);
        showSuccess('Logged out successfully');
        window.location.href = '/'; // Redirect to home
    };

    const value = {
        supplier,
        isLoading: loading,
        login,
        signup,
        logout
    };

    return (
        <SupplierContext.Provider value={value}>
            {children}
        </SupplierContext.Provider>
    );
};
