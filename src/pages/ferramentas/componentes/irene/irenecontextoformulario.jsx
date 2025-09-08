import { useState } from "react";
import { URL } from "../../../../config";
import "./irenecontextoformulario.css";

export default function IreneContextoFormulario({ dados, onClose, onSaved }) {
    const [palavraChave, setPalavraChave] = useState(dados?.chave || "");
    const [gatilhos, setGatilhos] = useState(
        dados ? [{ texto: dados.gatilho, respostas: [dados.resposta] }] : [{ texto: "", respostas: [""] }]
    );

    const adicionarGatilho = () => {
        setGatilhos([...gatilhos, { texto: "", respostas: [""] }]);
    };

    const atualizarGatilho = (index, valor) => {
        const novos = [...gatilhos];
        novos[index].texto = valor;
        setGatilhos(novos);
    };

    const adicionarResposta = (gIndex) => {
        const novos = [...gatilhos];
        novos[gIndex].respostas.push("");
        setGatilhos(novos);
    };

    const atualizarResposta = (gIndex, rIndex, valor) => {
        const novos = [...gatilhos];
        novos[gIndex].respostas[rIndex] = valor;
        setGatilhos(novos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            palavra_chave: palavraChave,
            gatilhos: gatilhos.map((g) => ({
                texto: g.texto,
                respostas: g.respostas,
            })),
        };

        const metodo = dados ? "PUT" : "POST";
        const url = dados
            ? `${URL}/irene_admin/contexto/${dados.id_chave}` // certo
            : `${URL}/irene_admin/contexto`;



        await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });


        onSaved();
    };

    return (
        <div className="contexto-overlay">
            <div className="contexto-formulario">
                <h3 className="contexto-formulario-titulo">
                    {dados ? "✏️ Editar Contexto" : "➕ Novo Contexto"}
                </h3>

                <form className="contexto-form" onSubmit={handleSubmit}>
                    <label className="contexto-label">Palavra-chave</label>
                    <input
                        className="contexto-input"
                        type="text"
                        value={palavraChave}
                        onChange={(e) => setPalavraChave(e.target.value)}
                        required
                    />

                    <h4 className="contexto-subtitulo">⚡ Gatilhos</h4>
                    {gatilhos.map((g, gi) => (
                        <div key={gi} className="contexto-bloco-gatilho">
                            <input
                                className="contexto-input"
                                type="text"
                                placeholder="Digite o gatilho"
                                value={g.texto}
                                onChange={(e) => atualizarGatilho(gi, e.target.value)}
                                required
                            />

                            <h5 className="contexto-subsubtitulo">💬 Respostas</h5>
                            {g.respostas.map((r, ri) => (
                                <input
                                    key={ri}
                                    className="contexto-input"
                                    type="text"
                                    placeholder="Digite a resposta"
                                    value={r}
                                    onChange={(e) => atualizarResposta(gi, ri, e.target.value)}
                                    required
                                />
                            ))}

                            <button
                                type="button"
                                className="contexto-btn adicionar-resposta"
                                onClick={() => adicionarResposta(gi)}
                            >
                                ➕ Adicionar Resposta
                            </button>
                        </div>
                    ))}

                    {/* 🔹 Botão de adicionar gatilho logo abaixo da lista */}
                    <div className="contexto-bloco-adicionar-gatilho">
                        <button
                            type="button"
                            className="contexto-btn adicionar-gatilho"
                            onClick={adicionarGatilho}
                        >
                            ➕ Adicionar Gatilho
                        </button>
                    </div>

                    <div className="contexto-acoes-form">
                        <button type="submit" className="contexto-btn salvar">
                            💾 Salvar
                        </button>
                        <button
                            type="button"
                            className="contexto-btn cancelar"
                            onClick={onClose}
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
