import "./portfoliopublico.css";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // 
import { URL } from "../config";
import { QRCodeCanvas } from "qrcode.react";


export default function PortfolioPublico() {
    const [usuarioId, setUsuarioId] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [certificados, setCertificados] = useState([]);
    const [experiencias, setExperiencias] = useState([]);
    const [educacao, setEducacao] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(null); // "exp", "edu", "hab", "cert"
    const modalRef = useRef(null);
    const [mostrarQR, setMostrarQR] = useState(false);

    const buscarPortfolio = async () => {
        if (!usuarioId) {
            setErro("Digite o ID do usuário para buscar o portfólio público.");
            return;
        }

        setErro("");
        setLoading(true);
        setUsuario(null);
        setCertificados([]);
        setExperiencias([]);
        setEducacao([]);
        setHabilidades([]);

        try {
            const res = await fetch(`${URL}/portfolio/publico/${usuarioId}`);
            if (!res.ok) throw new Error("Portfólio não encontrado para este usuário.");
            const data = await res.json();
            setUsuario(data.usuario || null);
            setCertificados(data.certificados || []);
            setExperiencias(data.experiencias || []);
            setEducacao(data.educacao || []);
            setHabilidades(data.habilidades || []);
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    };
    const location = useLocation();
    useEffect(() => {
        if (modalAberto && modalRef.current) {
            setTimeout(() => {
                modalRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Dá uma leve subida extra (50px acima do topo)
                window.scrollBy({ top: -500, behavior: "smooth" });
            }, 150); // pequeno delay pra garantir que o modal renderizou
        }
    }, [modalAberto]);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");
        if (id) {
            setUsuarioId(id);
            buscarPortfolioComId(id);
        }
    }, [location.search]);

    const buscarPortfolioComId = async (idParam) => {
        const id = idParam || usuarioId;
        if (!id) {
            setErro("Digite o ID do usuário para buscar o portfólio público.");
            return;
        }

        setErro("");
        setLoading(true);
        setUsuario(null);
        setCertificados([]);
        setExperiencias([]);
        setEducacao([]);
        setHabilidades([]);

        try {
            const res = await fetch(`${URL}/portfolio/publico/${id}`);
            if (!res.ok) throw new Error("Portfólio não encontrado para este usuário.");
            const data = await res.json();
            setUsuario(data.usuario || null);
            setCertificados(data.certificados || []);
            setExperiencias(data.experiencias || []);
            setEducacao(data.educacao || []);
            setHabilidades(data.habilidades || []);
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return "";
        const data = new Date(dataStr);
        if (isNaN(data)) return dataStr;
        return data.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const copiarEmail = () => {
        if (usuario?.email) {
            navigator.clipboard.writeText(usuario.email);
            alert("📋 Email copiado!");
        }
    };

    return (
        <div className="portfolio-container">
            <h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                🌐 Portfólio Público IronGoals
                <button
                    onClick={() => setMostrarQR(true)}
                    title="Ver QR Code deste portfólio"
                    style={{
                        background: "linear-gradient(90deg, #4ea3ff, #0072ff)",
                        border: "none",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 0 10px rgba(78,163,255,0.4)"
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                    📱 QR Code
                </button>
            </h2>


            <div
                className="busca-publica"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.8rem",
                    marginBottom: "2.5rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "1rem 1.5rem",
                    boxShadow: "0 0 12px rgba(0,0,0,0.3), inset 0 0 8px rgba(255,255,255,0.03)",
                    width: "fit-content",
                    marginInline: "auto",
                    transition: "all 0.3s ease",
                    display: "none"
                }}
            >
                <input
                    type="text"
                    placeholder="Digite o ID do usuário (ex: a00001)"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    style={{
                        padding: "0.7rem 1.2rem",
                        borderRadius: "10px",
                        border: "1px solid rgba(78,163,255,0.5)",
                        width: "400px",
                        fontSize: "1.5rem",
                        background: "rgba(255,255,255,0.08)",
                        color: "#fff",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "inset 0 0 6px rgba(78,163,255,0.15)",
                    }}
                    onFocus={(e) =>
                        (e.target.style.boxShadow = "0 0 10px rgba(78,163,255,0.6)")
                    }
                    onBlur={(e) =>
                        (e.target.style.boxShadow = "inset 0 0 6px rgba(78,163,255,0.15)")
                    }
                />
                <button
                    onClick={buscarPortfolio}
                    style={{
                        background:
                            "linear-gradient(135deg, #4ea3ff 0%, #0072ff 100%)",
                        color: "#fff",
                        fontSize: "1.05rem",
                        padding: "0.7rem 1.4rem",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
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
                    🔍 Buscar
                </button>
            </div>


            {/* 🔹 Mostrar informações do usuário */}
            {usuario && (
                <div
                    className="usuario-info"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.05)",
                        padding: "1.5rem 2rem",
                        borderRadius: "14px",
                        marginBottom: "2.5rem",
                        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                        width: "90%",
                        maxWidth: "1100px",
                        marginInline: "auto",
                    }}
                >
                    <img
                        src={usuario.foto}
                        alt={`${usuario.nome} ${usuario.sobrenome}`}
                        style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #4ea3ff",
                            boxShadow: "0 0 12px rgba(78,163,255,0.4)",
                            marginBottom: "0.8rem",
                        }}
                    />

                    <h3 style={{ margin: 0, color: "#fff", fontSize: "3rem", fontFamily: "initial" }}>
                        {usuario.nome} {usuario.sobrenome}
                    </h3>
                    {/* 🔹 Emprego atual, se existir */}
                    {experiencias.find((exp) => exp.data_fim === "Emprego atual") && (() => {
                        const atual = experiencias.find((exp) => exp.data_fim === "Emprego atual");
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    padding: "0.8rem 1rem",
                                    borderRadius: "12px",
                                    boxShadow: "0 0 10px rgba(78,163,255,0.15)",
                                    border: "1px solid rgba(78,163,255,0.2)",
                                    width: "97%",
                                    maxWidth: "85%",
                                    margin: "1rem auto",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#bcd9ff",
                                        fontSize: "1.35rem",
                                        fontWeight: "500",
                                        margin: 0,
                                        lineHeight: "1.5",
                                        textShadow: "0 0 6px rgba(78,163,255,0.2)",
                                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    }}
                                >
                                    <span style={{ fontSize: "1.6rem" }}></span>{" "}
                                    Trabalha em{" "}
                                    <strong style={{ color: "#ffffff" }}>{atual.empresa}</strong>{" "}
                                    como{" "}
                                    <strong style={{ color: "#ffffff" }}>{atual.cargo}</strong>{" "}
                                    desde{" "}
                                    <span style={{ color: "#a1c4ff", fontWeight: "600" }}>
                                        {(() => {
                                            const data = new Date(atual.data_inicio);
                                            if (!isNaN(data)) {
                                                data.setDate(data.getDate() + 1);
                                                return data.toLocaleDateString("pt-BR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                });
                                            }
                                            return atual.data_inicio;
                                        })()}


                                    </span>
                                    {/* 🔹 Formação atual (se estiver cursando) */}
                                    {educacao.find((ed) => ed.data_fim === "Cursando") && (() => {
                                        const atualEdu = educacao.find((ed) => ed.data_fim === "Cursando");
                                        return (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    textAlign: "center",
                                                    background: "rgba(255, 255, 255, 0.03)",
                                                    padding: "0.8rem 1rem",
                                                    borderRadius: "12px",
                                                    boxShadow: "0 0 10px rgba(78,163,255,0.15)",
                                                    border: "1px solid rgba(78,163,255,0.2)",
                                                    width: "97%",
                                                    maxWidth: "85%",
                                                    margin: "1rem auto",
                                                    transition: "all 0.3s ease",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        color: "#bcd9ff",
                                                        fontSize: "1.35rem",
                                                        fontWeight: "500",
                                                        margin: 0,
                                                        lineHeight: "1.5",
                                                        textShadow: "0 0 6px rgba(78,163,255,0.2)",
                                                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                                    }}
                                                >
                                                    <span style={{ fontSize: "1.6rem" }}></span>{" "}
                                                    Atualmente cursando em{" "}
                                                    <strong style={{ color: "#ffffff" }}>{atualEdu.curso}</strong>{" "}
                                                    desde{" "}
                                                    <span style={{ color: "#a1c4ff", fontWeight: "600" }}>
                                                        {(() => {
                                                            const data = new Date(atualEdu.data_inicio);
                                                            if (!isNaN(data)) {
                                                                data.setDate(data.getDate() + 1); // ➕ soma 1 dia
                                                                return data.toLocaleDateString("pt-BR", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                });
                                                            }
                                                            return atualEdu.data_inicio;
                                                        })()}
                                                    </span>
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </p>
                            </div>
                        );
                    })()}


                    {/* 🔹 Comentário de perfil */}
                    <p
                        style={{
                            fontStyle: "italic",
                            color: "#a6acb6ff",
                            margin: "0.5rem 0 0.8rem",
                            textAlign: "center",
                            maxWidth: "90%",
                        }}
                    >
                        {usuario.comentario_perfil || ""}
                    </p>

                    {/* 🔹 Categoria */}
                    <p
                        style={{
                            color: "#bbcce9ff",
                            fontWeight: "bold",
                            marginBottom: "1rem",
                            fontSize: "2rem",
                            marginTop: "-2px"
                        }}
                    >
                        <span style={{ fontSize: "1rem" }}  > Categoria na IronGoals: </span>  <br /> {usuario.categoria}
                    </p>

                    {/* 🔹 Contatos */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
                        {/* Email visível */}
                        {usuario.email && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.6rem",
                                    fontSize: "1.3rem",
                                    background: "rgba(255,255,255,0.08)",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "8px",
                                }}
                            >
                                <span style={{ color: "#fff", }}>📧 {usuario.email}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(usuario.email);
                                        alert("📋 Email copiado!");
                                    }}
                                    style={{
                                        backgroundColor: "#4ea3ff",
                                        color: "#fff",
                                        padding: "0.3rem 0.7rem",
                                        borderRadius: "6px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1.15rem",
                                    }}
                                >
                                    Copiar
                                </button>
                            </div>
                        )}

                        {/* WhatsApp */}
                        {usuario.whatsapp && (
                            <a
                                href={`https://wa.me/${usuario.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: "#04722cff",
                                    color: "#fff",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontWeight: "bold",
                                    boxShadow: "0 0 8px rgba(37,211,102,0.6)",
                                    fontSize: "1.4rem"
                                }}
                            >
                                💬 WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            )}


            {erro && <p style={{ color: "red" }}>{erro}</p>}
            {loading && <p>Carregando portfólio...</p>}

            {!loading && (experiencias.length > 0 || educacao.length > 0 || habilidades.length > 0 || certificados.length > 0) && (
                <>
                    <div className="portfolio-grid">
                        {/* 🎓 Formação Acadêmica */}
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
                                    </div>
                                ))
                            )}
                            {educacao.length > 3 && (
                                <button className="ver-tudo" onClick={() => setModalAberto("edu")}>
                                    Ver tudo
                                </button>
                            )}
                        </div>

                        {/* ⚙️ Habilidades */}
                        <div className="portfolio-coluna">
                            <h3>⚙️ Habilidades</h3>
                            {habilidades.length === 0 ? (
                                <p className="vazio">Nenhuma habilidade.</p>
                            ) : (
                                habilidades.slice(0, 3).map((h, i) => (
                                    <div key={i} className="item-box">
                                        <strong>{h.habilidade}</strong> — <small>{h.nivel}</small>
                                        <p>{h.observacao}</p>
                                    </div>
                                ))
                            )}
                            {habilidades.length > 3 && (
                                <button className="ver-tudo" onClick={() => setModalAberto("hab")}>
                                    Ver tudo
                                </button>
                            )}
                        </div>

                        {/* 📜 Certificados */}
                        <div className="portfolio-coluna">
                            <h3>📜 Certificados da Plataforma</h3>
                            {certificados.length === 0 ? (
                                <p className="vazio">Nenhum certificado.</p>
                            ) : (
                                certificados.slice(0, 3).map((c, i) => (
                                    <div key={i} className="item-box certificado">
                                        <strong>{c.titulo}</strong>
                                        <br />
                                        <a
                                            className="vercert"
                                            href={`https://www.irongoals.com/historico-certificados/${c.codigo}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver certificado
                                        </a>
                                    </div>
                                ))
                            )}
                            {certificados.length > 3 && (
                                <button className="ver-tudo" onClick={() => setModalAberto("cert")}>
                                    Ver tudo
                                </button>
                            )}
                        </div>
                    </div>


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
                                            {exp.data_fim === "Emprego atual"
                                                ? `Emprego atual desde ${formatarData(
                                                    (() => {
                                                        const data = new Date(exp.data_inicio);
                                                        if (!isNaN(data)) {
                                                            data.setDate(data.getDate() + 1); // ➕ soma 1 dia
                                                            return data.toISOString();
                                                        }
                                                        return exp.data_inicio;
                                                    })()
                                                )}`
                                                : `De ${formatarData(
                                                    (() => {
                                                        const data = new Date(exp.data_inicio);
                                                        if (!isNaN(data)) {
                                                            data.setDate(data.getDate() + 1); // ➕ soma 1 dia
                                                            return data.toISOString();
                                                        }
                                                        return exp.data_inicio;
                                                    })()
                                                )} até ${formatarData(
                                                    (() => {
                                                        const data = new Date(exp.data_fim);
                                                        if (!isNaN(data)) {
                                                            data.setDate(data.getDate() + 1); // ➕ soma 1 dia
                                                            return data.toISOString();
                                                        }
                                                        return exp.data_fim;
                                                    })()
                                                ) || "atual"}`}


                                        </small>

                                        <p>{exp.descricao}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {experiencias.length > 3 && (
                            <button className="ver-tudo" onClick={() => setModalAberto("exp")}>
                                Ver tudo
                            </button>
                        )}


                    </section>
                </>
            )}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(null)}>
                    <div className="modal-conteudo" ref={modalRef}
                        onClick={(e) => e.stopPropagation()}>
                        <button className="fechar" onClick={() => setModalAberto(null)}>✖</button>

                        {modalAberto === "edu" && (
                            <>
                                <h3>🎓 Todas as Formações</h3>
                                {educacao.map((ed, i) => (
                                    <div key={i} className="item-box">
                                        <strong>{ed.curso}</strong>
                                        <small>{ed.instituicao}</small>
                                        <p>{ed.descricao}</p>
                                    </div>
                                ))}
                            </>
                        )}

                        {modalAberto === "hab" && (
                            <>
                                <h3>⚙️ Todas as Habilidades</h3>
                                {habilidades.map((h, i) => (
                                    <div key={i} className="item-box">
                                        <strong>{h.habilidade}</strong> — <small>{h.nivel}</small>
                                        <p>{h.observacao}</p>
                                    </div>
                                ))}
                            </>
                        )}

                        {modalAberto === "cert" && (
                            <>
                                <h3>📜 Todos os Certificados</h3>
                                {certificados.map((c, i) => (
                                    <div key={i} className="item-box certificado">
                                        <strong>{c.titulo}</strong>
                                        <br />
                                        <a
                                            className="vercert"
                                            href={`https://www.irongoals.com/historico-certificados/${c.codigo}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver certificado
                                        </a>
                                    </div>
                                ))}
                            </>
                        )}

                        {modalAberto === "exp" && (
                            <>
                                <h3>🕓 Todas as Experiências</h3>
                                {experiencias.map((exp, i) => (
                                    <div key={i} className="timeline-item">
                                        <strong>{exp.cargo}</strong> <span>{exp.empresa}</span>
                                        <small>
                                            {exp.data_fim === "Emprego atual"
                                                ? `Emprego atual desde ${formatarData(exp.data_inicio)}`
                                                : `De ${formatarData(exp.data_inicio)} até ${formatarData(exp.data_fim) || "atual"}`}
                                        </small>
                                        <p>{exp.descricao}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
            {mostrarQR && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.75)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "",
                        marginTop: "30px",
                        zIndex: 5000,
                    }}
                    onClick={() => setMostrarQR(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            padding: "25px 30px",
                            borderRadius: "18px",
                            textAlign: "center",
                            height: "700px",

                            width: "80%",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
                            position: "relative",
                            animation: "fadeInUp 0.3s ease",
                        }}
                    >
                        <button
                            onClick={() => setMostrarQR(false)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "12px",
                                background: "transparent",
                                border: "none",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#555",
                                cursor: "pointer",
                            }}
                        >
                            ✖
                        </button>
                        <h3 style={{ marginBottom: "1rem", color: "#222" }}>QR Code deste portfólio</h3>
                        <QRCodeCanvas
                            value={window.location.href}
                            size={320}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                        />

                        <p style={{ marginTop: "1rem", fontSize: "1.9rem", color: "#333" }}>
                            Escaneie para abrir este portfólio
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}
