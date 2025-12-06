import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../contexts/ToastContext";
import { FaEye, FaEyeSlash, FaGavel, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import Button from '../components/common/Button';

import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [address, setAddress] = useState('');

    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();


    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match!");
            showToast("Passwords do not match!", "error");
            return;
        }

        try {
            await register(name, email, phone, address, password, captchaToken);
            showToast("Registration successful! Please verify your email.", "success");
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            // Error is handled by context but we also show toast
            showToast(err.message || "Registration failed", "error");
        }
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
                            <FaGavel />
                        </div>
                        <h1 className="display-3 fw-bold text-white mb-2">Join the Auction</h1>
                        <p className="lead text-light opacity-75">Start bidding on exclusive items today.</p>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="col-lg-5 col-12 d-flex align-items-center justify-content-center p-4">
                    <div className="glass-panel p-5 rounded-4 w-100 animate-fade-in" style={{ maxWidth: '500px' }}>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-white">Create Account</h2>
                            <p className="text-white-50">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingName"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingName" className="text-auction-primary">Full Name</label>
                            </div>

                            <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingEmail"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingEmail" className="text-auction-primary">Email address</label>
                            </div>

                            <div className="form-floating">
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="floatingPhone"
                                    placeholder="1234567890"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingPhone" className="text-auction-primary">Phone Number</label>
                            </div>

                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingAddress"
                                    placeholder="227 Nguyen Van Cu, Cho Quan ward, District 5, Ho Chi Minh City"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingAddress" className="text-auction-primary">Address</label>
                            </div>

                            <div className="form-floating position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingPassword" className="text-auction-primary">Password</label>
                                <div
                                    className="position-absolute top-50 end-0 translate-middle-y me-3 text-auction-primary"
                                    style={{ cursor: 'pointer', zIndex: 5 }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </div>
                            </div>

                            <div className="form-floating">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingConfirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingConfirmPassword" className="text-auction-primary">Confirm Password</label>
                            </div>

                            {/* Error handled by Toast */}

                            <div className="d-flex justify-content-center my-3">
                                <ReCAPTCHA
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "YOUR_RECAPTCHA_SITE_KEY"}
                                    onChange={(token) => setCaptchaToken(token)}
                                    theme="dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="py-3 fs-5 rounded-3 mt-2"
                                isLoading={isLoading}
                                loadingText="Creating Account..."
                                disabled={!captchaToken}
                            >
                                Register
                            </Button>

                            <div className="text-center mt-4 text-white-50">
                                Already have an account? <a href="/login" className="text-auction-primary text-decoration-none fw-bold">Sign in</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
