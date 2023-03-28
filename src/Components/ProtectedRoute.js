import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    let { user } = useUserAuth();
    if (!user) {
        navigate("/");
    }
    return children;
}
export default ProtectedRoute;