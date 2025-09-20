import React from "react";
import QuizPerguntas from "./quizperguntas";
import "./videomodal.css"; // 🔹 Importa o CSS

export default function VideoModal({ video, onClose, onConcluirVideo }) {
    if (!video) return null;

    return (
        <div className="videoum-overlay">
            <div className="videoum-content">
                <h3 className="videoum-title">{video.titulo}</h3>

                <iframe
                    className="videoum-iframe"
                    width="100%"
                    height="400"
                    src={video.link_embed}
                    title={video.titulo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>



                {/* 🔹 Passamos o callback para o Quiz */}
                <QuizPerguntas video={video} onConcluirVideo={onConcluirVideo} />

                <button className="videoum-close" onClick={onClose}>
                    ❌ Fechar
                </button>
            </div>
        </div>
    );
}
