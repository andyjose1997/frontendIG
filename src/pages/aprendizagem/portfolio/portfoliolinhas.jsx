// src/pages/portfolio/portfoliolinhas.jsx
export default function PortfolioLinhas({ modal, experiencias, educacao, habilidades, certificados, editarItem, apagarItem }) {
    if (!modal) return null;

    // função dedicada apenas para fechar o modal
    const fecharModal = () => window.dispatchEvent(new Event("fecharModal"));

    return (
        <div className="modal-overlay" onClick={fecharModal}>
            <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                <button className="fechar" onClick={fecharModal}>✖</button>

                {modal === "exp" && (
                    <>
                        <h3>🧰 Todas as Experiências Profissionais</h3>
                        {experiencias.map((exp) => (
                            <div key={exp.id} className="timeline-item">
                                <strong>{exp.cargo}</strong> — {exp.empresa}
                                <small>{exp.data_inicio} até {exp.data_fim || "atual"}</small>
                                <p>{exp.descricao}</p>
                                <div className="acoes-linha">
                                    <button onClick={() => editarItem("exp", exp)}>✏️ Editar</button>
                                    <button onClick={() => apagarItem("exp", exp.id)}>🗑️ Apagar</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {modal === "edu" && (
                    <>
                        <h3>🎓 Todas as Formações Acadêmicas</h3>
                        {educacao.map((ed) => (
                            <div key={ed.id} className="item-box">
                                <strong>{ed.curso}</strong>
                                <small>{ed.instituicao}</small>
                                <p>{ed.descricao}</p>
                                <div className="acoes-linha">
                                    <button onClick={() => editarItem("edu", ed)}>✏️ Editar</button>
                                    <button onClick={() => apagarItem("edu", ed.id)}>🗑️ Apagar</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {modal === "hab" && (
                    <>
                        <h3>⚙️ Todas as Habilidades</h3>
                        {habilidades.map((h) => (
                            <div key={h.id} className="item-box">
                                <strong>{h.habilidade}</strong> — {h.nivel}
                                <p>{h.observacao}</p>
                                <div className="acoes-linha">
                                    <button onClick={() => editarItem("hab", h)}>✏️ Editar</button>
                                    <button onClick={() => apagarItem("hab", h.id)}>🗑️ Apagar</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {modal === "cert" && (
                    <>
                        <h3>📜 Todos os Certificados</h3>
                        {certificados.map((c) => (
                            <div key={c.id} className="item-box certificado">
                                <strong>{c.titulo}</strong>
                                <br />
                                <a href={`https://www.irongoals.com/historico-certificados/${c.codigo}`} target="_blank" rel="noopener noreferrer">
                                    Ver certificado
                                </a>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
