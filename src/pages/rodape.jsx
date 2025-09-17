// 📂 src/componentes/Rodape.jsx
import { useState } from "react";
import "./rodape.css";
import ModalSuporte from "./areaafastada/modalsuporte";
import ModalLogin from "./areaafastada/modallogin";

export default function Rodape() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarSuporte, setMostrarSuporte] = useState(false); // novo estado

    return (
        <>
            <br />
            <footer className="Rodape">
                <div className="RodapeContent">
                    <div className="RodapeLinks">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setMostrarSuporte(true);
                            }}
                        >
                            Suporte
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setMostrarModal(true);
                            }}
                        >
                            Avalie-nos
                        </a>
                        <a href="/Manual">Ler os Termos de uso</a>
                    </div>

                    <div className="RodapeEmpresa">
                        <a href="/Login" style={{ textDecoration: "none", color: "black" }}>
                            <h2>IronGoals</h2>
                        </a>
                        <p>Where Learning Happens</p>
                        <a href="/">
                            <img src="/Logo/I_round.png" alt="logo" />
                        </a>
                    </div>

                    <div className="RodapeRedes">
                        <a
                            href="https://www.facebook.com/profile.php?id=61580492555279"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://www.instagram.com/irongoals3/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://www.tiktok.com/@irongoals3"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            TikTok
                        </a>
                        <a
                            href="https://www.youtube.com/@Andy-y7b6z/featured"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            YouTube
                        </a>
                    </div>
                </div>
                <p className="RodapeCopy">© 2025 IronGoals. Todos os direitos reservados.</p>
            </footer>

            {/* Modais */}
            {mostrarModal && <ModalLogin onClose={() => setMostrarModal(false)} />}
            {mostrarSuporte && <ModalSuporte onClose={() => setMostrarSuporte(false)} />}
        </>
    );
}
