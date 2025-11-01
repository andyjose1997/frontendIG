import { useEffect, useState } from "react";
import "./funcionariosannett.css";
import { URL } from "../../../../config";

export default function FuncionariosAnnett() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [funcionarios, setFuncionarios] = useState([]);
    const [novoId, setNovoId] = useState("");
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [confirmarRemocao, setConfirmarRemocao] = useState(null); // 👈 novo estado

    // 🔹 Buscar perfil logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Erro ao buscar perfil.");
                const data = await res.json();
                setUsuarioLogado(data);
            })
            .catch((err) => {
                console.error("Erro ao buscar perfil:", err);
                setMensagem("❌ Falha ao carregar perfil do usuário.");
            });
    }, []);

    // 🔹 Carregar funcionários
    const carregarFuncionarios = async () => {
        try {
            const res = await fetch(`${URL}/annett/funcionarios/listar`);
            if (!res.ok) throw new Error("Erro ao carregar funcionários.");
            const data = await res.json();
            setFuncionarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setMensagem("❌ Erro ao carregar lista de funcionários.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    // 🔹 Buscar usuário por ID (6 caracteres)
    const buscarUsuarioPorId = async (id) => {
        if (!id || id.length !== 6) return;
        try {
            const res = await fetch(`${URL}/annett/funcionarios/buscar/${id}`);
            if (!res.ok) throw new Error("Usuário não encontrado.");
            const data = await res.json();
            setUsuarioEncontrado(data);
            setMensagem("");
        } catch (err) {
            setUsuarioEncontrado(null);
            setMensagem("❌ " + err.message);
        }
    };

    // 🔹 Adicionar funcionário
    const adicionarFuncionario = async () => {
        if (!usuarioEncontrado) return;
        try {
            const res = await fetch(`${URL}/annett/funcionarios/atualizar_funcao`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: usuarioEncontrado.id,
                    funcao: "partner",
                    parceiro: "Annett Studios",
                }),
            });
            if (!res.ok) throw new Error("Erro ao adicionar funcionário.");
            setMensagem("✅ Funcionário adicionado com sucesso!");
            setUsuarioEncontrado(null);
            setNovoId("");
            carregarFuncionarios();
        } catch (err) {
            setMensagem("❌ " + err.message);
        }
    };

    // 🔹 Remover funcionário
    const removerFuncionario = async (id) => {
        try {
            const res = await fetch(`${URL}/annett/funcionarios/atualizar_funcao`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    funcao: null,
                    parceiro: null,
                }),
            });
            if (!res.ok) throw new Error("Erro ao remover funcionário.");
            setMensagem("🗑️ Funcionário removido com sucesso.");
            setConfirmarRemocao(null);
            carregarFuncionarios();
        } catch (err) {
            setMensagem("❌ " + err.message);
        }
    };

    // 🔹 Clique duplo: confirmação de remoção
    const handleClickRemover = (id) => {
        if (confirmarRemocao === id) {
            removerFuncionario(id); // segundo clique remove
        } else {
            setConfirmarRemocao(id); // primeiro clique ativa confirmação
            setMensagem("⚠️ Clique novamente para confirmar a remoção.");
            setTimeout(() => {
                setConfirmarRemocao(null);
            }, 4000); // após 4s, cancela a confirmação automaticamente
        }
    };

    const podeGerenciar =
        usuarioLogado &&
        (usuarioLogado.id === "a00041" || usuarioLogado.funcao === "admin");

    if (carregando) {
        return <p className="funcionarios-loading">⏳ Carregando dados...</p>;
    }

    return (
        <div className="funcionarios-container">
            <h2 className="funcionarios-titulo">👩‍💼 Funcionários - Annett Studios</h2>
            {mensagem && <p className="funcionarios-mensagem">{mensagem}</p>}

            {podeGerenciar && (
                <div className="funcionarios-adicionar">
                    <h3>➕ Adicionar novo funcionário</h3>
                    <input
                        type="text"
                        placeholder="Digite o ID do usuário"
                        value={novoId}
                        maxLength={6}
                        onChange={(e) => {
                            const valor = e.target.value.trim();
                            setNovoId(valor);
                            if (valor.length === 6) buscarUsuarioPorId(valor);
                            else setUsuarioEncontrado(null);
                        }}
                        className="funcionarios-input"
                    />
                    {usuarioEncontrado && (
                        <div className="funcionarios-preview">
                            <p>
                                <strong>
                                    {usuarioEncontrado.nome} {usuarioEncontrado.sobrenome}
                                </strong>
                            </p>
                            <button
                                onClick={adicionarFuncionario}
                                className="funcionarios-botao adicionar"
                            >
                                ✅ Adicionar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {funcionarios.length === 0 ? (
                <p className="funcionarios-vazio">Nenhum funcionário encontrado.</p>
            ) : (
                <table className="funcionarios-tabela">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Sobrenome</th>
                            {podeGerenciar && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((f) => (
                            <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.nome}</td>
                                <td>{f.sobrenome}</td>
                                {podeGerenciar && (
                                    <td>
                                        <button
                                            className={`funcionarios-botao apagar ${confirmarRemocao === f.id ? "confirmar" : ""
                                                }`}
                                            onClick={() => handleClickRemover(f.id)}
                                        >
                                            {confirmarRemocao === f.id
                                                ? "⚠️ Confirmar"
                                                : "❌ Remover"}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
