import { useState } from "react";
import { URL } from "../../../../config";
import "./IreneFormulario.css";

export default function IreneFormulario({ modo, dados, onClose, onSaved }) {
    // 🔹 Estados do formulário
    const [resposta, setResposta] = useState(dados?.resposta || "");
    const [perguntas, setPerguntas] = useState(
        dados?.perguntas?.length
            ? dados.perguntas.map((p) => ({ id: p.id || null, texto: p.texto || "" }))
            : [{ id: null, texto: "" }]
    );
    const [keywords, setKeywords] = useState(
        dados?.keywords?.length
            ? dados.keywords.map((k) => ({ id: k.id || null, texto: k.texto || "" }))
            : [{ id: null, texto: "" }]
    );

    // 🔹 Adicionar novos campos dinâmicos
    const adicionarPergunta = () =>
        setPerguntas([...perguntas, { id: null, texto: "" }]);

    const adicionarKeyword = () =>
        setKeywords([...keywords, { id: null, texto: "" }]);

    const atualizarPergunta = (index, valor) => {
        const novaLista = [...perguntas];
        novaLista[index].texto = valor;
        setPerguntas(novaLista);
    };

    const atualizarKeyword = (index, valor) => {
        const novaLista = [...keywords];
        novaLista[index].texto = valor;
        setKeywords(novaLista);
    };

    // 🔹 Submeter formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resposta.trim()) {
            alert("Digite uma resposta antes de salvar!");
            return;
        }

        try {
            let faq_id = dados?.id;

            // ➕ Criar nova resposta
            if (modo === "criar") {
                const res = await fetch(`${URL}/irene_admin/resposta`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resposta }),
                });
                const nova = await res.json();
                faq_id = nova.id;
            }

            // ✏️ Editar resposta existente
            if (modo === "editar" && faq_id) {
                await fetch(`${URL}/irene_admin/resposta/${faq_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resposta }),
                });
            }

            // 🔹 Salvar perguntas
            for (const p of perguntas) {
                if (p.texto.trim()) {
                    if (!p.id) {
                        await fetch(`${URL}/irene_admin/pergunta/${faq_id}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pergunta: p.texto }),
                        });
                    }
                }
            }

            // 🔹 Salvar keywords
            for (const k of keywords) {
                if (k.texto.trim()) {
                    if (!k.id) {
                        await fetch(`${URL}/irene_admin/keyword/${faq_id}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ palavra: k.texto }),
                        });
                    }
                }
            }

            // 🔹 Se veio de "não respondida", apagar de lá
            if (dados?.naoRespondidaId) {
                await fetch(`${URL}/irene_admin/nao_encontradas/${dados.naoRespondidaId}`, {
                    method: "DELETE",
                });
            }

            alert("✅ Salvo com sucesso!");
            onSaved();
            onClose();
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert("❌ Erro ao salvar!");
        }
    };

    return (
        <div className="irene-formulario-overlay">
            <div className="irene-formulario">
                <h3>{modo === "criar" ? "➕ Nova Resposta" : "✏️ Editar Resposta"}</h3>

                <form onSubmit={handleSubmit}>
                    {/* Resposta principal */}
                    <label>Resposta:</label>
                    <textarea
                        value={resposta}
                        onChange={(e) => setResposta(e.target.value)}
                        required
                    />

                    {/* Perguntas associadas */}
                    <label>Perguntas:</label>
                    {perguntas.map((p, i) => (
                        <input
                            key={i}
                            type="text"
                            value={p.texto}
                            onChange={(e) => atualizarPergunta(i, e.target.value)}
                            placeholder="Digite uma pergunta"
                        />
                    ))}
                    <button type="button" onClick={adicionarPergunta}>
                        ➕ Adicionar Pergunta
                    </button>

                    {/* Keywords associadas */}
                    <label>Keywords:</label>
                    {keywords.map((k, i) => (
                        <input
                            key={i}
                            type="text"
                            value={k.texto}
                            onChange={(e) => atualizarKeyword(i, e.target.value)}
                            placeholder="Digite uma keyword"
                        />
                    ))}
                    <button type="button" onClick={adicionarKeyword}>
                        ➕ Adicionar Keyword
                    </button>

                    {/* Botões */}
                    {/* Botões */}
                    <div className="form-botoes">
                        <button type="submit">💾 Salvar</button>
                        {modo === "editar" && (
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        // cria a nova resposta
                                        const res = await fetch(`${URL}/irene_admin/resposta`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ resposta }),
                                        });
                                        const nova = await res.json();
                                        const novoId = nova.id;

                                        // salva perguntas na cópia
                                        for (const p of perguntas) {
                                            if (p.texto.trim()) {
                                                await fetch(`${URL}/irene_admin/pergunta/${novoId}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ pergunta: p.texto }),
                                                });
                                            }
                                        }

                                        // salva keywords na cópia
                                        for (const k of keywords) {
                                            if (k.texto.trim()) {
                                                await fetch(`${URL}/irene_admin/keyword/${novoId}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ palavra: k.texto }),
                                                });
                                            }
                                        }

                                        // ⚡ Mantém aberto, mas agora em modo criar com os mesmos dados
                                        alert("📄 Copiado com sucesso! Agora edite os dados e salve novamente.");
                                        onSaved(); // atualiza lista
                                        // atualiza o estado interno para continuar no modo criar
                                        setResposta(resposta);
                                        setPerguntas(perguntas.map(p => ({ ...p, id: null })));
                                        setKeywords(keywords.map(k => ({ ...k, id: null })));

                                    } catch (err) {
                                        console.error("Erro ao copiar:", err);
                                        alert("❌ Erro ao copiar!");
                                    }
                                }}
                            >
                                📄 Copiar
                            </button>
                        )}

                        <button type="button" onClick={onClose}>
                            ❌ Cancelar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
