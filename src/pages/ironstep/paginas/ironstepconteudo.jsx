// IronStepConteudo.jsx
import React, { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./ironstepconteudo.css";
import IronStepExercicios from "./ironstepexercicios";

// 🔹 importa as imagens de CLASSES
import idiomasImg from "./logos/clases/idiomas.png";
import programacaoImg from "./logos/clases/programacao.png";

// 🔹 importa as imagens de CURSOS
import css3Img from "./logos/cursos/css3.png";
import espanholImg from "./logos/cursos/espanhol.png";
import excelImg from "./logos/cursos/excel.png";
import githubImg from "./logos/cursos/github.png";
import googlesheetsImg from "./logos/cursos/googleshees.jpg";
import html5Img from "./logos/cursos/html5.png";
import inglesImg from "./logos/cursos/ingles.png";
import javascriptImg from "./logos/cursos/javascript.png";
import powerpointImg from "./logos/cursos/powerpoint.jpg";
import pythonImg from "./logos/cursos/python.jpg";
import reactImg from "./logos/cursos/react.png";
import wordImg from "./logos/cursos/word.png";

export default function IronStepConteudo() {
    const [clases, setClases] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClase, setSelectedClase] = useState(null);
    const [selectedCurso, setSelectedCurso] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/ironstep/clases`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setClases(data.clases || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar classes:", err);
                setLoading(false);
            });
    }, []);

    // 🔹 mapeia cada CLASSE à imagem correspondente
    const iconMap = {
        "Idiomas": idiomasImg,
        "Programação": programacaoImg,
    };

    // 🔹 pega logo do curso mesmo com nome diferente
    const getCursoIcon = (cursoNome) => {
        const nome = cursoNome.toLowerCase();

        if (nome.includes("html")) return html5Img;
        if (nome.includes("css")) return css3Img;
        if (nome.includes("javascript")) return javascriptImg;
        if (nome.includes("react")) return reactImg;
        if (nome.includes("python")) return pythonImg;
        if (nome.includes("git")) return githubImg;
        if (nome.includes("excel")) return excelImg;
        if (nome.includes("word")) return wordImg;
        if (nome.includes("powerpoint")) return powerpointImg;
        if (nome.includes("google")) return googlesheetsImg;
        if (nome.includes("espanhol")) return espanholImg;
        if (nome.includes("inglês") || nome.includes("ingles")) return inglesImg;

        // fallback
        return programacaoImg;
    };

    const handleClaseClick = (claseId) => {
        setSelectedClase(claseId);
        const token = localStorage.getItem("token");

        fetch(`${URL}/ironstep/cursos/${claseId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCursos(data.cursos || []);
            })
            .catch(err => {
                console.error("Erro ao carregar cursos:", err);
            });
    };

    const handleBackClase = () => {
        setSelectedClase(null);
        setCursos([]);
    };

    const handleBackCurso = () => {
        setSelectedCurso(null);
    };

    return (
        <section className="section-container-ironstep">
            <h3>Qual trilha você quer seguir hoje?</h3>

            {loading ? (
                <p>Carregando classes...</p>
            ) : (
                <>
                    {!selectedClase ? (
                        // 🔹 mostra CLASSES
                        <div className="clases-container">
                            {clases
                                .filter(c => c.clase === "Idiomas" || c.clase === "Programação")
                                .map((clase) => (
                                    <button
                                        key={clase.id}
                                        className="clase-btn"
                                        onClick={() => handleClaseClick(clase.id)}
                                    >
                                        <img
                                            src={iconMap[clase.clase] || idiomasImg}
                                            alt={clase.clase}
                                            className="clase-icon-only"
                                        />
                                    </button>
                                ))}
                        </div>

                    ) : !selectedCurso ? (
                        // 🔹 mostra CURSOS da classe selecionada
                        <div className="cursos-container">
                            <button className="back-btn" onClick={handleBackClase}>
                                ⬅ Voltar
                            </button>
                            <h4>Cursos disponíveis:</h4>
                            <div className="cursos-lista">
                                {cursos.map((curso) => (
                                    <button
                                        key={curso.id}
                                        className="curso-bttn"
                                        onClick={() => setSelectedCurso(curso.id)}
                                    >
                                        <img
                                            src={getCursoIcon(curso.curso)}
                                            alt={curso.curso}
                                            className="curso-icon"
                                        />
                                        {curso.curso}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // 🔹 mostra EXERCÍCIOS do curso selecionado
                        <IronStepExercicios
                            cursoId={selectedCurso}
                            onBack={handleBackCurso}
                        />
                    )}
                </>
            )}
        </section>
    );
}
