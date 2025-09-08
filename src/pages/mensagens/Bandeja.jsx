import { useState, useEffect, useRef } from 'react';
import { URL } from '../../config';
import './Bandeja.css';
import ModalUsuario from './modalUsuario';

export default function Bandeja() {
    const [usuarios, setUsuarios] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [mensagemNova, setMensagemNova] = useState("");
    const [editando, setEditando] = useState(null);
    const [resposta, setResposta] = useState(null);
    const [menuAberto, setMenuAberto] = useState(null);
    const [confirmarApagar, setConfirmarApagar] = useState(null);
    const [busca, setBusca] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const [indicados, setIndicados] = useState([]);
    const [quantidadeNaoLidas, setQuantidadeNaoLidas] = useState(0); // 🔹 novo

    const userId = localStorage.getItem("id");
    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [dadosUsuario, setDadosUsuario] = useState(null);

    const buscarUsuarios = async (valor) => {
        setBusca(valor);

        if (valor.trim() === "") {
            setSugestoes([]);
            return;
        }

        try {
            const res = await fetch(`${URL}/mensagens/indicados/${userId}?q=${encodeURIComponent(valor)}`);
            const data = await res.json();
            setSugestoes(data);
        } catch (err) {
            console.error("Erro ao buscar indicados:", err);
        }
    };

    useEffect(() => {
        const carregarIndicados = async () => {
            try {
                const res = await fetch(`${URL}/mensagens/indicados/${userId}`);
                const data = await res.json();
                setIndicados(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao carregar indicados:", err);
            }
        };
        if (userId) carregarIndicados();
    }, [userId]);

    // abrir modal e buscar info do usuário
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

    // fechar ao clicar fora
    useEffect(() => {
        const handleClickFora = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAberto(null); // fecha
            }
        };

        if (menuAberto !== null) {
            document.addEventListener("mousedown", handleClickFora);
        } else {
            document.removeEventListener("mousedown", handleClickFora);
        }

        return () => document.removeEventListener("mousedown", handleClickFora);
    }, [menuAberto]);

    // 🔹 ref para rolar até a última mensagem
    const fimRef = useRef(null);
    useEffect(() => {
        if (fimRef.current) {
            fimRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [mensagens]);

    // 🔹 Carregar contatos
    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const res = await fetch(`${URL}/mensagens/meus_contatos/${userId}`);
                const data = await res.json();
                setUsuarios(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao carregar contatos:", err);
            }
        };
        if (userId) carregarUsuarios();
    }, [userId]);

    // 🔹 Carregar conversa
    const carregarMensagens = async (destinatario) => {
        setSelecionado(destinatario);
        try {
            // 🔹 carrega conversa
            const res = await fetch(`${URL}/mensagens/${userId}/${destinatario.id}`);
            const data = await res.json();
            setMensagens(data.dados || data);

            // 🔹 guarda qtd não lidas antes de marcar
            setQuantidadeNaoLidas(destinatario.nao_lidas || 0);

            // 🔹 marca todas como lidas
            await fetch(`${URL}/mensagens/marcar_lidas/${destinatario.id}/${userId}`, {
                method: "PUT"
            });

            // 🔹 recarregar contatos para atualizar os badges
            const contatosRes = await fetch(`${URL}/mensagens/meus_contatos/${userId}`);
            const contatosData = await contatosRes.json();
            setUsuarios(Array.isArray(contatosData) ? contatosData : []);
        } catch (err) {
            console.error("Erro ao carregar mensagens:", err);
        }
    };

    // 🔹 Enviar ou editar
    const enviarMensagem = async () => {
        if (!mensagemNova.trim() || !selecionado) return;

        if (editando) {
            // editar
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
            // enviar
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

    return (
        <main className="mensagens-container">
            {!selecionado ? (
                <>
                    <h2>📨 Seus contatos</h2>
                    <div className="busca-container">
                        <input
                            type="text"
                            placeholder="🔍 Buscar indicado..."
                            value={busca}
                            onChange={(e) => buscarUsuarios(e.target.value)}
                        />

                        {sugestoes.length > 0 && (
                            <ul className="sugestoes-lista">
                                {sugestoes.map(u => (
                                    <li key={u.id} onClick={() => {
                                        carregarMensagens(u);
                                        setBusca("");
                                        setSugestoes([]);
                                    }}>
                                        <div className="sugestao-avatar">{u.nome?.charAt(0)}</div>
                                        <div className="sugestao-info">
                                            <strong>{u.nome}</strong>
                                            <span>{u.email}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <ul className="lista-mensagens">
                        {usuarios.length === 0 ? (
                            <p>⚠️ Nenhum contato encontrado</p>
                        ) : (
                            usuarios.map((u) => (
                                <li key={u.id} className="mensagem-item" onClick={() => carregarMensagens(u)}>
                                    <div className="mensagem-avatar">
                                        {u.foto ? (
                                            <img
                                                src={`${URL}/fotos/${u.foto}`}
                                                alt={u.nome}
                                                className="avatar-foto"
                                            />
                                        ) : (
                                            <span>{u.nome?.charAt(0)}</span> // fallback se não tiver foto
                                        )}
                                    </div>
                                    <div className="mensagem-detalhes">
                                        <strong>{u.nome}</strong>
                                        <p>{u.email}</p>
                                    </div>

                                    {u.nao_lidas > 0 && (
                                        <span className="badge-nao-lidas">{u.nao_lidas}</span>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>

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

                            // 🔹 mostra linha "não lida(s)" no ponto certo
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
                                        {/* Texto da resposta */}
                                        {msg.resposta_conteudo && (
                                            <div className="resposta">{msg.resposta_conteudo}</div>
                                        )}

                                        <p>
                                            <strong>{msg.remetente_id === userId ? "Você" : msg.nome}:</strong> {msg.conteudo}
                                            {msg.editado ? <span className="editada"> (editada)</span> : ""}
                                        </p>

                                        {/* Três pontos */}
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

                        {/* 🔹 ref para scroll automático */}
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
                                    e.preventDefault(); // evita quebra de linha
                                    enviarMensagem();
                                }
                            }}
                        />

                        <button onClick={enviarMensagem}>{editando ? "Salvar" : "Enviar"}</button>
                    </div>
                </>
            )}
            {mostrarModalUsuario && (
                <ModalUsuario usuario={dadosUsuario} onClose={() => setMostrarModalUsuario(false)} />
            )}
            {confirmarApagar && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <h3>⚠️ Tem certeza que deseja apagar esta mensagem?</h3>
                        <div className="botoes">
                            <button className="btn-nao" onClick={() => setConfirmarApagar(null)}>Não tenho</button>
                            <button className="btn-sim" onClick={() => {
                                apagarMensagem(confirmarApagar);
                                setConfirmarApagar(null);
                            }}>Tenho</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
