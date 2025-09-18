// src/components/youtube/PerguntaCurso.jsx
import React, { useEffect, useState } from "react";
import { apiYoutube } from "./apiyoutube";
import "./perguntacurso.css";

export default function PerguntaCurso({ videoId, onConcluir, isUltimo }) {
    const [pergunta, setPergunta] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [acertou, setAcertou] = useState(false);
    const [clicado, setClicado] = useState(null);
    const [tentativas, setTentativas] = useState(0);

    useEffect(() => {
        apiYoutube.getPerguntas(videoId).then((data) => {
            if (data.length > 0) {
                setPergunta(data[0]);
            }
            setAcertou(false);
            setClicado(null);
            setTentativas(0);
            // ❌ não limpa mensagem aqui
        });
    }, [videoId]);

    const handleResposta = async (idx) => {
        const escolhida = idx + 1;
        setClicado(escolhida);

        if (escolhida === pergunta.resposta_correta) {
            setMensagem("✅ Correto!");
            setAcertou(true);

            const usuarioId = localStorage.getItem("usuario_id");
            await apiYoutube.concluirVideo(usuarioId, videoId);
            if (onConcluir) onConcluir(videoId, isUltimo);
        } else {
            const novasTentativas = tentativas + 1;
            setTentativas(novasTentativas);

            if (novasTentativas > 3) {
                setMensagem("❌ Sugerimos que reassista o vídeo.");
            } else {
                setMensagem("❌ Resposta incorreta, tente novamente.");
            }
        }
    };

    if (!pergunta) return null;

    return (
        <div className="quiz-curso">
            {/* 🔹 mensagem aparece sempre acima da pergunta */}
            {mensagem && <p className="mensagem-quiz">{mensagem}</p>}

            {/* 🔹 pergunta nunca some */}
            <p>{pergunta.texto}</p>

            <div className="opcoes">
                {[pergunta.opcao1, pergunta.opcao2, pergunta.opcao3, pergunta.opcao4, pergunta.opcao5, pergunta.opcao6].map(
                    (op, idx) =>
                        op && (
                            <button
                                key={idx}
                                className={`opcao
                                    ${acertou && idx + 1 === pergunta.resposta_correta ? "correta" : ""}
                                    {!acertou && clicado === idx + 1 && idx + 1 !== pergunta.resposta_correta ? "errada" : ""}`}
                                onClick={() => handleResposta(idx)}
                                disabled={acertou}
                            >
                                {op}
                            </button>
                        )
                )}
            </div>
        </div>
    );
}
