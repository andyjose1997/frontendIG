import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Feed from "./feed";
import Buscador from "./buscador";
import Propaganda from "./propaganda";
import Indicados from "./indicados";
import './inicio.css';
import { URL } from "../../config";

function Inicio() {
    const [abaAtiva, setAbaAtiva] = useState("feed"); // 🔹 Feed aberto por padrão
    const [largura, setLargura] = useState(window.innerWidth);

    const navigate = useNavigate();

    // 🔐 Proteção da rota
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // 🔹 Monitorar resize
    useEffect(() => {
        const handleResize = () => setLargura(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = largura <= 700;

    return (
        <section id="contenedor">
            <div className="Buscador">
                <Buscador />
            </div>

            {/* 🔹 Mobile: botões + conteúdo central */}
            {isMobile && (
                <>
                    <div className="acoes-topo">
                        <button
                            className={abaAtiva === "indicados" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("indicados")}
                        >
                            Indicados
                        </button>
                        <button
                            className={abaAtiva === "feed" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("feed")}
                        >
                            Feed
                        </button>
                        <button
                            className={abaAtiva === "propaganda" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("propaganda")}
                        >
                            Recomendados                        </button>
                    </div>

                    <div className="conteudo-central">
                        {abaAtiva === "indicados" && <Indicados />}
                        {abaAtiva === "feed" && <Feed />}
                        {abaAtiva === "propaganda" && <Propaganda />}
                    </div>
                </>
            )}

            {/* 🔹 Desktop: layout em grid */}
            {!isMobile && (
                <>
                    <div className="Indicados">
                        <Indicados />
                    </div>
                    <div className="Feed">
                        <Feed />
                    </div>
                    <div className="Propaganda">
                        <Propaganda />
                    </div>
                </>
            )}
        </section>
    );
}

export default Inicio;
