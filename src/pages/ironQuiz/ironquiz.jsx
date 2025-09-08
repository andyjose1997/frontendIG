import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { URL } from "../../config";
import CriarQuiz from "./criarquiz";
import JogarQuiz from "./jogarquiz";

export default function IronQuiz() {
    const [modo, setModo] = useState(null);
    const [funcao, setFuncao] = useState("");

    useEffect(() => {
        const carregarFuncao = async () => {
            try {
                const res = await fetch(`${URL}/perfil`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                console.log("🔎 Resposta do backend:", data);
                const f = data.funcao || "";
                setFuncao(f);

                // 🔹 Se a função NÃO estiver na lista, já abre em "jogar"
                if (!["admin", "auditor", "coordenador"].includes(f)) {
                    setModo("jogar");
                }
            } catch (err) {
                console.error("Erro ao carregar função:", err);
                // fallback: se der erro, também abre em "jogar"
                setModo("jogar");
            }
        };
        carregarFuncao();
    }, []);

    return (
        <main>
            <h1>🔥 Iron Quiz</h1>

            <div style={{ marginBottom: "20px" }}>
                <Link to="/perfil">
                    <button style={{
                        padding: "10px 16px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#0162d1",
                        color: "white",
                        marginRight: "10px"
                    }}>
                        Ir para Perfil
                    </button>
                </Link>

                {/* 🔹 Botão Criar Quiz só aparece se a função for válida */}
                {["admin", "auditor", "coordenador"].includes(funcao) && (
                    <button
                        onClick={() => setModo("criar")}
                        style={{
                            padding: "10px 16px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: modo === "criar" ? "#28a745" : "#ccc",
                            color: "white",
                            marginRight: "10px"
                        }}
                    >
                        ➕ Criar Quiz
                    </button>
                )}

                <button
                    onClick={() => setModo("jogar")}
                    style={{
                        padding: "10px 16px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: modo === "jogar" ? "#28a745" : "#ccc",
                        color: "white"
                    }}
                >
                    🎮 Jogar Quiz
                </button>
            </div>

            {modo === "criar" && <CriarQuiz />}
            {modo === "jogar" && <JogarQuiz />}
        </main>
    );
}
