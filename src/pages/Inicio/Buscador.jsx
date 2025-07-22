import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Buscador.css';

export default function Buscador() {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(15);

    const [sugestoes, setSugestoes] = useState([]);
    const [textoBusca, setTextoBusca] = useState("");
    const [detalhe, setDetalhe] = useState(null);

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
        try {
            const resposta = await fetch(`http://localhost:8899/usuarios_publicos?nome=${encodeURIComponent(texto)}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            const dados = await resposta.json();
            setSugestoes(dados);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setSugestoes([]);
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

    return (
        <>
            <div id="BuscadorFundo">
                <div className="esquerda">
                    <img style={{ width: "55px" }} src="/Logo/I_round.png" alt="" />
                    <h3 style={{ color: "white" }}>IronSources</h3>
                </div>
                <div className="centro">
                    <input
                        id='Buscador'
                        type="text"
                        placeholder='Procurar Usuários públicos'
                        value={textoBusca}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setTextoBusca(valor);
                            buscarUsuarios(valor);
                        }}
                    />

                    {sugestoes.length > 0 && (
                        <ul className="sugestoes-dropdown">
                            {sugestoes.map(usuario => (
                                <li key={usuario.id} onClick={() => selecionarUsuario(usuario)}>
                                    {usuario.nome} {usuario.sobrenome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="direita">
                    <Link className='topo' to="/perfil">Perfil</Link>
                    <a className='topo' href="/Mensagens">Mensagens</a>
                    <Link className='topo' to="/TelaConfig">Configurações</Link>
                    <a className='Logout' href="/" onClick={handleLogoutClick}>Logout</a>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Tem certeza que deseja sair?</h3>
                        <p>Saindo automaticamente em <strong>{countdown}</strong> segundos...</p>
                        <div className="botoes">
                            <button onClick={handleConfirmLogout}>Sair agora</button>
                            <button onClick={handleCancel}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {detalhe && (
                <div className="modalFundo">
                    <div className="modalDetalhe">
                        <button className="fecharModal" onClick={fecharDetalhe}>✖</button>
                        <img
                            src={`http://localhost:8899/fotos/${detalhe.foto || "padrao.png"}`}
                            alt="Foto"
                        />
                        <h2>{detalhe.nome} {detalhe.sobrenome}</h2>
                        <a
                            href={`https://wa.me/${detalhe.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="botaoZap"
                        >
                            📱 Abrir WhatsApp
                        </a>
                        <p className="comentarioPerfil">
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
