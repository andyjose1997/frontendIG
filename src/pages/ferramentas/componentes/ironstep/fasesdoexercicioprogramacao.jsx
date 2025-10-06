// FasesDoExercicioProgramacao.jsx
import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./fasesdoexercicioprogramacao.css";

import FormularioFaseProgramacao from "./formulariofaseprogramacao";

// 🔹 Preview visual da fase
function PreviewPro({ fase }) {
    const [resposta, setResposta] = useState("");
    const [selecionados, setSelecionados] = useState([]);

    if (!fase) return <p>Nenhuma fase selecionada.</p>;

    return (
        <div className="pro-fase-container">
            <h4>{fase.descricao}</h4>
            <pre className="pro-fase-frase">{fase.frase}</pre>

            {fase.tipo === "completar_codigo" && (
                <input
                    type="text"
                    placeholder="Digite a resposta"
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    className="pro-resposta-input"
                />
            )}

            {fase.tipo === "montar_codigo" && (
                <div>
                    <div className="pro-montar-palavras">
                        {(fase.opcoes || "").split(";").map((op, i) => (
                            <button
                                key={i}
                                onClick={() => setSelecionados([...selecionados, op])}
                                className="pro-montar-palavra"
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                    <div className="pro-montar-escolhidas">
                        {selecionados.map((sel, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    setSelecionados(selecionados.filter((_, idx) => idx !== i))
                                }
                                className="pro-montar-escolhida"
                            >
                                {sel}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {(fase.tipo === "identificar_erro" || fase.tipo === "traducao_codigo") && (
                <div className="pro-opcoes-erro">
                    {(fase.opcoes || "").split(";").map((op, i) => (
                        <button key={i} className="pro-erro-bttn">
                            {op}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// 🔹 Lista de fases
export default function FasesDoExercicioProgramacao({ exercicioId, nomeExercicio, onVoltar }) {
    const [fases, setFases] = useState([]);
    const [faseSelecionada, setFaseSelecionada] = useState(null);

    const carregarFases = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/fases/programacao/${exercicioId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFases(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Erro fetch fases programação:", err);
        }
    };

    useEffect(() => {
        carregarFases();
    }, [exercicioId]);

    const salvarFase = async (dadosFase) => {
        try {
            const token = localStorage.getItem("token");
            const isEdicao = !!dadosFase.id;
            const url = isEdicao
                ? `${URL}/ironstep/fases/programacao/${dadosFase.id}`
                : `${URL}/ironstep/fases/programacao/${exercicioId}`;
            const method = isEdicao ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dadosFase),
            });

            if (res.ok) {
                await carregarFases();
                setFaseSelecionada(null);
            }
        } catch (err) {
            console.error("Erro salvar fase programação:", err);
        }
    };

    const apagarFase = async (id) => {
        const confirmado = window.confirm("⚠️ Deseja realmente apagar esta fase de programação?");
        if (!confirmado) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`${URL}/ironstep/fases/programacao/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            carregarFases();
        } catch (err) {
            console.error("Erro ao apagar fase programação:", err);
        }
    };

    if (faseSelecionada) {
        return (
            <FormularioFaseProgramacao
                faseInicial={faseSelecionada}
                onSalvar={salvarFase}
                onVoltar={() => setFaseSelecionada(null)}
            />
        );
    }

    return (
        <div className="pro-painel-exercicios-curso">
            <h2>📖 Fases do Exercício de Programação: {nomeExercicio}</h2>
            <button className="pro-voltar-botao" onClick={onVoltar}>⬅ Voltar</button>

            <button
                className="pro-btn-adicionar"
                onClick={() =>
                    setFaseSelecionada({
                        descricao: "",
                        frase: "",
                        tipo: "completar_codigo",
                        opcoes: "",
                        correta: ""
                    })
                }
            >
                ➕ Adicionar Nova Fase
            </button>

            {fases.length > 0 ? (
                <div className="pro-exercicios-grid">
                    {fases.map((fase) => (
                        <div key={fase.id} className="pro-exercicio-card">
                            <div className="pro-exercicio-info">
                                <h3>{fase.descricao}</h3>
                                <p><b>Frase:</b> {fase.frase}</p>
                                <p><b>Tipo:</b> {fase.tipo}</p>
                                <p><b>Opções:</b> {fase.opcoes}</p>
                                <p><b>Correta:</b> {fase.correta}</p>
                                <p><b>ID:</b> {fase.id}</p>
                            </div>
                            <div className="pro-exercicio-acoes">
                                <button
                                    className="pro-btn-entrar"
                                    onClick={() => setFaseSelecionada(fase)}
                                >
                                    ▶️
                                </button>
                                <button
                                    className="pro-btn-apagar"
                                    onClick={() => apagarFase(fase.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhuma fase de programação encontrada para este exercício.</p>
            )}
        </div>
    );
}
