// 📂 src/pages/annetstudios/annetrotas/formulariodois.jsx
import { useState, useEffect, useRef } from "react"; // ✅ adiciona useRef
import "./formulariodois.css";
import { URL } from "../../../config";

export default function FormularioDois({
    onVoltar,
    maiorIdade,
    temPermissao,
    nomeResponsavel,
    condicao,
    whatsapp,
    nomeCompleto, // ✅ adiciona aqui
}) {
    const [servicos, setServicos] = useState([]);
    const [fotos, setFotos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [servicosSelecionados, setServicosSelecionados] = useState([]);
    const [dataHora, setDataHora] = useState("");
    const [indiceImagem, setIndiceImagem] = useState({});
    const [imagemGrande, setImagemGrande] = useState(null);
    const [statusPagamento, setStatusPagamento] = useState("inicio");
    const [etapaPagamento, setEtapaPagamento] = useState(false);
    const pagamentoRef = useRef(null); // ✅ referência da área de pagamento

    const horariosFixos = ["08:30", "10:30", "13:30", "15:30", "17:30"];

    // 🔹 Buscar serviços, fotos e agendamentos reais
    useEffect(() => {
        const carregar = async () => {
            try {
                const [resServicos, resFotos, resAg] = await Promise.all([
                    fetch(`${URL}/annett/servicos/listar`),
                    fetch(`${URL}/annett/servicos/fotos/listar`),
                    fetch(`${URL}/annett/agendamentos/listar`),
                ]);

                const dataServicos = await resServicos.json();
                const dataFotos = await resFotos.json();
                const dataAg = await resAg.json();

                setServicos(dataServicos);
                setFotos(dataFotos);
                setAgendamentos(dataAg);
            } catch (err) {
                console.error("❌ Erro ao carregar dados:", err);
            }
        };
        carregar();
    }, []);
    useEffect(() => {
        if (etapaPagamento && pagamentoRef.current) {
            requestAnimationFrame(() => {
                pagamentoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }, [etapaPagamento]);


    // 🔹 Bloquear datas passadas
    const hojeBrasil = new Date().toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
    });
    const [dia, mes, ano] = hojeBrasil.split("/");
    const dataMinima = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

    // 🔹 Verifica se o horário está ocupado
    const horarioOcupado = (data, hora) => {
        return agendamentos.some(
            (a) => a.data === data && a.horario_escolhido === hora
        );
    };

    // 🔹 Verifica se o dia está cheio
    const dataCheia = (data) => {
        return horariosFixos.every((hora) => horarioOcupado(data, hora));
    };

    // 🔹 Muda slide de imagens
    const mudarSlide = (id, direcao) => {
        setIndiceImagem((prev) => {
            const atual = prev[id] || 0;
            const novo =
                direcao === "proximo" ? (atual + 3) % 9 : (atual - 3 + 9) % 9;
            return { ...prev, [id]: novo };
        });
    };
    // 🔹 Permitir apenas um serviço selecionado por vez
    const handleSelecionarServico = (nome) => {
        setServicosSelecionados((prev) => {
            if (prev.includes(nome)) {
                // Se clicar de novo no mesmo serviço, desmarca
                return [];
            } else {
                // Caso contrário, substitui o anterior
                return [nome];
            }
        });
    };
    const handleConfirmar = (e) => {
        e.preventDefault();
        if (servicosSelecionados.length === 0 || !dataHora) {
            alert("Por favor, selecione os serviços e o horário.");
            return;
        }
        setEtapaPagamento(true);
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, 200);
    };


    // 🔹 Função para salvar agendamento (pago = 0 ou 1)
    const salvarAgendamento = async (pago = 0) => {
        try {
            const usuarioLocal = localStorage.getItem("usuario");
            const usuario = usuarioLocal ? JSON.parse(usuarioLocal) : {};
            const usuario_id =
                usuario.id ||
                usuario.usuario_id ||
                usuario.user_id ||
                localStorage.getItem("usuario_id") ||
                null;

            if (!usuario_id) {
                alert("Não foi possível identificar o usuário logado.");
                return;
            }

            const dataSelecionada = dataHora.split("T")[0];
            const horarioSelecionado = dataHora.split("T")[1];

            // 🧠 Detecta automaticamente o nome completo, independente do formato salvo
            let nomeUsuario =
                usuario.nome_completo ||
                usuario.full_name ||
                usuario.display_name ||
                (usuario.nome && usuario.sobrenome
                    ? `${usuario.nome} ${usuario.sobrenome}`
                    : usuario.nome || "Usuário");

            // 🔹 Se ainda assim vier só uma palavra, tenta buscar sobrenome adicional
            if (nomeUsuario.split(" ").length === 1 && usuario.sobrenome) {
                nomeUsuario = `${nomeUsuario} ${usuario.sobrenome}`;
            }



            const dados = {
                usuario_id,
                data: dataSelecionada,
                horario_escolhido: horarioSelecionado,
                servico: servicosSelecionados.join(", "),
                maior_idade: maiorIdade,
                permissao: temPermissao,
                nome_responsavel: nomeResponsavel || null,
                nome_completo: nomeCompleto || nomeUsuario,
                condicao: condicao || null,
                whatsapp: whatsapp || usuario.whatsapp || null,
                pago,
            };

            console.log("%c📤 Enviando agendamento:", "color:#d4af37; font-weight:bold;");
            console.table(dados);

            const resposta = await fetch(`${URL}/annett/agendamentos/criar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                console.log("%c✅ Agendamento salvo com sucesso!", "color:#32CD32; font-weight:bold;");
                console.table(resultado);
                setStatusPagamento(pago === 1 ? "aguardando" : "aprovado");
                setEtapaPagamento(false);
            } else {
                console.error("❌ Erro ao salvar agendamento:", resultado);
                alert(resultado.detail || "Erro ao salvar agendamento.");
            }
        } catch (err) {
            console.error("❌ Erro ao salvar agendamento:", err);
            alert("Ocorreu um erro ao salvar o agendamento.");
        }
    };

    // 🔹 Pagar agora (integra MercadoPago)
    const handlePagamentoAgora = async () => {
        const total = servicos
            .filter((s) => servicosSelecionados.includes(s.servico))
            .reduce((sum, s) => sum + parseFloat(s.valor), 0);

        try {
            console.log(
                "%c💳 Criando preferência de pagamento...",
                "color:#0099ff; font-weight:bold;"
            );

            const resposta = await fetch(`${URL}/pagamento/criar-preferencia-annet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    valor_total: total,
                    descricao: `Agendamento de ${servicosSelecionados.join(", ")}`,
                    dataHora: dataHora,
                }),
            });

            const data = await resposta.json();

            if (data.init_point) {
                await salvarAgendamento(1);
                window.open(data.init_point, "_blank", "noopener,noreferrer");
            } else {
                alert("Erro ao criar pagamento. Tente novamente.");
            }
        } catch (err) {
            console.error("❌ Erro ao criar pagamento:", err);
            alert("Ocorreu um erro ao iniciar o pagamento.");
        }
    };

    return (
        <main className="formannet-container">
            {statusPagamento === "inicio" && !etapaPagamento && (
                <>
                    <p className="formannet-etapa">Etapa 2/3</p><br />
                    <h1 className="formannet-titulo">Escolha seus serviços</h1>
                    <p className="formannet-subtitulo">
                        Selecione um serviço que deseja agendar e o horário disponível.
                    </p>

                    <div className="formannet-servicos-lista">
                        {servicos.map((servico) => {
                            const imagens = fotos
                                .filter((f) => f.id_servico === servico.id)
                                .map((f) => f.foto);
                            const inicio = indiceImagem[servico.id] || 0;
                            const visiveis = imagens.slice(inicio, inicio + 3);

                            return (
                                <div key={servico.id} className="formannet-servico-bloco">
                                    <label
                                        className={`formannet-servico ${servicosSelecionados.includes(servico.servico)
                                            ? "selecionado"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={servicosSelecionados.includes(servico.servico)}
                                            onChange={() => handleSelecionarServico(servico.servico)}
                                        />
                                        <span>{servico.servico}</span>
                                        <strong>
                                            {Number(servico.valor).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </strong>
                                    </label>

                                    {servicosSelecionados.includes(servico.servico) && imagens.length > 0 && (
                                        <div className="formannet-carrossel">
                                            <button
                                                type="button"
                                                className="formannet-carrossel-btn esquerda"
                                                onClick={() => mudarSlide(servico.id, "anterior")}
                                            >
                                                ⬅️
                                            </button>

                                            <div className="formannet-imagens">
                                                {visiveis.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img}
                                                        alt={servico.servico}
                                                        className="formannet-imagem"
                                                        onClick={() => setImagemGrande(img)}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                className="formannet-carrossel-btn direita"
                                                onClick={() => mudarSlide(servico.id, "proximo")}
                                            >
                                                ➡️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="formannet-horario">
                        <h3>Selecione a data e o horário desejado:</h3>

                        <div className="formannet-data">
                            <input
                                type="date"
                                min={dataMinima}
                                value={dataHora.split("T")[0] || ""}
                                onChange={(e) => {
                                    const data = e.target.value;
                                    if (dataCheia(data)) {
                                        alert("Todos os horários deste dia estão ocupados.");
                                        return;
                                    }
                                    setDataHora(`${data}T`);
                                }}
                                required
                            />
                        </div>

                        {dataHora && (
                            <div className="formannet-horas">
                                {horariosFixos.map((hora) => {
                                    const dataSelecionada = dataHora.split("T")[0];
                                    const ocupado = horarioOcupado(dataSelecionada, hora);
                                    if (ocupado) return null;
                                    return (
                                        <button
                                            key={hora}
                                            type="button"
                                            className={`formannet-hora-btn ${dataHora.endsWith(hora) ? "ativo" : ""}`}
                                            onClick={() => setDataHora(`${dataSelecionada}T${hora}`)}
                                        >
                                            {hora}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="formannet-botoes">
                        <button onClick={onVoltar} className="formannet-btn-voltar">← Voltar</button>
                        <button
                            onClick={handleConfirmar}
                            disabled={
                                servicosSelecionados.length === 0 ||
                                !dataHora.includes("T") ||
                                dataHora.split("T")[1] === "" // garante que tenha horário
                            }
                            className={`formannet-btn ${servicosSelecionados.length === 0 ||
                                !dataHora.includes("T") ||
                                dataHora.split("T")[1] === ""
                                ? "desativado"
                                : ""
                                }`}
                        >
                            Próximo Passo
                        </button>

                    </div>

                    {imagemGrande && (
                        <div className="formannet-modal-fundo" onClick={() => setImagemGrande(null)}>
                            <img
                                src={imagemGrande}
                                alt="Imagem ampliada"
                                className="formannet-modal-imagem"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                </>
            )}

            {/* 🔹 Etapa de confirmação de pagamento */}
            {etapaPagamento && (
                <div ref={pagamentoRef} className="formannet-confirmar-pagamento">
                    <h2>💳 Deseja pagar agora ou depois do serviço?</h2>
                    <p>Escolha a opção que preferir:</p>

                    <div className="formannet-botoes">
                        <button
                            className="formannet-btn"
                            style={{ backgroundColor: "#d4af37" }}
                            onClick={() => {
                                setEtapaPagamento(false);
                                handlePagamentoAgora();
                            }}
                        >
                            💰 Pagar Agora
                        </button>

                        <button
                            className="formannet-btn"
                            style={{ backgroundColor: "#a58e6a" }}
                            onClick={() => salvarAgendamento(0)}
                        >
                            ⏳ Pagar Depois do serviço
                        </button>
                        <br /><br />
                        <button
                            className="formannet-btn-voltar"
                            onClick={() => setEtapaPagamento(false)}
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>
            )}

            {statusPagamento === "aguardando" && (
                <div className="formannet-aguardando">
                    <h2>💅 Aguardando confirmação do pagamento...</h2>
                    <p>O checkout foi aberto em nova aba. Assim que o pagamento for aprovado, volte aqui para confirmar.</p>
                    <div className="formannet-loader"></div>
                </div>
            )}

            {statusPagamento === "aprovado" && (
                <div className="formannet-aprovado">
                    <h2>✅ Agendamento registrado!</h2>
                    <p>Seu agendamento foi salvo com sucesso!, em Perfil pode ver o historico</p>
                    <button onClick={() => setStatusPagamento("inicio")} className="formannet-aprovado-btn">
                        Novo Agendamento
                    </button>
                </div>
            )}
        </main>
    );
}
