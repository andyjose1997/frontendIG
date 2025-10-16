import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./painelironstep.css";
import CursosDaClasse from "./cursosdaclasse";
import Rankings from "./rankings"; // 🔹 novo arquivo de teste

export default function PainelEditarIronStep() {
    const [classes, setClasses] = useState([]);
    const [classeSelecionada, setClasseSelecionada] = useState(null);
    const [mostrarRankings, setMostrarRankings] = useState(false); // 🔹 novo estado

    const [novaClasse, setNovaClasse] = useState("");
    const [mostrarInput, setMostrarInput] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [editandoNome, setEditandoNome] = useState("");
    const [confirmarId, setConfirmarId] = useState(null);

    // 🔹 Buscar classes
    const carregarClasses = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/clases`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const filtradas = data.filter(
                    (item) => item.clase.toLowerCase() !== "pacote office"
                );
                const ordenadas = filtradas.sort((a, b) =>
                    a.clase.localeCompare(b.clase)
                );
                setClasses(ordenadas);
            }
        } catch (err) {
            console.error("Erro fetch classes:", err);
        }
    };

    useEffect(() => {
        carregarClasses();
    }, []);
    useEffect(() => {
        // 🔹 Assim que as classes forem carregadas, entra automaticamente em "Idiomas"
        if (classes.length > 0 && !classeSelecionada) {
            const idiomas = classes.find(c => c.clase.toLowerCase() === "idiomas");
            if (idiomas) {
                setClasseSelecionada(idiomas);
            }
        }
    }, [classes]);

    // 🔹 Adicionar classe
    const adicionarClasse = async () => {
        if (!novaClasse.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/clases`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ clase: novaClasse })
            });
            if (res.ok) {
                setNovaClasse("");
                setMostrarInput(false);
                carregarClasses();
            }
        } catch (err) {
            console.error("Erro ao adicionar classe:", err);
        }
    };

    // 🔹 Apagar classe
    const confirmarApagar = async () => {
        if (!confirmarId) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/clases/${confirmarId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setConfirmarId(null);
                carregarClasses();
            }
        } catch (err) {
            console.error("Erro ao apagar classe:", err);
        }
    };

    // 🔹 Editar classe
    const salvarEdicao = async (id) => {
        if (!editandoNome.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/clases/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ clase: editandoNome })
            });
            if (res.ok) {
                setEditandoId(null);
                setEditandoNome("");
                carregarClasses();
            }
        } catch (err) {
            console.error("Erro ao editar classe:", err);
        }
    };

    // 🔹 Se clicou em uma classe → abre os cursos dela
    if (classeSelecionada) {
        return (
            <CursosDaClasse
                classeId={classeSelecionada.id}
                nomeClasse={classeSelecionada.clase}
                onVoltar={() => setClasseSelecionada(null)}
            />
        );
    }
    if (mostrarRankings) {
        return <Rankings onVoltar={() => setMostrarRankings(false)} />;
    }

    return (
        <div className="painel-editar-ironstep">
            <button
                className="btn-rankings"
                onClick={() => setMostrarRankings(true)}
            >
                🏆 Rankings
            </button>
            <h2>⚙️ Gerenciar Classes</h2>

            <div className="cursos-grid">
                {classes.length > 0 ? (
                    classes.map((c) => (
                        <div key={c.id} className="curso-card">
                            <div className="curso-info">
                                {editandoId === c.id ? (
                                    <input
                                        type="text"
                                        value={editandoNome}
                                        onChange={(e) => setEditandoNome(e.target.value)}
                                    />
                                ) : (
                                    <h3>{c.clase}</h3>
                                )}
                                <p>ID: {c.id}</p>
                            </div>
                            <div className="curso-acoes">
                                {editandoId === c.id ? (
                                    <>
                                        <button
                                            className="btn-salvar"
                                            onClick={() => salvarEdicao(c.id)}
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
                                                setEditandoId(c.id);
                                                setEditandoNome(c.clase);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-entrar"
                                            onClick={() => setClasseSelecionada(c)}
                                        >
                                            ▶️
                                        </button>
                                        <button
                                            className="btn-apagar"
                                            onClick={() => setConfirmarId(c.id)}
                                        >
                                            🗑️
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma classe encontrada.</p>
                )}
            </div>

            {/* Botão adicionar classe */}
            {!mostrarInput ? (
                <button
                    className="btn-adicionar"
                    onClick={() => setMostrarInput(true)}
                >
                    ➕ Adicionar Nova Classe
                </button>
            ) : (
                <div className="novo-curso-form">
                    <input
                        type="text"
                        placeholder="Digite o nome da classe"
                        value={novaClasse}
                        onChange={(e) => setNovaClasse(e.target.value)}
                    />
                    <button className="btn-salvar" onClick={adicionarClasse}>
                        ✅ Salvar
                    </button>
                    <button
                        className="btn-cancelar"
                        onClick={() => {
                            setMostrarInput(false);
                            setNovaClasse("");
                        }}
                    >
                        ❌ Cancelar
                    </button>
                </div>
            )}

            {/* Modal confirmação apagar */}
            {confirmarId && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <h3>⚠️ Deseja realmente apagar esta classe?</h3>
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
