import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Bandeja from './bandeja';
import Up from '../Perfil/up';
import Botoes from '../Perfil/botoes';
import './mensagens.css';

export default function LayoutMensagens() {
    const location = useLocation();
    const navigate = useNavigate();
    const [larguraTela, setLarguraTela] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setLarguraTela(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMensagens = location.pathname.toLowerCase().includes("mensagens");

    return (
        <main id="Mensagens">
            <div id="Up">
                <Up />
            </div>

            <div id="Botoes">
                {/* Se for /mensagens e tela < 1300 → mostra apenas botão voltar */}
                {isMensagens && larguraTela < 2000 ? (
                    <button
                        className="botao-voltar"
                        onClick={() => navigate("/perfil")}
                    >
                        🔙
                    </button>
                ) : (
                    <Botoes />
                )}
            </div><br />

            <div id="Bandeja">
                <Bandeja />
            </div>
        </main>
    );
}
