import { useMemo, useState } from "react";
import "./proximosagendamentos.css"; // usa o mesmo estilo visual

export default function ProximosAgendamentos({ agendamentos }) {
    const [diaSelecionado, setDiaSelecionado] = useState("hoje");
    const [selecionado, setSelecionado] = useState(null);

    const horariosFixos = ["08:30", "10:30", "13:30", "15:30", "17:30"];
    const diasBase = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    // 🔹 Função utilitária para criar data sem fuso horário
    const criarDataLocal = (yyyyMmDd) => {
        const [y, m, d] = yyyyMmDd.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    // 🔹 Define hoje e amanhã
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    // 🔹 Agrupa agendamentos por data
    const agendamentosPorDiaHorario = useMemo(() => {
        const mapa = {};
        agendamentos.forEach((a) => {
            const dataObj = criarDataLocal(a.data);
            const dataStr = dataObj.toISOString().split("T")[0];
            if (!mapa[dataStr]) mapa[dataStr] = {};
            mapa[dataStr][a.horario_escolhido] = a;
        });
        return mapa;
    }, [agendamentos]);

    // 🔹 Determina o dia ativo
    const diaAtual = diaSelecionado === "hoje" ? hoje : amanha;
    const dataISO = diaAtual.toISOString().split("T")[0];
    const nomeDia = diasBase[diaAtual.getDay()];

    const abrirInfo = (agendamento) => agendamento && setSelecionado(agendamento);
    const fecharInfo = () => setSelecionado(null);

    return (
        <div className="semana-container">
            {/* 🔹 Legenda de cores */}
            <div className="legenda-cores">
                <span className="legenda-item roxo"> Maior de idade</span>
                <span className="legenda-item dourado"> Menor de idade</span>
                <span className="legenda-item vermelho"> Não pago</span>
            </div>

            <div className="semana-header">
                <h3 className="semana-titulo">
                    Próximos Agendamentos —{" "}
                    {diaSelecionado === "hoje" ? "Hoje" : "Amanhã"} (
                    {diaAtual.getDate()}/{diaAtual.getMonth() + 1})
                </h3>

                <div className="botao-toggle-dia">
                    <button
                        className={`botao-navegar ${diaSelecionado === "hoje" ? "ativo" : ""}`}
                        onClick={() => setDiaSelecionado("hoje")}
                    >
                        📅 Hoje
                    </button>
                    <button
                        className={`botao-navegar ${diaSelecionado === "amanha" ? "ativo" : ""}`}
                        onClick={() => setDiaSelecionado("amanha")}
                    >
                        🌅 Amanhã
                    </button>
                </div>
            </div>

            {/* 🔹 Grade de horários */}
            <div className="semana-grid">
                <div className="semana-coluna">
                    <h4 className="semana-dia">
                        {nomeDia}{" "}
                        <span className="semana-data">
                            ({diaAtual.getDate()}/{diaAtual.getMonth() + 1})
                        </span>
                    </h4>

                    {horariosFixos.map((horario) => {
                        const agendamento = agendamentosPorDiaHorario[dataISO]?.[horario];
                        const ocupado = !!agendamento;

                        return (
                            <div
                                key={`${dataISO}-${horario}`}
                                className={`horario-box 
                                    ${ocupado ? "ocupado" : "livre"} 
                                    ${ocupado && agendamento && !agendamento.maior_idade ? "menor-idade" : ""} 
                                    ${ocupado && agendamento && !agendamento.pago ? "nao-pago" : ""}`}
                                onClick={() => abrirInfo(agendamento)}
                            >
                                <span className="hora">{horario}</span>
                                {ocupado && (
                                    <span className="nome">
                                        {agendamento.nome_completo}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selecionado && (
                <div className="info-modal">
                    <div className="info-conteudo">
                        <button className="fechar" onClick={fecharInfo}>
                            ✖
                        </button>
                        <h3>Detalhes do Agendamento</h3>
                        <p><strong>Nome:</strong> {selecionado.nome_completo}</p>
                        <p><strong>Serviço:</strong> {selecionado.servico}</p>
                        <p><strong>Data:</strong> {new Date(selecionado.data).toLocaleDateString("pt-BR")}</p>
                        <p><strong>Horário:</strong> {selecionado.horario_escolhido}</p>

                        {/* 🔹 Link direto para o WhatsApp */}
                        <p>
                            <strong>WhatsApp:</strong>{" "}
                            {selecionado.whatsapp ? (
                                <a
                                    href={`https://wa.me/${selecionado.whatsapp.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-whatsapp"
                                >
                                    Enviar mensagem
                                </a>
                            ) : (
                                "-"
                            )}
                        </p>

                        <p><strong>Pago:</strong> {selecionado.pago ? "Sim ✅" : "Não ❌"}</p>
                        <p><strong>Maior de idade:</strong> {selecionado.maior_idade ? "Sim" : "Não"}</p>

                        {!selecionado.maior_idade && (
                            <>
                                <p><strong>Responsável:</strong> {selecionado.nome_responsavel || "-"}</p>
                                <p><strong>Permissão:</strong> {selecionado.permissao ? "Sim" : "Não"}</p>
                            </>
                        )}

                        {/* 🔹 Condição clicável para buscar no Google */}
                        {selecionado.condicao && (
                            <p>
                                <strong>Condição:</strong>{" "}
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(selecionado.condicao)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-condicao"
                                >
                                    {selecionado.condicao}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
