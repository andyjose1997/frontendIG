import React, { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./ironstepexercicios.css";
import IronStepExercicioIdioma from "./ironstepexercicioidioma";

export default function IronStepExercicios({ cursoId, onBack }) {
    const [exercicios, setExercicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursoNome, setCursoNome] = useState("");
    const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
    const [completos, setCompletos] = useState([]);

    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuario_id");

    // 🔹 Função para buscar exercícios concluídos do banco
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

    // 🔹 Carregar exercícios + concluídos
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
                const concluidosData = await concluidosRes.json();

                setExercicios(exerciciosData.exercicios || []);
                setCursoNome(exerciciosData.curso || "");
                setCompletos(concluidosData.concluidos || []);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setLoading(false);
            }
        }

        carregarDados();

        // 🔄 Atualiza automaticamente a cada 10s
        const interval = setInterval(() => {
            atualizarConcluidos();
        }, 10000);

        return () => clearInterval(interval); // limpa quando desmontar
    }, [cursoId, token, usuarioId]);

    // 🔹 Quando concluir um exercício, atualiza no banco e reflete na tela
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

    return (
        <div className="exercicios-container">
            <button className="back-bttn" onClick={onBack}>
                ⬅ Voltar
            </button>
            <h2 style={{ color: "white", textAlign: "center", marginBottom: "1rem" }}>
                {cursoNome}
            </h2>

            {loading ? (
                <p>Carregando exercícios...</p>
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
                                        key={ex.id}
                                        className={`exercicio-item ${jaFeito ? "completed" : ""} ${liberado ? "" : "disabled"}`}
                                        onClick={() => liberado && handleExercicioClick(ex)}
                                    >
                                        {ex.exercicio}
                                        {jaFeito && <span className="checkmark">✔</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <IronStepExercicioIdioma
                            exercicioId={exercicioSelecionado.id}
                            onClose={() => setExercicioSelecionado(null)}
                            onComplete={handleComplete}
                        />
                    )}
                </>
            )}
        </div>
    );
}
