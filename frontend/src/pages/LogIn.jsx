import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div class="mb-3">
                <label class="form-label">Email address</label>
                <input type="email" class="form-control" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} />
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" class="btn btn-primary">
                {isLoading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                {isLoading ? 'Loading...' : 'Log In'}
            </button>
            {error && <p class="color-red">{error}</p>}
        </form >
    );
}