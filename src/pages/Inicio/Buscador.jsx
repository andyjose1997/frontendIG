import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Buscador.css';
import Perfil from '../Perfil/Perfil';



export default function Buscador() {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(15);

    function handleLogoutClick(e) {
        e.preventDefault(); // evita navegação imediata
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
                <div className="esquerda" > {/* vazio por enquanto */}

                    <img style={{
                        width: "55px"
                    }} src="/Logo/I_round.png" alt="" />
                    <h3 style={{
                        color: "white"
                    }}>IronSources</h3></div>
                <div className="centro">
                    <input id='Buscador' type="text" placeholder='Procurar por alguém' />
                    <button id='buscar'>Buscar</button>
                </div>
                <div className="direita">
                    <Link className='topo' to="/perfil">Perfil</Link>
                    <a className='topo' href="/Mensagens">Mensagens</a>
                    <Link className='topo' to="/TelaConfig"> Configurações</Link>

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
        </>
    );
}
