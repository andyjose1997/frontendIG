import './botaotres.css';
import { useEffect, useState } from "react";
import { URL } from "../../config";

export default function BotaoTres() {
    const [mensagem, setMensagem] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [grupo, setGrupo] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [faltamDias, setFaltamDias] = useState(0);
    const [proximoTorneio, setProximoTorneio] = useState("");

    const id = localStorage.getItem("usuario_id");

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
            <h2 className="rankperfil-title">🏆 Ranking</h2>

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
                    {faltamDias <= 10 && (
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
