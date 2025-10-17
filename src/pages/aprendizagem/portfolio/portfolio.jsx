import "./portfolio.css";
import { useEffect, useState, useRef } from "react";
import { URL } from "../../../config";
import PortfolioLinhas from "./portfoliolinhas";

export default function Portfolio() {
    const [certificados, setCertificados] = useState([]);
    const [experiencias, setExperiencias] = useState([]);
    const [educacao, setEducacao] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const modalRef = useRef(null);

    const [formAberto, setFormAberto] = useState(null); // "exp", "edu", "hab"
    const [modal, setModal] = useState(null); // "exp", "edu", "hab", "cert"

    const [novaExp, setNovaExp] = useState({ id: null, empresa: "", cargo: "", data_inicio: "", data_fim: "", descricao: "" });
    const [novaEdu, setNovaEdu] = useState({ id: null, instituicao: "", curso: "", data_inicio: "", data_fim: "", descricao: "" });
    const [novaHab, setNovaHab] = useState({ id: null, habilidade: "", nivel: "Básico", observacao: "" });

    // 🔹 Refs para rolar até os formulários
    const refExp = useRef(null);
    const refEdu = useRef(null);
    const refHab = useRef(null);

    useEffect(() => {
        carregarTudo();
    }, []);

    // 🔹 Faz o modal rolar para o topo ao abrir
    useEffect(() => {
        if (modal && modalRef.current) {
            setTimeout(() => {
                modalRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Sobe um pouco mais pra centralizar melhor
                window.scrollBy({ top: -500, behavior: "smooth" });
            }, 150);
        }
    }, [modal]);
    const carregarTudo = async () => {
        try {
            const usuarioId = localStorage.getItem("usuario_id");
            if (!usuarioId) throw new Error("Usuário não definido");

            const res = await fetch(`${URL}/portfolio/publico/${usuarioId}`);
            if (!res.ok) throw new Error(`Erro ao buscar dados (${res.status})`);

            const data = await res.json();

            console.log("📦 Dados carregados:", data);

            setExperiencias(data.experiencias || []);
            setEducacao(data.educacao || []);
            setCertificados(data.certificados || []);
            setHabilidades(data.habilidades || []);

        } catch (error) {
            console.error("Erro ao carregar portfólio:", error);
        } finally {
            // 🔹 garante que o “Carregando...” desapareça
            setLoading(false);
        }
    };


    useEffect(() => {
        const fechar = () => setModal(null);
        window.addEventListener("fecharModal", fechar);
        return () => window.removeEventListener("fecharModal", fechar);
    }, []);
    const editarItem = (tipo, item) => {
        setFormAberto(tipo);

        const scrollComOffset = (ref) => {
            setTimeout(() => {
                if (ref.current) {
                    const y = ref.current.getBoundingClientRect().top + window.scrollY - 120; // 🔹 ajuste aqui
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            }, 200);
        };

        if (tipo === "exp") {
            setNovaExp(item);
            scrollComOffset(refExp);
        }
        if (tipo === "edu") {
            setNovaEdu(item);
            scrollComOffset(refEdu);
        }
        if (tipo === "hab") {
            setNovaHab(item);
            scrollComOffset(refHab);
        }

        setModal(null);
    };


    const apagarItem = async (tipo, id) => {
        if (!window.confirm("Tem certeza que deseja apagar este item?")) return;
        const token = localStorage.getItem("token");
        let rota = "";
        if (tipo === "exp") rota = "experiencias";
        if (tipo === "edu") rota = "educacao";
        if (tipo === "hab") rota = "habilidades";

        await fetch(`${URL}/portfolio/${rota}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        carregarTudo();
    };

    const enviarExperiencia = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const metodo = novaExp.id ? "PUT" : "POST";
        const url = novaExp.id ? `${URL}/portfolio/experiencias/${novaExp.id}` : `${URL}/portfolio/experiencias`;
        const formData = new FormData();
        Object.entries(novaExp).forEach(([k, v]) => formData.append(k, v));

        await fetch(url, { method: metodo, headers: { Authorization: `Bearer ${token}` }, body: formData });
        setNovaExp({ id: null, empresa: "", cargo: "", data_inicio: "", data_fim: "", descricao: "" });
        carregarTudo();
    };

    const enviarEducacao = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const metodo = novaEdu.id ? "PUT" : "POST";
        const url = novaEdu.id ? `${URL}/portfolio/educacao/${novaEdu.id}` : `${URL}/portfolio/educacao`;
        const formData = new FormData();
        Object.entries(novaEdu).forEach(([k, v]) => formData.append(k, v));

        await fetch(url, { method: metodo, headers: { Authorization: `Bearer ${token}` }, body: formData });
        setNovaEdu({ id: null, instituicao: "", curso: "", data_inicio: "", data_fim: "", descricao: "" });
        carregarTudo();
    };

    const enviarHabilidade = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const metodo = novaHab.id ? "PUT" : "POST";
        const url = novaHab.id ? `${URL}/portfolio/habilidades/${novaHab.id}` : `${URL}/portfolio/habilidades`;
        const formData = new FormData();
        Object.entries(novaHab).forEach(([k, v]) => formData.append(k, v));

        await fetch(url, { method: metodo, headers: { Authorization: `Bearer ${token}` }, body: formData });
        setNovaHab({ id: null, habilidade: "", nivel: "Básico", observacao: "" });
        carregarTudo();
    };

    return (
        <div className="portfolio-container">
            <h2>💼 Meu Portfólio Profissional</h2>
            {/* 🔹 Botão para copiar link público */}
            <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                <button
                    onClick={() => {
                        const id = localStorage.getItem("usuario_id"); // ✅ agora está certo
                        if (!id) {
                            alert("❗ ID do usuário não encontrado. Faça login novamente.");
                            return;
                        }
                        const baseUrl = window.location.origin;
                        const link = `${baseUrl}/portfolio-publico?id=${id}`;
                        navigator.clipboard.writeText(link);
                        alert("📋 Link do portfólio público copiado!");
                    }}
                    style={{
                        background: "linear-gradient(135deg, #4ea3ff, #0072ff)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "0.6rem 1rem",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(78,163,255,0.35)",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.08)";
                        e.target.style.boxShadow = "0 0 15px rgba(78,163,255,0.6)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 4px 12px rgba(78,163,255,0.35)";
                    }}
                >
                    🔗 Copiar link Portfolio Público
                </button>
            </div>


            <p>Gerencie suas experiências, formações, habilidades e certificados.</p>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <div className="portfolio-botoes">
                        <button onClick={() => setFormAberto(formAberto === "exp" ? null : "exp")} className={formAberto === "exp" ? "ativo" : ""}>🧰 Experiências Profissionais</button>
                        <button onClick={() => setFormAberto(formAberto === "edu" ? null : "edu")} className={formAberto === "edu" ? "ativo" : ""}>🎓 Formação Acadêmica</button>
                        <button onClick={() => setFormAberto(formAberto === "hab" ? null : "hab")} className={formAberto === "hab" ? "ativo" : ""}>⚙️ Habilidades e Competências</button>
                    </div>

                    {/* === FORMULÁRIOS === */}
                    {formAberto === "exp" && (
                        <form ref={refExp} className="portfolio-form" onSubmit={enviarExperiencia}>
                            <input type="text" placeholder="Empresa" required value={novaExp.empresa} onChange={(e) => setNovaExp({ ...novaExp, empresa: e.target.value })} />
                            <input type="text" placeholder="Cargo" required value={novaExp.cargo} onChange={(e) => setNovaExp({ ...novaExp, cargo: e.target.value })} />
                            <div className="data-group">
                                <label>Início:</label>
                                <input
                                    type="date"
                                    value={novaExp.data_inicio}
                                    onChange={(e) => setNovaExp({ ...novaExp, data_inicio: e.target.value })}
                                />
                                <label>Fim:</label>
                                <input
                                    type="date"
                                    disabled={novaExp.data_fim === "Emprego atual"}
                                    value={
                                        novaExp.data_fim === "Emprego atual"
                                            ? ""
                                            : novaExp.data_fim
                                    }
                                    onChange={(e) => setNovaExp({ ...novaExp, data_fim: e.target.value })}
                                />

                                <div className="check-atual">
                                    <input
                                        type="checkbox"
                                        id="empregoAtual"
                                        checked={novaExp.data_fim === "Emprego atual"}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setNovaExp({ ...novaExp, data_fim: "Emprego atual" });
                                            } else {
                                                setNovaExp({ ...novaExp, data_fim: "" });
                                            }
                                        }}
                                    />
                                    <label htmlFor="empregoAtual">Emprego atual</label>
                                </div>


                            </div>

                            <textarea placeholder="Descrição das atividades" value={novaExp.descricao} onChange={(e) => setNovaExp({ ...novaExp, descricao: e.target.value })}></textarea>
                            <button type="submit">{novaExp.id ? "💾 Atualizar Experiência" : "💾 Adicionar Experiência"}</button>
                        </form>
                    )}

                    {formAberto === "edu" && (
                        <form ref={refEdu} className="portfolio-form" onSubmit={enviarEducacao}>
                            <input type="text" placeholder="Instituição" required value={novaEdu.instituicao} onChange={(e) => setNovaEdu({ ...novaEdu, instituicao: e.target.value })} />
                            <input type="text" placeholder="Curso" required value={novaEdu.curso} onChange={(e) => setNovaEdu({ ...novaEdu, curso: e.target.value })} />
                            <div className="data-group">
                                <label>Início:</label>
                                <input type="date" value={novaEdu.data_inicio} onChange={(e) => setNovaEdu({ ...novaEdu, data_inicio: e.target.value })} />
                                <label>Fim:</label>
                                <input type="date" value={novaEdu.data_fim} onChange={(e) => setNovaEdu({ ...novaEdu, data_fim: e.target.value })} />
                            </div>
                            <textarea placeholder="Descrição ou foco do curso" value={novaEdu.descricao} onChange={(e) => setNovaEdu({ ...novaEdu, descricao: e.target.value })}></textarea>
                            <button type="submit">{novaEdu.id ? "💾 Atualizar Formação" : "💾 Adicionar Formação"}</button>
                        </form>
                    )}

                    {formAberto === "hab" && (
                        <form ref={refHab} className="portfolio-form" onSubmit={enviarHabilidade}>
                            <input type="text" placeholder="Habilidade" required value={novaHab.habilidade} onChange={(e) => setNovaHab({ ...novaHab, habilidade: e.target.value })} />
                            <select value={novaHab.nivel} onChange={(e) => setNovaHab({ ...novaHab, nivel: e.target.value })}>
                                <option value="Básico">Básico</option>
                                <option value="Intermediário">Intermediário</option>
                                <option value="Avançado">Avançado</option>
                            </select>
                            <textarea placeholder="Observação (opcional)" value={novaHab.observacao} onChange={(e) => setNovaHab({ ...novaHab, observacao: e.target.value })}></textarea>
                            <button type="submit">{novaHab.id ? "💾 Atualizar Habilidade" : "💾 Adicionar Habilidade"}</button>
                        </form>
                    )}

                    {/* === CONTEÚDO PRINCIPAL === */}
                    <div className="portfolio-grid">
                        {/* FORMAÇÃO */}
                        <div className="portfolio-coluna">
                            <h3>🎓 Formação Acadêmica</h3>
                            {educacao.length === 0 ? (
                                <p className="vazio">Nenhuma formação.</p>
                            ) : (
                                educacao.slice(0, 3).map((ed, i) => (
                                    <div key={i} className="item-box">
                                        <strong>{ed.curso}</strong>
                                        <small>{ed.instituicao}</small>
                                        <p>{ed.descricao}</p>
                                        <div className="acoes-linha">
                                            <button onClick={() => editarItem("edu", ed)}>✏️</button>
                                            <button onClick={() => apagarItem("edu", ed.id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                            <button className="ver-tudo" onClick={() => setModal("edu")}>Ver tudo</button>
                        </div>

                        {/* HABILIDADES */}
                        <div className="portfolio-coluna">
                            <h3>⚙️ Habilidades</h3>
                            {habilidades.length === 0 ? (
                                <p className="vazio">Nenhuma habilidade.</p>
                            ) : (
                                habilidades.slice(0, 3).map((h, i) => (
                                    <div key={i} className="item-box">
                                        <strong>{h.habilidade}</strong> — <small>{h.nivel}</small>
                                        <p>{h.observacao}</p>
                                        <div className="acoes-linha">
                                            <button onClick={() => editarItem("hab", h)}>✏️</button>
                                            <button onClick={() => apagarItem("hab", h.id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                            <button className="ver-tudo" onClick={() => setModal("hab")}>Ver tudo</button>
                        </div>

                        {/* CERTIFICADOS */}
                        <div className="portfolio-coluna">
                            <h3>📜 Certificados da Plataforma</h3>
                            {certificados.length === 0 ? (
                                <p className="vazio">Nenhum certificado.</p>
                            ) : (
                                certificados.slice(0, 3).map((c, i) => (
                                    <div key={i} className="item-box certificado">
                                        <strong>{c.titulo}</strong>
                                        <br />
                                        <a className="vercert" href={`https://www.irongoals.com/historico-certificados/${c.codigo}`} target="_blank" rel="noopener noreferrer">
                                            Ver certificado
                                        </a>
                                    </div>
                                ))
                            )}
                            <button className="ver-tudo" onClick={() => setModal("cert")}>Ver tudo</button>
                        </div>
                    </div>

                    {/* LINHA DO TEMPO */}
                    <section className="timeline-section">
                        <h3>🕓 Linha do Tempo Profissional</h3>
                        <div className="timeline-limite">
                            {experiencias.length === 0 ? (
                                <p>Nenhuma experiência adicionada.</p>
                            ) : (
                                experiencias.slice(0, 3).map((exp, i) => (
                                    <div key={i} className="timeline-item">
                                        <strong>{exp.cargo}</strong> <span>{exp.empresa}</span>
                                        <small>
                                            {(() => {
                                                // Função para formatar a data em "1 de janeiro de 2015"
                                                const formatarData = (dataStr) => {
                                                    if (!dataStr) return "";
                                                    const data = new Date(dataStr);
                                                    if (isNaN(data)) return dataStr; // caso seja "Emprego atual"
                                                    return data.toLocaleDateString("pt-BR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    });
                                                };

                                                const inicio = formatarData(exp.data_inicio);
                                                const fim = exp.data_fim === "Emprego atual"
                                                    ? "Emprego atual"
                                                    : formatarData(exp.data_fim);

                                                const adicionarUmDia = (dataStr) => {
                                                    if (!dataStr) return "";
                                                    const data = new Date(dataStr);
                                                    if (isNaN(data)) return dataStr;
                                                    data.setDate(data.getDate() + 1);
                                                    return data.toLocaleDateString("pt-BR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    });
                                                };

                                                const inicioCorrigido = adicionarUmDia(exp.data_inicio);
                                                const fimCorrigido =
                                                    exp.data_fim === "Emprego atual" ? "Emprego atual" : adicionarUmDia(exp.data_fim);

                                                return exp.data_fim === "Emprego atual"
                                                    ? `${fimCorrigido} desde ${inicioCorrigido}`
                                                    : `Desde ${inicioCorrigido} até ${fimCorrigido || "atual"}`;
                                            })()}
                                        </small>

                                        <p>{exp.descricao}</p>
                                        <div className="acoes-linha">
                                            <button onClick={() => editarItem("exp", exp)}>✏️</button>
                                            <button onClick={() => apagarItem("exp", exp.id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="ver-tudo" onClick={() => setModal("exp")}>Ver tudo</button>
                    </section>

                    {/* === MODAIS === */}
                    <div ref={modalRef}>
                        <PortfolioLinhas
                            modal={modal}
                            experiencias={experiencias}
                            educacao={educacao}
                            habilidades={habilidades}
                            certificados={certificados}
                            editarItem={(tipo, item) => tipo ? editarItem(tipo, item) : setModal(null)}
                            apagarItem={apagarItem}
                        />
                    </div>

                </>
            )}
        </div>
    );
}
