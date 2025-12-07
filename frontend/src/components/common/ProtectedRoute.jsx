import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, isLoading } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && !user) {
            showToast('You need to login first', 'error');
        }
    }, [isLoading, user, showToast]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin) {
        // Check for 'ADMIN' string or role ID 2
        const isAdmin = user.role === 'ADMIN' || user.role === 2 || user.role === '2';

        if (!isAdmin) {
            // Use a timeout to avoid rendering update warnings if toast triggers state change
            setTimeout(() => showToast('You are not authorized to access this page', 'error'), 0);
            return <Navigate to="/home" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
