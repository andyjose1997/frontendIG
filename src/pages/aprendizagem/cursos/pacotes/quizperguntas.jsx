// src/components/QuizPerguntas.jsx
import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import './quizperguntas.css';

export default function QuizPerguntas({ video, onConcluirVideo }) {
    const [tempoRestante, setTempoRestante] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [opcoes, setOpcoes] = useState([]);
    const [tentativas, setTentativas] = useState(0);
    const [mensagem, setMensagem] = useState("");

    // 🔹 Buscar perguntas quando abrir o vídeo
    useEffect(() => {
        if (!video) return;

        if (video.tempo_segundos) {
            setTempoRestante(video.tempo_segundos);
        }

        fetch(`${URL}/perguntas/por-video/${video.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Erro na API");
                return res.json();
            })
            .then(data => {
                console.log("📌 Perguntas recebidas:", data);
                setPerguntas(data);
            })
            .catch(err => console.error("Erro ao carregar perguntas:", err));
    }, [video]);

    // 🔹 Contagem regressiva do tempo invisível
    useEffect(() => {
        if (tempoRestante === null) return;
        if (tempoRestante <= 0) return;

        const intervalo = setInterval(() => {
            setTempoRestante(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [tempoRestante]);

    // 🔹 Preparar opções quando o tempo zerar
    useEffect(() => {
        if (tempoRestante === 0 && perguntas.length > 0) {
            prepararOpcoes(perguntas[0]);
        }
    }, [tempoRestante, perguntas]);

    // 🔹 Montar 4 opções incluindo a correta
    const prepararOpcoes = (pergunta) => {
        if (!pergunta) return;

        const todas = [];
        for (let i = 1; i <= 8; i++) {
            if (pergunta[`resposta${i}`]) {
                todas.push({ texto: pergunta[`resposta${i}`], indice: i });
            }
        }

        const correta = todas.find(o => o.indice === pergunta.correta);
        const erradas = todas.filter(o => o.indice !== pergunta.correta);
        const escolhidasErradas = erradas.sort(() => 0.5 - Math.random()).slice(0, 3);

        const selecionadas = [...escolhidasErradas, correta].sort(() => 0.5 - Math.random());
        setOpcoes(selecionadas);
    };

    // 🔹 Salvar progresso no backend
    const salvarProgresso = () => {
        const usuarioId = localStorage.getItem("usuario_id");

        fetch(`${URL}/progresso/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioId,
                video_id: video.id,
                perguntas_respondidas: perguntas.length,
                concluido: 1
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("📌 Progresso salvo:", data);
                if (onConcluirVideo) {
                    onConcluirVideo(video); // 🔹 avisa o pai que terminou
                }
            })
            .catch(err => console.error("Erro ao salvar progresso:", err));
    };

    // 🔹 Responder
    const responder = (opcao) => {
        const pergunta = perguntas[perguntaAtual];

        if (opcao.indice === pergunta.correta) {
            setMensagem("✅ Resposta correta!");
            setTentativas(0);

            setTimeout(() => {
                if (perguntaAtual + 1 < perguntas.length) {
                    setPerguntaAtual(perguntaAtual + 1);
                    prepararOpcoes(perguntas[perguntaAtual + 1]);
                    setMensagem("");
                } else {
                    setMensagem("");
                    salvarProgresso(); // 🔹 Salva no banco e notifica
                }
            }, 1000);

        } else {
            const novasTentativas = tentativas + 1;
            setTentativas(novasTentativas);

            if (novasTentativas >= 3) {
                setMensagem(`⚠️ Sugerimos que reassista o vídeo "${video.titulo}"`);
            } else {
                setMensagem("❌ Resposta errada, tente novamente!");
            }

            prepararOpcoes(pergunta);
        }
    };

    return (
        <div className="quizum-container">
            {tempoRestante === 0 && perguntas.length > 0 && (
                <>
                    <h4>{perguntas[perguntaAtual]?.pergunta}</h4>
                    <ul className="quizum-options">
                        {opcoes.map((opcao, idx) => (
                            <li key={idx}>
                                <button onClick={() => responder(opcao)}>
                                    {opcao.texto}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {mensagem && (
                        <p
                            className={`quizum-message ${mensagem.includes("correta")
                                ? "success"
                                : mensagem.includes("errada")
                                    ? "error"
                                    : "warning"
                                }`}
                        >
                            {mensagem}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
