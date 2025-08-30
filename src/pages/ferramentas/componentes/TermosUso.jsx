import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./termosUso.css";

export default function TermosUso() {
    const [termos, setTermos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [novoTexto, setNovoTexto] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [textoNovo, setTextoNovo] = useState("");
    const [confirmarApagar, setConfirmarApagar] = useState(null); // 🔹 guarda o id do termo a apagar

    useEffect(() => {
        buscarTermos();
    }, []);

    const buscarTermos = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${URL}/termos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTermos(data);
        } catch (err) {
            console.error("Erro:", err);
        } finally {
            setLoading(false);
        }
    };

    const atualizarTermo = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${URL}/termos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cadastro: novoTexto }),
            });
            buscarTermos();
            setEditando(null);
        } catch (err) {
            console.error("Erro ao atualizar:", err);
        }
    };

    const apagarTermo = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${URL}/termos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cadastro: "" }),
            });
            buscarTermos();
            setConfirmarApagar(null); // fecha modal de confirmação
        } catch (err) {
            console.error("Erro ao apagar:", err);
        }
    };

    const adicionarTermo = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${URL}/termos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cadastro: textoNovo }),
            });
            buscarTermos();
            setMostrarModal(false);
            setTextoNovo("");
        } catch (err) {
            console.error("Erro ao adicionar:", err);
        }
    };

    return (
        <div className="termosPainel-container">
            <div className="header-termos">
                <button className="btn-adicionar" onClick={() => setMostrarModal(true)}>➕ Adicionar termo</button>
                <h2>📜 Termos de Uso</h2>
            </div>

            {loading ? (
                <p className="loading">Carregando termos...</p>
            ) : (
                <section className="lista-termos-section">
                    <ol className="lista-termos">
                        {termos.map((t) => (
                            <li key={t.id}>
                                {editando === t.id ? (
                                    <div className="editor-termo">
                                        <textarea
                                            rows="5"
                                            value={novoTexto}
                                            onChange={(e) => setNovoTexto(e.target.value)}
                                        />
                                        <button onClick={() => atualizarTermo(t.id)}>💾 Atualizar</button>
                                        <button onClick={() => setEditando(null)}>❌ Cancelar</button>
                                        <button onClick={() => setConfirmarApagar(t.id)}>🗑 Apagar</button>
                                    </div>
                                ) : (
                                    <span
                                        onClick={() => {
                                            setEditando(t.id);
                                            setNovoTexto(t.cadastro || ""); // 🔹 permite editar mesmo vazio
                                        }}
                                    >
                                        {t.cadastro && t.cadastro.trim() !== "" ? t.cadastro : <em>(clique para editar)</em>}
                                    </span>
                                )}
                            </li>
                        ))}

                    </ol>
                </section>
            )}

            {/* 🔹 Modal de adicionar termo */}
            {mostrarModal && (
                <div className="modalA-overlay">
                    <div className="modalA">
                        <h3>Novo Termo</h3>
                        <textarea
                            value={textoNovo}
                            onChange={(e) => setTextoNovo(e.target.value)}
                            placeholder="Digite o novo termo..."
                            rows="5"
                        />
                        <div className="modalA-botoes">
                            <button onClick={adicionarTermo}>Adicionar</button>
                            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Modal de confirmação para apagar */}
            {confirmarApagar && (
                <div className="modalA-overlay">
                    <div className="modalA">
                        <h3>⚠️ Tem certeza que deseja apagar?</h3>
                        <p>Essa ação vai deixar o termo vazio, mas não remove a linha do banco.</p>
                        <div className="modalA-botoes">
                            <button onClick={() => apagarTermo(confirmarApagar)}>🗑 Apagar</button>
                            <button onClick={() => setConfirmarApagar(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
