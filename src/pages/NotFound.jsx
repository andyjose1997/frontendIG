import { useNavigate } from "react-router-dom";

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
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
            }}
        >
            <img
                src="/public/logo/I_round.png"
                alt="Logo da IronGoals"
                style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: "30px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
            />

            <h1 style={{ fontSize: "3.5rem", marginBottom: "10px", fontWeight: "bold" }}>
                404
            </h1>

            <h2 style={{ fontSize: "1.8rem", marginBottom: "20px", color: "#aad4ff" }}>
                Página não encontrada
            </h2>

            <p
                style={{
                    fontSize: "1.1rem",
                    maxWidth: "600px",
                    marginBottom: "30px",
                    color: "#dbe9f4",
                    lineHeight: "1.6",
                }}
            >
                O link que você tentou acessar não existe ou foi removido.<br />
                Você pode retornar à página inicial da plataforma.
            </p>

            <button
                onClick={handleVoltar}
                style={{
                    padding: "12px 28px",
                    backgroundColor: "#3e73ff",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    transition: "background 0.3s",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                ⬅ Voltar
            </button>
        </div>
    );
}
