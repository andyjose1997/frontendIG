// feed-completo/Comentarios.jsx
import React from 'react';
import Reacoes from './reacoes';

export default function Comentarios({
    post,
    comentariosPorPost,
    mostrarInputComentario,
    setMostrarInputComentario,
    comentariosDigitados,
    setComentariosDigitados,
    enviarComentario,
    quantidadeComentariosVisiveis,
    verMaisComentarios,
    verTodosComentarios,
    comentariosEmEdicao,
    setComentariosEmEdicao,
    apagarComentario,
    editarComentario,
    menuAberto,
    setMenuAberto,
    userId,
    tiposDeReacao,
    enviarReacaoComentario,
    reacoesPorComentario,

}) {
    const menuBotaoEstilo = {
        display: "block",
        padding: "10px",
        background: "none",
        border: "none",
        width: "100%",
        textAlign: "left",
        cursor: "pointer"
    };

    return (
        <div className="comentario-box">
            <button
                style={{ color: "white" }}
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

            {comentariosPorPost[post.id]?.length > 3 && (
                <button
                    onClick={() => verMaisComentarios(post.id)}
                    style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        backgroundColor: "#4a6ee0",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    {(quantidadeComentariosVisiveis[post.id] || 3) >= (comentariosPorPost[post.id]?.length || 0)
                        ? 'Ver Menos'
                        : 'Ver Mais Comentários'}
                </button>
            )}

            {(comentariosPorPost[post.id]?.length > 0 &&
                quantidadeComentariosVisiveis[post.id] !== comentariosPorPost[post.id].length) && (
                    <button
                        onClick={() => verTodosComentarios(post.id)}
                        style={{
                            marginTop: "10px",
                            marginLeft: "10px",
                            padding: "8px 16px",
                            backgroundColor: "#2e4cb8",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Ver Todos
                    </button>
                )}

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

            {(comentariosPorPost[post.id] || [])
                .slice(0, quantidadeComentariosVisiveis[post.id] || 3)
                .map(comentario => (
                    <div key={comentario.id} className="comentario-item" style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "10px", position: "relative" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <img
                                src={comentario.foto ? `http://localhost:8899/fotos/${comentario.foto}` : "/perfil.png"}
                                alt="Perfil"
                                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                            />
                            <strong>
                                {comentario.nome.charAt(0).toUpperCase() + comentario.nome.slice(1).toLowerCase()}{" "}
                                {comentario.sobrenome.charAt(0).toUpperCase() + comentario.sobrenome.slice(1).toLowerCase()}
                            </strong>
                            <small style={{ marginLeft: "auto", fontSize: "0.8rem" }}>{comentario.data_comentario}</small>

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
                                            {String(comentario.id_usuario) === String(userId) ? (
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
                                                        style={{
                                                            ...menuBotaoEstilo,
                                                            color: "#1e3a8a",
                                                            fontWeight: "600"
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.backgroundColor = "#e0e7ff";
                                                            e.target.style.color = "#1e40af";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.backgroundColor = "transparent";
                                                            e.target.style.color = "#1e3a8a";
                                                        }}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() => apagarComentario(comentario.id, post.id)}
                                                        style={{
                                                            ...menuBotaoEstilo,
                                                            color: "#dc2626",
                                                            fontWeight: "600"
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.backgroundColor = "#fee2e2";
                                                            e.target.style.color = "#b91c1c";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.backgroundColor = "transparent";
                                                            e.target.style.color = "#dc2626";
                                                        }}
                                                    >
                                                        Apagar
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => apagarComentario(comentario.id, post.id)}
                                                    style={{ ...menuBotaoEstilo, color: "red" }}
                                                >
                                                    Apagar
                                                </button>
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
                            <p style={{
                                marginLeft: "35px",
                                fontSize: "1.55rem",
                                wordBreak: "break-word",
                                overflowWrap: "break-word"
                            }}>
                                {comentario.texto}
                            </p>
                        )}



                    </div>
                ))}
        </div>
    );
}
