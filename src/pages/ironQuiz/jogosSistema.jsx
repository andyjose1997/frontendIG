import { useEffect, useState } from "react";
import { URL } from "../../config";
import "./JogarQuiz.css";

export default function JogosSistema({ id_jogador, abrirQuiz }) {
    const [jogosSistema, setJogosSistema] = useState([]);

    // 🔹 Carregar quizzes do sistema
    useEffect(() => {
        const carregarJogosSistema = async () => {
            try {
                const res = await fetch(`${URL}/quiz/tipos_com_progresso/${id_jogador}`);
                const data = await res.json();
                const filtrados = data.filter((q) => q.admin === 1);
                setJogosSistema(filtrados);
            } catch (err) {
                console.error("Erro ao carregar jogos do sistema:", err);
            }
        };
        carregarJogosSistema();
    }, [id_jogador]);

    return (
        <>
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
        </>
    );
}
