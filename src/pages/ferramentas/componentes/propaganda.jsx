import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./propaganda.css";

export default function Propaganda() {
    const [propagandas, setPropagandas] = useState([]);
    const [loading, setLoading] = useState(true);
    // Lista de conteúdos existentes
    const [listaConteudos, setListaConteudos] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [editarConteudoId, setEditarConteudoId] = useState(null);
    // 🔹 Modal de lista separada
    const [mostrarListaModal, setMostrarListaModal] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [busca, setBusca] = useState("");
    const [plataforma, setPlataforma] = useState("Outros");

    // Modais principais
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);

    // Modal extra (conteúdo interno)
    const [mostrarExtra, setMostrarExtra] = useState(false);
    const [idPropagandaExtra, setIdPropagandaExtra] = useState(null);

    // Campos propaganda
    const [site, setSite] = useState("");
    const [link, setLink] = useState("");
    const [comentario, setComentario] = useState("");
    const [ordem, setOrdem] = useState("");
    const [editarId, setEditarId] = useState(null);

    // Campos modal extra
    const [produto, setProduto] = useState("");
    const [descricao, setDescricao] = useState("");
    const [linkProduto, setLinkProduto] = useState("");
    const [dias, setDias] = useState("");
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(null);

    // 🔹 Buscar propagandas
    const carregarPropagandas = async () => {
        try {
            const res = await fetch(`${URL}/propagandas/`);
            const data = await res.json();
            setPropagandas(data);
        } catch (error) {
            console.error("Erro ao carregar propagandas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPropagandas();
    }, []);

    // 🔹 Adicionar propaganda
    const adicionarPropaganda = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/propagandas/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ site, link, comentario, ordem })
            });
            if (res.ok) {
                fecharModal();
                carregarPropagandas();
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // 🔹 Editar propaganda
    const abrirEditar = (item) => {
        setEditarId(item.id);
        setSite(item.site);
        setLink(item.link);
        setComentario(item.comentario);
        setOrdem(item.ordem);
        setMostrarEditar(true);
    };

    const editarPropaganda = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/propagandas/${editarId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ site, link, comentario, ordem })
            });
            if (res.ok) {
                fecharModal();
                carregarPropagandas();
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // 🔹 Apagar propaganda
    const apagarPropaganda = async (id) => {
        if (!window.confirm("Tem certeza que deseja apagar esta propaganda?")) return;
        try {
            const res = await fetch(`${URL}/propagandas/${id}`, { method: "DELETE" });
            if (res.ok) carregarPropagandas();
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // 🔹 Abrir modal extra
    const abrirModalExtra = (id) => {
        setIdPropagandaExtra(id);
        setMostrarExtra(true);
    };

    // 🔹 Enviar conteúdo extra
    // 🔹 Enviar conteúdo extra
    const enviarConteudoExtra = async (e) => {
        e.preventDefault();

        // Se não tiver imagem nova nem preview anterior → erro
        if (!imagem && !preview) {
            alert("Envie uma imagem antes de salvar!");
            return;
        }

        const formData = new FormData();
        formData.append("produto", produto);
        formData.append("link", linkProduto);
        formData.append("plataforma", plataforma);
        formData.append("descricao", descricao);
        formData.append("dias", dias);

        // 🔹 Só adiciona 'imagem' se for nova
        if (imagem) {
            formData.append("imagem", imagem);
        }

        try {
            const metodo = editarConteudoId ? "PUT" : "POST";
            const url = editarConteudoId
                ? `${URL}/propagandas/conteudo/${editarConteudoId}`
                : `${URL}/propagandas/conteudo/${idPropagandaExtra}`;

            const res = await fetch(url, {
                method: metodo,
                body: formData,
            });

            if (res.ok) {
                alert(editarConteudoId ? "Conteúdo atualizado com sucesso!" : "Conteúdo adicionado com sucesso!");
                fecharModalExtra();
                carregarPropagandas();
                setEditarConteudoId(null);
            } else {
                const erro = await res.text();
                console.error("Erro no servidor:", erro);
                alert("Erro ao enviar conteúdo.");
            }
        } catch (error) {
            console.error("Erro ao enviar conteúdo:", error);
        }
    };


    // 🔹 Fechar modais
    const fecharModal = () => {
        setMostrarModal(false);
        setMostrarEditar(false);
        setSite("");
        setLink("");
        setComentario("");
        setOrdem("");
        setEditarId(null);
    };

    const fecharModalExtra = () => {
        setMostrarExtra(false);
        setProduto("");
        setDescricao("");
        setLinkProduto("");
        setDias("");
        setImagem(null);
        setPreview(null);
    };

    return (
        <div className="propaganda-container">
            <h2 className="propaganda-titulo">Gerenciar Propagandas</h2>

            <button className="propaganda-btn adicionar" onClick={() => setMostrarModal(true)}>
                + Adicionar
            </button>

            {loading ? (
                <p className="propaganda-loading">Carregando...</p>
            ) : (
                <table className="ppropaganda-tabela">
                    <thead className="propaganda-tabela-head">
                        <tr>
                            <th>Site</th>
                            <th>Link</th>
                            <th>Comentário</th>
                            <th>Ordem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className="propaganda-tabela-body">
                        {propagandas.map((item) => (
                            <tr key={item.id} className="propaganda-item">
                                <td>{item.site}</td>
                                <td>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noreferrer">{item.link}</a>
                                    ) : (
                                        <span style={{ color: "#999" }}>Sem link</span>
                                    )}
                                </td>
                                <td>{item.comentario}</td>
                                <td>{item.ordem}</td>
                                <td>
                                    <button className="propaganda-btn editar" onClick={() => abrirEditar(item)}>Editar</button>
                                    <button className="propaganda-btn apagar" onClick={() => apagarPropaganda(item.id)}>Apagar</button>
                                    {!item.link && (
                                        <button
                                            className="propaganda-btn adicionar-extra"
                                            onClick={() => abrirModalExtra(item.id)}
                                        >
                                            Adicionar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 🔹 Modal Adicionar */}
            {mostrarModal && (
                <div className="propaganda-modal-overlay">
                    <div className="propaganda-modal-conteudo">
                        <h3>Adicionar Propaganda</h3>
                        <form className="propaganda-form" onSubmit={adicionarPropaganda}>
                            <label>Site</label>
                            <input className="propaganda-input" value={site} onChange={(e) => setSite(e.target.value)} required />

                            <label>Link</label>
                            <input
                                className="propaganda-input"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Opcional"
                            />

                            <label>Comentário</label>
                            <input className="propaganda-input" value={comentario} onChange={(e) => setComentario(e.target.value)} />

                            <label>Ordem</label>
                            <input className="propaganda-input" value={ordem} onChange={(e) => setOrdem(e.target.value)} required />

                            <div className="propaganda-modal-botoes">
                                <button type="submit" className="propaganda-btn salvar">Salvar</button>
                                <button type="button" className="propaganda-btn cancelar" onClick={fecharModal}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔹 Modal Editar */}
            {mostrarEditar && (
                <div className="propaganda-modal-overlay">
                    <div className="propaganda-modal-conteudo">
                        <h3>Editar Propaganda</h3>
                        <form className="propaganda-form" onSubmit={editarPropaganda}>
                            <label>Site</label>
                            <input className="propaganda-input" value={site} onChange={(e) => setSite(e.target.value)} required />

                            <label>Link</label>
                            <input
                                className="propaganda-input"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Opcional"
                            />

                            <label>Comentário</label>
                            <input className="propaganda-input" value={comentario} onChange={(e) => setComentario(e.target.value)} />

                            <label>Ordem</label>
                            <input className="propaganda-input" value={ordem} onChange={(e) => setOrdem(e.target.value)} required />

                            <div className="propaganda-modal-botoes">
                                <button type="submit" className="propaganda-btn salvar">Salvar</button>
                                <button type="button" className="propaganda-btn cancelar" onClick={fecharModal}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔹 Modal Extra */}
            {mostrarExtra && (
                <div className="propaganda-modal-overlay">
                    <div className="propaganda-modal-conteudo">
                        <h3>Adicionar Conteúdo Interno</h3>

                        {/* 🔸 Botão para listar todos os conteúdos dessa propaganda */}
                        {/* 🔸 Botão para abrir lista em modal separado */}
                        <button
                            type="button"
                            className="propaganda-btn ver-lista"
                            onClick={async () => {
                                try {
                                    const res = await fetch(`${URL}/propagandas/conteudo/${idPropagandaExtra}`);
                                    if (res.ok) {
                                        const data = await res.json();
                                        setListaConteudos(data);
                                        setPaginaAtual(1);
                                        setBusca("");
                                        setMostrarListaModal(true);
                                    }
                                } catch (error) {
                                    console.error("Erro ao carregar lista de conteúdos:", error);
                                }
                            }}
                        >
                            📋 Ver lista de conteúdos
                        </button>


                        {/* 🔹 Lista de conteúdos existentes */}
                        {mostrarLista && listaConteudos.length > 0 && (
                            <div className="lista-conteudos">
                                {listaConteudos.map((item) => (
                                    <div key={item.id} className="conteudo-card">
                                        <img src={item.imagem_url} alt={item.produto} />
                                        <div className="conteudo-info">
                                            <h4>{item.produto}</h4>
                                            <p>{item.descricao || "Sem descrição"}</p>
                                            <p><strong>{item.dias}</strong> dias</p>
                                            <div className="conteudo-botoes">
                                                <button
                                                    className="propaganda-btn editar"
                                                    onClick={() => {
                                                        setProduto(item.produto);
                                                        setDescricao(item.descricao);
                                                        setLinkProduto(item.link);
                                                        setDias(item.dias);
                                                        setPreview(item.imagem_url);
                                                        setEditarConteudoId(item.id);
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="propaganda-btn apagar"
                                                    onClick={async () => {
                                                        if (!window.confirm("Apagar este conteúdo?")) return;
                                                        try {
                                                            const res = await fetch(`${URL}/propagandas/conteudo/${item.id}`, {
                                                                method: "DELETE",
                                                            });
                                                            if (res.ok) {
                                                                setListaConteudos((prev) =>
                                                                    prev.filter((c) => c.id !== item.id)
                                                                );
                                                            }
                                                        } catch (error) {
                                                            console.error("Erro ao apagar conteúdo:", error);
                                                        }
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form className="propaganda-form" onSubmit={enviarConteudoExtra}>
                            <label>Imagem</label>
                            <div
                                className="upload-area"
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    setImagem(file);
                                    setPreview(URL.createObjectURL(file));
                                }}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImagem(file);
                                        setPreview(URL.createObjectURL(file));
                                    }}
                                />
                                {preview ? (
                                    <img src={preview} alt="Preview" className="upload-preview" />
                                ) : (
                                    <p>Arraste ou clique para enviar imagem</p>
                                )}
                            </div>

                            <label>Produto</label>
                            <input className="propaganda-input" value={produto} onChange={(e) => setProduto(e.target.value)} required />

                            <label>Link</label>
                            <input className="propaganda-input" value={linkProduto} onChange={(e) => setLinkProduto(e.target.value)} placeholder="Opcional" />
                            <label>Plataforma</label>
                            <select
                                className="propaganda-input"
                                value={plataforma}
                                onChange={(e) => setPlataforma(e.target.value)}
                                required
                            >
                                <option value="Shopee">Shopee</option>
                                <option value="Mercado Livre">Mercado Livre</option>
                                <option value="Amazon">Amazon</option>
                                <option value="Outros">Outros</option>
                            </select>

                            <label>Descrição</label>
                            <textarea className="propaganda-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

                            <label>Tempo (dias)</label>
                            <input type="number" className="propaganda-input" value={dias} onChange={(e) => setDias(e.target.value)} required />

                            <div className="propaganda-modal-botoes">
                                <button type="submit" className="propaganda-btn salvar">Salvar</button>
                                <button type="button" className="propaganda-btn cancelar" onClick={fecharModalExtra}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* 🔹 Modal de Lista de Conteúdos */}
            {mostrarListaModal && (
                <div className="propaganda-modal-overlay">
                    <div className="propaganda-modal-lista">
                        <h3>Lista de Conteúdos</h3>

                        {/* Campo de busca */}
                        <input
                            type="text"
                            className="propaganda-input"
                            placeholder="Buscar produto..."
                            value={busca}
                            onChange={(e) => {
                                setBusca(e.target.value.toLowerCase());
                                setPaginaAtual(1);
                            }}
                            style={{ marginBottom: "10px" }}
                        />

                        {/* Lista filtrada e paginada */}
                        <div className="lista-conteudos">
                            {listaConteudos
                                .filter((c) => c.produto.toLowerCase().includes(busca))
                                .slice((paginaAtual - 1) * 10, paginaAtual * 10)
                                .map((item) => (
                                    <div key={item.id} className="conteudo-card">
                                        <img src={item.imagem_url} alt={item.produto} />
                                        <div className="conteudo-info">
                                            <h4>{item.produto}</h4>
                                            <p>{item.descricao || "Sem descrição"}</p>
                                            <p><strong>{item.dias}</strong> dias</p>
                                            <div className="conteudo-botoes">
                                                <button
                                                    className="propaganda-btn editar"
                                                    onClick={() => {
                                                        setProduto(item.produto);
                                                        setDescricao(item.descricao);
                                                        setLinkProduto(item.link);
                                                        setDias(item.dias);
                                                        setPreview(item.imagem_url);
                                                        setEditarConteudoId(item.id);
                                                        setMostrarListaModal(false);
                                                        setMostrarExtra(true);
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="propaganda-btn apagar"
                                                    onClick={async () => {
                                                        if (!window.confirm("Apagar este conteúdo?")) return;
                                                        try {
                                                            const res = await fetch(`${URL}/propagandas/conteudo/${item.id}`, {
                                                                method: "DELETE",
                                                            });
                                                            if (res.ok) {
                                                                setListaConteudos((prev) =>
                                                                    prev.filter((c) => c.id !== item.id)
                                                                );
                                                            }
                                                        } catch (error) {
                                                            console.error("Erro ao apagar conteúdo:", error);
                                                        }
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Paginação */}
                        <div className="paginacao-botoes">
                            <button
                                className="propaganda-btn cancelar"
                                disabled={paginaAtual === 1}
                                onClick={() => setPaginaAtual(paginaAtual - 1)}
                            >
                                ◀ Anteriores
                            </button>
                            <button
                                className="propaganda-btn salvar"
                                disabled={paginaAtual * 10 >= listaConteudos.length}
                                onClick={() => setPaginaAtual(paginaAtual + 1)}
                            >
                                Próximos ▶
                            </button>
                        </div>

                        <div className="propaganda-modal-botoes">
                            <button
                                type="button"
                                className="propaganda-btn cancelar"
                                onClick={() => setMostrarListaModal(false)}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
