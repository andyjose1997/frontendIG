import React from "react";

export default function ExercicioTipos({
    fase,
    opcoesAtuais,
    resposta,
    setResposta,
    selecionados,
    setSelecionados,
    validarResposta
}) {
    if (!fase) return null;

    return (
        <>
            {/* 🔹 Exercício tipo completar */}
            {fase.tipo === "completar" && (
                <div className="opcoes-lista">
                    {opcoesAtuais.map((op, idx) => (
                        <button
                            key={idx}
                            className={`opcao-bttn ${resposta === op ? "active" : ""}`}
                            onClick={() => setResposta(op)}
                        >
                            {op}
                        </button>
                    ))}
                    <button className="next-bttn" onClick={validarResposta}>
                        Confirmar
                    </button>
                    <br /><br /><br /><br /><br /><br />

                </div>
            )}

            {/* 🔹 Exercício tipo tradução */}
            {fase.tipo === "traducao" && (
                <div>
                    <input
                        type="text"
                        placeholder="Digite a tradução..."
                        className="input-fase"
                        value={resposta}
                        onChange={(e) => setResposta(e.target.value)}
                    />
                    <button className="next-bttn" onClick={validarResposta}>
                        Confirmar
                    </button>
                    <br /><br /><br /><br /><br /><br />

                </div>
            )}

            {/* 🔹 Exercício tipo múltipla escolha */}
            {fase.tipo === "multipla" && (
                <div className="opcoes-lista">
                    {opcoesAtuais.map((op, idx) => (
                        <label key={idx}>
                            <input
                                type="checkbox"
                                value={op}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelecionados([...selecionados, op]);
                                    } else {
                                        setSelecionados(selecionados.filter((s) => s !== op));
                                    }
                                }}
                            />
                            {op}
                        </label>
                    ))}
                    <button className="next-bttn" onClick={validarResposta}>
                        Confirmar
                    </button>
                    <br /><br /><br /><br /><br /><br />

                </div>
            )}

            {/* 🔹 Exercício tipo montar frase */}
            {fase.tipo === "montar" && (
                <div className="montar-container">
                    <h3>Monte a frase traduzida:</h3>

                    {/* Palavras disponíveis */}
                    <div className="montar-palavras">
                        {opcoesAtuais
                            .filter(p => !resposta.split(" ").includes(p)) // só mostra as que não estão na resposta
                            .map((palavra, idx) => (
                                <button
                                    key={idx}
                                    className="montar-palavra"
                                    onClick={() =>
                                        setResposta((prev) => (prev + " " + palavra).trim())
                                    }
                                >
                                    {palavra}
                                </button>
                            ))}
                    </div>

                    {/* Construção da frase */}
                    <div className="montar-construcao">
                        {resposta.split(" ").map((palavra, idx) => (
                            <button
                                key={idx}
                                className="montar-palavra selecionada"
                                onClick={() => {
                                    // remove a palavra clicada
                                    const nova = resposta.split(" ").filter((_, i) => i !== idx);
                                    setResposta(nova.join(" "));
                                }}
                            >
                                {palavra}
                            </button>
                        ))}
                    </div>

                    <button className="next-bttn" onClick={validarResposta}>
                        Confirmar
                    </button>
                    <br /><br /><br /><br /><br /><br />

                </div>
            )}
            <br /><br /><br /><br /><br /><br /><br />
        </>
    );
}
