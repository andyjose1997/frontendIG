// src/pages/Aprendizagem.jsx
import "./aprendizagem.css";
import { useState } from "react";
import FormularioCurriculo from "./curriculo/curriculo";
import Portfolio from "./portfolio/portfolio";

// Importando os componentes Cursos e CursosYouTube
import { Cursos } from "./cursos/cursos";
import { CursosYouTube } from "./cursosYoutube/cursosyoutube";

// Importando a imagem para o botão
import youtubeImage from "./imagens/youtube.png";
import irongoalsImage from "./imagens/irongoals.png";

// Importando SweetAlert2
import Swal from "sweetalert2";

export default function Aprendizagem() {
    const [activeSection, setActiveSection] = useState("cursos");

    const renderSection = () => {
        switch (activeSection) {
            case "curriculo":
                return <FormularioCurriculo handleSubmit={handleSubmit} />;
            case "cursos":
                return <Cursos />;
            case "cursosYouTube":
                return <CursosYouTube />;
            case "portfolio":
                return <Portfolio />;
            default:
                return <FormularioCurriculo handleSubmit={handleSubmit} />;
        }
    };


    const handleSubmit = async (e, form) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                formData.append(key, form[key]);
            });

            const response = await fetch(`${URL}/curriculos/gerar`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Erro ao gerar currículo");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `curriculo_${form.nome}_${form.sobrenome}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erro:", err);
            Swal.fire({
                icon: "error",
                title: "❌ Erro ao gerar currículo",
                text: "Tente novamente mais tarde.",
            });
        }
    };

    return (
        <div>
            <main className="aprendizagem-container">
                <div className="sidebar">
                    <div className="back-button">
                        <button onClick={() => window.history.back()}>◀️◀️◀️</button>
                    </div>

                    <div className="logo-container">
                        <img src="/Logo/I_round.png" alt="Logo" className="logo" />
                        <h1>Área de Aprendizagem</h1>
                    </div>

                    {/* CURRICULO DESCONTINUADO POR ENQUANTO */}
                    <div className="button-container">
                        <button style={{ display: "none" }} onClick={() => setActiveSection("curriculo")}>
                            Currículo Pessoal
                        </button>
                        <button onClick={() => setActiveSection("cursos")}>
                            Cursos IronGoals
                        </button>
                        <button onClick={() => setActiveSection("cursosYouTube")}>
                            Cursos YouTube
                        </button>
                        <button onClick={() => setActiveSection("portfolio")}>
                            Portfólio IronGoals
                        </button>


                    </div>
                </div>

                <div className="content">
                    {renderSection()}
                </div>
            </main >
        </div >
    );
}
