import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Feed from "./feed";
import Buscador from "./buscador";
import Propaganda from "./propaganda";
import Indicados from "./indicados";
import ModalVideo from "./bv";
import './inicio.css';
import { URL } from "../../config";

function Inicio() {
    const [abaAtiva, setAbaAtiva] = useState("feed");
    const [largura, setLargura] = useState(window.innerWidth);
    const [mostrarVideo, setMostrarVideo] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // 🔹 Buscar se já assistiu
        fetch(`${URL}/usuarios/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.assistiu === 0) {
                    setMostrarVideo(true);
                }
            });
    }, [navigate]);

    const handleCloseVideo = () => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/usuarios/assistiu`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ assistiu: 1 })
        }).then(() => setMostrarVideo(false));
    };

    useEffect(() => {
        const handleResize = () => setLargura(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = largura <= 700;

    // 🔹 Se ainda não assistiu, mostra SOMENTE o vídeo
    if (mostrarVideo) {
        return <ModalVideo onClose={handleCloseVideo} />;
    }
    useEffect(() => {
        const jaRolou = localStorage.getItem("inicio_rolou");
        if (!jaRolou) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            localStorage.setItem("inicio_rolou", "true");
        }
    }, []);

    // 🔹 Caso contrário, mostra o site normal
    return (
        <section id="contenedor">
            <div className="Buscador">
                <Buscador />
            </div>

            {/* 🔹 Mobile */}
            {isMobile && (
                <>
                    <div className="acoes-topo">
                        <button className={abaAtiva === "indicados" ? "ativo" : ""} onClick={() => setAbaAtiva("indicados")}>Indicados</button>
                        <button className={abaAtiva === "feed" ? "ativo" : ""} onClick={() => setAbaAtiva("feed")}>Feed</button>
                        <button className={abaAtiva === "propaganda" ? "ativo" : ""} onClick={() => setAbaAtiva("propaganda")}>Recomendados</button>
                    </div>
                    <div className="conteudo-central">
                        {abaAtiva === "indicados" && <Indicados />}
                        {abaAtiva === "feed" && <Feed />}
                        {abaAtiva === "propaganda" && <Propaganda />}
                    </div>
                </>
            )}

            {/* 🔹 Desktop */}
            {!isMobile && (
                <>
                    <div className="Indicados"><Indicados /></div>
                    <div className="Feed"><Feed /></div>
                    <div className="Propaganda"><Propaganda /></div>
                </>
            )}
        </section>
    );
}

export default Inicio;
