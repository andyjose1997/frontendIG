import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./exerciciosdocurso.css";
import FasesDoExercicio from "./fasesdoexercicio";
import FormularioFaseIdioma from "./idiomaformulario";
import FasesDoExercicioProgramacao from "./fasesdoexercicioprogramacao"; // programação

export default function ExerciciosDoCurso({ cursoId, nomeCurso, onVoltar }) {
    const [exercicios, setExercicios] = useState([]);
    const [novoExercicio, setNovoExercicio] = useState({
        exercisio: "",
        descricao: "",
        tipo_exercisio: "",
        pontos: ""
    });
    const [mostrarInput, setMostrarInput] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [editandoDados, setEditandoDados] = useState({});
    const [confirmarId, setConfirmarId] = useState(null);

    // 🔹 Estados de navegação
    const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
    const [faseSelecionada, setFaseSelecionada] = useState(null); // 🔹 novo

    // 🔹 Novo estado para contagem de fases
    const [contagemFases, setContagemFases] = useState({});

    // 🔹 Função para carregar contagem de fases de cada exercício
    const carregarContagemFases = async (lista) => {
        const token = localStorage.getItem("token");
        const novasContagens = {};
        for (const ex of lista) {
            try {
                const res = await fetch(`${URL}/ironstep/fases/contagem/${ex.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    novasContagens[ex.id] = data.total_fases;
                }
            } catch (err) {
                console.error("Erro ao buscar contagem de fases:", err);
            }
        }
        setContagemFases(novasContagens);
    };

    // 🔹 Carregar exercícios
    const carregarExercicios = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/exercicios/${cursoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const lista = Array.isArray(data) ? data : [];
                setExercicios(lista);
                carregarContagemFases(lista); // 🔹 chama a contagem junto
            } else {
                console.error("Erro ao carregar exercícios");
            }
        } catch (err) {
            console.error("Erro fetch exercícios:", err);
        }
    };

    useEffect(() => {
        carregarExercicios();
    }, [cursoId]);

    // 🔹 Adicionar exercício
    const adicionarExercicio = async () => {
        if (!novoExercicio.exercisio.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/exercicios/${cursoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(novoExercicio)
            });
            if (res.ok) {
                setNovoExercicio({ exercisio: "", descricao: "", tipo_exercisio: "", pontos: "" });
                setMostrarInput(false);
                carregarExercicios();
            }
        } catch (err) {
            console.error("Erro ao adicionar exercício:", err);
        }
    };

    // 🔹 Apagar exercício
    const confirmarApagar = async () => {
        if (!confirmarId) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/exercicios/${confirmarId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setConfirmarId(null);
                carregarExercicios();
            }
        } catch (err) {
            console.error("Erro ao apagar exercício:", err);
        }
    };

    // 🔹 Salvar edição
    const salvarEdicao = async (id) => {
        if (!editandoDados.exercisio.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/exercicios/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editandoDados)
            });
            if (res.ok) {
                setEditandoId(null);
                setEditandoDados({});
                carregarExercicios();
            }
        } catch (err) {
            console.error("Erro ao editar exercício:", err);
        }
    };

    // 🔹 Se entrou no formulário de fase
    if (faseSelecionada) {
        return (
            <FormularioFaseIdioma
                faseInicial={faseSelecionada}
                onVoltar={() => setFaseSelecionada(null)}
            />
        );
    }

    // 🔹 Se entrou no formulário de fase
    if (faseSelecionada) {
        return (
            <FormularioFaseIdioma
                faseInicial={faseSelecionada}
                onVoltar={() => setFaseSelecionada(null)}
            />
        );
    }

    // 🔹 Se entrou em um exercício → sempre vai para FasesDoExercicio
    if (exercicioSelecionado) {
        return (
            <FasesDoExercicio
                exercicioId={exercicioSelecionado.id}
                nomeExercicio={exercicioSelecionado.exercisio}
                onVoltar={() => setExercicioSelecionado(null)}
            />
        );
    }
    // 🔹 Função para copiar os exercícios (com instrução no topo)
    const copiarExercicios = () => {
        if (!exercicios.length) {
            alert("Nenhum exercício disponível para copiar.");
            return;
        }

        // 🔸 Instrução inicial
        const instrucao = "me da mais exercicios como este (seguindo o mesmo padrão abaixo)\n\n";

        // 🔸 Monta o texto com nome e descrição
        const texto = exercicios
            .map((ex) => `${ex.exercisio}\nDescrição: ${ex.descricao}`)
            .join("\n\n");

        // 🔸 Junta instrução + exercícios
        const textoFinal = instrucao + texto;

        // 🔸 Copia para a área de transferência
        navigator.clipboard.writeText(textoFinal)
            .then(() => alert("📋 Instrução e exercícios copiados com sucesso!"))
            .catch(() => alert("Erro ao copiar para a área de transferência."));
    };


    return (
        <div className="painel-exercicios-curso">
            <h2>📝 Exercícios do Curso: {nomeCurso}</h2>
            <button className="btn-copiar" onClick={copiarExercicios}>📋 Copiar todos os exercícios deste curso</button>
            <br /> <br />
            <button className="voltar-botao" onClick={onVoltar}>⬅ Voltar</button>

            {exercicios.length > 0 ? (
                <div className="exercicios-grid">
                    {exercicios.map((ex) => (
                        <div key={ex.id} className="exercicio-card">
                            {editandoId === ex.id ? (
                                <div className="exercicio-edit-form">
                                    <input
                                        type="text"
                                        value={editandoDados.exercisio || ""}
                                        onChange={(e) => setEditandoDados({ ...editandoDados, exercisio: e.target.value })}
                                        placeholder="Nome do exercício"
                                    />
                                    <textarea
                                        value={editandoDados.descricao || ""}
                                        onChange={(e) => setEditandoDados({ ...editandoDados, descricao: e.target.value })}
                                        placeholder="Descrição"
                                    />
                                    <input
                                        type="text"
                                        value={editandoDados.tipo_exercisio || ""}
                                        onChange={(e) => setEditandoDados({ ...editandoDados, tipo_exercisio: e.target.value })}
                                        placeholder="Tipo de exercício"
                                    />
                                    <input
                                        type="number"
                                        value={editandoDados.pontos || ""}
                                        onChange={(e) => setEditandoDados({ ...editandoDados, pontos: e.target.value })}
                                        placeholder="Pontos"
                                    />
                                    <div className="acao-editar">
                                        <button className="btn-salvar" onClick={() => salvarEdicao(ex.id)}>💾 Salvar</button>
                                        <button className="btn-cancelar" onClick={() => setEditandoId(null)}>❌ Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="exercicio-info">
                                        <h3>{ex.exercisio}</h3>
                                        <p><b>Descrição:</b> {ex.descricao}</p>
                                        <p><b>Tipo:</b> {ex.tipo_exercisio}</p>
                                        <p><b>Pontos:</b> {ex.pontos}</p>
                                        <p><b>ID:</b> {ex.id}</p>
                                        {/* 🔹 Contagem de fases */}
                                        <p><b>Fases:</b> {contagemFases[ex.id] ?? "0"}</p>
                                    </div>
                                    <div className="exercicio-acoes">
                                        <button
                                            className="btn-editar"
                                            onClick={() => {
                                                setEditandoId(ex.id);
                                                setEditandoDados(ex);
                                            }}
                                        >✏️</button>
                                        <button
                                            className="btn-entrar"
                                            onClick={() => setExercicioSelecionado(ex)}
                                        >
                                            ▶️
                                        </button>

                                        <button
                                            className="btn-apagar"
                                            onClick={() => setConfirmarId(ex.id)}
                                        >🗑️</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum exercício encontrado para este curso.</p>
            )}

            {/* 🔹 Botão de adicionar */}
            {!mostrarInput ? (
                <button className="btn-adicionar" onClick={() => setMostrarInput(true)}>➕ Adicionar Novo Exercício</button>
            ) : (
                <div className="novo-exercicio-form">
                    <input
                        type="text"
                        placeholder="Nome do exercício"
                        value={novoExercicio.exercisio}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, exercisio: e.target.value })}
                    />
                    <textarea
                        placeholder="Descrição"
                        value={novoExercicio.descricao}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, descricao: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Tipo de exercício"
                        value={novoExercicio.tipo_exercisio}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, tipo_exercisio: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Pontos"
                        value={novoExercicio.pontos}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, pontos: e.target.value })}
                    />
                    <button className="btn-salvar" onClick={adicionarExercicio}>✅ Salvar</button>
                    <button className="btn-cancelar" onClick={() => setMostrarInput(false)}>❌ Cancelar</button>
                </div>
            )}

            {/* 🔹 Modal de confirmação de apagar */}
            {confirmarId && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <h3>⚠️ Deseja realmente apagar este exercício?</h3>
                        <p>ID: {confirmarId}</p>
                        <div className="confirm-buttons">
                            <button className="btn-confirmar" onClick={confirmarApagar}>Sim, apagar</button>
                            <button className="btn-cancelar" onClick={() => setConfirmarId(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
