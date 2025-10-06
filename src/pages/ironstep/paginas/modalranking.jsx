import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./modalranking.css";

export default function ModalRankingNivel({ nivel, usuarios, onClose }) {
    const [ranking, setRanking] = useState([]);
    const [prevRanking, setPrevRanking] = useState([]);
    const containerRef = useRef(null);

    // 🔹 Atualiza ranking sozinho a cada 20s
    useEffect(() => {
        async function fetchRanking() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API}/status/nivel/${nivel}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                setPrevRanking(ranking); // salva estado anterior
                setRanking(data);        // novo ranking
            } catch (err) {
                console.error("Erro ao atualizar ranking:", err);
            }
        }

        fetchRanking(); // primeira carga
        const interval = setInterval(fetchRanking, 20000);
        return () => clearInterval(interval);
    }, [nivel]);

    // 🔹 Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

    return (
        <div ref={containerRef} className="rankingg-container-inline">
            <h2>Ranking do Nível: {nivel}</h2>
            <div className="ranking-table-wrapper">

                <table className="rankingg-table">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                            <th>Pontos</th>
                        </tr>
                    </thead>
                    <AnimatePresence>
                        <tbody>
                            {ranking.map((user, index) => {
                                const isMe = String(user.usuario_id) === String(usuarios.id);
                                return (
                                    <motion.tr
                                        key={user.usuario_id}
                                        layout  // 🔹 framer-motion faz a transição automática
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.4 }}
                                        className={isMe ? "ranking-me" : ""}
                                    >
                                        <td>{index + 1}º</td>
                                        <td>
                                            {user.nome} {user.sobrenome} {isMe && "⭐"}
                                        </td>
                                        <td>{user.pontos_mes}</td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </AnimatePresence>
                </table>
            </div>
        </div>
    );
}
