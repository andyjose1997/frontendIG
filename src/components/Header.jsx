import './header.css';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const atual = location.pathname;

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
                    {!atual.startsWith("/cadastrarse") && (   // 👈 corrigido
                        <li><Link to="/cadastrarse">Cadastre-se</Link></li>
                    )}
                    {atual !== "/organizacao" && (
                        <li><Link to="/organizacao">Organização</Link></li>
                    )}
                    {atual !== "/login" && (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
