import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../config";
import "./jogarquiz.css";
import "./jogospublicos.css";

export default function JogosPublicos({ id_jogador, abrirQuiz }) {
    const [jogosPublicos, setJogosPublicos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [quizSelecionado, setQuizSelecionado] = useState(null);

    const navigate = useNavigate();

    // 🔹 Carregar quizzes públicos
    useEffect(() => {
        const carregarJogosPublicos = async () => {
            try {
                const res = await fetch(`${URL}/quiz/tipos_com_progresso/${id_jogador}`);
                const data = await res.json();
                const filtrados = data.filter((q) => q.admin === 0);
                setJogosPublicos(filtrados);
            } catch (err) {
                console.error("Erro ao carregar jogos públicos:", err);
            }
        };
        carregarJogosPublicos();
    }, [id_jogador]);

    // 🔹 Abrir modal antes de jogar
    const abrirModal = (quiz) => {
        setQuizSelecionado(quiz); // 👈 agora guarda objeto completo
        setModalAberto(true);
    };

    // 🔹 Jogar normalmente
    const confirmarJogar = () => {
        setModalAberto(false);
        if (quizSelecionado) {
            abrirQuiz(quizSelecionado.nome); // 👈 passa apenas o nome
        }
    };

    // 🔹 Criar sala no backend e redirecionar para rota de host
    const criarSala = async () => {
        setModalAberto(false);
        if (!quizSelecionado) return;

        try {
            const res = await fetch(`${URL}/salas/criar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_criador: id_jogador,
                    id_quiz: quizSelecionado.id,   // 👈 usa o id correto
                    nome_quiz: quizSelecionado.nome
                })
            });

            const data = await res.json();
            if (data.success) {
                navigate(`/sala/host/${data.codigo}`); // 👈 redireciona host
            } else {
                alert("Erro ao criar sala");
            }
        } catch (err) {
            console.error("Erro ao criar sala:", err);
            alert("Erro ao criar sala");
        }
    };

    return (
        <>
            <h3>🌍 Jogos Públicos</h3>
            <ul className="jogarQuiz-lista">
                {jogosPublicos.map((q) => (
                    <li key={q.id} className="jogarQuiz-item">
                        <button
                            className="jogarQuiz-btnAbrir"
                            onClick={() => abrirModal(q)} // 👈 passa objeto
                        >
                            {q.nome}
                        </button>
                    </li>
                ))}
            </ul>

            {/* 🔹 Modal com dois botões */}
            {modalAberto && quizSelecionado && (
                <div className="jogarQuiz-modalOverlay">
                    <div className="jogarQuiz-modalContent">
                        <h3>Escolha uma opção</h3>
                        <p>
                            O que deseja fazer com o jogo{" "}
                            <strong>{quizSelecionado.nome}</strong>?
                        </p>
                        <div className="jogarQuiz-opcoesModal">
                            <button className="jogarQuiz-btnAbrir" onClick={confirmarJogar}>
                                🎮 Jogar
                            </button>
                            <button className="jogarQuiz-btnVoltar" onClick={criarSala}>
                                🔑 Criar Sala
                            </button>
                        </div>
                        <button
                            className="jogarQuiz-btnSair"
                            onClick={() => setModalAberto(false)}
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
