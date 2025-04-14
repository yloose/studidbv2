// File: src/main/js/hooks/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {Simulate} from "react-dom/test-utils";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: any | null;
    login: (username: string, password: string ) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        // Check if user is already logged in
        setUser({
            name: "Alex Johnson",
            studentId: "UNI2025124",
            program: "Computer Science",
            year: 3,
            gpa: 3.8
        });
        setIsAuthenticated(localStorage.getItem('data') != null);
        setLoading(false);

    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        let header = new Headers();

        header.set('Authorization', 'Basic ' + btoa(username + ":" + password));
        let res = await fetch("/api/data", {
            method: "GET",
            headers: header,
        })

        if (res.ok) {
            let json = await res.json();
            localStorage.setItem('data', JSON.stringify(json));
            setIsAuthenticated(true);
        } else {
            throw new Error("Invalid Username or password!");
        }
        setLoading(false);
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