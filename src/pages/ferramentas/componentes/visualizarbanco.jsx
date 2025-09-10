import { useEffect, useState } from 'react';
import { URL } from '../../../config';
import './visualizarbanco.css';

export default function VisualizarBanco() {
    const [tabelas, setTabelas] = useState([]);
    const [tabelaSelecionada, setTabelaSelecionada] = useState("");
    const [dados, setDados] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const registrosPorPagina = 50;
    const [linhaSelecionada, setLinhaSelecionada] = useState(null);
    const [filtroId, setFiltroId] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [totalFiltradoPorData, setTotalFiltradoPorData] = useState(0);
    const [filtrosPorColuna, setFiltrosPorColuna] = useState({});
    const [linhaEditando, setLinhaEditando] = useState(null);
    const [dadosEditados, setDadosEditados] = useState({});
    const [alerta, setAlerta] = useState({ mensagem: "", tipo: "" });

    useEffect(() => {
        if (linhaEditando) {
            setDadosEditados({ ...linhaEditando });
            console.log("🟢 Dados carregados para edição:", linhaEditando);
        }
    }, [linhaEditando]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/ferramentas/tabelas`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const tabelasRecebidas = data.tabelas || [];
                setTabelas(tabelasRecebidas);

                if (tabelasRecebidas.includes("usuarios")) {
                    carregarTabela("usuarios");
                }
            });
    }, []);

    const carregarTabela = (nome) => {
        const token = localStorage.getItem("token");
        setTabelaSelecionada(nome);
        setPaginaAtual(0);

        fetch(`${URL}/ferramentas/tabela/${nome}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setDados(data.dados || []);
            });
    };

    const colunas = dados.length > 0 ? Object.keys(dados[0]) : [];

    const aplicarFiltrosColunas = (linha) => {
        return Object.entries(filtrosPorColuna).every(([coluna, valor]) => {
            if (!valor) return true;
            return String(linha[coluna] || '').toLowerCase().includes(valor.toLowerCase());
        });
    };

    const dadosFiltrados = dados
        .filter((linha) =>
            linha.id?.toLowerCase().includes(filtroId.toLowerCase())
        )
        .filter(aplicarFiltrosColunas);

    const dadosPaginados = dadosFiltrados.slice(
        paginaAtual * registrosPorPagina,
        (paginaAtual + 1) * registrosPorPagina
    );
    const [funcaoUsuario, setFuncaoUsuario] = useState("");
    // 🔹 Fecha o alerta automaticamente após 10 segundos
    useEffect(() => {
        if (alerta.mensagem) {
            const timer = setTimeout(() => {
                setAlerta({ mensagem: "", tipo: "" });
            }, 5000); // 10 segundos

            return () => clearTimeout(timer); // limpa se mudar antes
        }
    }, [alerta]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setFuncaoUsuario(data.funcao || "");
            });
    }, []);
    const handleApagarConta = async (idUsuario) => {
        const token = localStorage.getItem("token");
        const confirmar = window.confirm("Tem certeza que deseja apagar essa conta e todos os dados relacionados?");
        if (!confirmar) return;

        try {
            const resposta = await fetch(`${URL}/ferramentas/apagar_usuario_completo/${idUsuario}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (resposta.ok) {
                setAlerta({ mensagem: "Usuário e dados relacionados apagados com sucesso.", tipo: "sucesso" });
                carregarTabela(tabelaSelecionada);
            } else {
                setAlerta({ mensagem: "Erro ao apagar o usuário.", tipo: "erro" });
            }

        } catch (erro) {
            setAlerta({ mensagem: "Erro na requisição.", tipo: "erro" });
        }
    };
    const salvarAlteracoes = async () => {
        const token = localStorage.getItem("token");

        try {
            const resposta = await fetch(`${URL}/ferramentas/editar_usuario/${linhaEditando.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dadosEditados)
            });

            if (resposta.ok) {
                setAlerta({ mensagem: "Alterações salvas com sucesso!", tipo: "sucesso" });
                setLinhaEditando(null);
                carregarTabela(tabelaSelecionada);
            } else {
                setAlerta({ mensagem: "Erro ao salvar.", tipo: "erro" });
            }

        } catch (erro) {
            setAlerta({ mensagem: "Erro ao conectar com servidor.", tipo: "erro" });
        }
    };


    return (
        <div className="visualizador-container">

            <div className="tabela-selecao" style={{ display: "none" }}>
                <strong>Selecione uma tabela:</strong>
                <div className="botoes-tabelas">
                    {tabelas.map((nome) => (
                        <button
                            key={nome}
                            onClick={() => carregarTabela(nome)}
                            className={nome === tabelaSelecionada ? "selecionado" : ""}
                            style={{ display: nome === "usuarios" ? "inline-block" : "none" }}
                        >
                            {nome}
                        </button>
                    ))}
                </div>
            </div>



            {tabelaSelecionada && (
                <>
                    <h2>🗂️ Tabela <span style={{ fontWeight: "600" }}>{tabelaSelecionada}</span></h2>

                    <div className="resumo-tabela">
                        <p style={{ fontSize: "30px" }}>Total de registros: <strong>{dadosFiltrados.length}</strong></p>
                    </div>

                    <div className="filtro-data">
                        <label>📅 Filtrar por data de cadastro:</label>
                        <div className="inputs-data">
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                            />
                            <span>até</span>
                            <input
                                type="date"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                            />
                            <button className="botao-filtrar-data" onClick={() => {
                                if (!dataInicio || !dataFim) {
                                    setTotalFiltradoPorData(0);
                                    return;
                                }

                                const total = dadosFiltrados.filter((linha) => {
                                    const data = new Date(linha.data_cadastro);
                                    const inicio = new Date(dataInicio);
                                    const fim = new Date(dataFim);
                                    return data >= inicio && data <= fim;
                                }).length;

                                setTotalFiltradoPorData(total);
                            }}>
                                Filtrar
                            </button>
                        </div>

                        {dataInicio && dataFim && (
                            <p className="resultado-data">
                                Usuários cadastrados nesse intervalo: <strong>{totalFiltradoPorData}</strong>
                            </p>
                        )}

                        {/* 🔹 NOVOS BOTÕES PARA FILTRAR POR CATEGORIA */}
                        <div className="filtro-categoria-botoes">
                            <h3>🎯 Filtrar por categoria</h3>
                            <div className="botoes-categorias">
                                <button
                                    className="btn-explorer"
                                    onClick={() => setFiltrosPorColuna(prev => ({ ...prev, categoria: "explorer" }))}
                                >
                                    Explorer
                                </button>
                                <button
                                    className="btn-member"
                                    onClick={() => setFiltrosPorColuna(prev => ({ ...prev, categoria: "member" }))}
                                >
                                    Member
                                </button>
                                <button
                                    className="btn-mentor"
                                    onClick={() => setFiltrosPorColuna(prev => ({ ...prev, categoria: "mentor" }))}
                                >
                                    Mentor
                                </button>
                                <button
                                    className="btn-founder"
                                    onClick={() => setFiltrosPorColuna(prev => ({ ...prev, categoria: "founder" }))}
                                >
                                    Founder
                                </button>
                                <button
                                    className="btn-todos"
                                    onClick={() => setFiltrosPorColuna(prev => ({ ...prev, categoria: "" }))}
                                >
                                    Todos
                                </button>
                            </div>
                        </div>
                        {/* 🔹 NOVO INPUT COM DATALIST PARA FILTRAR PELO id_host */}
                        <div className="filtro-idhost">
                            <h3>🔑 Filtrar por Host</h3>
                            <input
                                list="lista-idhosts"
                                placeholder="Selecione um Host..."
                                onChange={(e) =>
                                    setFiltrosPorColuna(prev => ({
                                        ...prev,
                                        id_host: e.target.value
                                    }))
                                }
                            />
                            <datalist id="lista-idhosts">
                                {dados
                                    .map(linha => linha.id_host) // pega valores da coluna
                                    .filter((valor, index, self) => valor && self.indexOf(valor) === index) // remove duplicados e valores vazios
                                    .map((valor, i) => (
                                        <option key={i} value={valor} />
                                    ))}
                            </datalist>
                        </div>

                    </div>
                    {/* 🔹 BOTÃO PARA COPIAR EMAILS FILTRADOS */}
                    <div className="filtro-emails">
                        <h3>📧 Ações rápidas</h3>
                        <button
                            className="btn-copiar-emails"
                            onClick={() => {
                                const emails = dadosFiltrados
                                    .map(linha => linha.email) // pega os emails já filtrados
                                    .filter(email => !!email); // remove nulos/vazios

                                if (emails.length === 0) {
                                    setAlerta({ mensagem: "Nenhum email encontrado nos resultados filtrados.", tipo: "erro" });
                                    return;
                                }

                                navigator.clipboard.writeText(emails.join(", "))
                                    .then(() => {
                                        setAlerta({ mensagem: `${emails.length} emails copiados!`, tipo: "sucesso" });
                                    })
                                    .catch(() => {
                                        setAlerta({ mensagem: "Erro ao copiar emails.", tipo: "erro" });
                                    });
                            }}
                        >
                            Copiar emails filtrados
                        </button>
                    </div>

                    <br /><br /><br /><br />

                    <div className="area-tabela">
                        <table>
                            <thead>
                                <tr>
                                    {colunas.map(col => (
                                        (["funcao", "palavra_chave"].includes(col) && funcaoUsuario !== "admin") ||
                                            ["senha", "cargo", "responsabilidade"].includes(col)
                                            ? null
                                            : (
                                                <th key={col}>{col}</th>
                                            )
                                    ))}
                                    {funcaoUsuario === "admin" && <th>Ações</th>}
                                </tr>


                                <tr>
                                    {colunas.map(col => (
                                        (["funcao", "palavra_chave"].includes(col) && funcaoUsuario !== "admin") ||
                                            ["foto", "senha", "cargo", "responsabilidade"].includes(col)
                                            ? null
                                            : (
                                                <th key={col}>
                                                    <input
                                                        type="text"
                                                        placeholder={` ${col}`}
                                                        value={filtrosPorColuna[col] || ""}
                                                        onChange={(e) =>
                                                            setFiltrosPorColuna(prev => ({
                                                                ...prev,
                                                                [col]: e.target.value
                                                            }))
                                                        }
                                                        style={{ width: "100%", padding: "4px", fontSize: "0.8rem" }}
                                                    />
                                                </th>
                                            )
                                    ))}
                                </tr>

                            </thead>

                            <tbody>
                                {dadosPaginados.map((linha, i) => (
                                    <tr
                                        key={i}
                                        className={linhaSelecionada === i ? "linha-selecionada" : ""}
                                        onClick={(e) => {
                                            if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
                                                setLinhaSelecionada(i);
                                            }
                                        }}
                                    >
                                        {colunas.map(col => (
                                            (["funcao", "palavra_chave"].includes(col) && funcaoUsuario !== "admin") ||
                                                ["senha", "cargo", "responsabilidade"].includes(col)
                                                ? null
                                                : (
                                                    <td key={col}>
                                                        {String(linha[col])}
                                                    </td>
                                                )
                                        ))}

                                        <td>
                                            {["admin", "auditor", "coordenador"].includes(funcaoUsuario) && (
                                                <>
                                                    {(funcaoUsuario === "admin" || !linha.funcao) && (
                                                        <button
                                                            className="btn-editar"
                                                            onClick={() => setLinhaEditando(linha)}
                                                        >
                                                            Editar
                                                        </button>
                                                    )}

                                                    {(funcaoUsuario === "admin" || !linha.funcao) && (
                                                        <button
                                                            className="btn-apagar"
                                                            onClick={() => handleApagarConta(linha.id)}
                                                        >
                                                            Apagar
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                        </td>



                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="paginacao-tabela">
                        <button style={{
                            marginLeft: "200px"
                        }}
                            onClick={() => setPaginaAtual(p => Math.max(p - 1, 0))}
                            disabled={paginaAtual === 0}
                        >
                            ◀ Anterior
                        </button>
                        <span>
                            Página {paginaAtual + 1} de {Math.ceil(dados.length / registrosPorPagina)}
                        </span>
                        <button style={{
                            marginRight: "200px"
                        }}
                            onClick={() => setPaginaAtual(p => p + 1)}
                            disabled={(paginaAtual + 1) * registrosPorPagina >= dados.length}
                        >
                            Seguinte ▶
                        </button>
                    </div>
                </>
            )}
            {linhaEditando && (
                <div className="bancomodal-overlay">
                    <div className="modal-edicaobanco">
                        <h3>Editar Usuário</h3>
                        <form
                            className="formulario-edicao"
                            onSubmit={(e) => {
                                e.preventDefault();
                                salvarAlteracoes();
                            }}
                        >
                            {Object.entries(dadosEditados).map(([campo, valor]) => (
                                (campo === "senha" ||
                                    ["cargo", "responsabilidade"].includes(campo) ||
                                    (["funcao", "palavra_chave"].includes(campo) && funcaoUsuario !== "admin"))
                                    ? null
                                    : (
                                        <div key={campo} className="campo-edicao">
                                            <label htmlFor={`input-${campo}`}>{campo}</label>

                                            {campo === "funcao" ? (
                                                <select
                                                    id={`input-${campo}`}
                                                    value={valor || ""}
                                                    onChange={(e) =>
                                                        setDadosEditados((prev) => ({
                                                            ...prev,
                                                            [campo]: e.target.value
                                                        }))
                                                    }
                                                >
                                                    <option value=""></option>
                                                    <option value="admin">admin</option>
                                                    <option value="auditor">auditor</option>
                                                    <option value="coordenador">coordenador</option>
                                                </select>
                                            ) : campo === "categoria" ? (
                                                <select
                                                    id={`input-${campo}`}
                                                    value={valor || ""}
                                                    onChange={(e) =>
                                                        setDadosEditados((prev) => ({
                                                            ...prev,
                                                            [campo]: e.target.value
                                                        }))
                                                    }
                                                >
                                                    <option value=""></option>
                                                    <option value="mentor">mentor</option>
                                                    <option value="member">member</option>
                                                    <option value="explorer">explorer</option>
                                                    <option value="founder">founder</option>

                                                </select>
                                            ) : campo === "id" ? (
                                                <p id={`input-${campo}`} style={{ fontWeight: "bold", color: "#555" }}>{valor}</p>
                                            ) : (
                                                <input
                                                    id={`input-${campo}`}
                                                    type="text"
                                                    value={valor || ""}
                                                    onChange={(e) =>
                                                        setDadosEditados((prev) => ({
                                                            ...prev,
                                                            [campo]: e.target.value
                                                        }))
                                                    }
                                                />
                                            )}
                                        </div>
                                    )
                            ))}


                            <div className="botoes-edicao">
                                <button type="submit" className="bancobtn-salvar">💾 Salvar</button>
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setLinhaEditando(null)}
                                >
                                    Cancelar
                                </button>
                            </div><br /><br /><br />
                        </form>

                    </div>
                </div>
            )}

            {alerta.mensagem && (
                <div className={`alerta-custom alerta-${alerta.tipo}`}>
                    <p>{alerta.mensagem}</p>
                </div>
            )}

        </div>
    );
}
