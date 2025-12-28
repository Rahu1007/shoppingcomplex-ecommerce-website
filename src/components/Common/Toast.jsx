import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

const Toast = ({ toast }) => {
    const { removeToast } = useToast();
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start exit animation before removal
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, toast.duration - 300);

        return () => clearTimeout(exitTimer);
    }, [toast.duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            removeToast(toast.id);
        }, 300);
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'info':
                return 'ℹ';
            default:
                return '✓';
        }
    };

    return (
        <div
            className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}
            style={{
                '--progress-duration': `${toast.duration}ms`
            }}
        >
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={handleClose}>×</button>
        </div>
    );
};

Toast.propTypes = {
    toast: PropTypes.shape({
        id: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
        duration: PropTypes.number.isRequired,
    }).isRequired,
};

const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
