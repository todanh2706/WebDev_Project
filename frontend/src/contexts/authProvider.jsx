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
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to login!");

            const { user, accessToken, refreshToken } = data;
            setUser(user);
            setToken(accessToken);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, phone, password) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password }),
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
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            logout();
            return false;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
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

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, error, login, register, refreshAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    )
}