import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    const location = useLocation();
    const atual = location.pathname;

    const [instalavel, setInstalavel] = useState(false);
    const [promptInstalacao, setPromptInstalacao] = useState(null);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setPromptInstalacao(e);
            setInstalavel(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const instalarApp = async () => {
        if (!promptInstalacao) return;
        promptInstalacao.prompt();
        const escolha = await promptInstalacao.userChoice;
        if (escolha.outcome === 'accepted') {
            setMensagem('✅ Aplicativo instalado com sucesso!');
        } else {
            setMensagem('ℹ️ Instalação cancelada.');
        }
        setPromptInstalacao(null);
    };

    return (
        <header>
            <br />
            <img id='logo' src="/Logo/IronGoals.png" alt="Logo IronGoals" />
            <nav id='Cabecalho'>
                <ul>
                    {atual !== "/" && (
                        <li><Link to="/">Início</Link></li>
                    )}
                    {atual !== "/cursos" && (
                        <li><Link to="/cursos">Cursos</Link></li>
                    )}
                    {!atual.startsWith("/cadastrarse") && (
                        <li><Link to="/cadastrarse">Cadastre-se</Link></li>
                    )}
                    {atual !== "/organizacao" && (
                        <li><Link to="/organizacao">Organização</Link></li>
                    )}
                    {atual !== "/login" && (
                        <li><Link to="/login">Login</Link></li>
                    )}

                    {/* 🔹 Botão de Baixar Aplicativo (PWA) */}
                    {instalavel && (
                        <li>
                            <button className="btn-baixar" onClick={instalarApp}>
                                📲 Baixar Aplicativo
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
            {mensagem && <p id="avisoPWA">{mensagem}</p>}
        </header>
    );
}
