// src/components/youtube/VideoPlayer.jsx
import React, { useState } from "react";
import PerguntaCurso from "./perguntacurso";


export default function VideoPlayer({ video }) {
    const usuarioId = 1; // 🔹 por enquanto fixo para testes
    const [concluido, setConcluido] = useState(false);

    // Puxa progresso do banco
    useEffect(() => {
        apiYoutube.getProgresso(usuarioId, video.curso_id)
            .then((dados) => {
                const prog = dados.find((p) => p.video_id === video.id);
                if (prog && prog.concluido) setConcluido(true);
            })
            .catch(() => { });
    }, [video.id, video.curso_id]);

    // Marcar vídeo como concluído
    const handleConcluir = async () => {
        try {
            await apiYoutube.concluirVideo(usuarioId, video.id);
            setConcluido(true);
        } catch (err) {
            console.error("Erro ao concluir vídeo", err);
        }
    };

    return (
        <div className={`video-card ${concluido ? "concluido" : ""}`}>
            <h3>{video.titulo} {concluido && "✅"}</h3>
            <div className="video-frame">
                <iframe
                    width="560"
                    height="315"
                    src={video.codigo_iframe}
                    title={video.titulo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <button onClick={handleConcluir} disabled={concluido}>
                {concluido ? "Concluído" : "Concluir"}
            </button>
        </div>
    );
}
