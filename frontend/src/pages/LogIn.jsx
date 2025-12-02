import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash, FaGavel } from "react-icons/fa";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    }

    return (
        <div className="container-fluid vh-100 auction-bg-pattern overflow-hidden">
            <div className="row h-100">
                {/* Left Side - Hero/Branding (Hidden on small screens, visible on lg and up) */}
                <div className="col-lg-7 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative p-0">
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
                        <h1 className="display-3 fw-bold text-white mb-2">Premium Auction</h1>
                        <p className="lead text-light opacity-75">Discover unique treasures. Bid with confidence.</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-lg-5 col-12 d-flex align-items-center justify-content-center p-4">
                    <div className="glass-panel p-5 rounded-4 w-100 animate-fade-in" style={{ maxWidth: '500px' }}>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-white">Welcome Back</h2>
                            <p className="text-white-50">Sign in to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingInput" className="text-auction-primary">Email address</label>
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

                            {error && (
                                <Alert type="error" message={error} />
                            )}

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input className="form-check-input bg-dark border-secondary" type="checkbox" id="rememberMe" />
                                    <label className="form-check-label text-white-50" htmlFor="rememberMe">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-auction-primary text-decoration-none small">Forgot Password?</a>
                            </div>

                            <Button
                                type="submit"
                                className="py-3 fs-5 rounded-3"
                                isLoading={isLoading}
                                loadingText="Signing in..."
                            >
                                Sign In
                            </Button>

                            <div className="text-center mt-4 text-white-50">
                                Don't have an account? <a href="\register" className="text-auction-primary text-decoration-none fw-bold">Sign up</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}