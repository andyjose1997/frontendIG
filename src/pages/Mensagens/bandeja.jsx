// 📂 src/componentes/Bandeja.jsx
import { useState, useEffect, useRef } from 'react';
import { URL } from '../../config';
import './bandeja.css';
import ModalUsuarioMensagem from './modalusuariomensagem';

export default function Bandeja() {
    const userId = localStorage.getItem("usuario_id");

    const [usuarios, setUsuarios] = useState({
        host: [],
        historico: [],
        indicados: []
    });
    console.log("🧩 Usuario ID logado:", userId);

    const [selecionado, setSelecionado] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [mensagemNova, setMensagemNova] = useState("");
    const [editando, setEditando] = useState(null);
    const [resposta, setResposta] = useState(null);
    const [menuAberto, setMenuAberto] = useState(null);
    const [confirmarApagar, setConfirmarApagar] = useState(null);
    const [busca, setBusca] = useState("");
    const [quantidadeNaoLidas, setQuantidadeNaoLidas] = useState(0);


    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [dadosUsuario, setDadosUsuario] = useState(null);

    // 🔹 Buscar contatos (host, histórico e indicados)
    const carregarUsuarios = async (filtro = "") => {
        try {
            const res = await fetch(`${URL}/mensagens/contatos/${userId}?q=${encodeURIComponent(filtro)}`);
            const data = await res.json();

            setUsuarios({
                host: data.host || [],
                historico: data.historico || [],
                indicados: data.indicados || []
            });
        } catch (err) {
            console.error("Erro ao carregar contatos:", err);
            setUsuarios({ host: [], historico: [], indicados: [] });
        }
    };


    useEffect(() => {
        if (userId) carregarUsuarios(busca);
    }, [userId, busca]);

    // 🔹 Abrir modal de perfil
    const abrirModalUsuario = async () => {
        try {
            const res = await fetch(`${URL}/perfil/${selecionado.id}`);
            const data = await res.json();
            setDadosUsuario(data);
            setMostrarModalUsuario(true);
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
        }
    };

    const menuRef = useRef(null);

    // 🔹 Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickFora = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAberto(null);
            }
        };
        if (menuAberto !== null) {
            document.addEventListener("mousedown", handleClickFora);
        }
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, [menuAberto]);

    // 🔹 Scroll automático até última mensagem
    const fimRef = useRef(null);
    useEffect(() => {
        if (fimRef.current) {
            fimRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [mensagens]);

    // 🔹 Carregar conversa
    const carregarMensagens = async (destinatario) => {
        setSelecionado(destinatario);
        try {
            const res = await fetch(`${URL}/mensagens/${userId}/${destinatario.id}`);
            const data = await res.json();
            setMensagens(data.dados || data);

            setQuantidadeNaoLidas(destinatario.nao_lidas || 0);

            await fetch(`${URL}/mensagens/marcar_lidas/${destinatario.id}/${userId}`, {
                method: "PUT"
            });

            carregarUsuarios(busca);
        } catch (err) {
            console.error("Erro ao carregar mensagens:", err);
        }
    };

    // 🔹 Enviar ou editar
    const enviarMensagem = async () => {
        if (!mensagemNova.trim() || !selecionado) return;

        if (editando) {
            await fetch(`${URL}/mensagens/${editando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conteudo: mensagemNova })
            });
            setMensagens(prev =>
                prev.map(m => m.id === editando ? { ...m, conteudo: mensagemNova, editado: 1 } : m)
            );
            setEditando(null);
        } else {
            const res = await fetch(`${URL}/mensagens/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    remetente_id: userId,
                    destinatario_id: selecionado.id,
                    conteudo: mensagemNova,
                    resposta_id: resposta?.id || null
                })
            });
            const data = await res.json();
            setMensagens(prev => [...prev, data.dados]);
            setResposta(null);
        }

        setMensagemNova("");
    };

    // 🔹 Apagar
    const apagarMensagem = async (id) => {
        await fetch(`${URL}/mensagens/${id}`, { method: "DELETE" });
        setMensagens(prev => prev.filter(m => m.id !== id));
    };

    // 🔹 Renderizar lista de contatos por grupo
    const renderLista = (titulo, lista = []) => (
        <>
            {lista.length > 0 && <h3 className="grupo-titulo">{titulo}</h3>}
            <ul className="lista-mensagens">
                {lista.length === 0 ? (
                    <p>⚠️ Nenhum contato encontrado</p>
                ) : (
                    lista.map((u) => (
                        <li key={u.id} className="mensagem-item" onClick={() => carregarMensagens(u)}>
                            <div className="mensagem-avatar">
                                <img
                                    src={u.foto || "/Logo/perfilPadrao/M.png"}
                                    alt={`Foto de ${u.nome}`}
                                    className="avatar-foto"
                                />
                            </div>
                            <div className="mensagem-detalhes">
                                <strong>
                                    {u.nome} {u.sobrenome}
                                </strong>
                                <p>{u.email}</p>
                            </div>

                            {u.nao_lidas > 0 && <span className="badge-nao-lidas">{u.nao_lidas}</span>}
                        </li>
                    ))
                )}
            </ul>
        </>
    );

    return (
        <main className="mensagens-container">
            {!selecionado ? (
                <>
                    <h2>📨 Seus contatos</h2>
                    <div className="busca-container">
                        <input
                            type="text"
                            placeholder="🔍 Buscar contato..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />

                    </div>
                    <h2>Seu host</h2>

                    {renderLista("⭐ Seu Host", usuarios.host)}
                    {renderLista("💬 Conversas", usuarios.historico)}
                    {renderLista("👥 Indicados", usuarios.indicados)}

                </>
            ) : (
                <>
                    <button onClick={() => setSelecionado(null)} className="voltar-botao">⬅ Voltar</button>
                    <h2 className='conversaCom' onClick={abrirModalUsuario} style={{ cursor: "pointer" }}>
                        💬 Conversa com {selecionado.nome}
                    </h2>

                    <div className="conversa-historico">
                        {mensagens.map((msg, i) => {
                            const anterior = mensagens[i - 1];
                            const mudouAutor = !anterior || anterior.remetente_id !== msg.remetente_id;
                            const mostrarSeparador =
                                quantidadeNaoLidas > 0 && i === mensagens.length - quantidadeNaoLidas;

                            return (
                                <div key={msg.id}>
                                    {mostrarSeparador && (
                                        <div className="linha-nao-lidas">─── 📩 Não lida(s) ───</div>
                                    )}

                                    <div
                                        className={`mensagem-bolha ${msg.remetente_id === userId ? "enviada" : "recebida"} ${mudouAutor ? "mensagem-grupo" : ""}`}
                                    >
                                        {msg.resposta_conteudo && (
                                            <div className="resposta">{msg.resposta_conteudo}</div>
                                        )}

                                        <p>
                                            <strong>{msg.remetente_id === userId ? "Você" : msg.nome}:</strong> {msg.conteudo}
                                            {msg.editado ? <span className="editada"> (editada)</span> : ""}
                                        </p>

                                        <div className="mensagem-menu" onClick={() => setMenuAberto(menuAberto === msg.id ? null : msg.id)}>
                                            ⋮
                                        </div>

                                        {menuAberto === msg.id && (
                                            <div className="mensagem-opcoes" ref={menuRef}>
                                                {msg.remetente_id === userId && (
                                                    <>
                                                        <button onClick={() => { setMensagemNova(msg.conteudo); setEditando(msg.id); }}>✏️ Editar</button>
                                                        <button onClick={() => setConfirmarApagar(msg.id)}>🗑️ Apagar</button>
                                                    </>
                                                )}
                                                <button onClick={() => setResposta(msg)}>↩️ Responder</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={fimRef}></div>
                    </div>

                    {resposta && (
                        <div className="resposta-preview">
                            ↩️ Respondendo: <em>{resposta.conteudo}</em>
                            <button onClick={() => setResposta(null)}>❌</button>
                        </div>
                    )}

                    <div className="mensagem-input">
                        <input
                            type="text"
                            placeholder={editando ? "Editando mensagem..." : "Digite sua mensagem..."}
                            value={mensagemNova}
                            onChange={(e) => setMensagemNova(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    enviarMensagem();
                                }
                            }}
                        />
                        <button onClick={enviarMensagem}>{editando ? "Salvar" : "Enviar"}</button>
                    </div>
                </>
            )}

            {mostrarModalUsuario && (
                <ModalUsuarioMensagem usuario={dadosUsuario} onClose={() => setMostrarModalUsuario(false)} />
            )}

            {confirmarApagar && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <h3>⚠️ Tem certeza que deseja apagar esta mensagem?</h3>
                        <div className="botoes">
                            <button className="btn-nao" onClick={() => setConfirmarApagar(null)}>Não</button>
                            <button className="btn-sim" onClick={() => {
                                apagarMensagem(confirmarApagar);
                                setConfirmarApagar(null);
                            }}>Sim</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
