import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import Player from "@vimeo/player";
import './quizperguntas.css';

export default function QuizPerguntas({ video, onConcluirVideo }) {
    const [perguntas, setPerguntas] = useState([]);
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [opcoes, setOpcoes] = useState([]);
    const [tentativas, setTentativas] = useState(0);
    const [mensagem, setMensagem] = useState("");
    const [podeAvancar, setPodeAvancar] = useState(false);
    const [mostrarPerguntas, setMostrarPerguntas] = useState(false);
    const [videoFinalizado, setVideoFinalizado] = useState(false); // 🔹 novo estado

    // 🔹 Reset ao trocar vídeo
    useEffect(() => {
        if (!video) return;

        setPerguntas([]);
        setPerguntaAtual(0);
        setOpcoes([]);
        setTentativas(0);
        setMensagem("");
        setPodeAvancar(false);
        setMostrarPerguntas(false);
        setVideoFinalizado(false);

        fetch(`${URL}/perguntas/por-video/${video.id}`)
            .then(res => res.json())
            .then(data => setPerguntas(data))
            .catch(err => console.error("Erro ao carregar perguntas:", err));

        const iframe = document.querySelector("iframe");
        if (iframe) {
            const player = new Player(iframe);

            player.on("ended", () => {
                console.log("🎬 Vídeo finalizado → liberando perguntas");
                setVideoFinalizado(true); // 🔹 só marca como finalizado
            });

            return () => player.unload();
        }
    }, [video]);

    // 🔹 Agora, só libera perguntas quando tiver `perguntas` carregadas e vídeo finalizado
    useEffect(() => {
        if (videoFinalizado && perguntas.length > 0) {
            setMostrarPerguntas(true);
            prepararOpcoes(perguntas[0]);
        }
    }, [videoFinalizado, perguntas]);

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
            .then(() => setPodeAvancar(true))
            .catch(err => console.error("Erro ao salvar progresso:", err));
    };

    const irParaProximo = () => {
        if (onConcluirVideo) onConcluirVideo(video);
    };

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
                    salvarProgresso();
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
            {mostrarPerguntas && perguntas.length > 0 && (
                <>
                    <p className="quizum-contagem">
                        Pergunta {perguntaAtual + 1} de {perguntas.length}
                    </p>

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
                        <p className={`quizum-message ${mensagem.includes("correta") ? "success" :
                            mensagem.includes("errada") ? "error" : "warning"
                            }`}>
                            {mensagem}
                        </p>
                    )}

                    {podeAvancar && (
                        <div className="quizum-avancar">
                            <p>✅ Você concluiu este quiz! Pode ir para o próximo vídeo.</p>
                            <button onClick={irParaProximo}>➡ Próximo Vídeo</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
