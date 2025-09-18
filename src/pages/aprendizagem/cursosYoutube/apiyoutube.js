// src/services/apiYoutube.js
import { URL } from "../../../config";

async function fetchAPI(endpoint, options = {}) {
    const res = await fetch(`${URL}/youtube/${endpoint}`, options);

    let data;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        console.error("❌ Erro na API:", res.status, data);
        throw new Error(data?.detail || "Erro na API");
    }

    return data;
}

export const apiYoutube = {
    getCursos: () => fetchAPI("cursos"),
    getVideos: (cursoId) => fetchAPI(`cursos/${cursoId}/videos`),
    getPerguntas: (videoId) => fetchAPI(`videos/${videoId}/perguntas`),

    // 🔹 pega progresso do usuário (ex.: vídeos concluídos)
    getProgresso: (usuarioId, cursoId) =>
        fetchAPI(`progresso/${usuarioId}/${cursoId}`),

    // 🔹 marca vídeo como concluído
    concluirVideo: (usuarioId, videoId) =>
        fetchAPI("progresso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioId,   // 🔹 mantém como string "a00001"
                video_id: Number(videoId)
            })
        }),




    // 🔹 verificar resposta (erro/acerto + mensagem + tentativas)
    verificarResposta: ({ usuario_id, video_id, resposta_escolhida }) =>
        fetchAPI("verificar_resposta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id,
                video_id,
                resposta_escolhida
            })
        }),
};
