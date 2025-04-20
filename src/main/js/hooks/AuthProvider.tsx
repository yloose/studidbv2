import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    data: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        // Check if user is already logged in
        let data = localStorage.getItem('data');
        setIsAuthenticated(data != null);

        if (data != null) {
            try {
                const parsedData = JSON.parse(data);
                setData(parsedData);
            } catch (error) {
                // Handle potential JSON parse error
                localStorage.removeItem('data');a
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            let header = new Headers();
            header.set('Authorization', 'Basic ' + btoa(username + ":" + password));

            let res = await fetch("/api/data", {
                method: "GET",
                headers: header,
            });

            if (res.ok) {
                let json = await res.json();
                localStorage.setItem('data', JSON.stringify(json));
                setData(json);
                setIsAuthenticated(true);
            } else {
                // Important: throw a proper error with message
                throw new Error("Invalid username or password!");
            }
        } catch (error) {
            // Re-throw the error so it can be caught by the component
            setLoading(false);
            throw error;
        } finally {
            // This ensures loading is set to false even if there's an error
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('data'); // Fix: should remove 'data' not 'authToken'
        setData(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, data }}>
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