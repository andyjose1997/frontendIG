import React, { useEffect, useState } from "react";

// 🔹 Função para embaralhar igual no exercício real
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function PreviewFaseIdioma({ fase }) {
    const [opcoesAtuais, setOpcoesAtuais] = useState([]);

    // sempre recalcula opções quando os dados mudarem
    useEffect(() => {
        if (fase.tipo === "montar") {
            const palavras = fase.correta ? fase.correta.split(" ") : [];
            const extras = fase.opcoes ? fase.opcoes.split(";") : [];
            setOpcoesAtuais(shuffle([...palavras, ...extras]));
        } else if (fase.tipo === "multipla" || fase.tipo === "completar") {
            const todas = [
                ...(fase.opcoes?.split(";") || []),
                ...(fase.correta ? fase.correta.split(";") : []),
            ];
            setOpcoesAtuais(shuffle(todas));
        } else {
            setOpcoesAtuais([]);
        }
    }, [fase]);

    if (!fase.tipo) {
        return <p style={{ color: "#aaa" }}>Selecione um tipo de fase para visualizar...</p>;
    }

    return (
        <div className="exercicio-card" style={{ marginTop: "1rem" }}>
            <h3>{fase.descricao || "Descrição da fase"}</h3>
            {fase.frase && <p><b>Frase:</b> {fase.frase}</p>}

            {/* 🔹 Renderização depende do tipo */}
            {fase.tipo === "completar" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {opcoesAtuais.map((op, i) => (
                        <button
                            key={i}
                            disabled
                            className="btn-entrar"
                            style={{
                                fontSize: "1rem",
                                padding: "0.6rem",
                                width: "100%",
                                cursor: "not-allowed"
                            }}
                        >
                            {op}
                        </button>
                    ))}
                    <button
                        disabled
                        className="btn-confirmar"
                        style={{
                            backgroundColor: "#00c853",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.6rem",
                            marginTop: "0.6rem",
                            fontWeight: "bold",
                            cursor: "not-allowed"
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            )}

            {fase.tipo === "traducao" && (
                <input
                    type="text"
                    placeholder="Traduza aqui..."
                    disabled
                    style={{ width: "98%", padding: "0.6rem" }}
                />
            )}

            {fase.tipo === "multipla" && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        padding: "0.5rem 0",
                    }}
                >
                    {opcoesAtuais.map((op, i) => (
                        <label
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                cursor: "not-allowed",
                                fontSize: "1rem",
                            }}
                        >
                            <input type="radio" name="preview-multipla" disabled />
                            {op}
                        </label>
                    ))}
                    <button
                        disabled
                        className="btn-confirmar"
                        style={{
                            backgroundColor: "#00c853",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.6rem",
                            marginTop: "0.6rem",
                            fontWeight: "bold",
                            cursor: "not-allowed"
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            )}

            {fase.tipo === "montar" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {opcoesAtuais.map((palavra, i) => (
                        <button
                            key={i}
                            disabled
                            className="btn-entrar"
                            style={{ fontSize: "1rem" }}
                        >
                            {palavra}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
