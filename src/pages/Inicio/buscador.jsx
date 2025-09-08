import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './buscador.css';
import { URL } from '../../config';

export default function Buscador() {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [naoLidas, setNaoLidas] = useState(0);

    const [sugestoes, setSugestoes] = useState([]);
    const [textoBusca, setTextoBusca] = useState("");
    const [detalhe, setDetalhe] = useState(null);
    const [carregando, setCarregando] = useState(false);

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
        window.location.href = '/';
    }

    async function buscarUsuarios(texto) {
        if (texto.trim() === "") {
            setSugestoes([]);
            return;
        }

        setCarregando(true);
        try {
            const resposta = await fetch(`${URL}/usuarios_publicos?nome=${encodeURIComponent(texto)}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
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
                const userId = localStorage.getItem("id");
                const resposta = await fetch(`${URL}/Mensagens/nao_lidas/${userId}`, {
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
                    <a className="buscador-logout" href="/" onClick={handleLogoutClick}>Logout</a>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 className="modal-titulo">Tem certeza que deseja sair?</h3>
                        <p className="modal-texto">
                            Saindo automaticamente em <strong>{countdown}</strong> segundos...
                        </p>
                        <div className="modal-botoes">
                            <button className="modal-btn sair" onClick={handleConfirmLogout}>Sair agora</button>
                            <button className="modal-btn cancelar" onClick={handleCancel}>Cancelar</button>
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
                            src={`${URL}/fotos/${detalhe.foto || "padrao.png"}`}
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
