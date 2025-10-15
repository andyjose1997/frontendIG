import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./cursosdaclasse.css";
import ExerciciosDoCurso from "./exerciciosdocurso";
import Rankings from "./rankings"; // 🔹 área de teste temporária

export default function CursosDaClasse({ classeId, nomeClasse, onVoltar }) {
    const [cursos, setCursos] = useState([]);
    const [novoCurso, setNovoCurso] = useState("");
    const [mostrarInput, setMostrarInput] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [editandoNome, setEditandoNome] = useState("");
    const [confirmarId, setConfirmarId] = useState(null);
    const [cursoSelecionado, setCursoSelecionado] = useState(null);
    const [mostrarRankings, setMostrarRankings] = useState(false); // 🔹 novo estado

    // 🔹 Buscar cursos dessa classe
    const carregarCursos = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/cursos/${classeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const lista = Array.isArray(data) ? data : [];
                const ordenados = lista.sort((a, b) =>
                    a.curso.localeCompare(b.curso)
                );
                setCursos(ordenados);
            } else {
                console.error("Erro ao carregar cursos");
            }
        } catch (err) {
            console.error("Erro fetch cursos:", err);
        }
    };

    useEffect(() => {
        carregarCursos();
    }, [classeId]);

    // 🔹 Adicionar curso
    const adicionarCurso = async () => {
        if (!novoCurso.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/cursos/${classeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ curso: novoCurso })
            });
            if (res.ok) {
                setNovoCurso("");
                setMostrarInput(false);
                carregarCursos();
            }
        } catch (err) {
            console.error("Erro ao adicionar curso:", err);
        }
    };

    // 🔹 Apagar curso (com modal)
    const confirmarApagar = async () => {
        if (!confirmarId) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/cursos/${confirmarId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setConfirmarId(null);
                carregarCursos();
            }
        } catch (err) {
            console.error("Erro ao apagar curso:", err);
        }
    };

    // 🔹 Salvar edição
    const salvarEdicao = async (id) => {
        if (!editandoNome.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/cursos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ curso: editandoNome })
            });
            if (res.ok) {
                setEditandoId(null);
                setEditandoNome("");
                carregarCursos();
            } else {
                console.error("Erro ao editar curso");
            }
        } catch (err) {
            console.error("Erro ao editar curso:", err);
        }
    };

    // 🔹 Se entrou em um curso → abre os exercícios
    if (cursoSelecionado) {
        return (
            <ExerciciosDoCurso
                cursoId={cursoSelecionado.id}
                nomeCurso={cursoSelecionado.curso}
                onVoltar={() => setCursoSelecionado(null)}
            />
        );
    }
    // 🔹 Se clicou em Rankings → abre o componente de teste
    if (mostrarRankings) {
        return <Rankings onVoltar={() => setMostrarRankings(false)} />;
    }

    return (
        <div className="painel-cursos-classe">
            <button
                className="btn-rankings"
                onClick={() => setMostrarRankings(true)}
            >
                🏆 Rankings
            </button>

            <h2>📚 Cursos </h2>

            {cursos.length > 0 ? (
                <div className="cursos-grid">
                    {cursos.map((curso) => (
                        <div key={curso.id} className="curso-card">
                            <div className="curso-info">
                                {editandoId === curso.id ? (
                                    <input
                                        type="text"
                                        value={editandoNome}
                                        onChange={(e) => setEditandoNome(e.target.value)}
                                    />
                                ) : (
                                    <h3>{curso.curso}</h3>
                                )}
                                <p>ID: {curso.id}</p>
                            </div>
                            <div className="curso-acoes">
                                {editandoId === curso.id ? (
                                    <>
                                        <button
                                            className="btn-salvar"
                                            onClick={() => salvarEdicao(curso.id)}
                                        >
                                            💾
                                        </button>
                                        <button
                                            className="btn-cancelar"
                                            onClick={() => {
                                                setEditandoId(null);
                                                setEditandoNome("");
                                            }}
                                        >
                                            ❌
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn-editar"
                                            onClick={() => {
                                                setEditandoId(curso.id);
                                                setEditandoNome(curso.curso);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-entrar"
                                            onClick={() => setCursoSelecionado(curso)}
                                        >
                                            ▶️
                                        </button>
                                        <button
                                            className="btn-apagar"
                                            onClick={() => setConfirmarId(curso.id)}
                                        >
                                            🗑️
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum curso encontrado.</p>
            )}

            {!mostrarInput ? (
                <button
                    className="btn-adicionar"
                    onClick={() => setMostrarInput(true)}
                >
                    ➕ Adicionar Novo Curso
                </button>
            ) : (
                <div className="novo-curso-form">
                    <input
                        type="text"
                        placeholder="Digite o nome do curso"
                        value={novoCurso}
                        onChange={(e) => setNovoCurso(e.target.value)}
                    />
                    <button className="btn-salvar" onClick={adicionarCurso}>
                        ✅ Salvar
                    </button>
                    <button
                        className="btn-cancelar"
                        onClick={() => {
                            setMostrarInput(false);
                            setNovoCurso("");
                        }}
                    >
                        ❌ Cancelar
                    </button>
                </div>
            )}

            {/* 🔹 Modal de confirmação de apagar */}
            {confirmarId && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <h3>⚠️ Deseja realmente apagar este curso?</h3>
                        <p>ID: {confirmarId}</p>
                        <div className="confirm-buttons">
                            <button className="btn-confirmar" onClick={confirmarApagar}>
                                Sim, apagar
                            </button>
                            <button className="btn-cancelar" onClick={() => setConfirmarId(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
