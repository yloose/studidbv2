// File: src/main/js/hooks/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: any | null;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    // Verify token with backend
                    // For demo, just simulate authentication
                    setUser({
                        name: "Alex Johnson",
                        studentId: "UNI2025124",
                        program: "Computer Science",
                        year: 3,
                        gpa: 3.8
                    });
                    setIsAuthenticated(true);
                }
            } catch (error) {
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: { username: string; password: string }) => {
        setLoading(true);
        try {
            // In production, this would call your Spring backend
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(credentials),
            // });
            // const data = await response.json();

            // For demo, simulate successful login
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store token
            localStorage.setItem('authToken', 'demo-token');

            // Set user data
            setUser({
                name: "Alex Johnson",
                studentId: "UNI2025124",
                program: "Computer Science",
                year: 3,
                gpa: 3.8
            });
            setIsAuthenticated(true);
        } catch (error) {
            throw new Error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;