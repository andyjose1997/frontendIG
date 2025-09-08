import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./Propaganda.css";

export default function Propaganda() {
    const [propagandas, setPropagandas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado modal Adicionar
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado modal Editar
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [editarId, setEditarId] = useState(null);

    // Campos do formulário
    const [site, setSite] = useState("");
    const [link, setLink] = useState("");
    const [comentario, setComentario] = useState("");
    const [ordem, setOrdem] = useState("");

    // 🔹 Carregar dados da API
    const carregarPropagandas = async () => {
        try {
            const res = await fetch(`${URL}/propagandas`);
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
            const res = await fetch(`${URL}/propagandas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ site, link, comentario, ordem })
            });

            if (res.ok) {
                fecharModal();
                carregarPropagandas();
            } else {
                console.error("Erro ao adicionar propaganda");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // 🔹 Abrir modal de edição
    const abrirEditar = (item) => {
        setEditarId(item.id);
        setSite(item.site);
        setLink(item.link);
        setComentario(item.comentario);
        setOrdem(item.ordem);
        setMostrarEditar(true);
    };

    // 🔹 Salvar edição
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
            } else {
                console.error("Erro ao editar propaganda");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // 🔹 Apagar propaganda
    const apagarPropaganda = async (id) => {
        if (!window.confirm("Tem certeza que deseja apagar esta propaganda?")) return;
        try {
            const res = await fetch(`${URL}/propagandas/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                carregarPropagandas();
            } else {
                console.error("Erro ao apagar propaganda");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    // 🔹 Fechar modal e limpar
    const fecharModal = () => {
        setMostrarModal(false);
        setMostrarEditar(false);
        setSite("");
        setLink("");
        setComentario("");
        setOrdem("");
        setEditarId(null);
    };

    return (
        <div className="propaganda-container">
            <h2 className="propaganda-titulo">Gerenciar Propagandas</h2>

            {/* Botão de adicionar */}
            <button className="propaganda-btn adicionar" onClick={() => setMostrarModal(true)}>
                + Adicionar
            </button>

            {loading ? (
                <p className="propaganda-loading">Carregando...</p>
            ) : (
                <table className="propaganda-tabela">
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
                                <td className="propaganda-site">{item.site}</td>
                                <td className="propaganda-link">
                                    <a href={item.link} target="_blank" rel="noreferrer">
                                        {item.link}
                                    </a>
                                </td>
                                <td className="propaganda-comentario">{item.comentario}</td>
                                <td className="propaganda-ordem">{item.ordem}</td>
                                <td className="propaganda-acoes">
                                    <button
                                        className="propaganda-btn editar"
                                        onClick={() => abrirEditar(item)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="propaganda-btn apagar"
                                        onClick={() => apagarPropaganda(item.id)}
                                    >
                                        Apagar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 🔹 Modal de Adicionar */}
            {mostrarModal && (
                <div className="propaganda-modal-overlay">
                    <div className="propaganda-modal-conteudo">
                        <h3 className="propaganda-modal-titulo">Adicionar Propaganda</h3>
                        <form className="propaganda-form" onSubmit={adicionarPropaganda}>
                            <label className="propaganda-label">Site</label>
                            <input
                                className="propaganda-input"
                                value={site}
                                onChange={(e) => setSite(e.target.value)}
                                required
                            />

                            <label className="propaganda-label">Link</label>
                            <input
                                className="propaganda-input"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />

                            <label className="propaganda-label">Comentário</label>
                            <input
                                className="propaganda-input"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />

                            <label className="propaganda-label">Ordem</label>
                            <input
                                className="propaganda-input"
                                value={ordem}
                                onChange={(e) => setOrdem(e.target.value)}
                                required
                            />

                            <div className="propaganda-modal-botoes">
                                <button type="submit" className="propaganda-btn salvar">Salvar</button>
                                <button
                                    type="button"
                                    className="propaganda-btn cancelar"
                                    onClick={fecharModal}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔹 Modal de Editar */}
            {mostrarEditar && (
                <div className="propaganda-modal-overlay">
                    <div className="propaganda-modal-conteudo">
                        <h3 className="propaganda-modal-titulo">Editar Propaganda</h3>
                        <form className="propaganda-form" onSubmit={editarPropaganda}>
                            <label className="propaganda-label">Site</label>
                            <input
                                className="propaganda-input"
                                value={site}
                                onChange={(e) => setSite(e.target.value)}
                                required
                            />

                            <label className="propaganda-label">Link</label>
                            <input
                                className="propaganda-input"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />

                            <label className="propaganda-label">Comentário</label>
                            <input
                                className="propaganda-input"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />

                            <label className="propaganda-label">Ordem</label>
                            <input
                                className="propaganda-input"
                                value={ordem}
                                onChange={(e) => setOrdem(e.target.value)}
                                required
                            />

                            <div className="propaganda-modal-botoes">
                                <button type="submit" className="propaganda-btn salvar">Salvar</button>
                                <button
                                    type="button"
                                    className="propaganda-btn cancelar"
                                    onClick={fecharModal}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
}
