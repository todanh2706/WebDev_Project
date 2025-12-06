import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("accessToken");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Failed to load auth state from localStorage", err);
            localStorage.removeItem("accessToken");
            localStorage.removeITem("user");
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to login!");

            const { user, accessToken } = data;
            setUser(user);
            setToken(accessToken);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            navigate('/home');
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, phone, address, password, captchaToken) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, address, password, captchaToken }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to register!");

            // Optional: Auto-login after register or just return success
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to refresh token!");

            const { accessToken } = data;
            setToken(accessToken);
            localStorage.setItem("accessToken", accessToken);
            return true;
        } catch (err) {
            console.error("Token refresh failed:", err);
            logout();
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
                method: "POST",
                credentials: 'include'
            });
        } catch (error) {
            console.error("Logout failed", error);
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        navigate('/login');
    };

    const verifyOTP = async (email, otp) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Verification failed");
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        let currentToken = localStorage.getItem("accessToken");
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`
        };

        let response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            const refreshSuccess = await refreshAccessToken();
            if (refreshSuccess) {
                const newToken = localStorage.getItem("accessToken");
                headers['Authorization'] = `Bearer ${newToken}`;
                response = await fetch(url, { ...options, headers });
            }
        }

        return response;
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, error, login, register, refreshAccessToken, logout, verifyOTP, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    )
}