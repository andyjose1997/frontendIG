import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Botoes.css';

export default function Botoes() {
    const location = useLocation();
    const navigate = useNavigate();

    function handleLogout(e) {
        e.preventDefault();
        localStorage.clear();  // ou localStorage.removeItem('token');
        navigate('/');         // redireciona para a tela inicial ou login
    }
    return (
        <aside className="botoa-container">
            <Link to="/inicio">🏛️ <span className="link-text">Início</span></Link>
            {location.pathname === "/mensagens" ? (
                <Link to="/perfil">🙋‍♂️ <span className="link-text">Perfil</span></Link>
            ) : (
                <Link to="/mensagens">🗨️ <span className="link-text">Mensagens</span></Link>
            )}

            {location.pathname === "/TelaConfig" ? (
                <Link to="/perfil">👤 <span className="link-text">Perfil</span></Link>
            ) : (
                <Link to="/TelaConfig">🔧 <span className="link-text">Configurações</span></Link>
            )}

            <Link to="/ajuda">📞 <span className="link-text">Ajuda</span></Link>
            <Link to="/comentarios">🏷️ <span className="link-text">Comentários</span></Link>
            <Link to="/manual">🧾 <span className="link-text">Manual</span></Link>
            <Link to="*"> 📄 <span className="link-text">Curriculo</span></Link>
            <a href="/" onClick={handleLogout}>🔒 <span className="link-text">Logout</span></a>

        </aside>

    );
}
