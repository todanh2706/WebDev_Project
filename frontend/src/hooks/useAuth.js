import { useContext } from "react";
import { AuthContext } from "../contexts/authContext.jsx";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context == null) {
        throw new Error("useAuth() must be included in <AuthProvider>!");
    }
    return context;
}