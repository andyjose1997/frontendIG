import { Navigate } from "react-router-dom";

export default function RotaPrivada({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}
