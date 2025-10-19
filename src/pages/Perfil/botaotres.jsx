import './botaotres.css';
import { useEffect, useState } from "react";
import { URL } from "../../config";
import TorneioQuizzes from './torneioquizzes';

export default function BotaoTres() {
    const [mostrar, setMostrar] = useState("vendas"); // padrão = vendas
    const [mostrarModal, setMostrarModal] = useState(false);
    const [video, setVideo] = useState("");

    // ===============================
    // 🔹 Buscar vídeo da indicação
    // ===============================
    const abrirModal = async () => {
        try {
            const res = await fetch(`${URL}/indicacoes/ranking`);
            const data = await res.json();

            if (data.video) {
                setVideo(data.video);
                setMostrarModal(true);
            }
        } catch (err) {
            console.error("Erro ao buscar vídeo da indicação:", err);
        }
    };

    function TorneioVendas() {
        const [mensagem, setMensagem] = useState("");
        const [mostrarAviso, setMostrarAviso] = useState(false);
        const [tipoMensagem, setTipoMensagem] = useState("sucesso");
        const [grupo, setGrupo] = useState(null);
        const [participantes, setParticipantes] = useState([]);
        const [faltamDias, setFaltamDias] = useState(0);
        const [proximoTorneio, setProximoTorneio] = useState("");
        const [mostrarBotao, setMostrarBotao] = useState(false);
        const [premiosVendas, setPremiosVendas] = useState([]);

        const id = localStorage.getItem("usuario_id");

        // 🔹 Carregar prêmios de vendas
        useEffect(() => {
            const carregarPremios = async () => {
                try {
                    const res = await fetch(`${URL}/premios/vendas`);
                    const data = await res.json();
                    if (data.vendas) {
                        setPremiosVendas(data.vendas);
                    }
                } catch (err) {
                    console.error("Erro ao carregar prêmios de vendas:", err);
                }
            };

            carregarPremios();
        }, []);

        // 🔹 Controla exibição do botão de entrada
        useEffect(() => {
            if (faltamDias <= 10) {
                const timer = setTimeout(() => {
                    setMostrarBotao(true);
                }, 2000);
                return () => clearTimeout(timer);
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
                setMostrarAviso(true);
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
                setMostrarAviso(true);
            }
        };

        return (
            <section className="rankperfil-section">
                <h2 className="rankperfil-title">🏆 Ranking Vendas</h2>

                {premiosVendas.length > 0 ? (
                    <>
                        <p className="rankperfil-info">
                            Faltam <strong>{faltamDias}</strong> dias para o próximo torneio ({proximoTorneio}).
                            <> O prêmio é: <strong>{premiosVendas[0]}</strong></>
                        </p>

                        {grupo ? (
                            grupo === "Aguardando" ? (
                                <p className="rankperfil-info">
                                    🎉 Sua solicitação foi confirmada! Agora você está <strong>aguardando a formação dos grupos</strong>.
                                </p>
                            ) : (
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
                            )
                        ) : (
                            <>
                                <p className="rankperfil-info">
                                    Você poderá solicitar entrada quando faltarem <strong>10 dias ou menos</strong>.
                                </p>
                                {faltamDias <= 10 && mostrarBotao && (
                                    <button className="rankperfil-btn" onClick={ativarTorneio}>
                                        Solicitar entrada no torneio
                                    </button>
                                )}
                            </>
                        )}

                    </>
                ) : (
                    <p className="rankperfil-info">
                        Estamos aguardando o próximo torneio. ⏳
                    </p>
                )}

                {mostrarAviso && (
                    <div className="rankperfil-modal-overlay">
                        <div className={`rankperfil-modal-box ${tipoMensagem}`}>
                            <p>{mensagem}</p>
                            <button className="rankperfil-modal-btn" onClick={() => setMostrarAviso(false)}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    return (
        <div>
            <br /><br />

            <div className="rankperfil-botoes">
                <button
                    className={mostrar === "vendas" ? "ativo" : ""}
                    onClick={() => setMostrar("vendas")}
                >
                    Torneio Vendas
                </button>
                <button style={{ display: "none" }}
                    className={mostrar === "quizzes" ? "ativo" : ""}
                    onClick={() => setMostrar("quizzes")}
                >
                    Torneio Quizzes
                </button>
                <button className="rankperfil-info-btn" onClick={abrirModal}>
                    ℹ
                </button>
            </div>

            {mostrar === "vendas" ? <TorneioVendas /> : <TorneioQuizzes />}

            {mostrarModal && (
                <div
                    className="rankperfil-modal-overlay"
                    onClick={() => setMostrarModal(false)} // 👉 clicar fora fecha
                >
                    <div
                        className="rankperfil-modal-content"
                        onClick={(e) => e.stopPropagation()} // 👉 impede que clique dentro feche
                    >
                        <span
                            className="rankperfil-modal-close"
                            onClick={() => setMostrarModal(false)}
                        >
                            &times;
                        </span>
                        <div dangerouslySetInnerHTML={{ __html: video }} />
                    </div>
                </div>
            )}

        </div>
    );
}
