import { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./ireneconfig.css";
import IreneFormulario from "./ireneformulario";
import IreneConversaModal from "./ireneconversamodal";

export default function IreneConfig() {
    const [respostas, setRespostas] = useState([]);
    const [perguntas, setPerguntas] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [naoEncontradas, setNaoEncontradas] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState("respostas");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editarDados, setEditarDados] = useState(null);
    const [pagina, setPagina] = useState(0);

    // Novo estado para abrir modal de conversa
    const [mostrarConversa, setMostrarConversa] = useState(null);

    const paginar = (lista) => {
        const inicio = pagina * 5;
        return lista.slice(inicio, inicio + 5);
    };

    // Estado para confirmar exclusão
    const [confirmarDelete, setConfirmarDelete] = useState(null);

    // 🔹 Carregar dados
    const carregarRespostas = async () => {
        const res = await fetch(`${URL}/irene_admin/respostas`);
        setRespostas(await res.json());
    };

    const carregarPerguntas = async () => {
        const res = await fetch(`${URL}/irene_admin/perguntas`);
        setPerguntas(await res.json());
    };

    const carregarKeywords = async () => {
        const res = await fetch(`${URL}/irene_admin/keywords`);
        setKeywords(await res.json());
    };

    const carregarNaoEncontradas = async () => {
        const res = await fetch(`${URL}/irene_admin/nao_encontradas`);
        setNaoEncontradas(await res.json());
    };

    useEffect(() => {
        carregarRespostas();
        carregarPerguntas();
        carregarKeywords();
        carregarNaoEncontradas();
    }, []);

    // 🔹 Função para abrir formulário (criar ou editar)
    const abrirFormulario = async (tipo, item = null) => {
        if (tipo === "criar") {
            setEditarDados({
                id: null,
                resposta: "",
                perguntas: [{ id: null, texto: "" }],
                keywords: [{ id: null, texto: "" }],
            });
            setMostrarFormulario(true);
            return;
        }

        if (tipo === "editar" && item?.id) {
            try {
                let faqId = null;

                if (abaAtiva === "respostas") {
                    faqId = item.id;
                } else if (abaAtiva === "perguntas") {
                    faqId = item.faq_id;
                } else if (abaAtiva === "keywords") {
                    faqId = item.faq_id;
                }

                if (!faqId) {
                    console.error("Não foi possível determinar o faq_id");
                    return;
                }

                // 🔹 busca pacote completo pelo faq_id
                const res = await fetch(`${URL}/irene_admin/resposta/${faqId}`);
                const dados = await res.json();

                setEditarDados({
                    id: dados.resposta.id,
                    resposta: dados.resposta.resposta,
                    perguntas: dados.perguntas.map((p) => ({
                        id: p.id,
                        texto: p.pergunta,
                    })),
                    keywords: dados.keywords.map((k) => ({
                        id: k.id,
                        texto: k.palavra,
                    })),
                });

                setMostrarFormulario(true);
            } catch (err) {
                console.error("Erro ao carregar dados para edição:", err);
            }
        }
    };

    // 🔹 Handler genérico para apagar (com 2 cliques)
    const handleDelete = async (id, endpoint, reloadFn) => {
        if (confirmarDelete === id) {
            await fetch(`${URL}/irene_admin/${endpoint}/${id}`, {
                method: "DELETE",
            });
            reloadFn();
            setConfirmarDelete(null); // reseta
        } else {
            setConfirmarDelete(id); // 1º clique
            setTimeout(() => {
                setConfirmarDelete(null); // reseta após 2s se não confirmar
            }, 2000);
        }
    };

    // 🔹 Avançar página
    const avancarPagina = (total) => {
        if ((pagina + 1) * 5 < total) {
            setPagina(pagina + 1);
        } else {
            setPagina(0);
        }
    };

    return (
        <div className="irene-config">
            <h2>⚙️ Configuração da Irene</h2>
            <button onClick={() => abrirFormulario("criar")}>
                ➕ Nova Resposta
            </button>

            {/* 🔹 Botões de navegação */}
            <div className="irene-tabs">
                <button
                    className={abaAtiva === "perguntas" ? "ativo" : ""}
                    onClick={() => { setAbaAtiva("perguntas"); setPagina(0); }}
                >
                    Perguntas
                </button>
                <button
                    className={abaAtiva === "respostas" ? "ativo" : ""}
                    onClick={() => { setAbaAtiva("respostas"); setPagina(0); }}
                >
                    Respostas
                </button>
                <button
                    className={abaAtiva === "keywords" ? "ativo" : ""}
                    onClick={() => { setAbaAtiva("keywords"); setPagina(0); }}
                >
                    Keywords
                </button>
                <button
                    className={abaAtiva === "naoRespondidas" ? "ativo" : ""}
                    onClick={() => { setAbaAtiva("naoRespondidas"); setPagina(0); }}
                >
                    Não Respondidas ({naoEncontradas.length})
                </button>
            </div>

            {/* 🔹 Conteúdo das abas */}
            <div className="irene-conteudo">
                {abaAtiva === "perguntas" && (
                    <>
                        <ul>
                            {paginar(perguntas).map((p) => (
                                <li key={p.id}>
                                    <span className="texto">{p.pergunta}</span>
                                    <div className="acoes">
                                        <button
                                            className="editar"
                                            onClick={() => abrirFormulario("editar", p)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="apagar"
                                            onClick={() =>
                                                handleDelete(p.id, "pergunta", carregarPerguntas)
                                            }
                                        >
                                            {confirmarDelete === p.id ? "❗ Confirmar" : "🗑️ Apagar"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {perguntas.length > 5 && (
                            <button className="proximos-btn" onClick={() => avancarPagina(perguntas.length)}>
                                👉 Próximos 5
                            </button>
                        )}
                    </>
                )}

                {abaAtiva === "respostas" && (
                    <>
                        <ul>
                            {paginar(respostas).map((r) => (
                                <li key={r.id}>
                                    <span className="texto">{r.resposta}</span>
                                    <div className="acoes">
                                        <button className="editar" onClick={() => abrirFormulario("editar", r)}>✏️ Editar</button>
                                        <button className="apagar" onClick={() => handleDelete(r.id, "resposta", carregarRespostas)}>
                                            {confirmarDelete === r.id ? "❗ Confirmar" : "🗑️ Apagar"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {respostas.length > 5 && (
                            <button className="proximos-btn" onClick={() => avancarPagina(respostas.length)}>
                                👉 Próximos 5
                            </button>
                        )}
                    </>
                )}

                {abaAtiva === "keywords" && (
                    <>
                        <ul>
                            {paginar(keywords).map((k) => (
                                <li key={k.id}>
                                    <span className="texto">{k.palavra}</span>
                                    <div className="acoes">
                                        <button
                                            className="editar"
                                            onClick={() => abrirFormulario("editar", k)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="apagar"
                                            onClick={() =>
                                                handleDelete(k.id, "keyword", carregarKeywords)
                                            }
                                        >
                                            {confirmarDelete === k.id ? "❗ Confirmar" : "🗑️ Apagar"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {keywords.length > 5 && (
                            <button className="proximos-btn" onClick={() => avancarPagina(keywords.length)}>
                                👉 Próximos 5
                            </button>
                        )}
                    </>
                )}

                {abaAtiva === "naoRespondidas" && (
                    <>
                        <ul>
                            {paginar(naoEncontradas).map((n) => (
                                <li key={n.id}>
                                    <span className="texto">{n.pergunta}</span>
                                    <div className="acoes">
                                        <button
                                            className="editar"
                                            onClick={() => setMostrarConversa(n)}
                                        >
                                            Ver conversa
                                        </button>
                                        <button
                                            className="apagar"
                                            onClick={() =>
                                                handleDelete(
                                                    n.id,
                                                    "nao_encontradas",
                                                    carregarNaoEncontradas
                                                )
                                            }
                                        >
                                            {confirmarDelete === n.id ? "❗ Confirmar" : "🗑️ Apagar"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {naoEncontradas.length > 5 && (
                            <button className="proximos-btn" onClick={() => avancarPagina(naoEncontradas.length)}>
                                👉 Próximos 5
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* 🔹 Modal da conversa */}
            {mostrarConversa && (
                <IreneConversaModal
                    dados={mostrarConversa}
                    onClose={() => setMostrarConversa(null)}
                    onResponder={(n) => {
                        setEditarDados({
                            id: null,
                            resposta: "",
                            perguntas: [{ id: null, texto: n.pergunta }],
                            keywords: [{ id: null, texto: "" }],
                            naoRespondidaId: n.id,
                        });
                        setMostrarConversa(null);
                        setMostrarFormulario(true);
                    }}
                />
            )}

            {/* 🔹 Formulário (criar/editar) */}
            {mostrarFormulario && (
                <IreneFormulario
                    modo={editarDados?.id ? "editar" : "criar"}
                    dados={editarDados}
                    onClose={() => setMostrarFormulario(false)}
                    onSaved={() => {
                        carregarRespostas();
                        carregarPerguntas();
                        carregarKeywords();
                        carregarNaoEncontradas();
                    }}
                />
            )}
        </div>
    );
}
