import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { URL } from '../config';

export default function Header() {
    const location = useLocation();
    const atual = location.pathname;

    const [instalavel, setInstalavel] = useState(false);
    const [promptInstalacao, setPromptInstalacao] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [hostAtivo, setHostAtivo] = useState({
        id: "a00001",
        nome: "andydeoliveira"
    });

    // 🔹 Verifica privilégios ativos (como antes)
    useEffect(() => {
        const verificarPrivilegioAtivo = async () => {
            try {
                const res = await fetch(`${URL}/privilegios`);
                if (!res.ok) return;

                const dados = await res.json();
                if (!Array.isArray(dados)) return;

                const hoje = new Date();

                for (const p of dados) {
                    const inicio = new Date(p.data);
                    const fim = new Date(inicio);
                    fim.setDate(inicio.getDate() + Number(p.dias));

                    if (hoje >= inicio && hoje <= fim) {
                        setHostAtivo({
                            id: p.identificador || "a00001",
                            nome: p.nome || "andydeoliveira"
                        });
                        return;
                    }
                }

                setHostAtivo({ id: "a00001", nome: "andydeoliveira" });
            } catch (err) {
                console.error("Erro ao verificar privilégio ativo:", err);
                setHostAtivo({ id: "a00001", nome: "andydeoliveira" });
            }
        };

        verificarPrivilegioAtivo();
    }, []);

    // 🔹 Detecta se o usuário entrou em /criar-conta/<id>/<nome> e guarda no navegador
    useEffect(() => {
        const path = location.pathname;
        const match = path.match(/^\/criar-conta\/([^/]+)\/([^/]+)/);
        if (match) {
            const id = match[1];
            const nome = match[2];
            localStorage.setItem("hostGuardado", JSON.stringify({ id, nome }));
            console.log("💾 Host salvo:", id, nome);
        }
    }, [location.pathname]);

    // 🔹 Recupera host guardado, caso exista
    const hostSalvo = (() => {
        try {
            const data = localStorage.getItem("hostGuardado");
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    })();

    // 🔹 Configuração de PWA
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
        setMensagem(
            escolha.outcome === 'accepted'
                ? '✅ Aplicativo instalado com sucesso!'
                : 'ℹ️ Instalação cancelada.'
        );
        setPromptInstalacao(null);
    };

    // 🔹 Define o link dinâmico de cadastro
    const linkCadastro = hostSalvo
        ? `/criar-conta/${hostSalvo.id}/${hostSalvo.nome}`
        : `/criar-conta/${hostAtivo.id}/${hostAtivo.nome}`;

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

                    {/* 🔹 Link de cadastro dinâmico */}
                    {!atual.startsWith(linkCadastro) && (
                        <li>
                            <Link to={linkCadastro}>Cadastre-se</Link>
                        </li>
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
