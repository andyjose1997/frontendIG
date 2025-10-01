import React, { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./ironstepexercicioidioma.css";

export default function IronStepExercicioIdioma({ exercicioId, onClose }) {
    const [fases, setFases] = useState([]);
    const [faseAtual, setFaseAtual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [pontuacaoFinal, setPontuacaoFinal] = useState(null);
    const [resposta, setResposta] = useState("");
    const [selecionados, setSelecionados] = useState([]);
    const [opcoesAtuais, setOpcoesAtuais] = useState([]);
    const [vidas, setVidas] = useState(null);
    const [bloqueado, setBloqueado] = useState(false);
    const [entrando, setEntrando] = useState(true);
    const [respondidas, setRespondidas] = useState([]);
    const [erros, setErros] = useState(0); // 🔹 novo contador de erros

    // Timer de entrada
    const [countdown, setCountdown] = useState(3);
    const [pronto, setPronto] = useState(false);

    // Feedback e contagem de acertos
    const [feedback, setFeedback] = useState(null);
    const [acertos, setAcertos] = useState(0);

    const usuarioId = localStorage.getItem("usuario_id");

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    useEffect(() => {
        if (!exercicioId) return;

        const token = localStorage.getItem("token");
        fetch(`${URL}/ironstep/fase/${exercicioId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setFases(shuffle(data.fases || []));
                setStartTime(Date.now());
                setLoading(false);
                setEntrando(true);

                // espera 1s antes de começar
                setTimeout(() => setEntrando(false), 1000);
            })
            .catch(err => {
                console.error("Erro ao carregar fases:", err);
                setLoading(false);
            });

        fetch(`${URL}/vidas`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setVidas(data.vidas))
            .catch(err => console.error("Erro ao carregar vidas:", err));
    }, [exercicioId]);


    useEffect(() => {
        if (!pronto && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        setPronto(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown, pronto]);


    useEffect(() => {
        if (fases.length > 0) {
            const fase = fases[faseAtual];
            if (fase) {
                const todas = [
                    ...(fase.opcoes?.split(";") || []),
                    ...(fase.correta?.split(";") || [])
                ];
                setOpcoesAtuais(shuffle(todas));
            }
        }
    }, [faseAtual, fases]);

    if (loading) return <p>Carregando fases...</p>;
    if (!fases.length) return <p>Nenhuma fase encontrada.</p>;
    if (bloqueado) return <h2>💀 Você errou 5 vezes. Tente novamente!</h2>;

    const fase = fases[faseAtual];
    const normalizar = (txt) => txt.toLowerCase().replace(/[^a-z0-9]/gi, "");

    const proximaFase = () => {
        setFeedback(null);

        // Se já acertou 5 → finaliza
        if (acertos >= 5) {
            finalizarExercicio();
            return;
        }

        // Se já errou 5 → bloqueia
        if (erros >= 5) {
            setBloqueado(true);
            return;
        }

        // Busca próxima fase que ainda não foi respondida
        const naoRespondidas = fases.filter(f => !respondidas.includes(f.id));

        if (naoRespondidas.length > 0) {
            const proxima = naoRespondidas[0];
            const index = fases.findIndex(f => f.id === proxima.id);
            setFaseAtual(index);
            setResposta("");
            setSelecionados([]);
        } else {
            finalizarExercicio();
        }
    };

    const descontarVida = () => {
        if (!usuarioId) return;
        const token = localStorage.getItem("token");
        fetch(`${URL}/ironstep/vidas/descontar/${usuarioId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setVidas(data.vidas);
                if (data.vidas === 0) setBloqueado(true);
            })
            .catch(err => console.error("Erro ao descontar vida:", err));
    };

    const validarResposta = () => {
        let correto = false;

        if (fase.tipo === "completar") correto = resposta === fase.correta;
        if (fase.tipo === "traducao") correto = normalizar(resposta) === normalizar(fase.correta);
        if (fase.tipo === "multipla") {
            const corretas = fase.correta.split(";").map(c => c.trim()).filter(c => c.length > 0);
            const selecionadasOrdenadas = [...selecionados].sort();
            const corretasOrdenadas = [...corretas].sort();
            correto = JSON.stringify(corretasOrdenadas) === JSON.stringify(selecionadasOrdenadas);
        }

        // Marca fase como respondida
        setRespondidas(prev => [...prev, fase.id]);

        if (correto) {
            setAcertos(prev => prev + 1);
            setFeedback({ tipo: "acerto", msg: "✅ Você acertou!" });
        } else {
            setErros(prev => prev + 1); // 🔹 conta erro
            descontarVida();
            setFeedback({ tipo: "erro", msg: `❌ Você errou! Resposta correta: ${fase.correta}` });
        }
    };

    const finalizarExercicio = () => {
        const fim = Date.now();
        const tempoSegundos = Math.floor((fim - startTime) / 1000);
        const pontosBase = 10;
        const desconto = Math.floor(tempoSegundos / 30);
        const pontosGanhos = Math.max(1, pontosBase - desconto);
        setPontuacaoFinal(pontosGanhos);

        const token = localStorage.getItem("token");

        fetch(`${URL}/ironstep/finalizar/${exercicioId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                pontos: pontosGanhos
            })
        })
            .then(res => res.json())
            .then(data => console.log("Ranking atualizado:", data))
            .catch(err => console.error("Erro ao salvar ranking:", err));
    };

    return (
        <div className="fullscreen-overlay">
            <div className="fase-container">
                <button className="close-bttn" onClick={onClose}>✖ Fechar</button>

                {entrando ? (
                    <div className="countdown-container">
                        <h2>🚀 Entrando...</h2>
                    </div>
                ) : !pontuacaoFinal ? (
                    <>
                        <h2>{fase.descricao}</h2>
                        <p><strong>Frase:</strong> {fase.frase}</p>

                        {feedback ? (
                            <div className={`feedback ${feedback.tipo}`}>
                                <p>{feedback.msg}</p>
                                <button className="next-bttn" onClick={proximaFase}>Próxima</button>
                            </div>
                        ) : (
                            <>
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
                                        <button className="next-bttn" onClick={validarResposta}>Confirmar</button>
                                    </div>
                                )}

                                {fase.tipo === "traducao" && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Digite a tradução..."
                                            className="input-fase"
                                            value={resposta}
                                            onChange={(e) => setResposta(e.target.value)}
                                        />
                                        <button className="next-bttn" onClick={validarResposta}>Confirmar</button>
                                    </div>
                                )}

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
                                        <button className="next-bttn" onClick={validarResposta}>Confirmar</button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <h2>🎉 Você finalizou! Pontos ganhos: {pontuacaoFinal} </h2>
                )}
            </div>
        </div>
    );
}
