import React, { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./ironstepexercicioidioma.css";
import PremiumModal from "./premium";
import ExercicioTipos from "./exercisios/exerciciosidioma";

export default function ExercicioIdiomas({ exercicioId, onClose }) {
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
    const [erros, setErros] = useState(0);
    const [showPremium, setShowPremium] = useState(false);
    const [reiniciar, setReiniciar] = useState(false);

    // Timer de entrada
    const [countdown, setCountdown] = useState(3);
    const [pronto, setPronto] = useState(false);

    // Feedback e contagem de acertos
    const [feedback, setFeedback] = useState(null);
    const [acertos, setAcertos] = useState(0);

    const usuarioId = localStorage.getItem("usuario_id");

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // 🔹 Carregar fases e vidas
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

    // 🔹 Timer de contagem regressiva
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

    // 🔹 Configurar opções para cada fase
    useEffect(() => {
        if (fases.length > 0) {
            const fase = fases[faseAtual];
            if (fase) {
                if (fase.tipo === "montar") {
                    const palavras = fase.correta ? fase.correta.split(" ") : [];
                    const extras = fase.opcoes ? fase.opcoes.split(";") : [];
                    setOpcoesAtuais(shuffle([...palavras, ...extras]));
                } else if (fase.tipo === "multipla" || fase.tipo === "completar") {
                    const todas = [
                        ...(fase.opcoes?.split(";") || []),
                        ...(fase.correta ? fase.correta.split(";") : [])
                    ];
                    setOpcoesAtuais(shuffle(todas));
                } else {
                    setOpcoesAtuais([]);
                }
            }
        }
    }, [faseAtual, fases]);

    if (loading) return <p style={{ fontSize: "2rem" }}>Carregando fases...</p>;
    if (!fases.length) return <p>Nenhuma fase encontrada.</p>;
    if (bloqueado || vidas === 0) {
        return (
            <div className="fullscreennn">
                <div className="fase-container">
                    <h2>💔 Você ficou sem vidas!</h2>
                    <p>Você pode tentar novamente amanhã, ou desbloquear vidas ilimitadas com a conta <strong>Premium</strong>.</p>

                    <div style={{ marginTop: "1.5rem" }}>
                        <button className="next-bttn" onClick={onClose}>Fechar</button>
                        <button
                            className="premiumm-btttn"
                            onClick={() => setShowPremium(true)}
                        >
                            Quero ser Premium
                        </button>
                        <br /> <br /><br />
                        {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
                    </div>
                </div>
            </div>
        );
    }

    const fase = fases[faseAtual];
    const normalizar = (txt) => txt.toLowerCase().replace(/[^a-z0-9]/gi, "");

    const proximaFase = () => {
        setFeedback(null);

        if (erros >= 5) {
            alert("❌ Você errou 5 vezes! O exercício será reiniciado.");
            setErros(0);
            setAcertos(0);
            setRespondidas([]);
            setFaseAtual(0);
            setResposta("");
            setSelecionados([]);
            return;
        }

        if (acertos >= 5) {
            finalizarExercicio();
            return;
        }

        // 🔹 Mantém só as fases ainda não acertadas
        const fasesNaoAcertadas = fases.filter(
            f => !respondidas.includes(f.id) || f.errou
        );

        if (fasesNaoAcertadas.length > 0) {
            const proxima = fasesNaoAcertadas[0];
            const index = fases.findIndex(f => f.id === proxima.id);
            setFaseAtual(index);
            setResposta("");
            setSelecionados([]);
        } else {
            // 🔄 Se todas já foram acertadas ou erradas sem acerto, recomeça as erradas
            const fasesErradas = fases.filter(f => f.errou);
            if (fasesErradas.length > 0) {
                const proxima = fasesErradas[0];
                const index = fases.findIndex(f => f.id === proxima.id);
                setFaseAtual(index);
            } else {
                setFaseAtual(0);
            }
            setResposta("");
            setSelecionados([]);
        }
    };


    // 🔹 Descontar vida no erro
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

    // 🔹 Validação da resposta
    // 🔹 Validação da resposta
    const validarResposta = () => {
        let correto = false;

        if (fase.tipo === "completar") {
            if (resposta.trim().toLowerCase() === fase.correta.trim().toLowerCase()) {
                correto = true;

                // Se não for exatamente igual, dá feedback avisando
                if (resposta.trim() !== fase.correta.trim()) {
                    setFeedback({
                        tipo: "aviso",
                        msg: `✅ Sua resposta está certa, mas a forma correta é: ${fase.correta}`
                    });
                }
            } else {
                correto = false;
            }
        }
        if (fase.tipo === "traducao") {
            correto = normalizar(resposta) === normalizar(fase.correta);
        }
        if (fase.tipo === "multipla") {
            const normalizarArray = (arr) =>
                arr.map(c => c.trim().toLowerCase()).filter(c => c.length > 0).sort();
            const corretas = normalizarArray(fase.correta.split(";"));
            const selecionadasNormalizadas = normalizarArray(selecionados);
            correto = JSON.stringify(corretas) === JSON.stringify(selecionadasNormalizadas);
        }
        if (fase.tipo === "montar") {
            correto = normalizar(resposta) === normalizar(fase.correta);
        }

        setRespondidas(prev => [...prev, fase.id]);

        if (correto) {
            setAcertos(prev => {
                const novos = prev + 1;
                if (novos === 6) {
                    finalizarExercicio();
                }
                return novos;
            });

            // Se já não setou aviso acima, mostra acerto normal
            if (!feedback || feedback.tipo !== "aviso") {
                setFeedback({ tipo: "acerto", msg: "✅ Você acertou!" });
            }
        } else {
            setErros(prev => prev + 1);
            descontarVida();
            setFeedback({ tipo: "erro", msg: `❌ Você errou! Resposta correta: ${fase.correta}` });
        }
    };


    // 🔹 Finalizar exercício
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
        <div className="fullscreennn">
            <div className="fase-container">
                <button className="clossse-bttn" onClick={onClose}>✖ Fechar</button>

                {entrando ? (
                    <div className="countdown-container">
                        <h2>🚀 Entrando...</h2>
                    </div>
                ) : !pontuacaoFinal ? (
                    <>
                        <h2>{fase.descricao}</h2>
                        <p><strong></strong> {fase.frase}</p>

                        {feedback ? (
                            <div className={`feedback ${feedback.tipo}`}>
                                <p>{feedback.msg}</p>
                                <button className="next-bttn" onClick={proximaFase}>Próxima</button>
                            </div>
                        ) : (
                            <ExercicioTipos
                                fase={fase}
                                opcoesAtuais={opcoesAtuais}
                                resposta={resposta}
                                setResposta={setResposta}
                                selecionados={selecionados}
                                setSelecionados={setSelecionados}
                                validarResposta={validarResposta}
                            />
                        )}
                    </>
                ) : (
                    <h2>🎉 Você finalizou! Pontos ganhos: {pontuacaoFinal} </h2>
                )}
            </div>
        </div>
    );
}
