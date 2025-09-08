import { Navigate } from 'react-router-dom';
import { useFerramentas } from './ferramentasContext';
import { useAuth } from './authContext';

export default function AdminRoute({ children }) {
    const { acessoLiberado } = useFerramentas();
    const { user, isLoadingUser } = useAuth();

    const funcao = user?.funcao?.toLowerCase() || "";
    const funcoesPermitidas = ["admin", "coordinador", "auditor"];
    const localLiberado = localStorage.getItem("acessoFerramentas") === "true";

    // ✅ Enquanto carrega o user, não renderiza nada
    if (isLoadingUser) return null;

    if (!user || !funcoesPermitidas.includes(funcao) || (!acessoLiberado && !localLiberado)) {
        return <Navigate to="/" />;
    }

    return children;
}
