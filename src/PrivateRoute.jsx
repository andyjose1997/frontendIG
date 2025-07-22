// src/PrivateRoute.jsx
import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./components/Loader.jsx"; // ✅ ajuste se estiver em outro caminho

export default function PrivateRoute({ children }) {
    const { user, isLoadingUser } = useAuth();
    const location = useLocation();

    if (isLoadingUser) {
        return <Loader />; // Ou: return <p>Carregando...</p>
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
