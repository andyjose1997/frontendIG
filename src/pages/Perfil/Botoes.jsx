import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Botoes.css';
import { URL } from '../../config';

export default function Botoes() {
    const location = useLocation();
    const navigate = useNavigate();
    const [naoLidas, setNaoLidas] = useState(0);

    // 🔹 Controle do modal de logout
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
        localStorage.clear(); // ✅ limpa sessão
        navigate('/');        // ✅ volta pra home
    }

    // 🔹 Contagem regressiva
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

    // 🔹 Buscar mensagens não lidas
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
                <Link to="/inicio">🏛️ <span className="link-text">Início</span></Link>

                {location.pathname === "/mensagens" ? (
                    <Link to="/perfil">🙋‍♂️ <span className="link-text">Perfil</span></Link>
                ) : (
                    <div className="mensagenss-wrapper">
                        <Link to="/mensagens">🗨️ <span className="link-text">Mensagens</span></Link>
                        {naoLidas > 0 && (
                            <span className="badge-naoo-lidas">{naoLidas}</span>
                        )}
                    </div>
                )}

                {location.pathname === "/TelaConfig" ? (
                    <Link to="/perfil">👤 <span className="link-text">Perfil</span></Link>
                ) : (
                    <Link to="/TelaConfig">🔧 <span className="link-text">Configurações</span></Link>
                )}
                <Link to="/manual">🧾 <span className="link-text">Manual</span></Link>

                <Link to="/iron_quiz">🏆 <span className="link-text">IronQuiz</span></Link>
                <Link to="/aprendizagem">📘 <span className="link-text">Autossuficiência</span></Link>
                <a href="/" onClick={handleLogout}>🔒 <span className="link-text">Logout</span></a>
            </aside>

            {/* 🔹 Modal de Logout */}
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
