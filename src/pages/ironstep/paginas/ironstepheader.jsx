import React, { useEffect, useState } from "react";
import logoIronStep from "../logos/logoironstep.png";
import "./ironstepheader.css";
import { URL } from "../../../config";
import ModalOfensiva from "./modalofensiva";
import './modalranking.css'

export default function IronStepHeader({ usuarios }) {
    const [ofensiva, setOfensiva] = useState("Carregando...");
    const [showModal, setShowModal] = useState(false);
    const [semana, setSemana] = useState(null);

    const [status, setStatus] = useState(null);
    const [rankingNivel, setRankingNivel] = useState([]);
    const [showRanking, setShowRanking] = useState(false);
    const [loadingRanking, setLoadingRanking] = useState(false); // 🔹 estado novo

    useEffect(() => {
        if (!usuarios) return;

        async function fetchOfensiva() {
            try {
                const res = await fetch(`${URL}/ofensiva/${usuarios.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                setOfensiva(data.mensagem);
            } catch (err) {
                console.error("Erro ao carregar ofensiva:", err);
                setOfensiva("0 dias de ofensiva");
            }
        }

        async function fetchStatus() {
            try {
                const res = await fetch(`${URL}/status/${usuarios.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                setStatus(data);
            } catch (err) {
                console.error("Erro ao carregar status:", err);
            }
        }

        fetchOfensiva();
        fetchStatus();

        const interval = setInterval(() => {
            fetchOfensiva();
            fetchStatus();
        }, 30000);

        return () => clearInterval(interval);
    }, [usuarios]);

    async function fetchSemana() {
        try {
            const res = await fetch(`${URL}/ofensiva/semana/${usuarios.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            setSemana(data);
            setShowModal(true);
        } catch (err) {
            console.error("Erro ao carregar semana:", err);
        }
    }

    async function fetchRankingNivel() {
        if (!status) return;
        try {
            setShowRanking(true);       // abre área
            setLoadingRanking(true);    // mostra "carregando"
            const res = await fetch(`${URL}/status/nivel/${status.nivel}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            setRankingNivel(data);
        } catch (err) {
            console.error("Erro ao carregar ranking do nível:", err);
        } finally {
            setLoadingRanking(false);   // tira carregando
        }
    }

    if (!usuarios) return null;

    return (
        <>
            <header className="ironstep-header">
                {/* Logo central */}
                <div className="ironstep-logo-container">
                    <img src={logoIronStep} alt="IronStep" className="ironstep-logo" />
                </div>

                {/* Foto + Nome */}
                <div className="ironstep-userinfo">
                    <img
                        src={usuarios.foto ? usuarios.foto : "/Logo/perfilPadrao/M.png"}
                        alt="Foto de perfil"
                        className="ironstep-foto"
                    />
                    <h2>
                        <a href="https://irongoals.com/perfil" className="ironstep-link">
                            {usuarios.nome} {usuarios.sobrenome}
                        </a>
                    </h2>
                </div>

                {/* Infos agora ficam abaixo do nome */}
                <div className="ironstep-infos">
                    <h3
                        className="info-left"
                        style={{ cursor: "pointer" }}
                        onClick={fetchRankingNivel}
                    >
                        {status ? (
                            <>
                                Nível: {status.nivel} <br />
                                Pontos: {status.pontos_mes} <br />
                                Posição: {status.posicao}º lugar
                            </>
                        ) : (
                            "Carregando..."
                        )}
                    </h3>

                    {/* 🔹 Ofensiva */}
                    <h3
                        onClick={fetchSemana}
                        className={`info-right 
            ${ofensiva.includes("desde a última vez") ? "alerta-laranja" : ""} 
            ${ofensiva.includes("de ofensiva") && !ofensiva.includes("0") ? "alerta-verde" : ""} 
            ${ofensiva.includes("0 dias de ofensiva") ? "alerta-branco" : ""}`}
                        style={{ cursor: "pointer" }}
                    >
                        {ofensiva}
                    </h3>
                </div>

                {/* Modal Ofensiva */}
                {showModal && (
                    <ModalOfensiva semana={semana} onClose={() => setShowModal(false)} />
                )}
            </header>

            {/* 🔹 Ranking abaixo do header (fora dele) */}
            {showRanking && (
                <section
                    ref={(node) => {
                        if (node) {
                            // adiciona listener de clique quando renderiza
                            const handleClick = (e) => {
                                if (!node.contains(e.target)) {
                                    setShowRanking(false); // fecha se clicou fora
                                }
                            };
                            document.addEventListener("mousedown", handleClick);
                            return () => document.removeEventListener("mousedown", handleClick);
                        }
                    }}
                    className="ranking-nivel-container"
                >
                    {loadingRanking ? (
                        <p style={{ fontSize: "2rem" }} >Carregando ranking...</p>
                    ) : (
                        <>
                            <h3>Ranking do Nível {status?.nivel}</h3>
                            <table className="ranking-table">
                                <thead>
                                    <tr>
                                        <th>Posição</th>
                                        <th>Nome</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankingNivel.map((user, index) => {
                                        const isMe = String(user.usuario_id) === String(usuarios.id); // compara ID
                                        return (
                                            <tr key={user.usuario_id} className={isMe ? "ranking-me" : ""}>
                                                <td>{index + 1}º</td>
                                                <td>{user.nome} {user.sobrenome}</td>
                                                <td>{user.pontos_mes}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </>
                    )}
                </section>
            )}

        </>
    );
}
