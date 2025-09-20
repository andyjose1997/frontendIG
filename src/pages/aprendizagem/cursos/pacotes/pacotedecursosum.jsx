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
    const [certificados, setCertificados] = useState({}); // 🔹 agora guardamos {curso_id: codigo}

    const usuarioId = localStorage.getItem("usuario_id");

    // 🔹 Buscar cursos e certificados ao montar
    useEffect(() => {
        fetch(`${URL}/cursos`)
            .then(res => res.json())
            .then(setCursos)
            .catch(err => console.error("Erro ao carregar cursos:", err));

        fetch(`${URL}/certificados/usuario/${usuarioId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const mapa = {};
                    data.forEach(c => {
                        mapa[Number(c.curso_id)] = c.codigo; // 🔹 guarda curso_id -> codigo
                    });
                    setCertificados(mapa);
                }
            })
            .catch(err => console.error("Erro ao carregar certificados:", err));
    }, [usuarioId]);

    // 🔹 Carregar vídeos + progresso
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

                // 🔹 já marca como concluído se tiver certificado
                if (certificados[Number(cursoId)]) {
                    setCursoConcluido(true);
                }
            })
            .catch(err => console.error("Erro ao carregar vídeos:", err));
    };

    // 🔹 Voltar
    const voltarCursos = () => {
        setCursoAtivo(null);
        setNomeCursoAtivo("");
        setVideos([]);
        setCursoConcluido(false);
    };

    // 🔹 Quando concluir um vídeo
    const handleConcluirVideo = (video) => {
        const idx = videos.findIndex(v => v.id === video.id);

        if (idx !== -1 && idx + 1 < videos.length) {
            setVideoAtivo(videos[idx + 1]);
        } else {
            setVideoAtivo(null);
            setCursoConcluido(true);

            // 🔹 Emitir certificado
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
                    console.log("🎓 Certificado emitido:", data);
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
        <div>
            <h2>🎓 Pacote de Cursos Exclusivos</h2>

            {!cursoAtivo ? (
                cursos.length > 0 ? (
                    <ul>
                        {cursos.map((curso) => {
                            const codigoCert = certificados[Number(curso.id)];
                            return (
                                <li key={curso.id}>
                                    <button
                                        onClick={() => carregarVideos(curso.id, curso.titulo)}
                                        className={`curso-bbtn ${codigoCert ? "concluido" : ""}`}
                                    >
                                        {curso.titulo}
                                    </button>
                                    {codigoCert && (
                                        <div className="texto-concluido">
                                            <p>✅ Curso concluído</p>
                                            <p>🔑 O código do seu certificado é: <b>{codigoCert}</b></p>
                                            <a
                                                href={`/historico-certificados/${codigoCert}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-ver-certificado"
                                            >
                                                Ver Certificado
                                            </a>

                                            {/* 🔹 Botão de teste: emitir sempre e baixar */}
                                            <button
                                                onClick={() => {
                                                    fetch(`${URL}/certificados/emitir`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            usuario_id: usuarioId,
                                                            curso_id: Number(curso.id)
                                                        })
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            if (data.link_publico) {
                                                                const a = document.createElement("a");
                                                                a.href = data.link_publico;
                                                                a.download = `certificado_${data.codigo}.png`;
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                            }
                                                        })
                                                        .catch(err => console.error("Erro ao emitir certificado:", err));
                                                }}
                                                className="btn-emitir-teste"
                                            >
                                                Emitir Certificado (teste)
                                            </button>



                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Carregando cursos...</p>
                )
            ) : (
                <div>
                    <button onClick={voltarCursos}>⬅ Voltar para Cursos</button>

                    <h3>📺 Vídeos do Curso: {nomeCursoAtivo}</h3>

                    {(cursoConcluido || certificados[Number(cursoAtivo)]) && (
                        <div className="curso-concluido">
                            <p>🎉 Parabéns! Você concluiu este curso!</p>
                            {certificados[Number(cursoAtivo)] && (
                                <>
                                    <p>🔑 O código do seu certificado é: <b>{certificados[Number(cursoAtivo)]}</b></p>
                                    <a
                                        href={`/historico-certificados/${certificados[Number(cursoAtivo)]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-ver-certificado"
                                    >
                                        Ver Certificado
                                    </a>

                                    {/* 🔹 Botão de teste: emitir sempre */}
                                    <button
                                        onClick={() => {
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
                                                    alert("Certificado emitido! Código: " + data.codigo);
                                                })
                                                .catch(err => console.error("Erro ao emitir certificado:", err));
                                        }}
                                        className="btn-emitir-teste"
                                    >
                                        Emitir Certificado (teste)
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <ul>
                        {videos.map((video) => (
                            <li key={video.id}>
                                <button
                                    onClick={() => setVideoAtivo(video)}
                                    className={`video-bbbtn ${cursoConcluido || progresso[video.id] === 1 ? "concluido" : ""}`}
                                >
                                    {video.titulo}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 🔹 Modal separado */}
            <VideoModal
                video={videoAtivo}
                onClose={() => setVideoAtivo(null)}
                onConcluirVideo={handleConcluirVideo}
            />
        </div>
    );
}
