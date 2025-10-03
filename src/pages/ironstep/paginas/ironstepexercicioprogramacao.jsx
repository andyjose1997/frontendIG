import React, { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./ironstepexercicioprogramacao.css";
import PremiumModal from "./premium";

export default function ExercicioProgramacao({ exercicioId, onClose }) {
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

    const [respondidas, setRespondidas] = useState([]);
    const [erros, setErros] = useState(0);
    const [acertos, setAcertos] = useState(0);

    const [feedback, setFeedback] = useState(null);

    const [entrando, setEntrando] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const [pronto, setPronto] = useState(false);

    const [showPremium, setShowPremium] = useState(false);

    const usuarioId = localStorage.getItem("usuario_id");

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // 🔹 Normalizador universal
    const normalizarTexto = (txt) => {
        return txt
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    // 🔹 Carregar fases e vidas
    useEffect(() => {
        if (!exercicioId) return;

        const token = localStorage.getItem("token");

        fetch(`${URL}/ironstep/fasesprogramacao/${exercicioId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setFases(data.fases || []);
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

    // 🔹 Configurar opções ao entrar em uma nova fase
    useEffect(() => {
        if (fases.length > 0) {
            const fase = fases[faseAtual];
            if (!fase) return;

            // sempre resetar selecionados/opções quando muda de fase
            setSelecionados([]);
            setOpcoesAtuais([]);

            if (fase.tipo === "montar_codigo") {
                const partes = fase.correta ? fase.correta.split(" ") : [];
                const extras = fase.opcoes && fase.opcoes.trim() !== ""
                    ? fase.opcoes.split(";")
                    : ["<div>", "<section>", "<span>", "<h1>"];
                setOpcoesAtuais(shuffle([...partes, ...extras]));
            }
            else if (fase.tipo === "identificar_erro" || fase.tipo === "traducao_codigo") {
                let todas = [];

                if (fase.correta) todas.push(...fase.correta.split(";"));
                if (fase.opcoes && fase.opcoes.trim() !== "") {
                    todas.push(...fase.opcoes.split(";"));
                } else {
                    todas.push(
                        "<header> ... </header>",
                        "<footer> ... </footer>",
                        "<main> ... </main>",
                        "<article> ... </article>"
                    );
                }

                setOpcoesAtuais(shuffle([...new Set(todas)]));
            }
            else {
                setOpcoesAtuais([]);
            }
        }
    }, [faseAtual, fases]);

    if (loading) return <p style={{ fontSize: "2rem" }}>Carregando fases...</p>;
    if (!fases.length) return <p>Nenhuma fase encontrada.</p>;

    if (bloqueado || vidas === 0) {
        return (
            <div className="pro-fullscreennn">
                <div className="pro-fase-container">
                    <h2>💔 Você ficou sem vidas!</h2>
                    <p>Você pode tentar novamente amanhã, ou desbloquear vidas ilimitadas com a conta <strong>Premium</strong>.</p>

                    <div style={{ marginTop: "1.5rem" }}>
                        <button className="pro-next-bttn" onClick={onClose}>Fechar</button>
                        <button
                            className="pro-premiumm-btttn"
                            onClick={() => setShowPremium(true)}
                        >
                            Quero ser Premium
                        </button>
                        {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
                    </div>
                </div>
            </div>
        );
    }

    const fase = fases[faseAtual];

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
    const validarResposta = () => {
        let correto = false;

        if (fase.tipo === "completar_codigo") {
            correto = normalizarTexto(resposta) === normalizarTexto(fase.correta);
        }
        if (fase.tipo === "traducao_codigo" || fase.tipo === "identificar_erro") {
            const normalizarArray = (arr) =>
                arr.map(c => normalizarTexto(c)).filter(c => c.length > 0).sort();

            const corretas = normalizarArray(fase.correta.split(";"));
            const selecionadasNormalizadas = normalizarArray(selecionados);

            correto = JSON.stringify(corretas) === JSON.stringify(selecionadasNormalizadas);
        }

        if (fase.tipo === "montar_codigo") {
            const respostaMontada = selecionados.join(" ");
            correto = normalizarTexto(respostaMontada) === normalizarTexto(fase.correta);
        }

        setRespondidas(prev => [...prev, fase.id]);

        if (correto) {
            setAcertos(prev => prev + 1);
            setFeedback({ tipo: "acerto", msg: "✅ Você acertou!" });
        } else {
            setErros(prev => prev + 1);
            descontarVida();
            setFeedback({ tipo: "erro", msg: `❌ Você errou! Resposta correta: ${fase.correta}` });
        }
    };

    // 🔹 Ir para próxima fase
    const proximaFase = () => {
        setFeedback(null);

        if (acertos >= 5) {
            finalizarExercicio();
            return;
        }

        if (erros >= 5) {
            alert("❌ Você errou 5 vezes seguidas! O exercício será reiniciado.");
            setErros(0);
            setAcertos(0);
            setRespondidas([]);
            setFaseAtual(0);
            setResposta("");
            setSelecionados([]);
            return;
        }

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

    // 🔹 Clique em opção multipla
    // 🔹 Clique em opção multipla
    const toggleOpcao = (op) => {
        if (fase.tipo === "identificar_erro") {
            // só uma opção pode ser escolhida
            setSelecionados([op]);
        } else {
            // tradução pode ser múltipla
            if (selecionados.includes(op)) {
                setSelecionados(selecionados.filter(s => s !== op));
            } else {
                setSelecionados([...selecionados, op]);
            }
        }
    };


    return (
        <div className="pro-fullscreennn">
            <div className="pro-fase-container">
                <button className="pro-clossse-bttn" onClick={onClose}>✖ Fechar</button>
                <br /><br /><br />

                {entrando ? (
                    <div className="pro-countdown-container">
                        <h2>🚀 Entrando...</h2>
                    </div>
                ) : !pontuacaoFinal ? (
                    <>
                        <h2>{fase.descricao}</h2>
                        <pre className="pro-fase-frase">{fase.frase}</pre>

                        {feedback ? (
                            <div className={`pro-feedback ${feedback.tipo}`}>
                                <p>{feedback.msg}</p>
                                <button className="pro-next-bttn" onClick={proximaFase}>Próxima</button>
                            </div>
                        ) : (
                            <div>
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
                                        {/* 🔹 Palavras disponíveis */}
                                        <div className="pro-montar-palavras">
                                            {opcoesAtuais
                                                .filter(op => !selecionados.includes(op)) // só mostra se não foi escolhida
                                                .map((op, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelecionados([...selecionados, op])}
                                                        className="pro-montar-palavra"
                                                    >
                                                        {op}
                                                    </button>
                                                ))}
                                        </div>

                                        {/* 🔹 Palavras já escolhidas */}
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
                                        {opcoesAtuais.map((op, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleOpcao(op)}
                                                className={`pro-erro-bttn ${selecionados.includes(op) ? "pro-selecionado" : ""}`}
                                            >
                                                {op}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button className="pro-validar-bttn" onClick={validarResposta}>Validar</button>
                            </div>
                        )}
                    </>
                ) : (
                    <h2>🎉 Você finalizou! Pontos ganhos: {pontuacaoFinal}</h2>
                )}
            </div>
        </div>
    );
}
