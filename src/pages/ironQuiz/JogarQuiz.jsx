import { useEffect, useState } from "react";
import { URL } from "../../config";
import "./JogarQuiz.css";

export default function JogarQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const [quizSelecionado, setQuizSelecionado] = useState(null);
    const [perguntas, setPerguntas] = useState(null);
    const [atual, setAtual] = useState(0);
    const [tempo, setTempo] = useState(20);
    const [modalAberto, setModalAberto] = useState(false);
    const [bloqueado, setBloqueado] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState(null); // {opcao, correta}
    const [pontosAcumulados, setPontosAcumulados] = useState(0);

    const id_jogador = localStorage.getItem("usuario_id");

    // 🔹 Carregar quizzes com progresso
    useEffect(() => {
        const carregarQuizzes = async () => {
            try {
                const res = await fetch(`${URL}/quiz/tipos_com_progresso/${id_jogador}`);
                const data = await res.json();
                setQuizzes(data);
            } catch (err) {
                console.error("Erro ao carregar quizzes:", err);
            }
        };
        carregarQuizzes();
    }, [id_jogador]);

    // 🔹 Timer
    useEffect(() => {
        if (!modalAberto || bloqueado || carregando) return;
        if (tempo <= 0) {
            marcarComoIncorreta();
            return;
        }
        const timer = setTimeout(() => setTempo((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [tempo, modalAberto, bloqueado, carregando]);

    // 🔹 Detectar se saiu da aba
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                marcarComoIncorreta();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [perguntas, atual]);

    // 🔹 Abrir quiz
    const abrirQuiz = async (nome) => {
        setQuizSelecionado(nome);
        setModalAberto(true);
        setAtual(0);
        setTempo(20);
        setBloqueado(false);
        setResultado(null);
        setCarregando(true);
        setFeedback(null);
        setPontosAcumulados(0);
        setPerguntas(null);

        try {
            const res = await fetch(`${URL}/quiz/perguntas/${nome}`);
            const data = await res.json();
            setPerguntas(data);
        } catch (err) {
            console.error("Erro ao carregar perguntas:", err);
            setPerguntas([]);
        } finally {
            setCarregando(false);
        }
    };

    // 🔹 Registrar resposta
    const registrarResposta = async (id_pergunta, pontos) => {
        try {
            await fetch(`${URL}/quiz/responder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_pergunta,
                    id_jogador,
                    pontos
                })
            });
        } catch (err) {
            console.error("Erro ao registrar resposta:", err);
        }
    };

    // 🔹 Marcar como incorreta automaticamente
    const marcarComoIncorreta = async () => {
        if (!perguntas || !perguntas[atual]) return;
        await registrarResposta(perguntas[atual].id, 0);
        proximaPergunta();
    };

    // 🔹 Responder pergunta
    const responder = async (opcao) => {
        if (bloqueado || feedback) return;

        const perguntaAtual = perguntas[atual];
        let pontos = 0;
        const correta = opcao === perguntaAtual.resposta_correta;

        if (correta) pontos = tempo;

        await registrarResposta(perguntaAtual.id, pontos);

        setFeedback({ opcao, correta });
        setPontosAcumulados((prev) => prev + pontos);

        setTimeout(() => {
            setFeedback(null);
            proximaPergunta();
        }, 1000);
    };

    // 🔹 Próxima pergunta
    const proximaPergunta = async () => {
        if (atual + 1 < perguntas.length) {
            setAtual(atual + 1);
            setTempo(20);
            setBloqueado(false);
        } else {
            setResultado(pontosAcumulados);
        }
    };

    // 🔹 Sair do quiz (conta como errado)
    const sairDoQuiz = async () => {
        if (perguntas && perguntas[atual]) {
            await registrarResposta(perguntas[atual].id, 0);
        }
        setModalAberto(false);
    };

    // 🔹 Voltar se ainda está carregando
    const voltarDuranteCarregamento = () => {
        setModalAberto(false);
        setPerguntas(null);
        setCarregando(false);
    };

    // 🔹 Separar listas
    const jogosSistema = quizzes.filter((q) => q.admin === 1);
    const jogosPublicos = quizzes.filter((q) => q.admin === 0);

    return (
        <div className="jogarQuiz-container">
            <h2 className="jogarQuiz-title">🎮 Jogar Quiz</h2>

            {/* Jogos do Sistema */}
            <h3>🛡️ Jogos do Sistema</h3>
            <ul className="jogarQuiz-lista">
                {jogosSistema.map((q) => (
                    <li key={q.id} className="jogarQuiz-item">
                        <button
                            className="jogarQuiz-btnAbrir"
                            disabled={q.respondidas >= q.total_perguntas}
                            onClick={() => abrirQuiz(q.nome)}
                        >
                            {q.nome} ({q.respondidas}/{q.total_perguntas})
                        </button>
                    </li>
                ))}
            </ul>

            {/* Jogos Públicos */}
            <div style={{ display: "none" }} >  <h3>🌍 Jogos Públicos</h3>
                <ul className="jogarQuiz-lista">
                    {jogosPublicos.map((q) => (
                        <li key={q.id} className="jogarQuiz-item">
                            <button
                                className="jogarQuiz-btnAbrir"
                                onClick={() => abrirQuiz(q.nome)}
                            >
                                {q.nome}
                            </button>
                        </li>
                    ))}
                </ul></div>


            {/* Modal */}
            {modalAberto && (
                <div className="jogarQuiz-modalOverlay">
                    <div className="jogarQuiz-modalContent">
                        {resultado !== null ? (
                            <div className="jogarQuiz-resultado">
                                <h3>🏆 Jogo finalizado!</h3>
                                <p>Você fez <strong>{resultado}</strong> pontos.</p>
                                <button
                                    className="jogarQuiz-btnAbrir"
                                    onClick={() => setModalAberto(false)}
                                >
                                    Fechar
                                </button>
                            </div>
                        ) : carregando || perguntas === null ? (
                            <div className="jogarQuiz-carregandoBox">
                                <p className="jogarQuiz-carregando">Carregando perguntas...</p>
                                <button
                                    className="jogarQuiz-btnVoltar"
                                    onClick={voltarDuranteCarregamento}
                                >
                                    ⬅️ Voltar
                                </button>
                            </div>
                        ) : perguntas.length > 0 ? (
                            <>
                                {/* 🔹 Pontos + progresso */}
                                <p className="jogarQuiz-status">
                                    Pergunta {atual + 1}/{perguntas.length} — Pontos: {pontosAcumulados}
                                </p>
                                <div className="jogarQuiz-progressBar">
                                    <div
                                        className="jogarQuiz-progressFill"
                                        style={{
                                            width: `${((atual + 1) / perguntas.length) * 100}%`,
                                        }}
                                    />
                                </div>

                                <h3 className="jogarQuiz-pergunta">{perguntas[atual].pergunta}</h3>
                                <p className="jogarQuiz-tempo">⏱️ Tempo restante: {tempo}s</p>

                                <div className="jogarQuiz-opcoes">
                                    {["a", "b", "c", "d"].map((opc) => {
                                        const isSelected = feedback?.opcao === opc.toUpperCase();
                                        const isCorrect = feedback?.correta && isSelected;
                                        const isWrong = !feedback?.correta && isSelected;

                                        return (
                                            <button
                                                key={opc}
                                                className={`jogarQuiz-btnOpcao ${isCorrect ? "correta" : ""} ${isWrong ? "errada" : ""}`}
                                                disabled={bloqueado || !!feedback}
                                                onClick={() => responder(opc.toUpperCase())}
                                            >
                                                {perguntas[atual][opc]}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="jogarQuiz-sair">
                                    <button className="jogarQuiz-btnSair" onClick={sairDoQuiz}>
                                        🚪 Sair do Quiz
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
