import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Failed to load auth state from localStorage", err);
            localStorage.removeItem("token");
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

            const { user, token } = data;
            setUser(user);
            setToken(token);

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, error, login }}>
            {children}
        </AuthContext.Provider>
    )
}