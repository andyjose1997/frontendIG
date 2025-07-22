import './Feed.css';
import { useState, useEffect, useRef } from 'react';

export default function Feed() {
    const sectionRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [comentariosPorPost, setComentariosPorPost] = useState({});
    const [novaPostagem, setNovaPostagem] = useState("");
    const [reacoesPorPost, setReacoesPorPost] = useState({});
    const [menuAberto, setMenuAberto] = useState({});
    const [modoEdicao, setModoEdicao] = useState({});
    const [novoTitulo, setNovoTitulo] = useState({});
    const [mostrarInputComentario, setMostrarInputComentario] = useState({});
    const [comentariosDigitados, setComentariosDigitados] = useState({});
    const [comentariosEmEdicao, setComentariosEmEdicao] = useState({});

    const userId = localStorage.getItem('user_id');

    const buscarComentarios = async (postId) => {
        const resposta = await fetch(`http://localhost:8899/comentarios/${postId}`);
        const dados = await resposta.json();
        setComentariosPorPost((prev) => ({
            ...prev,
            [postId]: dados
        }));
    };

    const editarComentario = async (idComentario, novoTexto, idPostagem) => {
        if (!novoTexto.trim()) {
            alert("O comentário não pode estar vazio.");
            return;
        }

        await fetch(`http://localhost:8899/comentarios/${idComentario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ texto: novoTexto })
        });

        // Limpa o estado de edição
        setComentariosEmEdicao((prev) => ({
            ...prev,
            [idComentario]: undefined
        }));

        await buscarComentarios(idPostagem);
    };

    const tiposDeReacao = [
        { tipo: "blz", imagem: "/reacoes/blz.png" },
        { tipo: "risada", imagem: "/reacoes/risada.png" },
        { tipo: "seila", imagem: "/reacoes/seila.jpg" },
        { tipo: "surpreso", imagem: "/reacoes/surpreso.jpg" },
        { tipo: "amei", imagem: "/reacoes/amei.png" },
    ];

    const enviarComentario = async (postId) => {
        const comentario = comentariosDigitados[postId]?.trim();
        if (!comentario) return;

        await fetch(`http://localhost:8899/postagens/${postId}/comentar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ texto: comentario })
        });

        setComentariosDigitados((prev) => ({
            ...prev,
            [postId]: ""
        }));

        setMostrarInputComentario((prev) => ({
            ...prev,
            [postId]: false
        }));

        await buscarComentarios(postId);
    };

    const buscarPostagens = async () => {
        const resposta = await fetch('http://localhost:8899/postagens');
        const dados = await resposta.json();
        setPosts(dados);
        dados.forEach(post => {
            buscarReacoes(post.id);
            buscarComentarios(post.id); // ✅ buscar comentários junto com posts
        });
    };

    const buscarReacoes = async (postId) => {
        const resposta = await fetch(`http://localhost:8899/reacoes/${postId}`);
        const dados = await resposta.json();
        setReacoesPorPost(prev => ({
            ...prev,
            [postId]: dados
        }));
    };
    const menuBotaoEstilo = {
        display: "block",
        padding: "10px",
        background: "none",
        border: "none",
        width: "100%",
        textAlign: "left",
        cursor: "pointer"
    };
    const apagarComentario = async (idComentario, idPostagem) => {
        const confirmar = window.confirm("Deseja apagar este comentário?");
        if (!confirmar) return;

        await fetch(`http://localhost:8899/comentarios/deletar/${idComentario}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        await buscarComentarios(idPostagem);
    };

    const enviarReacao = async (postId, tipoReacao) => {
        await fetch(`http://localhost:8899/reacoes/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ tipo_reacao: tipoReacao })
        });
        buscarReacoes(postId);
    };

    const criarPostagem = async () => {
        if (novaPostagem.trim() === "") return;

        await fetch('http://localhost:8899/postagens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ titulo: novaPostagem })
        });

        setNovaPostagem("");
        buscarPostagens();
    };

    const removerPostagem = async (postId) => {
        await fetch(`http://localhost:8899/postagens/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        buscarPostagens();
    };

    const atualizarPostagem = async (postId) => {
        await fetch(`http://localhost:8899/postagens/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ titulo: novoTitulo[postId] })
        });

        setModoEdicao((prev) => ({ ...prev, [postId]: false }));
        buscarPostagens();
    };

    useEffect(() => {
        buscarPostagens();
    }, []);

    return (
        <div className="FeedWrapper">
            <section ref={sectionRef} className="FeedSectionScroll">
                <h3>Últimas Notícias</h3>

                <div className="nova-postagem-box">
                    <input
                        type="text"
                        className="nova-postagem-input"
                        placeholder="Escreva uma nova postagem..."
                        value={novaPostagem}
                        onChange={(e) => setNovaPostagem(e.target.value)}
                    />
                    <button className="nova-postagem-botao" onClick={criarPostagem}>Postar</button>
                </div>

                {posts.map(post => (
                    <div key={post.id} className="card-post">
                        <div className="autor-info" style={{ justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <img
                                    src={post.foto ? `http://localhost:8899/fotos/${post.foto}` : "/perfil.png"}
                                    alt="Perfil"
                                />
                                <div>
                                    <strong>{post.nome} {post.sobrenome}</strong><br />
                                    <small>{post.data_postagem}</small>
                                </div>
                            </div>

                            {String(post.id_usuario) === String(userId) && (
                                <div style={{ position: "relative" }}>
                                    <button
                                        onClick={() => setMenuAberto((prev) => ({
                                            ...prev,
                                            [post.id]: !prev[post.id]
                                        }))}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            fontSize: "1.5rem",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ⋮
                                    </button>

                                    {menuAberto[post.id] && (
                                        <div style={{
                                            position: "absolute",
                                            right: 0,
                                            top: "100%",
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                                            zIndex: 1
                                        }}>
                                            <button
                                                onClick={() => {
                                                    setModoEdicao((prev) => ({ ...prev, [post.id]: true }));
                                                    setNovoTitulo((prev) => ({ ...prev, [post.id]: post.titulo }));
                                                    setMenuAberto((prev) => ({ ...prev, [post.id]: false }));
                                                }}
                                                style={{
                                                    display: "block",
                                                    padding: "10px",
                                                    background: "none",
                                                    border: "none",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => removerPostagem(post.id)}
                                                style={{
                                                    display: "block",
                                                    padding: "10px",
                                                    background: "none",
                                                    border: "none",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    cursor: "pointer",
                                                    color: "red"
                                                }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {modoEdicao[post.id] ? (
                            <div style={{ marginTop: "1rem" }}>
                                <input
                                    type="text"
                                    value={novoTitulo[post.id]}
                                    onChange={(e) => setNovoTitulo((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value
                                    }))}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        border: "1px solid #ccc"
                                    }}
                                />
                                <button
                                    onClick={() => atualizarPostagem(post.id)}
                                    style={{
                                        marginTop: "10px",
                                        padding: "10px 20px",
                                        backgroundColor: "#0d6efd",
                                        color: "white",
                                        fontWeight: "bold",
                                        border: "none",
                                        borderRadius: "10px"
                                    }}
                                >
                                    Salvar
                                </button>
                            </div>
                        ) : (
                            <h4>{post.titulo}</h4>
                        )}

                        <div className="reacoes-box">
                            <div className="reacoes-container">
                                <button
                                    className="reacao-botao"
                                    onClick={() => enviarReacao(post.id, "blz")}
                                >
                                    <img src="/reacoes/blz.png" alt="blz" />
                                </button>

                                <div className="reacoes-opcoes">
                                    {tiposDeReacao.map(reacao => (
                                        <button
                                            key={reacao.tipo}
                                            className="reacao-botao"
                                            onClick={() => enviarReacao(post.id, reacao.tipo)}
                                        >
                                            <img src={reacao.imagem} alt={reacao.tipo} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="contagem-reacoes">
                                {(reacoesPorPost[post.id] || []).map(item => (
                                    <span key={item.tipo_reacao} style={{ marginRight: "10px", fontSize: "14px" }}>
                                        <img
                                            src={tiposDeReacao.find(r => r.tipo === item.tipo_reacao)?.imagem}
                                            alt={item.tipo_reacao}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                marginRight: "5px",
                                                verticalAlign: "middle"
                                            }}
                                        />
                                        {item.total}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="comentario-box">
                            <button
                                className="botao-comentar"
                                onClick={() =>
                                    setMostrarInputComentario((prev) => ({
                                        ...prev,
                                        [post.id]: !prev[post.id]
                                    }))
                                }
                            >
                                💬 Comentar
                            </button>

                            {mostrarInputComentario[post.id] && (
                                <div style={{ marginTop: "1rem" }}>
                                    <input
                                        type="text"
                                        placeholder="Escreva seu comentário..."
                                        value={comentariosDigitados[post.id] || ""}
                                        onChange={(e) =>
                                            setComentariosDigitados((prev) => ({
                                                ...prev,
                                                [post.id]: e.target.value
                                            }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "10px",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                    <button
                                        style={{
                                            marginTop: "10px",
                                            padding: "10px 20px",
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            fontWeight: "bold",
                                            border: "none",
                                            borderRadius: "10px"
                                        }}
                                        onClick={() => enviarComentario(post.id)}
                                    >
                                        Enviar Comentário
                                    </button>
                                </div>
                            )}

                            {/* 🔽 Lista de Comentários */}
                            {/* 🔽 Lista de Comentários */}
                            {(comentariosPorPost[post.id] || []).map(comentario => (
                                <div key={comentario.id} className="comentario-item" style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "10px", position: "relative" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <img
                                            src={comentario.foto ? `http://localhost:8899/fotos/${comentario.foto}` : "/perfil.png"}
                                            alt="Perfil"
                                            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                                        />
                                        <strong>{comentario.nome} {comentario.sobrenome}</strong>
                                        <small style={{ marginLeft: "auto", fontSize: "0.8rem" }}>{comentario.data_comentario}</small>

                                        {/* ⋮ Botão de opções */}
                                        {(String(comentario.id_usuario) === String(userId) || String(post.id_usuario) === String(userId)) && (
                                            <div style={{ position: "relative" }}>
                                                <button
                                                    onClick={() => setMenuAberto(prev => ({
                                                        ...prev,
                                                        [`comentario-${comentario.id}`]: !prev[`comentario-${comentario.id}`]
                                                    }))}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        fontSize: "1.5rem",
                                                        cursor: "pointer",
                                                        marginLeft: "8px"
                                                    }}
                                                >
                                                    ⋮
                                                </button>

                                                {menuAberto[`comentario-${comentario.id}`] && (
                                                    <div style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "100%",
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "8px",
                                                        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                                                        zIndex: 1
                                                    }}>
                                                        {/* Se for o autor do comentário */}
                                                        {String(comentario.id_usuario) === String(userId) && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setComentariosEmEdicao((prev) => ({
                                                                            ...prev,
                                                                            [comentario.id]: comentario.texto
                                                                        }));
                                                                        setMenuAberto((prev) => ({
                                                                            ...prev,
                                                                            [`comentario-${comentario.id}`]: false
                                                                        }));
                                                                    }}
                                                                    style={menuBotaoEstilo}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => apagarComentario(comentario.id, post.id)}
                                                                    style={{ ...menuBotaoEstilo, color: "red" }}
                                                                >
                                                                    Apagar
                                                                </button>
                                                            </>
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {comentariosEmEdicao[comentario.id] !== undefined ? (
                                        <div style={{ marginLeft: "35px", marginTop: "10px" }}>
                                            <input
                                                type="text"
                                                value={comentariosEmEdicao[comentario.id]}
                                                onChange={(e) =>
                                                    setComentariosEmEdicao((prev) => ({
                                                        ...prev,
                                                        [comentario.id]: e.target.value
                                                    }))
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                            <button
                                                onClick={() => editarComentario(comentario.id, comentariosEmEdicao[comentario.id], post.id)}
                                                style={{
                                                    marginTop: "5px",
                                                    padding: "6px 12px",
                                                    backgroundColor: "#28a745",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "6px"
                                                }}
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    ) : (
                                        <p style={{ marginLeft: "35px", fontSize: "0.95rem" }}>{comentario.texto}</p>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
