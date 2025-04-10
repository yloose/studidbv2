import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import useAuth from "../../hooks/AuthProvider";
import {Alert, Button, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {UserRole} from "../../types/UserRole";

const LoginView = function () {
    const [loginFormState, setLoginFormState] = useState({username: "", password: ""});
    const [error, setError] = useState(false);

    const {decodedToken, setToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        decodedToken != null && navigate(decodedToken.role as UserRole === UserRole.ROLE_ADMIN ? "/users" : "/buildings");
    }, [decodedToken]);


    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            axios.post("/api/auth/login", loginFormState)
                .then((res) => {
                    setToken(res.data);
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        setError(true);
                        setTimeout(() => setError(false), 10000)
                    } else {
                        alert("Login Failure");
                    }
                });
        },
        [loginFormState, decodedToken]
    );

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <form
                className="flex flex-col justify-center items-center gap-4 p-6 bg-white shadow-md rounded-lg max-w-md w-full"
                onSubmit={handleSubmit}
            >
                <img
                    src="/images/GoldenPathLogo.png"
                    alt="Golden Path Logo"
                    className="mb-8 w-48 h-auto"
                    style={{maxWidth: "100%", objectFit: "contain"}}
                />
                <div
                    className={`transition-opacity duration-500 ${
                        error ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {error && (
                        <Alert severity="error" className="my-4">
                            Incorrect username or password!
                        </Alert>
                    )}
                </div>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={loginFormState.username}
                    onChange={(e) =>
                        setLoginFormState({...loginFormState, username: e.target.value})
                    }
                    className="mb-4"
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={loginFormState.password}
                    onChange={(e) =>
                        setLoginFormState({...loginFormState, password: e.target.value})
                    }
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="mt-4 self-end w-min"
                >
                    Login
                </Button>
            </form>
        </div>
    );
}

export default LoginView;