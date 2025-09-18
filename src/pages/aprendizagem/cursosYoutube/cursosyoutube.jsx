// src/components/youtube/CursosYouTube.jsx
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { apiYoutube } from "./apiyoutube";
import PerguntaCurso from "./perguntacurso";
import "./cursosyoutube.css";

export const CursosYouTube = () => {
    const [cursos, setCursos] = useState([]);
    const [cursoSelecionado, setCursoSelecionado] = useState(null);
    const [videos, setVideos] = useState([]);
    const [videoSelecionado, setVideoSelecionado] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [mostrarPerguntas, setMostrarPerguntas] = useState(false);
    const [progresso, setProgresso] = useState([]); // progresso de todos os cursos
    const [hoverCurso, setHoverCurso] = useState(null);

    const usuarioId = localStorage.getItem("usuario_id");

    // Buscar cursos e progresso ao carregar
    useEffect(() => {
        const carregar = async () => {
            try {
                const cursosData = await apiYoutube.getCursos();
                setCursos(cursosData);

                // Buscar progresso de todos os cursos
                const progressoData = {};
                for (const curso of cursosData) {
                    const prog = await apiYoutube.getProgresso(usuarioId, curso.id);
                    progressoData[curso.id] = prog;
                }
                setProgresso(progressoData);
            } catch (err) {
                console.error("Erro ao carregar cursos:", err);
            }
        };
        carregar();
    }, [usuarioId]);

    // Selecionar curso → carregar vídeos
    const handleSelecionarCurso = async (curso) => {
        setCursoSelecionado(curso);
        setVideoSelecionado(null);
        setVideos([]);
        setPerguntas([]);
        setMostrarPerguntas(false);

        try {
            const vids = await apiYoutube.getVideos(curso.id);
            setVideos(vids);
        } catch (err) {
            console.error("Erro ao carregar curso:", err);
        }
    };

    // Voltar para lista
    const handleVoltar = () => {
        setCursoSelecionado(null);
        setVideos([]);
        setVideoSelecionado(null);
        setPerguntas([]);
        setMostrarPerguntas(false);
    };

    // Selecionar vídeo
    const handleSelecionarVideo = async (video) => {
        setVideoSelecionado(video);
        setMostrarPerguntas(false);

        try {
            const pergs = await apiYoutube.getPerguntas(video.id);
            setPerguntas(pergs);
        } catch (err) {
            console.error("Erro ao carregar perguntas:", err);
        }
    };

    // Player options
    const opts = {
        height: "575",
        width: "820",
        playerVars: { autoplay: 0 },
    };

    // Verificar se vídeo está concluído
    const isConcluido = (videoId) => {
        if (!cursoSelecionado) return false;
        const prog = progresso[cursoSelecionado.id] || [];
        return prog.some((p) => p.video_id === videoId && p.concluido);
    };

    // % de progresso do curso
    const calcularProgressoCurso = (cursoId, totalVideos) => {
        if (!totalVideos || totalVideos === 0) return 0;
        const prog = progresso[cursoId] || [];
        const concluidos = prog.filter((p) => p.concluido).length;
        return Math.round((concluidos / totalVideos) * 100);
    };

    // Atualizar progresso local
    const handleConcluir = (videoId) => {
        if (!cursoSelecionado) return;
        setProgresso((prev) => {
            const progAtual = prev[cursoSelecionado.id] || [];
            const novoProg = [
                ...progAtual.filter((p) => p.video_id !== videoId),
                { video_id: videoId, concluido: true, tentativas: 0 },
            ];
            return { ...prev, [cursoSelecionado.id]: novoProg };
        });
    };

    return (
        <div className="cursos-container">
            <h2>Cursos no YouTube</h2>

            {/* Lista de cursos */}
            {!cursoSelecionado && (
                <div className="botoes-cursos">
                    {cursos.map((curso) => (
                        <div
                            key={curso.id}
                            className="curso-wrapper"
                            onMouseEnter={() => setHoverCurso(curso.id)}
                            onMouseLeave={() => setHoverCurso(null)}
                        >
                            <button
                                onClick={() => handleSelecionarCurso(curso)}
                                className="curso-botao"
                            >
                                {curso.titulo}
                                <span className="progresso">
                                    {calcularProgressoCurso(curso.id, curso.total_videos || 0)}%
                                </span>
                            </button>

                            {/* Tooltip com descrição */}
                            {hoverCurso === curso.id && (
                                <div className="tooltip-descricao">
                                    {curso.descricao || "Sem descrição disponível."}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Detalhes do curso */}
            {cursoSelecionado && (
                <div className="curso-detalhes">
                    <div className="cabecalho-curso">
                        <button className="voltar-botao" onClick={handleVoltar}>
                            ⬅️ Voltar
                        </button>
                        <h3>
                            {cursoSelecionado.titulo} –{" "}
                            <span className="autor">
                                <br />
                                {cursoSelecionado.autor}
                            </span>
                        </h3>
                    </div>

                    {videos.length > 0 ? (
                        <>
                            <ul className="lista-videos">
                                {videos.map((video, index) => (
                                    <li
                                        key={video.id}
                                        className={`video-item ${videoSelecionado?.id === video.id ? "ativo" : ""} 
                                            ${isConcluido(video.id) ? "concluido" : ""}`}
                                    >
                                        <div
                                            className="video-titulo"
                                            onClick={() => handleSelecionarVideo(video)}
                                        >
                                            {video.titulo} {isConcluido(video.id) && "✅"}
                                        </div>

                                        {videoSelecionado?.id === video.id && (
                                            <div className="video-player">
                                                <h4>{video.titulo}</h4>
                                                <YouTube
                                                    videoId={video.codigo_iframe.split("embed/")[1].split("?")[0]}
                                                    opts={opts}
                                                    onEnd={() => setMostrarPerguntas(true)}
                                                />

                                                {mostrarPerguntas && (
                                                    <PerguntaCurso
                                                        videoId={video.id}
                                                        isUltimo={index === videos.length - 1}
                                                        onConcluir={(id, fim) => {
                                                            handleConcluir(id);
                                                            if (fim) {
                                                                setVideoSelecionado(null);
                                                                setMostrarPerguntas(false);
                                                                setPerguntas([]);
                                                            } else {
                                                                handleSelecionarVideo(videos[index + 1]);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* Conclusão do curso */}
                            {(progresso[cursoSelecionado.id]?.filter((p) => p.concluido).length || 0) === videos.length && (
                                <div className="curso-concluido">
                                    <h3>
                                        🎉 Parabéns, você concluiu o curso{" "}
                                        <span className="curso-nome">
                                            {cursoSelecionado.titulo}
                                        </span>
                                        !
                                    </h3>
                                    <button className="certificado-botao">
                                        📜 Gerar Certificado
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Sem vídeos para este curso.</p>
                    )}
                </div>
            )}
        </div>
    );
};
