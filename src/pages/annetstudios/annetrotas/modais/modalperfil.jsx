// 📂 src/pages/annetstudios/modais/ModalPerfil.jsx
import ReactDOM from "react-dom";
import "./modalperfil.css";
import { useState, useEffect } from "react";
import { URL } from "../../../../config";

export default function ModalPerfil({ onFechar }) {
    const [usuario, setUsuario] = useState(null);
    const [erro, setErro] = useState(null);
    const [agendamentos, setAgendamentos] = useState([]);

    // 🔹 Buscar perfil
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErro("É necessário fazer login para visualizar o perfil.");
            return;
        }

        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Erro ao buscar perfil");
                const data = await res.json();
                setUsuario(data);
            })
            .catch((err) => setErro(err.message));
    }, []);

    // 🔹 Buscar agendamentos do usuário
    useEffect(() => {
        if (!usuario?.id) return;

        fetch(`${URL}/annett/agendamentos/listar`)
            .then((res) => res.json())
            .then((data) => {
                const filtrados = data.filter(
                    (a) => a.usuario_id === usuario.id
                );
                setAgendamentos(filtrados);
            })
            .catch((err) =>
                console.error("Erro ao carregar agendamentos:", err)
            );
    }, [usuario]);

    // 🔹 Função para texto de data inteligente
    const getTextoData = (dataStr) => {
        const hoje = new Date();
        const data = new Date(dataStr);
        const diffDias = Math.ceil(
            (data - hoje) / (1000 * 60 * 60 * 24)
        );

        if (diffDias === 0) return "Hoje";
        if (diffDias === 1) return "Amanhã";
        if (diffDias === 2) return "Depois de amanhã";
        if (diffDias < 7 && diffDias > 2) {
            const dias = [
                "Domingo",
                "Segunda",
                "Terça",
                "Quarta",
                "Quinta",
                "Sexta",
                "Sábado",
            ];
            return `Próxima ${dias[data.getDay()]}`;
        }
        if (diffDias > 14)
            return data.toLocaleDateString("pt-BR");
        return data.toLocaleDateString("pt-BR");
    };

    // 🔹 Função para WhatsApp
    const cancelarAgendamento = (a) => {
        const base = "https://wa.me/5511915305613";
        const mensagem =
            `Olá, sou ${usuario.nome}! ` +
            `Gostaria de cancelar o serviço ${a.servico} ` +
            `do dia ${a.data} às ${a.horario_escolhido}. ` +
            (a.pago === 1 ? "E solicito o reembolso." : "");
        const url = `${base}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    };

    return ReactDOM.createPortal(
        <div className="annetperfil-overlay" onClick={onFechar}>
            <div
                className="annetperfil-conteudo"
                onClick={(e) => e.stopPropagation()}
            >
                {erro ? (
                    <h2 className="annetperfil-erro">⚠️ {erro}</h2>
                ) : usuario ? (
                    <>
                        <h2 className="annetperfil-titulo">
                            <span className="annetperfil-icone">👤</span> Perfil
                        </h2>
                        <hr className="annetperfil-linha" />

                        <div className="annetperfil-area-foto-nome">
                            <img
                                src={
                                    usuario.foto ||
                                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                }
                                alt="Foto de perfil"
                                className="annetperfil-foto"
                            />
                            <h3 className="annetperfil-nome">
                                {usuario.nome} {usuario.sobrenome}
                            </h3>
                            <p className="annetperfil-boas-vindas">
                                Bem-vindo(a) ao seu perfil!
                            </p>

                            {/* 🔹 Botão Ir ao perfil */}
                            <button
                                className="annetperfil-irperfil"
                                onClick={() =>
                                    window.open(
                                        "https://irongoals.com/perfil",
                                        "_blank"
                                    )
                                }
                            >
                                Ir ao perfil
                            </button>
                        </div>

                        {/* 🔹 Histórico de agendamentos */}
                        <div className="annetperfil-historico">
                            <h3>🗓️ Histórico de Agendamentos</h3>
                            {agendamentos.length > 0 ? (
                                <ul>
                                    {agendamentos.map((a, i) => (
                                        <li key={i} className="annetperfil-item">
                                            <div>
                                                <strong>{a.servico}</strong> — {getTextoData(a.data)} às {a.horario_escolhido}
                                                {a.pago === 0 && (
                                                    <span className="annetperfil-naopago"> NÃO PAGO </span>
                                                )}
                                            </div>
                                            <button
                                                className="annetperfil-cancelar"
                                                onClick={() => cancelarAgendamento(a)}
                                            >
                                                Solicitar cancelamento
                                            </button>
                                        </li>
                                    ))}

                                </ul>
                            ) : (
                                <p>Nenhum agendamento encontrado.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="annetperfil-carregando">Carregando...</p>
                )}

                <button className="annetperfil-fechar" onClick={onFechar}>
                    Fechar
                </button>
            </div>
        </div>,
        document.body
    );
}
