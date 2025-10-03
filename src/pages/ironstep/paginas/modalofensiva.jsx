import React, { useState, useEffect } from "react";
import "./modalofensiva.css";
import { URL } from "../../../config";

export default function ModalOfensiva({ semana, onClose, usuarioId }) {
    const [semanaAtual, setSemanaAtual] = useState(semana || null);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    // 🔹 novos estados para exercícios do dia
    const [diaSelecionado, setDiaSelecionado] = useState(null);
    const [exerciciosDia, setExerciciosDia] = useState([]);

    const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    useEffect(() => {
        async function fetchSemana() {
            setLoading(true);
            try {
                const url = `${URL}/ofensiva/semana/${usuarioId}?offset=${offset}`;
                console.log("🔎 Fetching:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                console.log("🔎 Resposta backend:", data);
                setSemanaAtual(data);
            } catch (err) {
                console.error("Erro ao carregar semana:", err);
            } finally {
                setLoading(false);
            }
        }

        if (usuarioId) fetchSemana();
    }, [offset, usuarioId]);

    // 🔹 função para carregar exercícios do dia clicado
    async function carregarExerciciosDia(dataISO) {
        try {
            const usuarioIdLocal = usuarioId || localStorage.getItem("usuario_id"); // ✅ fallback
            console.log("🟢 Dia clicado:", dataISO, "| Usuario:", usuarioIdLocal);

            const url = `${URL}/ofensiva/exercicios-dia/${usuarioIdLocal}/${dataISO}`;
            console.log("🔎 Fetching exercícios do dia:", url);

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            console.log("🔎 Exercícios do dia:", data);

            setDiaSelecionado(dataISO);
            setExerciciosDia(data.exercicios || []);
        } catch (err) {
            console.error("Erro ao carregar exercícios do dia:", err);
        }
    }


    if (!semanaAtual) {
        return (
            <div className="ofensiva-modal-overlay" onClick={onClose}>
                <div className="ofensiva-modal-conteudo" onClick={(e) => e.stopPropagation()}>
                    <h1>Ofensiva semanal</h1>
                    <p>Carregando...</p>
                    <button className="ofensiva-fechar-btn" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        );
    }

    // 🔹 Gera os dias da semana
    const dias = [];
    if (semanaAtual.inicio && semanaAtual.fim) {
        let atual = new Date(semanaAtual.inicio);
        const fim = new Date(semanaAtual.fim);

        while (atual <= fim) {
            dias.push(atual.toISOString().split("T")[0]); // YYYY-MM-DD
            atual.setDate(atual.getDate() + 1);
        }
    }

    return (
        <div className="ofensiva-modal-overlay" onClick={onClose}>
            <div className="ofensiva-modal-conteudo" onClick={(e) => e.stopPropagation()}>
                <h1>Ofensiva semanal</h1>

                <h2>
                    Semana: {new Date(semanaAtual.inicio).toLocaleDateString()} até{" "}
                    {new Date(semanaAtual.fim).toLocaleDateString()}
                </h2>

                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <div className="ofensiva-semana-container">
                        {dias.map((dataISO, idx) => {
                            const jogou = semanaAtual.dias_jogados?.some(
                                d => d.trim() === dataISO.trim()
                            );
                            const dataDia = new Date(dataISO);

                            return (
                                <div
                                    key={idx}
                                    className="ofensiva-dia-box"
                                    onClick={() => carregarExerciciosDia(dataISO)}
                                >
                                    <div
                                        className={`ofensiva-bolinha ${jogou ? "ofensiva-verde" : "ofensiva-preta"}`}
                                    />
                                    <span>{diasSemana[idx]}</span>
                                    <small>{dataDia.getDate()}</small>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 🔹 Lista de exercícios do dia selecionado */}
                {diaSelecionado && (
                    <div className="ofensiva-exercicios-lista">
                        <h3>Exercícios no dia {new Date(diaSelecionado).toLocaleDateString()}:</h3>
                        {exerciciosDia.length > 0 ? (
                            <ul>
                                {exerciciosDia.map((ex, i) => (
                                    <li key={i}>
                                        <strong>{ex.exercisio}</strong> <br /><span>{ex.descricao}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum exercício feito neste dia.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
