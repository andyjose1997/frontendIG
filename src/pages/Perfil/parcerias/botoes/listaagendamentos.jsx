import { useState, useMemo, useEffect } from "react";
import "./listaagendamentos.css";
import { URL } from "../../../../config";

export default function ListaAgendamentos({ agendamentos }) {
    const [visiveis, setVisiveis] = useState(10);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroServico, setFiltroServico] = useState("");
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        const carregarServicos = async () => {
            try {
                const res = await fetch(`${URL}/annett/servicos/listar`);
                const data = await res.json();
                setServicos(data);
            } catch (err) {
                console.error("Erro ao carregar serviços:", err);
            }
        };
        carregarServicos();
    }, []);

    const carregarMais = () => setVisiveis((prev) => prev + 10);

    const agendamentosFiltrados = useMemo(() => {
        return agendamentos.filter((a) => {
            const nomeMatch = a.nome_completo
                .toLowerCase()
                .includes(filtroNome.toLowerCase());
            const servicoMatch = filtroServico
                ? a.servico.toLowerCase() === filtroServico.toLowerCase()
                : true;
            return nomeMatch && servicoMatch;
        });
    }, [agendamentos, filtroNome, filtroServico]);

    const exibidos = agendamentosFiltrados.slice(0, visiveis);

    return (
        <div className="listaagendamentos-container">
            {/* 🔹 Filtros */}
            <div className="listaagendamentos-filtros">
                <input
                    type="text"
                    placeholder="🔍 Filtrar por nome..."
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    className="listaagendamentos-input"
                />

                <select
                    value={filtroServico}
                    onChange={(e) => setFiltroServico(e.target.value)}
                    className="listaagendamentos-input"
                >
                    <option value="">💅 Todos os serviços</option>
                    {servicos.map((s, i) => {
                        const nomeServico = typeof s === "string" ? s : s.servico;
                        return (
                            <option key={i} value={nomeServico}>
                                {nomeServico}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* 🔹 Legenda explicativa */}
            <div className="listaagendamentos-legenda">
                <p>
                    🔹 <span style={{ color: "purple", fontWeight: "bold" }}>Roxo</span> = menor de idade &nbsp;|&nbsp;
                    ⚪ <span style={{ color: "#555" }}>Branco</span> = maior de idade &nbsp;|&nbsp;
                    🔴 <span style={{ color: "red", fontWeight: "bold" }}>Bordas vermelhas</span> = não pagaram
                </p>
            </div>

            {/* 🔹 Lista */}
            {exibidos.length === 0 ? (
                <p className="listaagendamentos-vazio">Nenhum agendamento encontrado.</p>
            ) : (
                exibidos.map((a) => (
                    <div
                        key={a.id}
                        className={`listaagendamentos-card 
                            ${!a.maior_idade ? "menor-idade" : ""} 
                            ${!a.pago ? "nao-pago" : ""}`}
                    >
                        <div className="listaagendamentos-topo">
                            <h3>{a.nome_completo}</h3>
                            <span className="listaagendamentos-servico">{a.servico}</span>
                        </div>

                        <div className="listaagendamentos-info">
                            <p><strong>Data:</strong> {a.data}</p>
                            <p><strong>Horário:</strong> {a.horario_escolhido}</p>

                            <p>
                                <strong>WhatsApp:</strong>{" "}
                                {a.whatsapp ? (
                                    <a
                                        href={`https://wa.me/${a.whatsapp.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-whatsapp"
                                    >
                                        {a.whatsapp}
                                    </a>
                                ) : (
                                    "-"
                                )}
                            </p>

                            <p><strong>Pago:</strong> {a.pago ? "Sim ✅" : "Não ❌"}</p>
                            <p><strong>Maior de idade:</strong> {a.maior_idade ? "Sim" : "Não"}</p>

                            {!a.maior_idade && (
                                <>
                                    <p><strong>Permissão:</strong> {a.permissao ? "Sim" : "Não"}</p>
                                    <p><strong>Responsável:</strong> {a.nome_responsavel || "-"}</p>
                                </>
                            )}

                            {a.condicao && (
                                <p>
                                    <strong>Condição:</strong>{" "}
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(a.condicao)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-condicao"
                                    >
                                        {a.condicao}
                                    </a>
                                </p>
                            )}
                        </div>

                        <div className="listaagendamentos-id">
                            <small>ID Usuário: {a.usuario_id || "-"}</small>
                        </div>
                    </div>
                ))
            )}

            {/* 🔹 Botão de carregar mais */}
            {visiveis < agendamentosFiltrados.length && (
                <div className="listaagendamentos-mais-container">
                    <button onClick={carregarMais} className="listaagendamentos-botao-mais">
                        Carregar mais 10
                    </button>
                </div>
            )}
        </div>
    );
}
