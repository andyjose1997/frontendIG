import React, { useEffect, useState } from "react";
import logoIronStep from "../logos/logoironstep.png";
import "./ironstepheader.css";
import { URL } from "../../../config";
import ModalOfensiva from "./modalofensiva";
import ModalRanking from "./modalranking"; // ✅ novo modal

export default function IronStepHeader({ usuarios }) {
    const [ofensiva, setOfensiva] = useState("Carregando...");
    const [showModal, setShowModal] = useState(false);
    const [semana, setSemana] = useState(null);

    const [ranking, setRanking] = useState({ nivel: "Carregando...", posicao: 0, pontos: 0 });

    // 🔹 estado para modal ranking
    const [showRankingModal, setShowRankingModal] = useState(false);

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

        async function fetchRanking() {
            try {
                const res = await fetch(`${URL}/ranking/${usuarios.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                setRanking(data);
            } catch (err) {
                console.error("Erro ao carregar ranking:", err);
            }
        }

        fetchOfensiva();
        fetchRanking();

        const interval = setInterval(() => {
            fetchOfensiva();
            fetchRanking();
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

    if (!usuarios) return null;

    return (
        <header className="ironstep-header">
            {/* Logo central */}
            <div className="ironstep-logo-container">
                <img src={logoIronStep} alt="IronStep" className="ironstep-logo" />
            </div>

            {/* Foto + Nome */}
            <div className="ironstep-userinfo">
                <img
                    src={usuarios.foto}
                    alt="Foto de perfil"
                    className="ironstep-foto"
                />
                <h2>
                    <a
                        href="https://irongoals.com/perfil"
                        className="ironstep-link"
                    >
                        {usuarios.nome} {usuarios.sobrenome}
                    </a>
                </h2>
            </div>

            {/* Infos agora ficam abaixo do nome */}
            <div className="ironstep-infos">
                {/* 🔹 Ranking com verde ofuscado */}
                <h3
                    className="info-left ranking-highlight"
                    onClick={() => setShowRankingModal(true)} // ✅ abre modal ranking
                    style={{ cursor: "pointer" }}
                >
                    {ranking.nivel} - Posição {ranking.posicao}
                </h3>

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

            {/* Modal Ranking */}
            {showRankingModal && (
                <ModalRanking onClose={() => setShowRankingModal(false)} ranking={ranking} />
            )}
        </header>
    );
}
