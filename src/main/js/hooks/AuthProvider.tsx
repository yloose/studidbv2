import axios from "axios";
import { useJwt } from "react-jwt";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const { decodedToken, isExpired } = useJwt(token);

    const setToken = (newToken) => {
        setToken_(newToken);
    };

    useEffect(() => {
        if (isExpired)
            setToken(null);
    }, [isExpired]);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem('token',token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token')
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            decodedToken,
            isExpired,
            setToken,
        }),
        [token, decodedToken, isExpired]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
