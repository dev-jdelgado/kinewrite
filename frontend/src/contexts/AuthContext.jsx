import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Restore Login Session
     */
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedAdmin = localStorage.getItem("admin");

        if (savedToken && savedAdmin) {
            setToken(savedToken);
            setAdmin(JSON.parse(savedAdmin));
        }

        setLoading(false);
    }, []);

    /**
     * Login
     */
    const login = async (credentials) => {
        try {
            console.log("Calling API...");

            const response = await AuthService.login(credentials);

            console.log("API Response:", response);
    
            if (response.data.success) {
                const jwtToken = response.data.token;
                const adminData = response.data.admin;
    
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("admin", JSON.stringify(adminData));
    
                setToken(jwtToken);
                
                console.log("Login successful");
    
                return {
                    success: true,
                    admin: adminData,
                };
            }
    
            return {
                success: false,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Unable to login. Please try again.",
            };
        }
    };

    /**
     * Logout
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
    
        setToken(null);
        setAdmin(null);
    };

    /**
     * Authentication Checker
     */
    const isAuthenticated = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                token,
                loading,
                login,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);