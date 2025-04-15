import * as React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./app.css";
import useAuth, {AuthProvider} from "./hooks/AuthProvider";
import LoginView from "./views/login/LoginView";
import DashboardView from "./views/dashboard/DashboardView";
import GradesView from "./views/grades/GradesView";
import EnrolledView from "./views/EnrolledView/EnrolledView";
import ProfileView from "./views/profile/ProfileView";

const App = function (props: any) {
    const { isAuthenticated, loading } = useAuth();
    //const navigate = useNavigate();

    console.log(`loading: ${loading}, isAuthenticated: ${isAuthenticated}`)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
            </div>
        );
    }

    const login = <Navigate to={"/login"} />;

    return (
        <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/" element={isAuthenticated ? <DashboardView /> : login} />
            <Route path="/grades" element={isAuthenticated ? <GradesView /> : login }/>
            <Route path="/attendance" element={isAuthenticated ? <EnrolledView /> : login} />
            <Route path="/profile" element={isAuthenticated ? <ProfileView /> : login} />
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