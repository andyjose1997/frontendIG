// src/components/pacoteDeCursosUm.jsx
import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import VideoModal from "./videomodal";
import './cursosum.css';

export default function PacoteDeCursosUm() {
    const [cursos, setCursos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [cursoAtivo, setCursoAtivo] = useState(null);
    const [nomeCursoAtivo, setNomeCursoAtivo] = useState("");
    const [videoAtivo, setVideoAtivo] = useState(null);
    const [progresso, setProgresso] = useState({});
    const [cursoConcluido, setCursoConcluido] = useState(false);
    const [certificados, setCertificados] = useState({});
    const [reloadKey, setReloadKey] = useState(0);
    const [proximoCurso, setProximoCurso] = useState(null); // 🔹 NOVO

    const [animarTexto, setAnimarTexto] = useState(true);
    const usuarioId = localStorage.getItem("usuario_id");

    useEffect(() => {
        const timer = setTimeout(() => setAnimarTexto(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // 🔹 Buscar cursos, certificados e o próximo curso
    useEffect(() => {
        fetch(`${URL}/cursos/`)
            .then(res => res.json())
            .then(data => {
                setCursos(data.cursos || []);
                setProximoCurso(data.proximo_curso || null); // 🔹 novo
            })
            .catch(err => console.error("Erro ao carregar cursos:", err));

        fetch(`${URL}/certificados/usuario/${usuarioId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const mapa = {};
                    data.forEach(c => {
                        mapa[Number(c.curso_id)] = c.codigo;
                    });
                    setCertificados(mapa);
                }
            })
            .catch(err => console.error("Erro ao carregar certificados:", err));
    }, [usuarioId]);

    // 🔹 Carregar vídeos e progresso
    const carregarVideos = (cursoId, cursoNome) => {
        setCursoAtivo(cursoId);
        setNomeCursoAtivo(cursoNome);

        fetch(`${URL}/videos/por-curso/${cursoId}`)
            .then(res => res.json())
            .then(data => {
                setVideos(data);

                fetch(`${URL}/progresso/usuario/${usuarioId}`)
                    .then(res => res.json())
                    .then(prog => {
                        const progressoMap = {};
                        prog.forEach(p => {
                            progressoMap[p.video_id] = Number(p.concluido);
                        });
                        setProgresso(progressoMap);
                    })
                    .catch(err => console.error("Erro ao carregar progresso:", err));

                if (certificados[Number(cursoId)]) {
                    setCursoConcluido(true);
                }
            })
            .catch(err => console.error("Erro ao carregar vídeos:", err));
    };

    const voltarCursos = () => {
        setCursoAtivo(null);
        setNomeCursoAtivo("");
        setVideos([]);
        setCursoConcluido(false);
    };

    const handleConcluirVideo = (video) => {
        const idx = videos.findIndex(v => v.id === video.id);

        if (idx !== -1 && idx + 1 < videos.length) {
            setVideoAtivo(videos[idx + 1]);
        } else {
            setVideoAtivo(null);
            setCursoConcluido(true);

            fetch(`${URL}/certificados/emitir`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: usuarioId,
                    curso_id: cursoAtivo
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.codigo) {
                        setCertificados(prev => ({
                            ...prev,
                            [Number(cursoAtivo)]: data.codigo
                        }));
                    }
                })
                .catch(err => console.error("Erro ao emitir certificado:", err));
        }
    };

    return (
        <section className="pacoteum-section" key={reloadKey}>
            <div className="pacoteum-container">
                <h2 className="pacoteum-titulo">🎓 Pacote de Cursos Exclusivos</h2>

                {/* 🔹 Aviso profissional sobre o próximo curso */}
                {proximoCurso && (
                    <div className="aviso-proximo-curso">
                        <h3>🚀 Próximo Curso Chegando!</h3>
                        <p><strong>{proximoCurso.curso}</strong></p>
                        <p>{proximoCurso.descricao}</p>
                        <p className="data-proximo">📅 Disponível a partir de <span> </span> <strong>{new Date(proximoCurso.quando).toLocaleDateString("pt-BR")}</strong></p>
                    </div>
                )}

                {/* 🔹 Lista de cursos ou vídeos */}
                {!cursoAtivo ? (
                    cursos.length > 0 ? (
                        <ul className="pacoteum-lista-cursos">
                            {cursos.map((curso) => {
                                const codigoCert = certificados[Number(curso.id)];
                                return (
                                    <li key={curso.id} className="pacoteum-item-curso">
                                        <button
                                            onClick={() => carregarVideos(curso.id, curso.titulo)}
                                            className={`pacoteum-curso-btn ${codigoCert ? "concluido" : ""}`}
                                        >
                                            {curso.titulo}
                                        </button>
                                        {codigoCert && (
                                            <div className="pacoteum-texto-concluido">
                                                <p>✅ Curso concluído</p>
                                                <p>🔑 O código do seu certificado é: <b>{codigoCert}</b></p>
                                                <a
                                                    href={`/historico-certificados/${codigoCert}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="pacoteum-btn-ver-certificado"
                                                >
                                                    Ver Certificado
                                                </a>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="pacoteum-carregando">Carregando cursos...</p>
                    )
                ) : (
                    <div className="pacoteum-area-curso">
                        <button
                            onClick={() => {
                                voltarCursos();
                                setTimeout(() => {
                                    setReloadKey(prev => prev + 1);
                                    window.location.reload();
                                }, 300);
                            }}
                            className="pacoteum-voltar-btn"
                        >
                            ⬅ Voltar para Cursos
                        </button>

                        <h3 className="pacoteum-subtitulo">📺 Vídeos do Curso: {nomeCursoAtivo}</h3>

                        {(cursoConcluido || certificados[Number(cursoAtivo)]) && (
                            <div className="pacoteum-curso-concluido">
                                <p>🎉 Parabéns! Você concluiu este curso!</p>
                                {certificados[Number(cursoAtivo)] && (
                                    <>
                                        <p>🔑 O código do seu certificado é: <b>{certificados[Number(cursoAtivo)]}</b></p>
                                        <a
                                            href={`/historico-certificados/${certificados[Number(cursoAtivo)]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pacoteum-btn-ver-certificado"
                                        >
                                            Ver Certificado
                                        </a>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 🔹 Lista de vídeos */}
                        <ul className="pacoteum-lista-videos">
                            {videos.map((video) => (
                                <li key={video.id} className="pacoteum-item-video">
                                    <button
                                        onClick={() => setVideoAtivo(video)}
                                        className={`pacoteum-video-btn ${cursoConcluido || progresso[video.id] === 1 ? "concluido" : ""}`}
                                    >
                                        {video.titulo}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <VideoModal
                    video={videoAtivo}
                    onClose={() => setVideoAtivo(null)}
                    onConcluirVideo={handleConcluirVideo}
                />
            </div>
        </section>
    );
}
