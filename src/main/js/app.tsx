import * as React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./app.css";
import useAuth, {AuthProvider} from "./hooks/AuthProvider";
import LoginView from "./views/login/LoginView";
import DashboardView from "./views/dashboard/DashboardView";
import GradesView from "./views/grades/GradesView";
import CalculatorView from "./views/grades/CalculatorView";
import EnrolledView from "./views/EnrolledView/EnrolledView";
import ProfileView from "./views/profile/ProfileView";

const App = function (props: any) {
    const { isAuthenticated, loading } = useAuth();
    //const navigate = useNavigate();

    const withAuth = elem => loading ?
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
        </div>
        : isAuthenticated ? elem : <Navigate to={"/login"} />;

    return (
        <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/" element={withAuth(<DashboardView />)} />
            <Route path="/grades" element={withAuth(<GradesView />)} />
            <Route path="/attendance" element={withAuth(<EnrolledView />)} />
            <Route path="/calculator" element={withAuth(<CalculatorView />)} />
            <Route path="/profile" element={withAuth(<ProfileView />)} />
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