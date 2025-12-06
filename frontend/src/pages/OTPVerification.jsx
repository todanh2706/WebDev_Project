import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { FaLock } from 'react-icons/fa';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { verifyOTP } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await verifyOTP(email, otp);
            showToast('Account verified! Please log in.', 'success');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Verification failed');
            showToast(err.message || 'Verification failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="container-fluid min-vh-100 auction-bg-pattern d-flex align-items-center justify-content-center">
                <div className="glass-panel p-5 rounded-4 text-center animate-fade-in">
                    <h3 className="text-danger mb-3">Access Denied</h3>
                    <p className="text-white-50 mb-4">No email provided for verification.</p>
                    <Button onClick={() => navigate('/register')} className="w-100">
                        Go to Register
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 auction-bg-pattern">
            <div className="row">
                {/* Left Side - Hero/Branding */}
                <div className="col-lg-7 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative p-0" style={{ minHeight: '100vh' }}>
                    <div className="position-absolute w-100 h-100" style={{
                        backgroundImage: "url('/login_bg.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.4) sepia(0.2)',
                        zIndex: 0
                    }}></div>
                    <div className="position-relative z-1 text-center p-5 animate-fade-in">
                        <div className="display-1 text-auction-primary mb-3">
                            <FaLock />
                        </div>
                        <h1 className="display-3 fw-bold text-white mb-2">Security Check</h1>
                        <p className="lead text-light opacity-75">Protecting your account with secure verification.</p>
                    </div>
                </div>

                {/* Right Side - OTP Form */}
                <div className="col-lg-5 col-12 d-flex align-items-center justify-content-center p-4">
                    <div className="glass-panel p-5 rounded-4 w-100 animate-fade-in" style={{ maxWidth: '500px' }}>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-white">Verify OTP</h2>
                            <p className="text-white-50">
                                Enter the 6-digit code sent to <br />
                                <span className="text-white fw-medium">{email}</span>
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter OTP Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="bg-black bg-opacity-50 border-secondary border-opacity-25 text-white text-center text-spacing-2 fs-4 py-3"
                                    style={{ letterSpacing: '0.5rem' }}
                                    required
                                    maxLength={6}
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 py-3 fw-bold shadow-lg hover-scale"
                                disabled={isLoading || otp.length !== 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Account'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <p className="text-white-50 small mb-0">
                                Didn't receive code?{' '}
                                <button className="btn btn-link text-auction-primary p-0 text-decoration-none small fw-bold">
                                    Resend
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
