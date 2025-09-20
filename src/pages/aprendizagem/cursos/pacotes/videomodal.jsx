import React from "react";
import QuizPerguntas from "./quizperguntas";
import "./videomodal.css"; // 🔹 Importa o CSS

export default function VideoModal({ video, onClose, onConcluirVideo }) {
    if (!video) return null;

    return (
        <div className="video-modal-overlay">
            <div className="video-modal-content">
                <h3>{video.titulo}</h3>

                <iframe
                    width="100%"
                    height="400"
                    src={video.link_embed}
                    title={video.titulo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>

                {video.exercicio_link && (
                    <p style={{ marginTop: "15px" }}>
                        📘 <a href={video.exercicio_link} target="_blank" rel="noopener noreferrer">
                            Acessar Exercício
                        </a>
                    </p>
                )}

                {/* 🔹 Passamos o callback para o Quiz */}
                <QuizPerguntas video={video} onConcluirVideo={onConcluirVideo} />

                <button className="video-modal-close" onClick={onClose}>
                    ❌ Fechar
                </button>
            </div>
        </div>
    );
}
