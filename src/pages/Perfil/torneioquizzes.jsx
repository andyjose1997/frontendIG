import { useEffect, useState } from "react";
import { URL } from "../../config";
import './torneioQuizzes.css'

export default function TorneioQuizzes() {
    const [tipos, setTipos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [rankings, setRankings] = useState({});
    const [premiosRanking, setPremiosRanking] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const idUsuario = localStorage.getItem("usuario_id");
                if (!idUsuario) {
                    console.error("Usuário não logado!");
                    return;
                }

                // 🔹 Tipos ainda não clicados
                const resTipos = await fetch(`${URL}/quiz/tipos/${idUsuario}`);
                const dataTipos = await resTipos.json();
                const unicos = [];
                const vistos = new Set();
                for (const item of dataTipos) {
                    if (!vistos.has(item.tipo)) {
                        vistos.add(item.tipo);
                        unicos.push(item);
                    }
                }
                setTipos(unicos);

                // 🔹 Tipos já clicados → rankings
                const resClicados = await fetch(`${URL}/quiz/clicados/${idUsuario}`);
                const dataClicados = await resClicados.json();

                for (const item of dataClicados) {
                    await carregarRanking(item.tipo_quiz);
                }

                // 🔹 Carregar prêmios da coluna ranking
                const resPremios = await fetch(`${URL}/premios/ranking`);
                const dataPremios = await resPremios.json();
                if (dataPremios.ranking) {
                    setPremiosRanking(dataPremios.ranking);
                }

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };

        carregarDados();
    }, []);

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const carregarRanking = async (tipo) => {
        try {
            const res = await fetch(`${URL}/quiz/ranking/${tipo}`);
            const data = await res.json();
            setRankings((prev) => ({ ...prev, [tipo]: data }));
        } catch (err) {
            console.error("Erro ao carregar ranking:", err);
        }
    };

    const registrarClique = async (tipo, id) => {
        try {
            const idUsuario = localStorage.getItem("usuario_id");
            if (!idUsuario) {
                setMensagem("Erro: usuário não logado ❌");
                setTimeout(() => setMensagem(""), 3000);
                return;
            }

            const res = await fetch(`${URL}/quiz/clique`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    tipo_quiz: tipo
                })
            });

            if (res.ok) {
                setTipos((prev) => prev.filter((t) => t.id !== id));
                setMensagem(`Você foi adicionado ao quiz de ${capitalize(tipo)} ✅`);
                setTimeout(() => setMensagem(""), 3000);

                carregarRanking(tipo);
            }
        } catch (err) {
            console.error("Erro ao registrar clique:", err);
        }
    };

    return (
        <div className="ranking-container">
            <h2 className="rankperfil-title">🎯 Ranking Quizzes</h2>

            {/* 🔹 Mostrar prêmio da coluna ranking */}
            {premiosRanking.length > 0 && (
                <p className="rankperfil-info">
                    🎁 O prêmio é: <strong>{premiosRanking[0].ranking}</strong> até o último dia de {premiosRanking[0].mes_ano}
                </p>
            )}


            <p className="rankperfil-info">Escolha um tipo de quiz:</p>

            {mensagem && <div className="alerta-quizzes">{mensagem}</div>}

            <div className="botoes-quizzes">
                {tipos.length > 0 ? (
                    tipos.map((t) => (
                        <button
                            key={t.id}
                            className="rankperfil-btn"
                            onClick={() => registrarClique(t.tipo, t.id)}
                        >
                            {capitalize(t.tipo)}
                        </button>
                    ))
                ) : (
                    mostrarMensagem && (
                        <p className="sem-quizzes">📌 Em breve teremos mais quizzes!</p>
                    )
                )}
            </div>

            <div className="rankings-container">
                {Object.keys(rankings).map((tipo) => (
                    <div key={tipo} className="ranking-box">
                        <h3 className="ranking-title">🏆 Ranking {capitalize(tipo)}</h3>
                        <table className="ranking-tabela">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Sobrenome</th>
                                    <th>Pontos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings[tipo].map((jogador, idx) => (
                                    <tr key={idx}>
                                        <td>{jogador.nome}</td>
                                        <td>{jogador.sobrenome}</td>
                                        <td>{jogador.pontos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}
