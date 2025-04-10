import * as React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import "./app.css";
import useAuth, {AuthProvider} from "hooks/AuthProvider";
import LoginView from "./views/login/LoginView";
import {useEffect, useState} from "react";

const App = function (props: any) {
    return (
        <>
            <span>
                alnglakwnglkawnglkwanglkawn
            </span>
        </>
    )
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
