import { useEffect, useState } from "react";
import "./manualpainel.css";
import { URL } from "../../../config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 🔹 API sempre com barra no final para evitar 405
const API_URL = `${URL}/clausulas/`;

function Clausula({ clausula, onAddFilho, onAddIrmao, onSave, onDelete, nivel = 0 }) {
    const [texto, setTexto] = useState(clausula.texto || "");
    const [editando, setEditando] = useState(!clausula.texto);

    // 🔹 Detecta cor pelo número raiz
    const getBackground = () => {
        const raiz = parseInt(clausula.numero.split(".")[0], 10);
        if (isNaN(raiz)) return "#fff";
        return raiz % 2 === 0 ? "#c8f7c5" : "#c5d8f7"; // verde claro / azul claro
    };

    const salvar = async () => {
        const payload = {
            numero: clausula.numero,
            texto,
            pai_id: clausula.pai_id,
        };

        try {
            if (clausula.id) {
                await fetch(`${API_URL}${clausula.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
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
        <div
            className="clausula-container"
            style={{
                marginLeft: nivel * 30,
                backgroundColor: getBackground(),
                color: "black",
            }}
        >
            <button
                className="clausula-btn"
                onClick={() => setEditando(true)}
                style={{ backgroundColor: getBackground(), color: "black" }}
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
                            style={{
                                cursor: "pointer",
                                whiteSpace: "pre-line",
                                color: "black",
                            }}
                        >
                            {clausula.texto}
                        </p>

                        {/* botão de subcláusula */}
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

            {/* filhos */}
            {clausula.filhos?.map((f) => (
                <Clausula
                    key={f.id || f.numero}
                    clausula={f}
                    onAddFilho={onAddFilho}
                    onAddIrmao={onAddIrmao}
                    onSave={onSave}
                    onDelete={onDelete}
                    nivel={nivel + 1}
                />
            ))}

            {/* botão para adicionar irmão */}
            {clausula.texto && (
                <button
                    className="add-sub-btn"
                    onClick={() => onAddIrmao(clausula)}
                >
                    ➕ Cláusula {(() => {
                        const partes = clausula.numero.split(".");
                        partes[partes.length - 1] =
                            parseInt(partes[partes.length - 1], 10) + 1;
                        return partes.join(".");
                    })()}
                </button>
            )}
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

    const addIrmao = async (clausula) => {
        const partes = clausula.numero.split(".");
        const ultimo = parseInt(partes[partes.length - 1], 10);
        partes[partes.length - 1] = ultimo + 1;
        const novoNumero = partes.join(".");

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    numero: novoNumero,
                    texto: "",
                    pai_id: clausula.pai_id,
                }),
            });
        } catch (err) {
            console.error("Erro ao adicionar cláusula irmã:", err);
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

    // 🔹 exportar PDF
    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        let conteudo = [];

        const montarConteudo = (lista, nivel = 0) => {
            lista.forEach((c) => {
                if (c.texto && c.texto.trim() !== "") {
                    conteudo.push([
                        `Cláusula ${c.numero}`,
                        c.texto.replace(/\n/g, "\n")
                    ]);
                    if (c.filhos) montarConteudo(c.filhos, nivel + 1);
                }
            });
        };

        montarConteudo(clausulas);

        autoTable(doc, {
            head: [["Cláusula", "Texto"]],
            body: conteudo,
            styles: { fontSize: 10, cellPadding: 3, valign: "top" },
            headStyles: { fillColor: [0, 0, 0] },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 140 }
            }
        });

        doc.save("Manual_Geral_IronGoals.pdf");
    };

    // renderizar documento sempre branco/preto
    const renderDocumento = (lista, nivel = 0) =>
        lista
            .filter((c) => c.texto && c.texto.trim() !== "")
            .map((c) => (
                <div
                    key={c.id}
                    style={{
                        marginLeft: nivel * 20,
                        background: "#fff",
                        color: "#000",
                        padding: "10px 0",
                    }}
                >
                    <strong>Cláusula {c.numero}:</strong> <br />
                    <span style={{ whiteSpace: "pre-line" }}>{c.texto}</span>
                    {c.filhos && renderDocumento(c.filhos, nivel + 1)}
                </div>
            ));

    return (
        <div className="manual-painel">

            <button
                className="visualizar-btn"
                onClick={() => setVisualizar(!visualizar)}
            >
                {visualizar ? "Voltar ao Editor" : "Visualizar Documento"}
            </button>

            {visualizar ? (
                <div className="documento-gerado">
                    <h3>Documento Gerado</h3>
                    <button className="exportar-btn" onClick={exportarPDF}>
                        📄 Exportar PDF
                    </button>
                    {renderDocumento(clausulas)}
                </div>
            ) : (
                <div className="clausulas-arvore">
                    {clausulas.map((c) => (
                        <Clausula
                            key={c.id || c.numero}
                            clausula={c}
                            onAddFilho={addFilho}
                            onAddIrmao={addIrmao}
                            onSave={carregar}
                            onDelete={deletarClausula}
                        />
                    ))}
                    <br />
                    {/* botão para começar nova cláusula raiz */}
                    {clausulas.length > 0 && (
                        <button
                            className="clausula-btn"
                            onClick={() =>
                                addIrmao(clausulas[clausulas.length - 1])
                            }
                        >
                            ➕ Cláusula {clausulas.length + 1}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
