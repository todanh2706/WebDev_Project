import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => {
            setProgress(0);
        }, 100);

        const closeTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    };

    return (
        <div className={`toast-notification toast-${type} ${isExiting ? 'exiting' : ''}`}>
            <div className="toast-icon">
                {type === 'success' && <CheckCircle size={24} />}
                {type === 'error' && <AlertCircle size={24} />}
                {type === 'info' && <Info size={24} />}
            </div>

            <div className="toast-content">
                <p className="toast-message">{message}</p>
            </div>

            <button onClick={handleClose} className="toast-close">
                <X size={18} />
            </button>

            <div
                className="toast-progress"
                style={{
                    width: `${progress}%`,
                    transition: `width ${duration}ms linear`
                }}
            />
        </div>
    );
};

export default Toast;
