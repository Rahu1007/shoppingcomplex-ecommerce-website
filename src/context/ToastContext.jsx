import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const showError = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const showInfo = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            showSuccess,
            showError,
            showInfo
        }}>
            {children}
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
