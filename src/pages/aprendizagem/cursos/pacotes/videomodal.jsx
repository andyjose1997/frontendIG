import React from "react";
import QuizPerguntas from "./quizperguntas";
import "./videomodal.css"; // 🔹 Importa o CSS

export default function VideoModal({ video, onClose, onConcluirVideo }) {
    if (!video) return null;

    return (
        <div className="videoum-overlay">
            <div className="videoum-content">
                <h3 className="videoum-title">{video.titulo}</h3>

                {/* 🔹 Renderiza exatamente o embed vindo do banco */}
                <div
                    className="videoum-iframe"
                    dangerouslySetInnerHTML={{ __html: video.link_embed }}
                />

                {/* 🔹 Passamos o callback para o Quiz */}
                <QuizPerguntas video={video} onConcluirVideo={onConcluirVideo} />

                <button className="videoum-close" onClick={onClose}>
                    ❌ Fechar
                </button>
            </div>
        </div>
    );
}
