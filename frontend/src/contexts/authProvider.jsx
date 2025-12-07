import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
            localStorage.removeItem("user");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);

        try {
            const data = await authService.login(email, password);
            const { user, accessToken } = data;
            setUser(user);
            setToken(accessToken);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, phone, address, password, captchaToken) => {
        setIsLoading(true);
        try {
            await authService.register({ name, email, phone, address, password, captchaToken });
            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = getCookie('refreshToken');

            const data = await authService.refreshToken();
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
            await authService.logout();
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
            const data = await authService.verifyOTP(email, otp);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, error, login, register, refreshAccessToken, logout, verifyOTP }}>
            {children}
        </AuthContext.Provider>
    )
}