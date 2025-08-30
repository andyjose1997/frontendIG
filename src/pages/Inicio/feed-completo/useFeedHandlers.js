import { useState, useEffect } from 'react';
import { URL } from '../../../config';
const tiposDeReacao = [
    { tipo: "blz", imagem: "/reacoes/blz.png" },
    { tipo: "risada", imagem: "/reacoes/risada.png" },
    { tipo: "seila", imagem: "/reacoes/seila.jpg" },
    { tipo: "surpreso", imagem: "/reacoes/surpreso.jpg" },
    { tipo: "amei", imagem: "/reacoes/amei.png" },
];

export default function useFeedHandlers() {
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
    const [alerta, setAlerta] = useState({ visivel: false, mensagem: '', aoConfirmar: null });
    const [minhaReacaoPorPost, setMinhaReacaoPorPost] = useState({});
    const [quantidadeComentariosVisiveis, setQuantidadeComentariosVisiveis] = useState({});
    const [funcaoUsuario, setFuncaoUsuario] = useState("");

    const userId = localStorage.getItem('user_id');

    const buscarComentarios = async (postId) => {
        const resposta = await fetch(`${URL}/comentarios/${postId}`);
        const dados = await resposta.json();
        setComentariosPorPost((prev) => ({ ...prev, [postId]: dados }));
    };

    const buscarMinhaReacao = async (postId) => {
        const resposta = await fetch(`${URL}/reacoes/minha/${postId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const dados = await resposta.json();
        setMinhaReacaoPorPost(prev => ({ ...prev, [postId]: dados.tipo_reacao }));
    };
    const buscarFuncaoUsuario = async () => {
        const token = localStorage.getItem("token");
        const resposta = await fetch(`${URL}/perfil`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const dados = await resposta.json();
        setFuncaoUsuario(dados.funcao); // 🔹 funcao vem da tabela usuarios
    };

    const editarComentario = async (idComentario, novoTexto, idPostagem) => {
        if (!novoTexto.trim()) {
            alert("O comentário não pode estar vazio.");
            return;
        }

        await fetch(`${URL}/comentarios/${idComentario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ texto: novoTexto })
        });

        setComentariosEmEdicao((prev) => ({ ...prev, [idComentario]: undefined }));
        await buscarComentarios(idPostagem);
    };

    const enviarComentario = async (postId) => {
        const comentario = comentariosDigitados[postId]?.trim();
        if (!comentario) return;

        await fetch(`${URL}/comentarios/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ texto: comentario })
        });

        setComentariosDigitados((prev) => ({ ...prev, [postId]: "" }));
        setMostrarInputComentario((prev) => ({ ...prev, [postId]: false }));

        // 🔹 garante atualização logo após enviar
        await buscarComentarios(postId);
    };


    const buscarPostagens = async () => {
        const resposta = await fetch(`${URL}/postagens`);
        const dados = await resposta.json();
        setPosts(dados);
        dados.forEach(post => {
            if (!post.id) {
                console.warn("Post inválido:", post);
                return;
            }
            buscarReacoes(post.id);
            buscarComentarios(post.id);
            buscarMinhaReacao(post.id);
        });
    };

    const buscarReacoes = async (postId) => {
        const resposta = await fetch(`${URL}/reacoes/totais/${postId}`);
        const dados = await resposta.json();
        setReacoesPorPost(prev => ({ ...prev, [postId]: dados }));
    };

    const apagarComentario = (idComentario, idPostagem) => {
        setAlerta({
            visivel: true,
            mensagem: 'Deseja apagar este comentário?',
            aoConfirmar: async () => {
                await fetch(`${URL}/comentarios/deletar/${idComentario}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                await buscarComentarios(idPostagem);
            }
        });
    };

    const removerPostagem = (postId) => {
        setAlerta({
            visivel: true,
            mensagem: 'Deseja apagar esta postagem?',
            aoConfirmar: async () => {
                await fetch(`${URL}/postagens/${postId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                await buscarPostagens();
            }
        });
    };

    const enviarReacao = async (postId, tipoReacao) => {
        const reacaoAtual = minhaReacaoPorPost[postId];

        if (reacaoAtual === tipoReacao) {
            await fetch(`${URL}/reacoes/remover/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        } else {
            await fetch(`${URL}/reacoes/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ tipo_reacao: tipoReacao })
            });
        }

        buscarReacoes(postId);
        buscarMinhaReacao(postId);
    };

    const criarPostagem = async () => {
        if (novaPostagem.trim() === "") return;

        await fetch(`${URL}/postagens`, {
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
    const criarPostagemSistema = async () => {
        if (novaPostagem.trim() === "") return;

        await fetch(`${URL}/postagens/sistema`, {
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

    const atualizarPostagem = async (postId) => {
        await fetch(`${URL}/postagens/${postId}`, {
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

    const verMaisComentarios = (postId) => {
        setQuantidadeComentariosVisiveis(prev => ({
            ...prev,
            [postId]: (prev[postId] || 3) >= (comentariosPorPost[postId]?.length || 0)
                ? 3
                : (prev[postId] || 3) + 3
        }));
    };

    const verTodosComentarios = (postId) => {
        setQuantidadeComentariosVisiveis(prev => ({
            ...prev,
            [postId]: comentariosPorPost[postId]?.length || 0
        }));
    };
    useEffect(() => {
        buscarPostagens();
        buscarFuncaoUsuario();
    }, []);

    useEffect(() => {
        buscarPostagens();
    }, []);

    return {
        posts,
        setPosts,
        comentariosPorPost,
        novaPostagem,
        setNovaPostagem,
        reacoesPorPost,
        menuAberto,
        setMenuAberto,
        modoEdicao,
        setModoEdicao,
        novoTitulo,
        setNovoTitulo,
        mostrarInputComentario,
        setMostrarInputComentario,
        comentariosDigitados,
        setComentariosDigitados,
        comentariosEmEdicao,
        setComentariosEmEdicao,
        alerta,
        setAlerta,
        minhaReacaoPorPost,
        quantidadeComentariosVisiveis,
        userId,
        editarComentario,
        enviarComentario,
        removerPostagem,
        enviarReacao,
        criarPostagem,
        criarPostagemSistema,
        atualizarPostagem,
        verMaisComentarios,
        verTodosComentarios,
        apagarComentario,
        tiposDeReacao,
        funcaoUsuario,
    };


}
