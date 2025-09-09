// feed-completo/Comentarios.jsx
import React from 'react';
import Reacoes from './reacoes';
import { URL } from '../../../config';
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
        <div className="comentarios-box">
            <button
                className="comentarios-botao-comentar"
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
                    className="comentarios-botao-vermais"
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
                        className="comentarios-botao-vertodos"
                    >
                        Ver Todos
                    </button>
                )}

            {mostrarInputComentario[post.id] && (
                <div className="comentarios-area-input">
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
                        className="comentarios-input"
                    />
                    <button
                        className="comentarios-botao-enviar"
                        onClick={() => enviarComentario(post.id)}
                    >
                        Enviar Comentário
                    </button>
                </div>
            )}

            {(comentariosPorPost[post.id] || [])
                .slice(0, quantidadeComentariosVisiveis[post.id] || 3)
                .map(comentario => (
                    <div key={comentario.id} className="comentarios-item">
                        <div className="comentarios-header">
                            <img
                                src={comentario.foto || "/perfil.png"}
                                alt="Perfil"
                                className="comentarios-foto"
                            />

                            <strong className="comentarios-nome">
                                {comentario.nome.charAt(0).toUpperCase() + comentario.nome.slice(1).toLowerCase()}{" "}
                                {comentario.sobrenome.charAt(0).toUpperCase() + comentario.sobrenome.slice(1).toLowerCase()}
                            </strong>
                            <small className="comentarios-data">{comentario.data_comentario}</small>

                            {(String(comentario.id_usuario) === String(userId) || String(post.id_usuario) === String(userId)) && (
                                <div className="comentarios-menu">
                                    <button
                                        onClick={() => setMenuAberto(prev => ({
                                            ...prev,
                                            [`comentario-${comentario.id}`]: !prev[`comentario-${comentario.id}`]
                                        }))}
                                        className="comentarios-menu-toggle"
                                    >
                                        ⋮
                                    </button>

                                    {menuAberto[`comentario-${comentario.id}`] && (
                                        <div className="comentarios-menu-opcoes">
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
                                                        className="comentarios-menu-editar"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() => apagarComentario(comentario.id, post.id)}
                                                        className="comentarios-menu-apagar"
                                                    >
                                                        Apagar
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => apagarComentario(comentario.id, post.id)}
                                                    className="comentarios-menu-apagar"
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
                            <div className="comentarios-editar-area">
                                <input
                                    type="text"
                                    value={comentariosEmEdicao[comentario.id]}
                                    onChange={(e) =>
                                        setComentariosEmEdicao((prev) => ({
                                            ...prev,
                                            [comentario.id]: e.target.value
                                        }))
                                    }
                                    className="comentarios-editar-input"
                                />
                                <button
                                    onClick={() => editarComentario(comentario.id, comentariosEmEdicao[comentario.id], post.id)}
                                    className="comentarios-editar-salvar"
                                >
                                    Salvar
                                </button>
                            </div>
                        ) : (
                            <p className="comentarios-texto">
                                {comentario.texto}
                            </p>
                        )}
                    </div>
                ))}
        </div>
    );

}
