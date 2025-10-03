import React, { useEffect, useState } from "react";
import "./modalranking.css";
import { URL } from "../../../config";

export default function ModalRanking({ onClose, ranking, usuarioId }) {
    const [dadosRanking, setDadosRanking] = useState(ranking);

    // 🔹 Atualiza ranking sozinho a cada 30 segundos
    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await fetch(`${URL}/ranking/${usuarioId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setDadosRanking(data);
                }
            } catch (err) {
                console.error("Erro ao atualizar ranking:", err);
            }
        };

        // primeira atualização
        fetchRanking();

        // intervalo a cada 30s
        const interval = setInterval(fetchRanking, 30000);

        // limpa quando o componente desmontar
        return () => clearInterval(interval);
    }, [usuarioId]);

    return (
        <div className="ranking-extension">
            <button className="ranking-close" onClick={onClose}>X</button>
            <p><strong>Nível:</strong> {dadosRanking.nivel}</p>
            <p><strong>Posição:</strong> {dadosRanking.posicao}</p>
            <p><strong>Pontos do mês:</strong> {dadosRanking.pontos}</p>

            {/* 🔹 Ranking Geral */}
            <h3 style={{ marginTop: "1.5rem" }}>Ranking Geral ({dadosRanking.nivel})</h3>
            <table className="ranking-table">
                <tbody>
                    {dadosRanking.ranking_geral && dadosRanking.ranking_geral.map((item) => (
                        <tr
                            key={item.usuario_id}
                            className={
                                String(item.usuario_id).trim().toLowerCase() ===
                                    String(usuarioId).trim().toLowerCase()
                                    ? "meu-ranking"
                                    : ""
                            }
                        >
                            <td>{item.posicao}</td>
                            <td className="user-cell">
                                <img
                                    src={item.foto || "/fotos/padrao.png"}
                                    alt={`${item.nome} ${item.sobrenome}`}
                                    className="user-foto"
                                />
                                {item.nome} {item.sobrenome}
                            </td>
                            <td>{item.pontos}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
