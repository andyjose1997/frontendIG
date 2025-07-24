import React from 'react';
import Reacoes from './reacoes';
import Comentarios from './comentarios';
import MenuOpcoesPostagem from './MenuOpcoesPostagem';

export default function Postagem({
    post,
    userId,
    modoEdicao,
    novoTitulo,
    setNovoTitulo,
    setModoEdicao,
    atualizarPostagem,
    menuAberto,
    setMenuAberto,
    removerPostagem,
    tiposDeReacao,
    enviarReacao,
    reacoesPorPost,
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
    enviarReacaoComentario,
    reacoesPorComentario,

}) {
    return (
        <div className="card-post">
            <div className="autor-info post-cabecalho">
                <div className="post-autor-detalhes">
                    <img
                        src={post.foto ? `http://localhost:8899/fotos/${post.foto}` : "/perfil.png"}
                        alt="Perfil"
                    />
                    <div>
                        <strong>
                            {post.nome.charAt(0).toUpperCase() + post.nome.slice(1).toLowerCase()}{" "}
                            {post.sobrenome.charAt(0).toUpperCase() + post.sobrenome.slice(1).toLowerCase()}
                        </strong><br />
                        <small>{post.data_postagem}</small>
                    </div>
                </div>

                <MenuOpcoesPostagem
                    post={post}
                    userId={userId}
                    menuAberto={menuAberto}
                    setMenuAberto={setMenuAberto}
                    setModoEdicao={setModoEdicao}
                    setNovoTitulo={setNovoTitulo}
                    removerPostagem={removerPostagem}
                />
            </div>

            {modoEdicao[post.id] ? (
                <div className="post-edicao">
                    <input
                        type="text"
                        value={novoTitulo[post.id]}
                        onChange={(e) =>
                            setNovoTitulo((prev) => ({
                                ...prev,
                                [post.id]: e.target.value
                            }))
                        }
                    />
                    <button onClick={() => atualizarPostagem(post.id)}>Salvar</button>
                </div>
            ) : (
                <h4>{post.titulo}</h4>
            )}

            <Reacoes
                post={post}
                tiposDeReacao={tiposDeReacao}
                enviarReacao={enviarReacao}
                reacoesPorPost={reacoesPorPost}
            />
            <Comentarios
                post={post}
                comentariosPorPost={comentariosPorPost}
                mostrarInputComentario={mostrarInputComentario}
                setMostrarInputComentario={setMostrarInputComentario}
                comentariosDigitados={comentariosDigitados}
                setComentariosDigitados={setComentariosDigitados}
                enviarComentario={enviarComentario}
                quantidadeComentariosVisiveis={quantidadeComentariosVisiveis}
                verMaisComentarios={verMaisComentarios}
                verTodosComentarios={verTodosComentarios}
                comentariosEmEdicao={comentariosEmEdicao}
                setComentariosEmEdicao={setComentariosEmEdicao}
                apagarComentario={apagarComentario}
                editarComentario={editarComentario}
                menuAberto={menuAberto}
                setMenuAberto={setMenuAberto}
                userId={userId}
                tiposDeReacao={tiposDeReacao}
                enviarReacaoComentario={enviarReacaoComentario}
                reacoesPorComentario={reacoesPorComentario}
            />
        </div>
    );
}
