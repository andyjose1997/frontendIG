import React, { useEffect, useState } from "react";
import PacoteDeCursosUm from "./pacotes/pacotedecursosum";
import { URL } from "../../../config";
import "./cursos.css";
import ModalSuporte from "../../areaafastada/modalsuporte";

export const Cursos = () => {
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarSuporte, setMostrarSuporte] = useState(false); // ✅ controla modal

    // Buscar categoria do usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${URL}/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategoria(data.categoria);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar categoria:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="pagar-loading">Carregando...</p>;
    }

    if (categoria === "member" || categoria === "mentor" || categoria === "founder") {
        return <PacoteDeCursosUm />;
    }

    return (
        <div className="pagar-container">
            <h2 className="pagar-titulo">🎓 Torne sua categoria Member IronGoals</h2>

            <p className="pagar-descricao">
                Com a categoria <strong>Member</strong>, você desbloqueia um universo de oportunidades:
                acesso integral aos cursos, certificados exclusivos que fortalecem seu currículo,
                recursos de acompanhamento de desempenho e atualizações constantes para manter-se
                competitivo no mercado.
            </p>

            <ul className="pagar-lista">
                <li className="pagar-item">✅ Acesso ilimitado a todos os cursos</li>
                <li className="pagar-item">✅ Certificado digital para cada curso concluído</li>
                <li className="pagar-item">✅ Participação em rankings e desafios</li>
                <li className="pagar-item">✅ Suporte e comunidade exclusiva</li>
            </ul>

            <p className="pagar-aviso">
                O acesso é liberado automaticamente após a confirmação do pagamento.
            </p>

            <button
                className="pagar-botao"
                onClick={async () => {
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(`${URL}/criar-preferencia`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        });

                        const data = await response.json();

                        if (data.init_point) {
                            window.open(data.init_point, "_blank");
                        } else {
                            alert("Erro ao iniciar pagamento.");
                        }
                    } catch (error) {
                        console.error("Erro:", error);
                        alert("Erro ao conectar com pagamento.");
                    }
                }}
            >
                💳 Comprar Pacote de Cursos (R$60)
            </button>

            {/* 🔹 Texto de suporte clicável */}
            <p
                className="pagar-suporte"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setMostrarSuporte(true)}
            >
                Em caso de dúvidas, clique aqui para falar com o suporte.
            </p>

            {/* 🔹 Renderiza o modal se mostrarSuporte = true */}
            {mostrarSuporte && <ModalSuporte onClose={() => setMostrarSuporte(false)} />}
        </div>
    );
};
