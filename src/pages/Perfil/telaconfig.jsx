import './telaconfig.css';
import Acima from "./up.jsx";
import Botoes from "./botoes.jsx";
import Config from "./config.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TelaConfig() {
    const [larguraTela, setLarguraTela] = useState(window.innerWidth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        function atualizarLargura() {
            setLarguraTela(window.innerWidth);
        }
        window.addEventListener("resize", atualizarLargura);
        return () => window.removeEventListener("resize", atualizarLargura);
    }, []);

    const isConfigPage = location.pathname.toLowerCase().includes("config");

    return (
        <div id="ConfigGeral">
            <div id="ConfigUp">
                <Acima />
            </div>

            {isConfigPage && larguraTela <= 2200 ? (
                <div className="config-voltar-wrapper">
                    <button
                        className="config-voltar-botao"
                        onClick={() => navigate("/perfil")}
                    >
                        🔙
                    </button>
                </div>
            ) : (
                <div id="ConfigBotoes">
                    <Botoes />
                </div>
            )}

            <div id="ConfigConteudo">
                <Config />
            </div>
        </div>
    );
}
