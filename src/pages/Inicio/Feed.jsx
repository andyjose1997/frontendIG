import './Feed.css';
import { useRef } from 'react';
import Reacoes from './feed-completo/reacoes';
import Comentarios from './feed-completo/comentarios';
import Postar from './feed-completo/postar';
import ModalConfirmacao from './feed-completo/ModalConfirmacao';
import MenuOpcoesPostagem from './feed-completo/MenuOpcoesPostagem';
import Postagem from './feed-completo/Postagem';
import useFeedHandlers from './feed-completo/useFeedHandlers';
import './feed-completo/comentarios.css';
import './feed-completo/ModalConfirmacao.css';
import './feed-completo/Postagem.css';
import './feed-completo/postar.css';
import './feed-completo/reacoes.css';

export default function Feed() {
    const sectionRef = useRef(null);
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
        atualizarPostagem,
        verMaisComentarios,
        verTodosComentarios,
        reacoesPorComentario, // ✅ NOVO
        enviarReacaoComentario // ✅ NOVO
    } = useFeedHandlers();

    const userId = localStorage.getItem('user_id');

    return (
        <div className="FeedWrapper">
            <ModalConfirmacao alerta={alerta} setAlerta={setAlerta} />
            <section ref={sectionRef} className="FeedSectionScroll">
                <h1 style={{ fontSize: "3rem" }}>Últimas Notícias</h1>

                <Postar
                    novaPostagem={novaPostagem}
                    setNovaPostagem={setNovaPostagem}
                    criarPostagem={criarPostagem}
                />

                {posts.map(post => (
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
                ))}
            </section>
        </div>
    );
}
