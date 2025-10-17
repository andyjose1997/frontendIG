import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { apiYoutube } from "./apiyoutube";
import PerguntaCurso from "./perguntacurso";
import "./cursosyoutube.css";
import { URL } from "../../../config"; // 🔹 importa sua URL do backend

export const CursosYouTube = () => {
    const [cursos, setCursos] = useState([]);
    const [cursoSelecionado, setCursoSelecionado] = useState(null);
    const [videos, setVideos] = useState([]);
    const [videoSelecionado, setVideoSelecionado] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [mostrarPerguntas, setMostrarPerguntas] = useState(false);
    const [progresso, setProgresso] = useState([]);
    const [hoverCurso, setHoverCurso] = useState(null);
    const [modoTeatro, setModoTeatro] = useState(false);

    const [avisoOk, setAvisoOk] = useState(false);

    const usuarioId = localStorage.getItem("usuario_id");

    // 🔹 Função para extrair o ID do vídeo a partir do iframe salvo no banco
    const extrairVideoId = (iframe) => {
        if (!iframe) return null;
        const match = iframe.match(/src="([^"]+)"/);
        if (!match) return null;
        const url = match[1]; // exemplo: https://www.youtube.com/embed/NOebfEFJW6Y
        if (url.includes("embed/")) {
            return url.split("embed/")[1].split("?")[0];
        }
        return null;
    };

    // Buscar cursos e progresso ao carregar
    useEffect(() => {
        if (!avisoOk) return;
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
    }, [usuarioId, avisoOk]);

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

    const handleVoltar = () => {
        setCursoSelecionado(null);
        setVideos([]);
        setVideoSelecionado(null);
        setPerguntas([]);
        setMostrarPerguntas(false);
    };

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

    const opts = {
        height: "575",
        width: "820",
        playerVars: { autoplay: 0 },
    };

    const isConcluido = (videoId) => {
        if (!cursoSelecionado) return false;
        const prog = progresso[cursoSelecionado.id] || [];
        return prog.some((p) => p.video_id === videoId && p.concluido);
    };

    const calcularProgressoCurso = (cursoId, totalVideos) => {
        if (!totalVideos || totalVideos === 0) return 0;
        const prog = progresso[cursoId] || [];
        const concluidos = prog.filter((p) => p.concluido).length;
        return Math.round((concluidos / totalVideos) * 100);
    };

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
            <h2>Cursos YouTube</h2>

            {!avisoOk && (
                <div className="aviso-cursos">
                    <p>
                        🔹 <strong>Atenção:</strong> Os vídeos exibidos aqui não pertencem à plataforma IronGoals.
                        Eles são conteúdos gratuitos e públicos do YouTube, incorporados via <em>embed</em>.
                    </p>
                    <p>
                        ✅ Nosso objetivo é organizar esses cursos de forma estruturada, com acompanhamento
                        de progresso, perguntas interativas e emissão de certificado exclusivo IronGoals.
                    </p>
                    <p>
                        🎥 Você pode assistir aos mesmos vídeos diretamente no YouTube sem custo, mas aqui
                        oferecemos <strong>recursos adicionais</strong> como:
                    </p>
                    <ul>
                        <li>📊 Progresso salvo automaticamente</li>
                        <li>❓ Perguntas e testes interativos ao final de cada aula</li>
                        <li>📜 Certificado de conclusão validado pela plataforma</li>
                        <li>🏆 Pontuação e ranking interno</li>
                    </ul>

                    <button className="ok-botao" onClick={() => setAvisoOk(true)}>
                        Entendi, quero ver os cursos
                    </button>
                </div>
            )}

            {avisoOk && (
                <>
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

                                    {hoverCurso === curso.id && (
                                        <div className="tooltip-descricao">
                                            {curso.descricao || "Sem descrição disponível."}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

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
                                                        <h4 style={{ color: "black" }}  >{video.titulo}</h4>
                                                        <div
                                                            className={`video-responsivo ${modoTeatro ? "modo-teatro" : ""}`}
                                                            onClick={() => setModoTeatro(true)}
                                                        >
                                                            <iframe
                                                                src={`https://www.youtube.com/embed/${extrairVideoId(
                                                                    video.codigo_iframe
                                                                )}?autoplay=0&modestbranding=1&rel=0&playsinline=1`}
                                                                title="YouTube video player"
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                                                allowFullScreen
                                                                webkitallowfullscreen="true"
                                                                mozallowfullscreen="true"
                                                            ></iframe>

                                                            {modoTeatro && (
                                                                <>
                                                                    <div
                                                                        className="fundo-teatro"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setModoTeatro(false);
                                                                        }}
                                                                    ></div>

                                                                    <button
                                                                        className="fechar-teatro"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setModoTeatro(false);
                                                                        }}
                                                                    >
                                                                        ✖
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>


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

                                    {(progresso[cursoSelecionado.id]?.filter((p) => p.concluido).length || 0) === videos.length && (
                                        <div className="curso-concluido">
                                            <h3>
                                                🎉 Parabéns, você concluiu o curso{" "}
                                                <span className="curso-nome">
                                                    {cursoSelecionado.titulo}
                                                </span>
                                                !
                                            </h3>
                                            <button
                                                className="certificado-botao"
                                                onClick={async () => {
                                                    const usuarioId = localStorage.getItem("usuario_id");
                                                    const cursoId = cursoSelecionado.id;

                                                    if (!usuarioId || !cursoId) {
                                                        alert("⚠️ Usuário ou curso inválido.");
                                                        return;
                                                    }

                                                    try {
                                                        // 🔹 1. Primeiro tenta pegar certificado já existente
                                                        const resCheck = await fetch(
                                                            `${URL}/certificados/detalhes-por-usuario-curso?usuario_id=${usuarioId}&curso_id=${cursoId}`
                                                        );

                                                        let codigoCertificado = null;

                                                        if (resCheck.ok) {
                                                            const existente = await resCheck.json();
                                                            if (existente?.codigo) {
                                                                codigoCertificado = existente.codigo;
                                                            }
                                                        }

                                                        // 🔹 2. Se não existir, gera novo
                                                        if (!codigoCertificado) {
                                                            const resGerar = await fetch(
                                                                `${URL}/certificados/gerar?usuario_id=${usuarioId}&curso_id=${cursoId}`
                                                            );

                                                            if (!resGerar.ok) {
                                                                throw new Error("Erro ao gerar certificado");
                                                            }

                                                            const data = await resGerar.json();
                                                            codigoCertificado = data.arquivo_local.split("/").pop();
                                                        }

                                                        // 🔹 3. Redireciona sempre para o certificado
                                                        const baseUrl = window.location.origin;
                                                        const link = `${baseUrl}/historico-certificados/${codigoCertificado}`;
                                                        window.open(link, "_blank");

                                                    } catch (err) {
                                                        console.error("Erro ao emitir certificado:", err);
                                                        alert("⚠️ Não foi possível emitir ou abrir o certificado.");
                                                    }
                                                }}
                                            >
                                                📜 Ver Certificado
                                            </button>


                                        </div>
                                    )}
                                </>
                            ) : (
                                <p>Sem vídeos para este curso.</p>
                            )}
                        </div>
                    )}
                </>
            )
            }
        </div >
    );
};
