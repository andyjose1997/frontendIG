import { useNavigate } from "react-router-dom";
import "./notFound.css";

export default function NotFound() {
    const navigate = useNavigate();

    const handleVoltar = () => {
        const token = localStorage.getItem("token");
        const tokenValido = token && token.trim() !== "" && token !== "null";

        if (tokenValido) {
            navigate("/inicio");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="notfound-container">
            <img
                src="/public/logo/I_round.png"
                alt="Logo da IronGoals"
                className="notfound-logo"
            />

            <h1 className="notfound-title">404</h1>

            <h2 className="notfound-subtitle">Página não encontrada</h2>

            <p className="notfound-text">
                O link que você tentou acessar não existe ou foi removido.
                <br />
                Você pode retornar à página inicial da plataforma.
            </p>

            <button onClick={handleVoltar} className="notfound-button">
                ⬅ Voltar
            </button>
        </div>
    );
}
