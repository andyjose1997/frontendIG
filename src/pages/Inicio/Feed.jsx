import './Feed.css';
import { useRef, useState } from 'react';
import Reacoes from './feed-completo/reacoes';
import Comentarios from './feed-completo/comentarios';
import Postar from './feed-completo/postar';
import ModalConfirmacao from './feed-completo/ModalConfirmacao';
import MenuOpcoesPostagem from './feed-completo/MenuOpcoesPostagem';
import Postagem from './feed-completo/Postagem';
import PostagemSistema from './feed-completo/PostagemSistema'; // ✅ novo
import useFeedHandlers from './feed-completo/useFeedHandlers';
import './feed-completo/comentarios.css';
import './feed-completo/ModalConfirmacao.css';
import './feed-completo/Postagem.css';
import './feed-completo/postar.css';
import './feed-completo/reacoes.css';

export default function Feed() {
    const sectionRef = useRef(null);
    const [filtro, setFiltro] = useState("gerais"); // ✅ novo estado

    const {
        posts, setPosts,
        comentariosPorPost, setComentariosPorPost,
        novaPostagem, setNovaPostagem,
        reacoesPorPost, setReacoesPorPost,
        menuAberto, setMenuAberto,
        modoEdicao, setModoEdicao,
        novoTitulo, setNovoTitulo,
        mostrarInputComentario, setMostrarInputComentario,
        comentariosDigitados, setComentariosDigitados,
        comentariosEmEdicao, setComentariosEmEdicao,
        alerta, setAlerta,
        minhaReacaoPorPost, setMinhaReacaoPorPost,
        quantidadeComentariosVisiveis, setQuantidadeComentariosVisiveis,
        tiposDeReacao,
        buscarPostagens,
        enviarComentario,
        editarComentario,
        apagarComentario,
        removerPostagem,
        enviarReacao,
        criarPostagem,
        criarPostagemSistema,
        atualizarPostagem,
        verMaisComentarios,
        verTodosComentarios,
        reacoesPorComentario,
        enviarReacaoComentario,
        funcaoUsuario
    } = useFeedHandlers();




    const userId = localStorage.getItem('user_id');

    return (
        <div className="FeedWrapper">
            <ModalConfirmacao alerta={alerta} setAlerta={setAlerta} />
            <section ref={sectionRef} className="FeedSectionScroll">

                <div className="filtro-botoes" style={{ marginBottom: "1rem" }}>
                    {filtro !== "gerais" && (
                        <button className="btnPostGeral" onClick={() => setFiltro("gerais")}>Gerais</button>
                    )}
                    {filtro !== "postagens" && (
                        <button className="btnPostGeral" onClick={() => setFiltro("postagens")}>Postagens</button>
                    )}
                    {filtro !== "sistema" && (
                        <button className="btnPostGeral" onClick={() => setFiltro("sistema")}>Sistema</button>
                    )}
                </div>


                <h1 style={{ fontSize: "3rem" }}>
                    {filtro === "gerais" && "Últimas Notícias"}
                    {filtro === "postagens" && "Postagens dos Usuários"}
                    {filtro === "sistema" && "Notícias Oficiais do Sistema"}
                    {filtro === "muro" && "Muro de Serviços"}
                </h1>

                {(filtro !== "sistema" || ["admin", "auditor", "coordenador"].includes(funcaoUsuario)) && (
                    <Postar
                        novaPostagem={novaPostagem}
                        setNovaPostagem={setNovaPostagem}
                        criarPostagem={filtro === "sistema" ? criarPostagemSistema : criarPostagem}
                    />
                )}



                {/* 🔹 Renderizar posts filtrados */}
                {posts
                    .filter(post => {
                        if (filtro === "gerais") return true;
                        if (filtro === "postagens") return post.postagem === 1;
                        if (filtro === "sistema") return post.sistema === 1;
                        if (filtro === "muro") return post.muro === 1;
                        return true;
                    })
                    .map(post => (
                        filtro === "sistema" ? (
                            <PostagemSistema
                                key={post.id}
                                post={post}
                                userId={userId}
                                modoEdicao={modoEdicao}
                                novoTitulo={novoTitulo}
                                setNovoTitulo={setNovoTitulo}
                                setModoEdicao={setModoEdicao}
                                atualizarPostagem={atualizarPostagem}
                                menuAberto={menuAberto}
                                setMenuAberto={setMenuAberto}
                                removerPostagem={removerPostagem}
                                tiposDeReacao={tiposDeReacao}
                                enviarReacao={enviarReacao}
                                reacoesPorPost={reacoesPorPost}
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
                                reacoesPorComentario={reacoesPorComentario}
                                enviarReacaoComentario={enviarReacaoComentario}
                            />
                        ) : (
                            <Postagem
                                key={post.id}
                                post={post}
                                userId={userId}
                                modoEdicao={modoEdicao}
                                novoTitulo={novoTitulo}
                                setNovoTitulo={setNovoTitulo}
                                setModoEdicao={setModoEdicao}
                                atualizarPostagem={atualizarPostagem}
                                menuAberto={menuAberto}
                                setMenuAberto={setMenuAberto}
                                removerPostagem={removerPostagem}
                                tiposDeReacao={tiposDeReacao}
                                enviarReacao={enviarReacao}
                                reacoesPorPost={reacoesPorPost}
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
                                reacoesPorComentario={reacoesPorComentario}
                                enviarReacaoComentario={enviarReacaoComentario}
                            />
                        )
                    ))}
            </section>
        </div>
    );
}
