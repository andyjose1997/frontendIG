// src/pages/Aprendizagem.jsx
import "./aprendizagem.css";
import Rodape from "../rodape";
import { useState } from "react";
import FormularioCurriculo from "./curriculo/curriculo";

// Importando os componentes Cursos e CursosYouTube
import { Cursos } from "./cursos/cursos";
import { CursosYouTube } from "./cursosYoutube/cursosyoutube";

// Importando a imagem para o botão
import youtubeImage from "./imagens/youtube.png";
import irongoalsImage from "./imagens/irongoals.png";

export default function Aprendizagem() {
    const [activeSection, setActiveSection] = useState("curriculo");

    // Função para exibir a seção correta (Formulário, Cursos ou Cursos YouTube)
    const renderSection = () => {
        switch (activeSection) {
            case "curriculo":
                return <FormularioCurriculo handleSubmit={handleSubmit} />; // Formulário
            case "cursos":
                return <Cursos />; // Cursos
            case "cursosYouTube":
                return <CursosYouTube />; // Cursos YouTube
            default:
                return <FormularioCurriculo handleSubmit={handleSubmit} />; // Exibe o FormularioCurriculo por padrão
        }
    };

    // Função para processar o envio do formulário (você pode adicionar a lógica de envio aqui)
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
            alert("❌ Erro ao gerar currículo");
        }
    };

    return (
        <div>
            <main className="aprendizagem-container">

                <div className="sidebar">
                    {/* 🔹 Botão de voltar no topo */}
                    <div className="back-button">
                        <button onClick={() => window.history.back()}>◀️◀️◀️

                        </button>
                    </div>

                    <div className="logo-container">
                        <img src="/Logo/I_round.png" alt="Logo" className="logo" />
                        <h1>Área de Aprendizagem</h1>
                    </div>

                    <div className="button-container">
                        <button onClick={() => setActiveSection("curriculo")}>📄 <pre>  </pre> Currículo Pessoal</button>
                        <button onClick={() => setActiveSection("cursos")}>
                            <img
                                src={irongoalsImage}  // Usando a imagem importada
                                alt="Irongoals"
                                className="irongoals-icon"
                            />
                            Cursos IronGoals</button>
                        <button onClick={() => setActiveSection("cursosYouTube")}>
                            <img
                                src={youtubeImage}  // Usando a imagem importada
                                alt="YouTube"
                                className="youtube-icon"
                            />
                            Cursos YouTube
                        </button>
                    </div>
                </div>

                {/* Renderizar a seção ativa */}
                <div className="content">
                    {renderSection()}
                </div>
            </main>
            <Rodape />
        </div>
    );
}
