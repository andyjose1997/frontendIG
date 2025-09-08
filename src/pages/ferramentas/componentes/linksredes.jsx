import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./linksredes.css";

export default function LinksRedes() {
    const [links, setLinks] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [confirmandoId, setConfirmandoId] = useState(null); // 🔹 novo estado
    const [novoItem, setNovoItem] = useState({ rede: "", link: "" });

    const carregarLinks = async () => {
        try {
            const res = await fetch(`${URL}/fundadores/links`);
            const data = await res.json();
            setLinks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar links:", err);
            setLinks([]);
        }
    };

    useEffect(() => {
        carregarLinks();
    }, []);

    const apagarLink = async (id) => {
        // 🔹 Se ainda não está confirmando → primeiro clique
        if (confirmandoId !== id) {
            setConfirmandoId(id);

            // reseta automaticamente depois de 3s se não clicar de novo
            setTimeout(() => setConfirmandoId(null), 3000);
            return;
        }

        // 🔹 Se já clicou uma vez → confirma exclusão
        await fetch(`${URL}/fundadores/links/${id}`, { method: "DELETE" });
        setConfirmandoId(null);
        carregarLinks();
    };

    const salvarEdicao = async (id, rede, link) => {
        await fetch(`${URL}/fundadores/links/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rede, link }),
        });
        setEditandoId(null);
        carregarLinks();
    };

    const adicionarLink = async () => {
        if (!novoItem.rede || !novoItem.link) {
            alert("Preencha todos os campos!");
            return;
        }
        await fetch(`${URL}/fundadores/links`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoItem),
        });
        setNovoItem({ rede: "", link: "" });
        carregarLinks();
    };

    return (
        <div className="links-wrapper">
            <h2 className="links-title">Gerenciar Redes Sociais</h2>

            <div className="links-add">
                <input
                    type="text"
                    placeholder="Nome da Rede"
                    value={novoItem.rede}
                    onChange={(e) => setNovoItem({ ...novoItem, rede: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Link da Rede"
                    value={novoItem.link}
                    onChange={(e) => setNovoItem({ ...novoItem, link: e.target.value })}
                />
                <button className="btn btn-add" onClick={adicionarLink}>Adicionar</button>
            </div>

            <table className="links-table">
                <thead>
                    <tr>
                        <th>Rede</th>
                        <th>Link</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(links) && links.map((item) => (
                        <tr key={item.id}>
                            {editandoId === item.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            defaultValue={item.rede}
                                            onChange={(e) => (item.rede = e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            defaultValue={item.link}
                                            onChange={(e) => (item.link = e.target.value)}
                                        />
                                    </td>
                                    <td className="actions">
                                        <button className="btn btn-save" onClick={() => salvarEdicao(item.id, item.rede, item.link)}>
                                            Salvar
                                        </button>
                                        <button className="btn btn-cancel" onClick={() => setEditandoId(null)}>
                                            Cancelar
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{item.rede}</td>
                                    <td>
                                        <a href={item.link} target="_blank" rel="noreferrer">
                                            {item.link}
                                        </a>
                                    </td>
                                    <td className="actions">
                                        <button className="btn btn-edit" onClick={() => setEditandoId(item.id)}>Editar</button>
                                        <button
                                            className={`btn btn-delete ${confirmandoId === item.id ? "confirmando" : ""}`}
                                            onClick={() => apagarLink(item.id)}
                                        >
                                            {confirmandoId === item.id ? "Confirmar" : "Apagar"}
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
