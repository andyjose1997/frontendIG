import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./botaodois.css";
import { URL } from "../../config";

export default function BotaoDois() {
    const [ranking, setRanking] = useState([]);
    const [nivel, setNivel] = useState(null);
    const [temStatus, setTemStatus] = useState(false);
    const containerRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const idUsuario = String(user?.id || "").trim();

    // 🔹 Verifica se usuário já está em ironstep_status
    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch(`${URL}/status/${idUsuario}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("📌 Status recebido:", data);
                    if (data && data.nivel) {
                        setNivel(data.nivel);
                        setTemStatus(true);
                    } else {
                        setTemStatus(false);
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar status:", err);
                setTemStatus(false);
            }
        }
        if (idUsuario) fetchStatus();
    }, [idUsuario]);

    // 🔹 Buscar ranking do nível (e atualizar sozinho)
    useEffect(() => {
        if (!nivel) return;

        async function fetchRanking() {
            try {
                const res = await fetch(`${URL}/status/nivel/${nivel}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                console.log("📌 Ranking recebido:", data);

                if (Array.isArray(data)) {
                    setRanking(data);
                } else {
                    console.warn("Formato inesperado:", data);
                    setRanking([]);
                }
            } catch (err) {
                console.error("Erro ao carregar ranking:", err);
                setRanking([]);
            }
        }

        fetchRanking();
        const interval = setInterval(fetchRanking, 20000);
        return () => clearInterval(interval);
    }, [nivel]);

    // 🔹 Iniciar status se não existir
    async function handleIniciarIronStep() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Você precisa estar logado.");
                return;
            }

            const res = await fetch(`${URL}/ironstep_status/iniciar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("✅ IronStep status:", data);

            if (res.ok) {
                localStorage.setItem("ironstep_status", JSON.stringify(data.status));
                window.location.href = "/ironstep";
            } else {
                alert(data.detail || "Erro ao iniciar status.");
            }
        } catch (err) {
            console.error("Erro ao iniciar IronStep:", err);
            alert("Erro de conexão.");
        }
    }

    return (
        <section className="perfil-nivel-container" ref={containerRef}>
            {/* 🔹 Botão acima da tabela com tooltip */}
            <div className="tooltip-wrapper">
                {temStatus ? (
                    <button
                        onClick={() => window.location.href = "/ironstep"}
                        className="botao-acao"
                    >
                        🚀 Trilhar hoje
                    </button>
                ) : (
                    <button
                        onClick={handleIniciarIronStep}
                        className="botao-acao"
                    >
                        📝 Se cadastrar
                    </button>
                )}

                <span className="tooltip-text">
                    {temStatus
                        ? "Clique aqui para continuar sua trilha hoje e acumular pontos."
                        : "Clique aqui para se cadastrar e começar sua jornada no IronStep."}
                </span>
            </div>

            <h2>Ranking do Nível {nivel || "..."}</h2>
            <div className="perfil-table-wrapper">
                <table className="perfil-table">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                            <th>Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {ranking.map((user, index) => {
                                const isMe = String(user.usuario_id || "").trim() === idUsuario;
                                return (
                                    <motion.tr
                                        key={user.usuario_id}
                                        layout
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.4 }}
                                        className={isMe ? "perfil-me" : ""}
                                    >
                                        <td>{index + 1}º</td>
                                        <td>
                                            {user.nome} {user.sobrenome} {isMe && "⭐"}
                                        </td>
                                        <td>{user.pontos_mes}</td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
