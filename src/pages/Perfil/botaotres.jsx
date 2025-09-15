import './botaotres.css';
import { useEffect, useState } from "react";
import { URL } from "../../config";
import TorneioQuizzes from './torneioquizzes';

export default function BotaoTres() {
    const [mostrar, setMostrar] = useState("vendas"); // padrão = vendas

    // ===============================
    // 🔹 Torneio Vendas (seu código original)
    // ===============================
    function TorneioVendas() {
        const [mensagem, setMensagem] = useState("");
        const [mostrarModal, setMostrarModal] = useState(false);
        const [tipoMensagem, setTipoMensagem] = useState("sucesso");
        const [grupo, setGrupo] = useState(null);
        const [participantes, setParticipantes] = useState([]);
        const [faltamDias, setFaltamDias] = useState(0);
        const [proximoTorneio, setProximoTorneio] = useState("");
        const [mostrarBotao, setMostrarBotao] = useState(false);

        const id = localStorage.getItem("usuario_id");
        useEffect(() => {
            if (faltamDias <= 10) {
                const timer = setTimeout(() => {
                    setMostrarBotao(true);
                }, 2000); // 2 segundos

                return () => clearTimeout(timer); // limpa se o componente desmontar
            } else {
                setMostrarBotao(false);
            }
        }, [faltamDias]);
        // 🔹 Buscar grupo do usuário
        useEffect(() => {
            const carregarGrupo = async () => {
                if (!id) return;

                try {
                    const res = await fetch(`${URL}/distribuicao/grupo/${id}`);
                    const data = await res.json();

                    if (data.grupo) {
                        setGrupo(data.grupo);
                        setParticipantes(data.participantes || []);
                    }

                    if (data.faltam_dias !== undefined) {
                        setFaltamDias(data.faltam_dias);
                    }

                    if (data.proximo_torneio) {
                        setProximoTorneio(data.proximo_torneio);
                    }

                    if (data.mensagem) {
                        setMensagem(data.mensagem);
                    }
                } catch (err) {
                    console.error("Erro ao carregar grupo:", err);
                }
            };

            carregarGrupo();
        }, [id]);

        const ativarTorneio = async () => {
            if (!id) {
                setMensagem("⚠️ Usuário não identificado!");
                setTipoMensagem("erro");
                setMostrarModal(true);
                return;
            }

            try {
                const res = await fetch(`${URL}/distribuicao/ativar/${id}`, { method: "POST" });
                const data = await res.json();
                setMensagem(data.mensagem || "Erro inesperado.");
                setTipoMensagem(res.ok ? "sucesso" : "erro");
            } catch (err) {
                console.error("Erro ao ativar torneio:", err);
                setMensagem("❌ Erro ao ativar torneio. Tente novamente.");
                setTipoMensagem("erro");
            } finally {
                setMostrarModal(true);
            }
        };

        return (
            <section className="rankperfil-section">
                <h2 className="rankperfil-title">🏆 Ranking Vendas</h2>

                {/* 🔹 Sempre mostra os dias restantes */}
                <p className="rankperfil-info">
                    Faltam <strong>{faltamDias}</strong> dias para o próximo torneio ({proximoTorneio}).
                </p>

                {/* 🔹 Se estiver em um grupo, mostra os detalhes do grupo */}
                {grupo ? (
                    <>
                        <p className="rankperfil-info">
                            Você está no grupo <strong>{grupo}</strong>
                        </p>
                        <hr />

                        <ul className="rankperfil-lista">
                            {participantes.map((p, index) => (
                                <li key={index}>
                                    <span>{p.nome} {p.sobrenome}</span> |{" "}
                                    <span className="rankperfil-pontos">{p.pontos} pts</span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <p className="rankperfil-info">
                            Você poderá solicitar entrada quando faltarem <strong>10 dias ou menos</strong>.
                        </p>

                        {/* 🔹 Botão só aparece se faltarem 10 dias ou menos */}
                        {faltamDias <= 10 && mostrarBotao && (
                            <button className="rankperfil-btn" onClick={ativarTorneio}>
                                Solicitar entrada no torneio
                            </button>
                        )}

                    </>
                )}

                {/* 🔹 Modal estilizado */}
                {mostrarModal && (
                    <div className="rankperfil-modal-overlay">
                        <div className={`rankperfil-modal-box ${tipoMensagem}`}>
                            <p>{mensagem}</p>
                            <button className="rankperfil-modal-btn" onClick={() => setMostrarModal(false)}>OK</button>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    // ===============================
    // 🔹 Render principal
    // ===============================
    return (
        <div>
            {/* 🔹 Botões para alternar */}
            <div className="rankperfil-botoes">
                <button
                    className={mostrar === "vendas" ? "ativo" : ""}
                    onClick={() => setMostrar("vendas")}
                >
                    Torneio Vendas
                </button>
                <button
                    className={mostrar === "quizzes" ? "ativo" : ""}
                    onClick={() => setMostrar("quizzes")}
                >
                    Torneio Quizzes
                </button>
            </div>

            {/* 🔹 Alterna entre os dois */}
            {mostrar === "vendas" ? <TorneioVendas /> : <TorneioQuizzes />}
        </div>
    );
}
