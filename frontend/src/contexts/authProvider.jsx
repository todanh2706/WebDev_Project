import { useState, useEffect, useCallback } from "react";
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
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem("accessToken");
                const storedUser = localStorage.getItem("user");

                if (storedToken) {
                    setToken(storedToken);
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token exists but user doesn't. Fetch user.
                        try {
                            const userData = await authService.getProfile();
                            setUser(userData);
                            localStorage.setItem("user", JSON.stringify(userData));
                        } catch (profileError) {
                            console.error("Failed to fetch profile with stored token", profileError);
                            localStorage.removeItem("accessToken");
                            setToken(null);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load auth state from localStorage", err);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
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
    }, [navigate]);

    const register = useCallback(async (name, email, phone, address, password, captchaToken) => {
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
    }, []);

    const refreshAccessToken = useCallback(async () => {
        try {
            // check cookie? actually logic depended on calling getCookie which wasn't defined in view
            // Assuming getCookie implementation or authService handling.
            const data = await authService.refreshToken();
            const { accessToken } = data;
            setToken(accessToken);
            localStorage.setItem("accessToken", accessToken);
            return true;
        } catch (err) {
            console.error("Token refresh failed:", err);
            // logout(); // calling logout inside callback might need to be careful with dependencies
            // To be safe, avoid circular dep, or include logout in dependency if logout is memoized.
            // But usually just setting state is fine.
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            return false;
        }
    }, []);

    const logout = useCallback(async (shouldRedirect = true) => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        if (shouldRedirect) {
            navigate('/login');
        }
    }, [navigate]);

    const verifyOTP = useCallback(async (email, otp) => {
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
    }, []);

    const loginWithToken = useCallback(async (accessToken) => {
        setIsLoading(true);
        try {
            setToken(accessToken);
            localStorage.setItem("accessToken", accessToken);

            const userData = await authService.getProfile();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (err) {
            console.error("Login with token failed", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, error, login, register, refreshAccessToken, logout, verifyOTP, loginWithToken }}>
            {children}
        </AuthContext.Provider>
    )
};