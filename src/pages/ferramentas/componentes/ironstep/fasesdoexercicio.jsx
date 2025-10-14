import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./exerciciosdocurso.css";
import FormularioFaseIdioma from "./idiomaformulario";

export default function FasesDoExercicio({ exercicioId, nomeExercicio, onVoltar }) {
    const [fases, setFases] = useState([]);
    const [confirmarId, setConfirmarId] = useState(null);
    const [faseSelecionada, setFaseSelecionada] = useState(null);
    const [tipoFase, setTipoFase] = useState("idioma"); // idioma ou programacao

    // 🔹 Descobrir se o exercício pertence à programação
    const descobrirTipoFase = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/exercicio/${exercicioId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // backend retorna: { id, curso_id, descricao, tipo_exercisio, ... }

                // regra: se o curso pertence à classe de programação → programacao
                if (data.clase_nome?.toLowerCase().includes("programa")) {
                    setTipoFase("programacao");
                } else {
                    setTipoFase("idioma");
                }
            }
        } catch (err) {
            console.error("Erro descobrir tipo:", err);
        }
    };

    // 🔹 Buscar fases
    const carregarFases = async () => {
        try {
            const token = localStorage.getItem("token");
            const rota =
                tipoFase === "programacao"
                    ? `${URL}/ironstep/fases/programacao/${exercicioId}`
                    : `${URL}/ironstep/fases/idioma/${exercicioId}`;

            const res = await fetch(rota, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setFases(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Erro fetch fases:", err);
        }
    };

    useEffect(() => {
        descobrirTipoFase().then(() => {
            carregarFases();
        });
    }, [exercicioId, tipoFase]);

    // 🔹 Salvar fase
    const salvarFase = async (dados) => {
        try {
            const token = localStorage.getItem("token");
            const rota =
                dados.id
                    ? `${URL}/ironstep/fases/${tipoFase}/${dados.id}`   // PUT
                    : `${URL}/ironstep/fases/${tipoFase}/${exercicioId}`; // POST

            const metodo = dados.id ? "PUT" : "POST";

            const res = await fetch(rota, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });

            if (res.ok) {
                setFaseSelecionada(null);
                carregarFases();
            } else {
                console.error("Erro ao salvar fase");
            }
        } catch (err) {
            console.error("Erro salvar fase:", err);
        }
    };

    // 🔹 Apagar fase
    const confirmarApagar = async () => {
        if (!confirmarId) return;
        try {
            const token = localStorage.getItem("token");
            const rota = `${URL}/ironstep/fases/${tipoFase}/${confirmarId}`;
            const res = await fetch(rota, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setConfirmarId(null);
                carregarFases();
            }
        } catch (err) {
            console.error("Erro ao apagar fase:", err);
        }
    };

    // 🔹 Se clicou em adicionar ou editar
    if (faseSelecionada) {
        return (
            <FormularioFaseIdioma
                faseInicial={faseSelecionada}
                onVoltar={() => setFaseSelecionada(null)}
                onSalvar={salvarFase}
            />
        );
    }

    return (
        <div className="painel-exercicios-curso">
            <h2>📖 Fases do Exercício: {nomeExercicio}</h2>
            <button className="voltar-botao" onClick={onVoltar}>⬅ Voltar</button>

            {/* Adicionar nova fase */}
            <button
                className="btn-adicionar"
                onClick={() =>
                    setFaseSelecionada({
                        descricao: "",
                        frase: "",
                        tipo: "",
                        opcoes: "",
                        correta: ""
                    })
                }
            >
                ➕ Adicionar Nova Fase
            </button>

            {fases.length > 0 ? (
                <div className="exercicios-grid">
                    {fases.map((fase) => (
                        <div key={fase.id} className="exercicio-card">
                            <div className="exercicio-info">
                                <h3>{fase.descricao}</h3>
                                <p><b>Frase:</b> {fase.frase}</p>
                                <p><b>Tipo:</b> {fase.tipo}</p>
                                <p><b>Opções:</b> {fase.opcoes}</p>
                                <p><b>Correta:</b> {fase.correta}</p>
                                <p><b>ID:</b> {fase.id}</p>
                            </div>
                            <div className="exercicio-acoes">
                                <button
                                    className="btn-entrar"
                                    onClick={() => setFaseSelecionada(fase)}
                                >
                                    ▶️
                                </button>
                                <button
                                    className="btn-apagar"
                                    onClick={() => setConfirmarId(fase.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhuma fase encontrada para este exercício.</p>
            )}

            {/* Modal de confirmação */}
            {confirmarId && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <h3>⚠️ Deseja realmente apagar esta fase?</h3>
                        <p>ID: {confirmarId}</p>
                        <div className="confirm-buttons">
                            <button className="btn-confirmar" onClick={confirmarApagar}>
                                Sim, apagar
                            </button>
                            <button
                                className="btn-cancelar"
                                onClick={() => setConfirmarId(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
