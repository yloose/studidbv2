import * as React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import "./app.css";
import useAuth, {AuthProvider} from "./hooks/AuthProvider";
import LoginView from "./views/login/LoginView";
import DashboardView from "./views/dashboard/DashboardView";
import GradesView from "./views/grades/GradesView";
import AttendanceView from "./views/attendance/AttendanceView";
import ProfileView from "./views/profile/ProfileView";
import {useEffect, useState} from "react";

const App = function (props: any) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/" element={<DashboardView />} />
            <Route path="/grades" element={<GradesView />} />
            <Route path="/attendance" element={<AttendanceView />} />
            <Route path="/profile" element={<ProfileView />} />
        </Routes>
    );
}

const RootApp = () => (
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
);

// TODO: Use React.StrictMode
createRoot(document.getElementById("react") as HTMLElement).render(<RootApp/>);