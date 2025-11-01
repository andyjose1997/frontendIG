import { useState, useMemo } from "react";
import "./calendarioagendamentos.css";

// 🔹 Função utilitária para criar data sem alterar o dia (sem fuso horário)
function criarDataLocal(yyyyMmDd) {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export default function CalendarioAgendamentos({ agendamentos }) {
    const [selecionado, setSelecionado] = useState(null);

    // 🔹 Corrige todas as datas do backend para evitar erro de fuso
    const agendamentosCorrigidos = useMemo(() => {
        return agendamentos.map(a => ({
            ...a,
            dataObj: criarDataLocal(a.data)
        }));
    }, [agendamentos]);

    // 🔹 Pega a primeira data real do banco
    const primeiraData = useMemo(() => {
        if (agendamentosCorrigidos.length === 0) return new Date();
        const datas = agendamentosCorrigidos.map(a => a.dataObj);
        return new Date(Math.min(...datas.map(d => d.getTime())));
    }, [agendamentosCorrigidos]);

    // 🔹 Define a segunda-feira da primeira semana com agendamento
    const [semanaBase, setSemanaBase] = useState(() => {
        const inicio = new Date(primeiraData);
        inicio.setDate(inicio.getDate() - (inicio.getDay() === 0 ? 6 : inicio.getDay() - 1));
        return inicio;
    });

    const horariosFixos = ["08:30", "10:30", "13:30", "15:30", "17:30"];
    const diasBase = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    // 🔹 Gera os dias da semana
    const diasDaSemana = useMemo(() => {
        const dias = [];
        for (let i = 0; i < 6; i++) {
            const dia = new Date(semanaBase);
            dia.setDate(semanaBase.getDate() + i);
            dias.push(dia);
        }
        return dias;
    }, [semanaBase]);

    // 🔹 Agrupa agendamentos
    const agendamentosPorDiaHorario = useMemo(() => {
        const mapa = {};
        agendamentosCorrigidos.forEach((a) => {
            const dataStr = a.dataObj.toISOString().split("T")[0];
            if (!mapa[dataStr]) mapa[dataStr] = {};
            mapa[dataStr][a.horario_escolhido] = a;
        });
        return mapa;
    }, [agendamentosCorrigidos]);

    // 🔹 Navegação semanal
    const avancarSemana = () => {
        const novaBase = new Date(semanaBase);
        novaBase.setDate(semanaBase.getDate() + 7);
        setSemanaBase(novaBase);
    };
    const voltarSemana = () => {
        const novaBase = new Date(semanaBase);
        novaBase.setDate(semanaBase.getDate() - 7);
        setSemanaBase(novaBase);
    };

    const abrirInfo = (agendamento) => agendamento && setSelecionado(agendamento);
    const fecharInfo = () => setSelecionado(null);

    // 🔹 Intervalo da semana
    const inicio = diasDaSemana[0];
    const fim = diasDaSemana[diasDaSemana.length - 1];
    const intervaloSemana = `${inicio.toLocaleDateString("pt-BR")} - ${fim.toLocaleDateString("pt-BR")}`;

    return (
        <div className="semana-container">
            {/* 🔹 Legenda de cores */}
            <div className="legenda-cores">
                <span className="legenda-item roxo"> Maior de idade</span>
                <span className="legenda-item dourado"> Menor de idade</span>
                <span className="legenda-item vermelho"> Não pago</span>
            </div>

            <div className="semana-header">
                <button onClick={voltarSemana} className="botao-navegar">⏪ Semana anterior</button>
                <h3 className="semana-titulo">Agenda Semanal ({intervaloSemana})</h3>
                <button onClick={avancarSemana} className="botao-navegar">Semana seguinte ⏩</button>
            </div>

            <div className="semana-grid">
                {diasDaSemana.map((dia) => {
                    const dataISO = dia.toISOString().split("T")[0];
                    const nomeDia = diasBase[dia.getDay()];
                    return (
                        <div key={dataISO} className="semana-coluna">
                            <h4 className="semana-dia">
                                {nomeDia} <span className="semana-data">({dia.getDate()}/{dia.getMonth() + 1})</span>
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
                    );
                })}
            </div>
            {/* 🔹 Controles abaixo da grade (visíveis apenas no mobile) */}
            <div className="semana-footer">
                <button onClick={voltarSemana} className="botao-navegar">⏪ Semana anterior</button>
                <span className="intervalo-semana">{intervaloSemana}</span>
                <button onClick={avancarSemana} className="botao-navegar">Semana seguinte ⏩</button>
            </div>

            {selecionado && (
                <div className="info-modal">
                    <div className="info-conteudo">
                        <button className="fechar" onClick={fecharInfo}>✖</button>
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
