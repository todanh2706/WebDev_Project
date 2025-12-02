import React from 'react';
import { FaExclamationCircle, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const Alert = ({ type = 'error', message, onClose }) => {
    if (!message) return null;

    const getAlertConfig = () => {
        switch (type) {
            case 'warning':
                return {
                    className: 'alert-warning',
                    icon: <FaExclamationTriangle size={20} />
                };
            case 'success':
                return {
                    className: 'alert-success',
                    icon: <FaCheckCircle size={20} />
                };
            case 'error':
            default:
                return {
                    className: 'alert-error',
                    icon: <FaExclamationCircle size={20} />
                };
        }
    };

    const config = getAlertConfig();

    return (
        <div className={`alert-custom ${config.className} w-100 animate-fade-in`} role="alert">
            <div className="flex-shrink-0">
                {config.icon}
            </div>
            <div className="flex-grow-1">
                {message}
            </div>
            {onClose && (
                <button
                    type="button"
                    className="btn-close btn-close-white ms-auto"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ filter: type === 'warning' ? 'none' : 'invert(1)' }}
                ></button>
            )}
        </div>
    );
};

export default Alert;
