// 📂 src/pages/annetstudios/menu.jsx
import "./menuannet.css";
import { useState } from "react";

// 🧱 Import dos modais individuais
import ModalServicos from "./modais/modalservicos";
import ModalSobre from "./modais/modalsobre";
import ModalAvaliacoes from "./modais/modalavaliacoes";
import ModalPerfil from "./modais/modalperfil";

export default function MenuAnnet() {
    const [menuAberto, setMenuAberto] = useState(false);

    // 🔹 Estados dos modais
    const [modalServicos, setModalServicos] = useState(false);
    const [modalSobre, setModalSobre] = useState(false);
    const [modalAvaliacoes, setModalAvaliacoes] = useState(false);
    const [modalPerfil, setModalPerfil] = useState(false);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <header className="menuannet-container">
            <div className="menuannet-logo">
                <img
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/logo.png"
                    alt="Annett Studios"
                    className="menuannet-logo-img"
                />
                <h1 className="menuannet-titulo">Annett Studios</h1>
            </div>

            <nav className={`menuannet-links ${menuAberto ? "aberto" : ""}`}>
                <button
                    className="menuannet-link"
                    onClick={() => setModalServicos(true)}
                >
                    <span className="menuannet-emoji">💼</span>
                    Serviços
                </button>

                <button
                    className="menuannet-link"
                    onClick={() => setModalSobre(true)}
                >
                    <span className="menuannet-emoji">💖</span>
                    Sobre
                </button>

                <button
                    className="menuannet-link"
                    onClick={() => setModalAvaliacoes(true)}
                >
                    <span className="menuannet-emoji">⭐</span>
                    Avaliações
                </button>

                <button
                    className="menuannet-link"
                    onClick={() => setModalPerfil(true)}
                >
                    <span className="menuannet-emoji">👤</span>
                    Perfil
                </button>
            </nav>

            {/* 🔹 Renderização condicional dos modais */}
            {modalServicos && <ModalServicos onFechar={() => setModalServicos(false)} />}
            {modalSobre && <ModalSobre onFechar={() => setModalSobre(false)} />}
            {modalAvaliacoes && <ModalAvaliacoes onFechar={() => setModalAvaliacoes(false)} />}
            {modalPerfil && <ModalPerfil onFechar={() => setModalPerfil(false)} />}
        </header>
    );
}
