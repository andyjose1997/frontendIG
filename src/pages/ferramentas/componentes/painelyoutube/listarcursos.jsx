import { useState, useEffect } from "react";
import { URL } from "../../../../config";
import './listarcursos.css'

export default function ListaCursos({ mostrarAlerta, setConfirmacao }) {
    const [cursos, setCursos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [perguntas, setPerguntas] = useState([]);
    const [cursoAtivo, setCursoAtivo] = useState(null);
    const [videoAtivo, setVideoAtivo] = useState(null);
    const [filtro, setFiltro] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        carregarCursos();
        const atualizar = () => carregarCursos();
        window.addEventListener("atualizarCursos", atualizar);
        return () => window.removeEventListener("atualizarCursos", atualizar);
    }, []);

    const carregarCursos = async () => {
        try {
            const res = await fetch(`${URL}/youtube/cursos`);
            const data = await res.json();

            // 🔹 para cada curso, busca o último vídeo
            const cursosComUltimoVideo = await Promise.all(
                data.map(async (curso) => {
                    try {
                        const resVideos = await fetch(`${URL}/youtube/cursos/${curso.id}/videos`);
                        if (!resVideos.ok) return { ...curso, ultimoVideoId: null };
                        const listaVideos = await resVideos.json();

                        if (listaVideos.length === 0) return { ...curso, ultimoVideoId: null };

                        // pega o último (maior id)
                        const ultimo = Math.max(...listaVideos.map(v => v.id));
                        return { ...curso, ultimoVideoId: ultimo };
                    } catch {
                        return { ...curso, ultimoVideoId: null };
                    }
                })
            );

            setCursos(cursosComUltimoVideo);
        } catch (err) {
            console.error("Erro ao carregar cursos:", err);
        }
    };

    // Abre modal e busca vídeos do curso + status de perguntas
    const handleSelecionarCurso = async (cursoId) => {
        setCursoAtivo(cursoId);
        setVideoAtivo(null);
        setPerguntas([]);
        setMostrarModal(true);

        const res = await fetch(`${URL}/youtube/cursos/${cursoId}/videos`);
        const data = await res.json();

        const videosComStatus = await Promise.all(
            data.map(async (video) => {
                try {
                    const resPerg = await fetch(`${URL}/youtube/videos/${video.id}/perguntas`);
                    if (!resPerg.ok) return { ...video, temPerguntas: false };
                    const perguntas = await resPerg.json();
                    return { ...video, temPerguntas: perguntas.length > 0 };
                } catch {
                    return { ...video, temPerguntas: false };
                }
            })
        );

        setVideos(videosComStatus);
    };

    // Busca perguntas ao clicar em vídeo
    const handleSelecionarVideo = async (videoId) => {
        setVideoAtivo(videoId);
        try {
            const res = await fetch(`${URL}/youtube/videos/${videoId}/perguntas`);
            if (!res.ok) {
                setPerguntas([]);
                return;
            }
            const data = await res.json();
            setPerguntas(data);
        } catch {
            setPerguntas([]);
        }
    };

    const handleDeletarCurso = async (cursoId) => {
        const res = await fetch(`${URL}/youtube/cursos/${cursoId}`, { method: "DELETE" });
        if (res.ok) {
            mostrarAlerta("🗑️ Curso apagado!", "sucesso");
            carregarCursos();
            setVideos([]);
            setCursoAtivo(null);
        } else {
            mostrarAlerta("❌ Erro ao apagar curso.", "erro");
        }
    };

    const handleDeletarVideo = async (videoId) => {
        const res = await fetch(`${URL}/youtube/videos/${videoId}`, { method: "DELETE" });
        if (res.ok) {
            mostrarAlerta("🗑️ Vídeo apagado!", "sucesso");
            if (cursoAtivo) handleSelecionarCurso(cursoAtivo);
        } else {
            mostrarAlerta("❌ Erro ao apagar vídeo.", "erro");
        }
    };

    const cursosFiltrados = cursos.filter(
        (c) =>
            c.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
            String(c.id).includes(filtro)
    );

    return (
        <div className="youtube-lista">
            <h3>Cursos</h3>

            <input
                type="text"
                placeholder="🔎 Filtrar cursos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="filtro-cursos"
            />

            <ul>
                {cursosFiltrados.map((curso) => (
                    <li key={curso.id}>
                        <span
                            className="curso-item"
                            onClick={() => handleSelecionarCurso(curso.id)}
                        >
                            {curso.id} - {curso.titulo}
                        </span>
                        <br />
                        <button
                            onClick={() =>
                                setConfirmacao({
                                    mostrar: true,
                                    mensagem: `Deseja realmente apagar o curso "${curso.titulo}"?`,
                                    onConfirm: () => handleDeletarCurso(curso.id),
                                })
                            }
                            className="btn-apagar"
                        >
                            🗑️
                        </button>
                        {/* 🔹 Mostra último vídeo ao lado */}
                        {curso.ultimoVideoId && (
                            <span className="ultimo-video"> 🎬 {curso.ultimoVideoId}</span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Modal com vídeos do curso */}
            {mostrarModal && (
                <div className="youtubemodal-overlay" onClick={() => setMostrarModal(false)}>
                    <div
                        className="youtubemodal-conteudo"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>🎓 Vídeos do Curso {cursoAtivo}</h3>
                        <button className="btn-fechar" onClick={() => setMostrarModal(false)}>
                            ❌ Fechar
                        </button>

                        <ul className="videos-sublista">
                            {videos.map((video) => (
                                <li
                                    key={video.id}
                                    className={!video.temPerguntas ? "sem-perguntas" : ""}
                                >
                                    <span
                                        className={`video-item ${videoAtivo === video.id ? "ativo" : ""}`}
                                        onClick={() => handleSelecionarVideo(video.id)}
                                    >
                                        🎬 {video.id} - {video.titulo}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setConfirmacao({
                                                mostrar: true,
                                                mensagem: `Deseja realmente apagar o vídeo "${video.titulo}"?`,
                                                onConfirm: () => handleDeletarVideo(video.id),
                                            })
                                        }
                                        className="bbtn-apagar"
                                    >
                                        🗑️
                                    </button>

                                    {/* Perguntas do vídeo selecionado */}
                                    {videoAtivo === video.id && perguntas.length > 0 && (
                                        <ul className="perguntas-sublista">
                                            {perguntas.map((p) => (
                                                <li key={p.id}>
                                                    ❓ {p.texto}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {videoAtivo === video.id && perguntas.length === 0 && (
                                        <p className="sem-perguntas-msg">⚠️ Nenhuma pergunta cadastrada.</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
