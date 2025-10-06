import React, { useState } from "react";

export default function PreviewPro({ fase }) {
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
