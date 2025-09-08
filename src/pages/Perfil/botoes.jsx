import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './botoes.css';
import { URL } from '../../config';

export default function Botoes() {
    const location = useLocation();
    const navigate = useNavigate();
    const [naoLidas, setNaoLidas] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(15);

    function handleLogout(e) {
        e.preventDefault();
        setShowModal(true);
        setCountdown(15);
    }

    function handleCancel() {
        setShowModal(false);
        setCountdown(15);
    }

    function handleConfirmLogout() {
        localStorage.clear();
        navigate('/');
    }

    useEffect(() => {
        let timer;
        if (showModal && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (showModal && countdown === 0) {
            handleConfirmLogout();
        }
        return () => clearTimeout(timer);
    }, [showModal, countdown]);

    useEffect(() => {
        const carregarNaoLidas = async () => {
            try {
                const userId = localStorage.getItem("id");
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

    return (
        <>
            <aside className="botoa-container">
                <div className="tooltip-wrapper">
                    <button onClick={() => navigate('/inicio')}>🏛️ <span className="link-text">Início</span></button>
                </div>

                <div className="tooltip-wrapper">
                    <button onClick={() => navigate('/mensagens')}>
                        🗨️ <span className="link-text">Mensagens</span>
                        {naoLidas > 0 && <span className="badge-naoo-lidas">{naoLidas}</span>}
                    </button>
                </div>

                <div className="tooltip-wrapper">
                    <button onClick={() => navigate('/TelaConfig')}>🔧 <span className="link-text">Configurações</span></button>
                </div>

                <div className="tooltip-wrapper">
                    <button onClick={() => navigate('/manual')}>🧾 <span className="link-text">Manual</span></button>
                </div>

                <div className="tooltip-wrapper">
                    <button onClick={() => navigate('/iron_quiz')}>
                        🏆 <span className="link-text">IronQuiz</span>
                    </button>
                    <span className="tooltip-text">
                        Participe dos quizzes do sistema e ganhe compensações se vencer os torneios.
                    </span>
                </div>

                <div className="tooltip-wrapper">
                    <button onClick={() => navigate('/aprendizagem')}>
                        📘 <span className="link-text">Autossuficiência</span>
                    </button>
                    <span className="tooltip-text">
                        Aqui você encontra cursos de autossuficiência organizados pela plataforma,
                        com aulas, materiais e recursos para desenvolver suas habilidades.
                    </span>
                </div>

                <div className="tooltip-wrapper">
                    <button onClick={handleLogout}>🔒 <span className="link-text">Logout</span></button>
                </div>
            </aside>

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
        </>
    );
}
