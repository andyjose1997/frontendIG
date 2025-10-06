import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./botaodois.css";
import { URL } from "../../config";

export default function BotaoDois() {
    const [ranking, setRanking] = useState([]);
    const [nivel, setNivel] = useState(null);
    const [temStatus, setTemStatus] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false); // 👈 novo estado
    const containerRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const idUsuario = String(user?.id || "").trim();

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch(`${URL}/status/${idUsuario}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.nivel) {
                        setNivel(data.nivel);
                        setTemStatus(true);
                    } else setTemStatus(false);
                }
            } catch (err) {
                console.error("Erro ao buscar status:", err);
                setTemStatus(false);
            }
        }
        if (idUsuario) fetchStatus();
    }, [idUsuario]);

    // 👇 Espera 5 segundos e exibe mensagem se não tiver status
    useEffect(() => {
        if (!temStatus) {
            const timer = setTimeout(() => setMostrarMensagem(true), 5000);
            return () => clearTimeout(timer);
        } else {
            setMostrarMensagem(false);
        }
    }, [temStatus]);

    useEffect(() => {
        if (!nivel) return;
        async function fetchRanking() {
            try {
                const res = await fetch(`${URL}/status/nivel/${nivel}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                setRanking(Array.isArray(data) ? data : []);
            } catch {
                setRanking([]);
            }
        }
        fetchRanking();
        const interval = setInterval(fetchRanking, 20000);
        return () => clearInterval(interval);
    }, [nivel]);

    async function handleIniciarIronStep() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Você precisa estar logado.");
                return;
            }
            const res = await fetch(`${URL}/ironstep_status/iniciar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("ironstep_status", JSON.stringify(data.status));
                window.location.href = "/ironstep";
            } else alert(data.detail || "Erro ao iniciar status.");
        } catch {
            alert("Erro de conexão.");
        }
    }

    return (
        <section className="perfil-nivel-container" ref={containerRef}>
            <div className="tooltip-wrapper">
                {temStatus ? (
                    <button
                        onClick={() => (window.location.href = "/ironstep")}
                        className="botao-acao"
                    >
                        🚀 Trilhar hoje
                    </button>
                ) : (
                    <button onClick={handleIniciarIronStep} className="botao-acao">
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

            {/* 👇 Mensagem aparece após 5s se não tiver status */}
            {mostrarMensagem && !temStatus && (
                <p className="mensagem-cadastro">
                    🔥 Ainda não está no ranking? <strong>Cadastre-se</strong> para começar sua trilha e aparecer aqui!
                </p>
            )}

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
