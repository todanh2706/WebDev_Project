import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const { showToast } = useToast();
    const processedRef = useRef(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            showToast('No token received', 'error');
            navigate('/login');
            return;
        }

        // Global Guard: Check if we have already processed this exact token in this window session.
        if (window.oauthProcessedToken === token) {
            navigate('/home', { replace: true });
            return;
        }

        // Mark as processed globally
        window.oauthProcessedToken = token;

        // Also set localStorage as persistent backup
        localStorage.setItem('accessToken', token);

        const handleLogin = async () => {
            try {
                if (loginWithToken) {
                    await loginWithToken(token);
                } else {
                    window.location.href = '/home';
                    return;
                }
                showToast('Login successful!', 'success');
                navigate('/home', { replace: true });
            } catch (error) {
                console.error(error);
                // Reset guard on failure so user can try again
                window.oauthProcessedToken = null;
                showToast('Login failed', 'error');
                navigate('/login');
            }
        };
        handleLogin();

    }, [searchParams, navigate, loginWithToken, showToast]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <h2 className="ms-3">Authenticating...</h2>
        </div>
    );
}
