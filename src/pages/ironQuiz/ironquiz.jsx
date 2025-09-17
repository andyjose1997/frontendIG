import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { URL } from "../../config";
import CriarQuiz from "./criarquiz";
import JogarQuiz from "./jogarquiz";
import './ironquiz.css'

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
        <main className="ironquiz-container">
            <h1 className="ironquiz-title">🔥 Iron Quiz 🔥</h1>

            <div className="ironquiz-buttons">
                <Link to="/perfil">
                    <button className="ironquiz-btn ironquiz-btn-perfil">
                        Ir para Perfil
                    </button>
                </Link>

                {["admin", "auditor", "coordenador"].includes(funcao) && (
                    <button
                        onClick={() => setModo("criar")}
                        className={`ironquiz-btn ironquiz-btn-criar ${modo === "criar" ? "active" : ""}`}
                    >
                        ➕ Criar Quiz
                    </button>
                )}

                <button
                    onClick={() => setModo("jogar")}
                    className={`ironquiz-btn ironquiz-btn-jogar ${modo === "jogar" ? "active" : ""}`}
                >
                    🎮 Jogar Quiz
                </button>
            </div>

            <div className="ironquiz-content">
                {modo === "criar" && <CriarQuiz />}
                {modo === "jogar" && <JogarQuiz />}
            </div>
        </main>
    );

}
