// src/components/youtube/PerguntaTexto.jsx
import React from "react";
import "./perguntacurso.css";

export default function PerguntaTexto({ texto }) {
    if (!texto) return null;

    return (
        <div className="pergunta-texto">
            <h3 className="titulo-pergunta">📌 Pergunta:</h3>
            <p>{texto}</p>
        </div>
    );
}
