import { useEffect, useState } from "react";
import "./agendamentosannett.css";
import { URL } from "../../../../config";
import ListaAgendamentos from "./listaagendamentos";
import CalendarioAgendamentos from "./calendarioagendamentos";
import ProximosAgendamentos from "./proximosagendamentos"; // 🆕 import novo

export default function AgendamentosAnnett() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [visiveis, setVisiveis] = useState(30);
    const [abaAtiva, setAbaAtiva] = useState("proximos");

    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await fetch(`${URL}/annett/agendamentos/listar`);
                const data = await res.json();
                setAgendamentos(data);
            } catch (err) {
                console.error("Erro ao carregar agendamentos:", err);
            }
        };
        carregar();
    }, []);

    const carregarMais = () => {
        setVisiveis((prev) => prev + 30);
    };

    return (
        <div className="agendamentosannet-container">
            <h2 className="agendamentosannet-titulo">Agendamentos Annett</h2>

            {/* 🔹 Barra de botões */}
            <div className="agendamentosannet-abas">
                <button
                    className={`aba-botao ${abaAtiva === "tabela" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("tabela")}
                >
                    📋 Tabela
                </button>
                <button
                    className={`aba-botao ${abaAtiva === "lista" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("lista")}
                >
                    📄 Lista
                </button>
                <button
                    className={`aba-botao ${abaAtiva === "calendario" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("calendario")}
                >
                    📆 Calendário
                </button>
                <button
                    className={`aba-botao ${abaAtiva === "proximos" ? "ativo" : ""}`} // 🆕 botão
                    onClick={() => setAbaAtiva("proximos")}
                >
                    🕒 Próximos
                </button>
            </div>

            {/* 🔹 Conteúdo dinâmico */}
            {abaAtiva === "tabela" && (
                <>
                    <table className="agendamentosannet-tabela">
                        <thead>
                            <tr>
                                <th>ID do Usuário</th>
                                <th>Data</th>
                                <th>Horário</th>
                                <th>Serviço</th>
                                <th>Maior de Idade</th>
                                <th>Permissão</th>
                                <th>Responsável</th>
                                <th>Nome Completo</th>
                                <th>Condição</th>
                                <th>WhatsApp</th>
                                <th>Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendamentos.length === 0 ? (
                                <tr>
                                    <td colSpan="12">Nenhum agendamento encontrado.</td>
                                </tr>
                            ) : (
                                agendamentos.slice(0, visiveis).map((a, i) => {
                                    const linhaClasse = !a.maior_idade
                                        ? "linha-menor-idade"
                                        : i % 2 === 0
                                            ? "linha-par"
                                            : "linha-impar";
                                    return (
                                        <tr key={a.id} className={linhaClasse}>
                                            <td>{a.usuario_id || "-"}</td>
                                            <td>{a.data}</td>
                                            <td>{a.horario_escolhido}</td>
                                            <td>{a.servico}</td>
                                            <td>{a.maior_idade ? "Sim" : "Não"}</td>
                                            <td>
                                                {a.maior_idade ? "-" : a.permissao ? "Sim" : "Não"}
                                            </td>
                                            <td>{a.nome_responsavel || "-"}</td>
                                            <td>{a.nome_completo}</td>
                                            <td>{a.condicao || "-"}</td>
                                            <td>{a.whatsapp}</td>
                                            <td>{a.pago ? "✅" : "❌"}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {visiveis < agendamentos.length && (
                        <div className="agendamentosannet-botao-container">
                            <button
                                onClick={carregarMais}
                                className="agendamentosannet-botao-mais"
                            >
                                Carregar mais 30
                            </button>
                        </div>
                    )}
                </>
            )}

            {abaAtiva === "lista" && <ListaAgendamentos agendamentos={agendamentos} />}
            {abaAtiva === "calendario" && <CalendarioAgendamentos agendamentos={agendamentos} />}
            {abaAtiva === "proximos" && <ProximosAgendamentos agendamentos={agendamentos} />} {/* 🆕 */}
        </div>
    );
}
