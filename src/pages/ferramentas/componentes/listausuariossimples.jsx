import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./listausuariosSsimples.css";

export default function ListaUsuariosSimples() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [dadosEditados, setDadosEditados] = useState({});
    const [busca, setBusca] = useState(""); // 🔍 novo estado para o filtro

    // Carrega apenas usuarios
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/ferramentas/tabela/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setUsuarios(data.dados || []);
            });
    }, []);

    // Quando seleciona, preenche os inputs
    useEffect(() => {
        if (usuarioSelecionado) {
            setDadosEditados({
                id: usuarioSelecionado.id,
                nome: usuarioSelecionado.nome || "",
                funcao: usuarioSelecionado.funcao || "",
                cargo: usuarioSelecionado.cargo || "",
                responsabilidade: usuarioSelecionado.responsabilidade || ""
            });
        }
    }, [usuarioSelecionado]);

    const atualizarUsuario = async () => {
        const token = localStorage.getItem("token");
        try {
            const resposta = await fetch(`${URL}/ferramentas/editar_usuario/${dadosEditados.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dadosEditados)
            });

            if (resposta.ok) {
                alert("Funcionario atualizado com sucesso!");
                setUsuarioSelecionado(null);
                // recarregar lista
                const res = await fetch(`${URL}/ferramentas/tabela/usuarios`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setUsuarios(data.dados || []);
            } else {
                alert("Erro ao atualizar Funcionario.");
            }
        } catch (erro) {
            alert("Erro de conexão.");
        }
    };

    return (
        <div className="lista-usuarios-simples">
            <h2>👥 Lista de Funcionarios</h2>

            {/* 🔍 Campo de busca */}
            <input
                type="text"
                placeholder="Digite um nome para buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                    width: "60%",
                    padding: "10px",
                    margin: "10px 20%",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1em"
                }}
            />

            <ul>
                {usuarios
                    .filter(u => u.funcao && u.funcao.trim() !== "") // só quem tem função
                    .filter(u => u.nome?.toLowerCase().includes(busca.toLowerCase())) // aplica filtro
                    .map((u) => (
                        <li key={u.id} onClick={() => setUsuarioSelecionado(u)}>
                            <strong>{u.nome}</strong> — <span>{u.funcao}</span>
                        </li>
                    ))}
            </ul>

            {usuarioSelecionado && (
                <div className="modalFuncionarios-overlay">
                    <div className="modalFuncionarios-edicao">
                        <h3>Editar Funcionario</h3>
                        <form onSubmit={(e) => { e.preventDefault(); atualizarUsuario(); }}>
                            <label>Nome</label>
                            <input
                                type="text"
                                value={dadosEditados.nome}
                                onChange={(e) => setDadosEditados(prev => ({ ...prev, nome: e.target.value }))}
                            />

                            <label>Função</label>
                            <select
                                value={dadosEditados.funcao}
                                onChange={(e) => setDadosEditados(prev => ({ ...prev, funcao: e.target.value }))}
                            >
                                <option value="admin">admin</option>
                                <option value="auditor">auditor</option>
                                <option value="coordenador">coordenador</option>
                            </select>


                            <label>Cargo</label>
                            <input
                                type="text"
                                value={dadosEditados.cargo}
                                onChange={(e) => setDadosEditados(prev => ({ ...prev, cargo: e.target.value }))}
                            />

                            <label>Responsabilidade</label>
                            <textarea
                                value={dadosEditados.responsabilidade}
                                onChange={(e) => setDadosEditados(prev => ({ ...prev, responsabilidade: e.target.value }))}
                                rows={10}
                            />

                            <div className="botoes-edicao">
                                <button type="submit" className="btn-salvar">💾 Atualizar</button>
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setUsuarioSelecionado(null)}
                                >
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
