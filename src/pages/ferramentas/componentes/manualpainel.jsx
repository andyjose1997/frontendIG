import { useEffect, useState } from "react";
import "./manualpainel.css";
import { URL } from "../../../config";

// 🔹 API sempre com barra no final para evitar 405
const API_URL = `${URL}/clausulas/`;

function Clausula({ clausula, onAddFilho, onSave, onDelete, nivel = 0 }) {
    const [texto, setTexto] = useState(clausula.texto || "");
    const [editando, setEditando] = useState(!clausula.texto);

    const salvar = async () => {
        const payload = {
            numero: clausula.numero,
            texto,
            pai_id: clausula.pai_id,
        };

        try {
            if (clausula.id) {
                // atualizar existente
                await fetch(`${API_URL}${clausula.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                // criar nova
                await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
        } catch (err) {
            console.error("Erro ao salvar cláusula:", err);
        }

        setEditando(false);
        onSave();
    };

    return (
        <div className="clausula-container" style={{ marginLeft: nivel * 30 }}>
            <button
                className="clausula-btn"
                onClick={() => setEditando(true)}
            >
                Cláusula {clausula.numero}
            </button>

            {editando ? (
                <div className="clausula-editor">
                    <textarea
                        className="clausula-textarea"
                        value={texto}
                        rows={9}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder={`Digite o texto da Cláusula ${clausula.numero}`}
                    />
                    <div className="acoes">
                        <button className="guardar-btn" onClick={salvar}>
                            Salvar
                        </button>
                        {clausula.id && (
                            <button
                                className="apagar-btn"
                                onClick={() => onDelete(clausula.id)}
                            >
                                Apagar
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                clausula.texto && (
                    <div className="acoes">
                        <p
                            className="clausula-texto"
                            onClick={() => setEditando(true)}
                            style={{ cursor: "pointer", whiteSpace: "pre-line" }}
                        >
                            {clausula.texto}
                        </p>

                        {clausula.numero.split(".").length < 3 && (
                            <button
                                className="add-sub-btn"
                                onClick={() => onAddFilho(clausula)}
                            >
                                ➕ Cláusula {clausula.numero}.1
                            </button>
                        )}
                    </div>
                )
            )}

            {clausula.filhos?.map((f) => (
                <Clausula
                    key={f.id || f.numero}
                    clausula={f}
                    onAddFilho={onAddFilho}
                    onSave={onSave}
                    onDelete={onDelete}
                    nivel={nivel + 1}
                />
            ))}
        </div>
    );
}

export default function ManualPainel() {
    const [clausulas, setClausulas] = useState([]);
    const [visualizar, setVisualizar] = useState(false);

    const carregar = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (Array.isArray(data)) {
                setClausulas(data);
            } else {
                setClausulas([]);
            }
        } catch (err) {
            console.error("Erro ao carregar cláusulas:", err);
            setClausulas([]);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const addFilho = async (pai) => {
        const filhos = pai.filhos ? pai.filhos.length : 0;
        const novoNumero = `${pai.numero}.${filhos + 1}`;

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    numero: novoNumero,
                    texto: "",
                    pai_id: pai.id,
                }),
            });
        } catch (err) {
            console.error("Erro ao adicionar subcláusula:", err);
        }

        carregar();
    };

    const addRaiz = async () => {
        const raizes = clausulas.filter((c) => !c.pai_id);
        const novoNumero = (raizes.length + 1).toString();

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    numero: novoNumero,
                    texto: "",
                    pai_id: null,
                }),
            });
        } catch (err) {
            console.error("Erro ao adicionar cláusula raiz:", err);
        }

        carregar();
    };

    const deletarClausula = async (id) => {
        try {
            await fetch(`${API_URL}${id}`, { method: "DELETE" });
        } catch (err) {
            console.error("Erro ao deletar cláusula:", err);
        }
        carregar();
    };

    const renderDocumento = (lista, nivel = 0) =>
        lista
            .filter((c) => c.texto && c.texto.trim() !== "")
            .map((c) => (
                <div key={c.id} style={{ marginLeft: nivel * 20 }}>
                    <strong>Cláusula {c.numero}:</strong> <br />
                    <span style={{ whiteSpace: "pre-line" }}>{c.texto}</span>
                    {c.filhos && renderDocumento(c.filhos, nivel + 1)}
                </div>
            ));

    return (
        <div className="manual-painel">
            <h2>Editor de Cláusulas</h2>

            <button
                className="visualizar-btn"
                onClick={() => setVisualizar(!visualizar)}
            >
                {visualizar ? "Voltar ao Editor" : "Visualizar Documento"}
            </button>

            {visualizar ? (
                <div className="documento-gerado">
                    <h3>Documento Gerado</h3>
                    {renderDocumento(clausulas)}
                </div>
            ) : (
                <div className="clausulas-arvore">
                    {clausulas.map((c) => (
                        <Clausula
                            key={c.id || c.numero}
                            clausula={c}
                            onAddFilho={addFilho}
                            onSave={carregar}
                            onDelete={deletarClausula}
                        />
                    ))}

                    <button className="clausula-btn" onClick={addRaiz}>
                        ➕ Nova Cláusula Raiz
                    </button>
                </div>
            )}
        </div>
    );
}
