import { useState, useEffect } from "react";
import { URL } from "../../../config";
import "./privilegiopainel.css";

export default function PrivilegioPainel() {
    const [form, setForm] = useState({
        id: "",
        identificador: "",
        nome: "",
        data: "",
        dias: ""
    });
    const [buscando, setBuscando] = useState(false);
    const [privilegios, setPrivilegios] = useState([]);
    const [carregandoLista, setCarregandoLista] = useState(true);
    const [editando, setEditando] = useState(false);
    const [dataMinima, setDataMinima] = useState(""); // nova linha
    const [avisoData, setAvisoData] = useState(""); // nova linha

    // 🔹 Buscar nome automaticamente ao digitar ID
    const buscarNomePorID = async (idDigitado) => {
        setForm({ ...form, identificador: idDigitado });
        if (!idDigitado) {
            setForm({ ...form, nome: "" });
            return;
        }

        try {
            setBuscando(true);
            const res = await fetch(`${URL}/perfil/id/${idDigitado}`);
            if (!res.ok) {
                setForm((prev) => ({ ...prev, nome: "" }));
                return;
            }
            const data = await res.json();
            if (data && data.nome && data.sobrenome) {
                const nomeCompleto = `${data.nome}${data.sobrenome}`.toLowerCase().replace(/\s+/g, "");
                setForm((prev) => ({ ...prev, nome: nomeCompleto }));
            } else {
                setForm((prev) => ({ ...prev, nome: "" }));
            }
        } catch (err) {
            console.error("Erro ao buscar nome:", err);
            setForm((prev) => ({ ...prev, nome: "" }));
        } finally {
            setBuscando(false);
        }
    };

    // 🔹 Carregar lista de privilégios
    const carregarPrivilegios = async () => {
        setCarregandoLista(true);
        try {
            const res = await fetch(`${URL}/privilegios`);
            if (!res.ok) throw new Error("Erro ao buscar privilégios");
            const data = await res.json();
            setPrivilegios(Array.isArray(data) ? data : []);

            // 🔹 Calcular a data mais distante (último privilégio ativo)
            if (Array.isArray(data) && data.length > 0) {
                let ultimaData = new Date(0);

                data.forEach((p) => {
                    const inicio = new Date(p.data);
                    const fim = new Date(inicio);
                    fim.setDate(inicio.getDate() + Number(p.dias));

                    if (fim > ultimaData) ultimaData = fim;
                });

                // 🔹 Define a próxima data disponível
                const proxima = new Date(ultimaData);
                proxima.setDate(ultimaData.getDate() + 1);

                const dataFormatada = proxima.toISOString().split("T")[0];
                setDataMinima(dataFormatada);
                setAvisoData(`📅 A próxima data disponível é ${proxima.toLocaleDateString("pt-BR")}`);
            } else {
                // Nenhum privilégio — hoje é o início
                const hoje = new Date();
                const hojeStr = hoje.toISOString().split("T")[0];
                setDataMinima(hojeStr);
                setAvisoData("📅 Nenhum privilégio anterior — disponível a partir de hoje.");
            }
        } catch (err) {
            console.error("Erro ao carregar privilégios:", err);
            setPrivilegios([]);
        } finally {
            setCarregandoLista(false);
        }
    };

    useEffect(() => {
        carregarPrivilegios();
    }, []);

    // 🔹 Enviar ou atualizar privilégio
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.identificador || !form.nome || !form.data || !form.dias) {
            alert("Preencha todos os campos antes de salvar.");
            return;
        }

        // 🚫 Bloqueia se a data for antes da mínima
        if (dataMinima && new Date(form.data) < new Date(dataMinima)) {
            alert(`⚠️ A data deve ser igual ou posterior a ${new Date(dataMinima).toLocaleDateString("pt-BR")}.`);
            return;
        }

        try {
            const endpoint = editando ? `${URL}/privilegios/editar/${form.id}` : `${URL}/privilegios/adicionar`;
            const method = editando ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                alert(editando ? "✅ Privilégio atualizado!" : "✅ Privilégio salvo com sucesso!");
                setForm({ id: "", identificador: "", nome: "", data: "", dias: "" });
                setEditando(false);
                carregarPrivilegios();
            } else {
                alert("❌ Erro ao salvar privilégio.");
            }
        } catch (err) {
            console.error("Erro ao salvar privilégio:", err);
        }
    };

    // 🔹 Verifica se privilégio está ativo
    const isAtivo = (p) => {
        const inicio = new Date(p.data);
        const hoje = new Date();
        const fim = new Date(inicio);
        fim.setDate(inicio.getDate() + Number(p.dias));
        return hoje >= inicio && hoje <= fim;
    };

    // 🔹 Editar privilégio
    const editarPrivilegio = (p) => {
        setForm({
            id: p.id,
            identificador: p.identificador,
            nome: p.nome,
            data: p.data.split("T")[0],
            dias: p.dias
        });
        setEditando(true);
    };

    // 🔹 Apagar privilégio
    const apagarPrivilegio = async (id) => {
        if (!window.confirm("Tem certeza que deseja apagar este privilégio?")) return;
        try {
            const res = await fetch(`${URL}/privilegios/deletar/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("🗑️ Privilégio removido com sucesso!");
                carregarPrivilegios();
            } else {
                alert("❌ Erro ao apagar privilégio.");
            }
        } catch (err) {
            console.error("Erro ao apagar privilégio:", err);
        }
    };

    return (
        <div className="privilegio-painel">
            <h2>Gerenciar Privilégios</h2>

            <form className="privilegio-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ID do usuário (ex: a00001)"
                    value={form.identificador}
                    onChange={(e) => buscarNomePorID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nome do usuário"
                    value={form.nome}
                    readOnly
                />
                <input
                    type="date"
                    min={dataMinima}
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Dias de privilégio"
                    value={form.dias}
                    onChange={(e) => setForm({ ...form, dias: e.target.value })}
                />
                <button type="submit" disabled={buscando}>
                    {buscando ? "Buscando..." : editando ? "Atualizar" : "Salvar"}
                </button>
            </form>

            {avisoData && (
                <p className="aviso-data">{avisoData}</p>
            )}

            <p className="privilegio-aviso">
                ⚠️ Caso o ID não esteja disponível, será usado automaticamente <strong>a00001</strong>.
            </p>

            {/* 🔹 Lista */}
            <div className="privilegio-lista">
                {carregandoLista ? (
                    <p>Carregando privilégios...</p>
                ) : privilegios.length === 0 ? (
                    <p>Nenhum privilégio cadastrado.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Data</th>
                                <th>Dias</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {privilegios.map((p, i) => {
                                const ativo = isAtivo(p);
                                return (
                                    <tr key={i} className={ativo ? "ativo" : ""}>
                                        <td>{p.identificador}</td>
                                        <td>{p.nome}</td>
                                        <td>{new Date(p.data).toLocaleDateString("pt-BR")}</td>
                                        <td>{p.dias}</td>
                                        <td>
                                            {ativo ? (
                                                <span className="ativo-texto">🔸 Atualmente ativo</span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td>
                                            <button className="btn-editar" onClick={() => editarPrivilegio(p)}>
                                                ✏️
                                            </button>
                                            <button className="btn-apagar" onClick={() => apagarPrivilegio(p.id)}>
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
