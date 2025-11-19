import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

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
        <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="d-flex flex-column justify-content-center align-items-center border p-4 w-50 mx-auto rounded-4">
                <h3 >Log In</h3>
                <form onSubmit={handleSubmit} class="w-100 d-flex flex-column align-items-center">
                    <div class="form-floating mb-3 w-50">
                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
                        <label for="floatingInput">Email address</label>
                    </div>
                    <div class="form-floating mb-3 w-50">
                        <input type={showPassword ? "text" : "password"} class="form-control" id="floatingPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        <div
                            className="position-absolute end-0 top-50 translate-middle-y me-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
                        </div>
                        <label for="floatingPassword">Password</label>
                    </div>
                    {error && <p class="color-red">{error}</p>}
                    <button type="submit" class="btn btn-primary w-50">
                        {isLoading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        {isLoading ? 'Loading...' : 'Log In'}
                    </button>
                </form >
            </div>
        </div>
    );
}