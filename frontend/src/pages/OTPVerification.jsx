import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
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
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="text-center text-white">
                    <h3>Error</h3>
                    <p>No email provided for verification.</p>
                    <Button onClick={() => navigate('/register')}>Go to Register</Button>
                </div>
            </Container>
        );
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 position-relative overflow-hidden">
            {/* Background Elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black"></div>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-radial from-auction-primary/20 to-transparent opacity-20"></div>

            <Container className="position-relative z-1">
                <Row className="justify-content-center">
                    <Col md={6} lg={5} xl={4}>
                        <div className="glass-panel p-4 p-md-5 rounded-xl shadow-lg border border-white border-opacity-10 animate-slide-up">
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center bg-auction-primary bg-opacity-20 p-3 rounded-circle mb-3 text-auction-primary">
                                    <FaLock size={24} />
                                </div>
                                <h2 className="fw-bold text-white mb-2">Verify OTP</h2>
                                <p className="text-white-50 small">
                                    Enter the 6-digit code sent to <br />
                                    <span className="text-white fw-medium">{email}</span>
                                </p>
                            </div>

                            {/* Error handled by Toast */}

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
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OTPVerification;
