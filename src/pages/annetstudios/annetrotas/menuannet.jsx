// 📂 src/pages/annetstudios/menu.jsx
// Todas as classes começam com "menuannet-"
import "./menuannet.css";
import { useState } from "react";

export default function MenuAnnet() {
    const [menuAberto, setMenuAberto] = useState(false);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <header className="menuannet-container">
            <div className="menuannet-logo">
                <img
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/ChatGPT%20Image%2028%20de%20out%20(1).%20de%202025,%2015_28_46"
                    alt="Annet Studios"
                    className="menuannet-logo-img"
                />
                <h1 className="menuannet-titulo">Annet Studios</h1>
            </div>

            <nav className={`menuannet-links ${menuAberto ? "aberto" : ""}`}>
                <a href="#servicos">
                    <span className="menuannet-emoji">💼</span>
                    Serviços
                </a>
                <a href="#sobre">
                    <span className="menuannet-emoji">💖</span>
                    Sobre
                </a>
                <a href="#avaliacoes">
                    <span className="menuannet-emoji">⭐</span>
                    Avaliações
                </a>
                <a href="#perfil">
                    <span className="menuannet-emoji">👤</span>
                    Perfil
                </a>
            </nav>


        </header>
    );
}
