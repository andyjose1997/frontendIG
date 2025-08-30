import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Botoes.css';
import { URL } from '../../config';
export default function Botoes() {
    const location = useLocation();
    const navigate = useNavigate();
    const [naoLidas, setNaoLidas] = useState(0);

    function handleLogout(e) {
        e.preventDefault();
        localStorage.clear();
        navigate('/');
    }

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

        // atualizar a cada 30s
        const intervalo = setInterval(carregarNaoLidas, 30000);
        return () => clearInterval(intervalo);
    }, []);

    return (
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

            <Link to="/ajuda">📞 <span className="link-text">Ajuda</span></Link>
            <Link to="/comentarios">🏷️ <span className="link-text">Comentários</span></Link>
            <Link to="/manual">🧾 <span className="link-text">Manual</span></Link>
            <Link to="/aprendizagem">📘 <span className="link-text">Aprendizagem</span></Link>
            <a href="/" onClick={handleLogout}>🔒 <span className="link-text">Logout</span></a>
        </aside>
    );
}
