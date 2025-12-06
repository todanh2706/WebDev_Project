import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            showToast('You need to login first', 'error');
        }
    }, [loading, user, showToast]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
