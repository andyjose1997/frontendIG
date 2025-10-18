import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './buscador.css';
import { URL } from '../../config';

export default function Buscador() {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [naoLidas, setNaoLidas] = useState(0);
    const [mostrarAvaliacao, setMostrarAvaliacao] = useState(false);
    const [videoHtml, setVideoHtml] = useState("");

    const [sugestoes, setSugestoes] = useState([]);
    const [textoBusca, setTextoBusca] = useState("");
    const [detalhe, setDetalhe] = useState(null);
    const [carregando, setCarregando] = useState(false);

    // 🔹 Novo estado para modal do vídeo
    const [mostrarVideo, setMostrarVideo] = useState(false);

    function handleLogoutClick(e) {
        e.preventDefault();
        setShowModal(true);
        setCountdown(15);
    }

    function handleCancel() {
        setShowModal(false);
        setCountdown(15);
    }

    function handleConfirmLogout() {
        // limpar storage
        localStorage.clear();  // limpa tudo (ou use removeItem se quiser só alguns)

        // redirecionar
        window.location.href = '/login';
    }


    async function buscarUsuarios(texto) {
        if (texto.trim() === "") {
            setSugestoes([]);
            return;
        }

        setCarregando(true);
        try {
            const resposta = await fetch(`${URL}/mensagens/nao_lidas/${userId}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });



            const dados = await resposta.json();
            setSugestoes(dados);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setSugestoes([]);
        } finally {
            setCarregando(false);
        }
    }

    function selecionarUsuario(usuario) {
        setSugestoes([]);
        setTextoBusca("");
        setDetalhe(usuario);
    }

    function fecharDetalhe() {
        setDetalhe(null);
    }

    useEffect(() => {
        const carregarNaoLidas = async () => {
            try {
                const userId = localStorage.getItem("usuario_id");
                const resposta = await fetch(`${URL}/mensagens/nao_lidas/${userId}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                });
                const data = await resposta.json();
                setNaoLidas(data.total || 0);
            } catch (err) {
                console.error("Erro ao buscar mensagens não lidas:", err);
            }
        };

        carregarNaoLidas();
        const intervalo = setInterval(carregarNaoLidas, 30000);
        return () => clearInterval(intervalo);
    }, []);

    async function abrirVideo() {
        try {
            const resp = await fetch(`${URL}/indicacoes/buscador`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            if (!resp.ok) throw new Error("Vídeo não encontrado");
            const data = await resp.json();
            setVideoHtml(data.video); // iframe inteiro do banco
            setMostrarVideo(true);
        } catch (err) {
            console.error("Erro ao carregar vídeo:", err);
        }
    }
    useEffect(() => {
        let timer;
        if (showModal && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (showModal && countdown === 0) {
            handleConfirmLogout();
        }
        return () => clearTimeout(timer);
    }, [showModal, countdown]);

    useEffect(() => {
        const delay = setTimeout(() => {
            buscarUsuarios(textoBusca);
        }, 500);
        return () => clearTimeout(delay);
    }, [textoBusca]);

    return (
        <>
            <div className="buscador-fundo">
                <div className="buscador-esquerda">
                    <img className="buscador-logo" src="/Logo/I_round.png" alt="Logo IronGoals" />
                    <h3 className="buscador-titulo">IronGoals</h3>

                    <button
                        className="buscador-info-btn"
                        onClick={abrirVideo}
                    >
                        ℹ
                    </button>

                </div>

                <div className="buscador-centro">
                    <input
                        className="buscador-input"
                        type="text"
                        placeholder="Procurar Usuários públicos"
                        value={textoBusca}
                        autoComplete="off"
                        onChange={(e) => setTextoBusca(e.target.value)}
                    />
                    {carregando && <div className="buscador-spinner"></div>}

                    {sugestoes.length > 0 && (
                        <ul className="buscador-sugestoes">
                            {sugestoes.map(usuario => (
                                <li
                                    key={usuario.id}
                                    className="buscador-sugestao-item"
                                    onClick={() => selecionarUsuario(usuario)}
                                >
                                    {usuario.nome} {usuario.sobrenome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="buscador-direita">
                    <Link className="buscador-link" to="/perfil">Perfil</Link>

                    <div className="buscador-mensagens-wrapper">
                        <Link className="buscador-link" to="/Mensagens">Mensagens</Link>
                        {naoLidas > 0 && (
                            <span className="buscador-badge">{naoLidas}</span>
                        )}
                    </div>
                    <Link className="buscador-link" to="/TelaConfig">Configurações</Link>
                    <Link
                        className="buscador-link"
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            const token = localStorage.getItem("token");
                            const usuarioId = localStorage.getItem("usuario_id");

                            if (token && usuarioId) {
                                window.location.href = "/Avaliacao";
                            } else {
                                setMostrarAvaliacao(true);
                            }
                        }}
                    >
                        Avalie-nos
                    </Link>

                    <a className="buscador-logout" href="/" onClick={handleLogoutClick}>Logout</a>
                </div>
            </div>

            {mostrarVideo && (
                <div className="video-overlay">
                    <div className="video-box">
                        <button className="video-fechar" onClick={() => setMostrarVideo(false)}>✖</button>

                        {/* 🔹 Renderiza o iframe que veio do banco */}
                        <div dangerouslySetInnerHTML={{ __html: videoHtml }} />
                    </div>
                </div>
            )}


            {showModal && (
                <div className="sair-overlay">
                    <div className="sair-box">
                        <h3 className="sair-titulo">Tem certeza que deseja sair?</h3>
                        <p className="sair-texto">
                            Saindo automaticamente em <strong>{countdown}</strong> segundos...
                        </p>
                        <div className="sair-botoes">
                            <button className="sair-btn sair-agora" onClick={handleConfirmLogout}>
                                Sair agora
                            </button>
                            <button className="sair-btn sair-cancelar" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detalhe && (
                <div className="detalhe-overlay">
                    <div className="detalhe-box">
                        <button className="detalhe-fechar" onClick={fecharDetalhe}>✖</button>
                        <img
                            className="detalhe-foto"
                            src={detalhe.foto || "/Logo/perfilPadrao/M.png"}
                            alt="Foto"
                        />
                        <h2 className="detalhe-nome">{detalhe.nome} {detalhe.sobrenome}</h2>
                        <a
                            href={`https://wa.me/${detalhe.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detalhe-whatsapp"
                        >
                            📱 Abrir WhatsApp
                        </a>
                        <br />
                        {/* 🔹 Novo botão para ver portfólio */}
                        <a
                            href={`https://www.irongoals.com/portfolio-publico?id=${detalhe.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detalhe-portfolio"
                        >
                            🎓 Ver Portfólio
                        </a>

                        <p className="detalhe-meta">
                            <strong>Próxima Meta:</strong><br />
                            {detalhe.comentario_perfil && detalhe.comentario_perfil.trim() !== ""
                                ? detalhe.comentario_perfil
                                : "Nenhuma meta definida."}
                        </p>
                    </div>
                </div>
            )}

        </>
    );
}
