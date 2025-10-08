import React, { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./ironstepexercicios.css";
import IronStepExercicioIdioma from "./ironstepexercicioidioma";
import ExercicioProgramacao from "./ironstepexercicioprogramacao";

export default function IronStepExercicios({ cursoId, onBack }) {
    const [exercicios, setExercicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursoNome, setCursoNome] = useState("");
    const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
    const [completos, setCompletos] = useState([]);

    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuario_id");

    async function atualizarConcluidos() {
        try {
            const res = await fetch(`${URL}/ironstep/concluidos/${usuarioId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setCompletos(data.concluidos || []);
        } catch (err) {
            console.error("Erro ao atualizar concluídos:", err);
        }
    }

    useEffect(() => {
        if (!cursoId) return;

        async function carregarDados() {
            try {
                const [exRes, concluidosRes] = await Promise.all([
                    fetch(`${URL}/ironstep/exercicios/${cursoId}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${URL}/ironstep/concluidos/${usuarioId}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                const exerciciosData = await exRes.json();
                console.log("📌 DEBUG EXERCICIOS DATA:", exerciciosData);

                const concluidosData = await concluidosRes.json();
                setExercicios(exerciciosData.exercicios || exerciciosData || []);
                setCursoNome(exerciciosData.curso || exerciciosData.curso_nome || "");

                setCompletos(concluidosData.concluidos || []);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setLoading(false);
            }
        }

        carregarDados();

        const interval = setInterval(() => {
            atualizarConcluidos();
        }, 10000);

        return () => clearInterval(interval);
    }, [cursoId, token, usuarioId]);

    async function handleComplete(exercicioId) {
        await atualizarConcluidos();
        setExercicioSelecionado(null);
    }

    function handleExercicioClick(ex) {
        const index = exercicios.findIndex(e => e.id === ex.id);
        if (index > 0 && !completos.includes(exercicios[index - 1].id)) {
            return;
        }
        setExercicioSelecionado(ex);
    }

    useEffect(() => {
        if (exercicios.length > 0) {
            const primeiroNaoFeito = exercicios.find(ex => !completos.includes(ex.id));
            if (primeiroNaoFeito) {
                const element = document.getElementById(`exercicio-${primeiroNaoFeito.id}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        }
    }, [exercicios, completos]);

    // 🔹 decide qual componente abrir
    function renderExercicioSelecionado() {
        if (!exercicioSelecionado) return null;
        console.log("🔍 Tipo do exercício selecionado:", exercicioSelecionado.tipo_exercicio);
        console.log("🆔 ID do exercício selecionado:", exercicioSelecionado.id);

        if (exercicioSelecionado.tipo_exercicio === "Prática" ||
            exercicioSelecionado.tipo_exercicio === "Programação") {
            return (
                <ExercicioProgramacao
                    exercicioId={exercicioSelecionado.id}
                    onClose={() => setExercicioSelecionado(null)}
                />
            );

        } else {
            return (
                <IronStepExercicioIdioma
                    exercicioId={exercicioSelecionado.id}
                    onClose={() => setExercicioSelecionado(null)}
                    onComplete={handleComplete}
                />
            );
        }
    }

    return (
        <>
            <button
                className="back-bttn"
                onClick={onBack}
                disabled={!!exercicioSelecionado}
            >
                ⬅ Voltar
            </button>

            <div className="exercicios-container">
                <h2 style={{ color: "white", textAlign: "center", marginBottom: "1rem" }}>
                    {cursoNome}
                </h2>

                {loading ? (
                    <p className="carreg">Carregando exercícios...</p>
                ) : (
                    <>
                        {!exercicioSelecionado ? (
                            <ul className="exercicios-lista">
                                {exercicios.map((ex, index) => {
                                    const liberado =
                                        index === 0 || completos.includes(exercicios[index - 1].id);
                                    const jaFeito = completos.includes(ex.id);

                                    return (
                                        <li
                                            id={`exercicio-${ex.id}`}
                                            key={ex.id}
                                            className={`exercicio-item ${jaFeito ? "completed" : ""} ${liberado ? "" : "disabled"}`}
                                            onClick={() => liberado && handleExercicioClick(ex)}
                                        >
                                            <div className="exercicio-titulo">
                                                {ex.exercicio || ex.exercisio}
                                                {jaFeito && <span className="checkmark">✔</span>}
                                            </div>
                                            <div className="exercicio-infoo">
                                                <p><strong>Descrição:</strong> {ex.descricao}</p>
                                                <p><strong>Tipo:</strong> {ex.tipo_exercicio || ex.tipo_exercisio}</p>
                                                <p><strong>Pontos:</strong> {ex.pontos}</p>
                                            </div>

                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            renderExercicioSelecionado()
                        )}
                    </>
                )}
            </div>
        </>
    );
}
