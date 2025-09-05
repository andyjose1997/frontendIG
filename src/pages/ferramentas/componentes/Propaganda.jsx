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
            <h2>Gerenciar Propagandas</h2>

            {/* Botão de adicionar */}
            <button className="btn-adicionar" onClick={() => setMostrarModal(true)}>
                + Adicionar
            </button>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <table className="tabela-propagandas">
                    <thead>
                        <tr>
                            <th>Site</th>
                            <th>Link</th>
                            <th>Comentário</th>
                            <th>Ordem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propagandas.map((item) => (
                            <tr key={item.id}>
                                <td>{item.site}</td>
                                <td>
                                    <a href={item.link} target="_blank" rel="noreferrer">
                                        {item.link}
                                    </a>
                                </td>
                                <td>{item.comentario}</td>
                                <td>{item.ordem}</td>
                                <td>
                                    <button className="btn-editar" onClick={() => abrirEditar(item)}>Editar</button>
                                    <button className="btn-apagar" onClick={() => apagarPropaganda(item.id)}>Apagar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 🔹 Modal de Adicionar */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                        <h3>Adicionar Propaganda</h3>
                        <form onSubmit={adicionarPropaganda}>
                            <label>Site</label>
                            <input value={site} onChange={(e) => setSite(e.target.value)} required />

                            <label>Link</label>
                            <input value={link} onChange={(e) => setLink(e.target.value)} required />

                            <label>Comentário</label>
                            <input value={comentario} onChange={(e) => setComentario(e.target.value)} />

                            <label>Ordem</label>
                            <input value={ordem} onChange={(e) => setOrdem(e.target.value)} required />

                            <div className="modal-botoes">
                                <button type="submit" className="btn-salvar">Salvar</button>
                                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔹 Modal de Editar */}
            {mostrarEditar && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                        <h3>Editar Propaganda</h3>
                        <form onSubmit={editarPropaganda}>
                            <label>Site</label>
                            <input value={site} onChange={(e) => setSite(e.target.value)} required />

                            <label>Link</label>
                            <input value={link} onChange={(e) => setLink(e.target.value)} required />

                            <label>Comentário</label>
                            <input value={comentario} onChange={(e) => setComentario(e.target.value)} />

                            <label>Ordem</label>
                            <input value={ordem} onChange={(e) => setOrdem(e.target.value)} required />

                            <div className="modal-botoes">
                                <button type="submit" className="btn-salvar">Salvar</button>
                                <button type="button" className="btn-cancelar" onClick={fecharModal}>
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
