import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./painelcursos.css";

export default function PainelCursos() {
    const [cursos, setCursos] = useState([]);
    const [alerta, setAlerta] = useState(null);

    // Estados de modal
    const [cursoSelecionado, setCursoSelecionado] = useState(null);
    const [videos, setVideos] = useState([]);
    const [videoSelecionado, setVideoSelecionado] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [iframeAberto, setIframeAberto] = useState(null);

    // Estados de edição
    const [cursoEditando, setCursoEditando] = useState(null);
    const [videoEditando, setVideoEditando] = useState(null);
    const [perguntaEditando, setPerguntaEditando] = useState(null);

    // 🔹 Carregar cursos
    const carregarCursos = async () => {
        try {
            const res = await fetch(`${URL}/cursos`);
            const data = await res.json();
            setCursos(data);
        } catch (err) {
            console.error("Erro ao carregar cursos:", err);
        }
    };

    useEffect(() => {
        carregarCursos();
    }, []);

    const mostrarAlerta = (msg, tipo = "sucesso") => {
        setAlerta({ msg, tipo });
        setTimeout(() => setAlerta(null), 2500);
    };

    // 🔹 Cursos
    const handleSubmitCurso = async (e) => {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.target).entries());

        try {
            if (cursoEditando) {
                const res = await fetch(`${URL}/cursos/${cursoEditando.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(await res.text());
                mostrarAlerta("✏️ Curso atualizado!");
                setCursoEditando(null);
            } else {
                const res = await fetch(`${URL}/cursos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(await res.text());
                mostrarAlerta("✅ Curso adicionado!");
            }

            e.target.reset();
            carregarCursos();
        } catch (err) {
            mostrarAlerta("Erro: " + err.message, "erro");
        }
    };

    const apagarCurso = async (id) => {
        setAlerta({
            msg: "Confirmar exclusão do curso?", tipo: "confirm", acao: async () => {
                try {
                    const res = await fetch(`${URL}/cursos/${id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error(await res.text());
                    mostrarAlerta("🗑️ Curso apagado!");
                    carregarCursos();
                } catch (err) {
                    mostrarAlerta("Erro: " + err.message, "erro");
                }
            }
        });
    };

    // 🔹 Vídeos
    const carregarVideos = async (cursoId) => {
        const res = await fetch(`${URL}/videos?curso_id=${cursoId}`);
        setVideos(await res.json());
        setCursoSelecionado(cursoId);
    };

    const handleSubmitVideo = async (e, cursoId) => {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.target).entries());
        body.curso_id = cursoId;

        try {
            if (videoEditando) {
                const res = await fetch(`${URL}/videos/${videoEditando.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(await res.text());
                mostrarAlerta("✏️ Vídeo atualizado!");
                setVideoEditando(null);
            } else {
                const res = await fetch(`${URL}/videos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(await res.text());
                mostrarAlerta("✅ Vídeo adicionado!");
            }

            e.target.reset();
            carregarVideos(cursoId);
        } catch (err) {
            mostrarAlerta("Erro: " + err.message, "erro");
        }
    };

    const apagarVideo = async (id, cursoId) => {
        setAlerta({
            msg: "Confirmar exclusão do vídeo?", tipo: "confirm", acao: async () => {
                try {
                    const res = await fetch(`${URL}/videos/${id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error(await res.text());
                    mostrarAlerta("🗑️ Vídeo apagado!");
                    carregarVideos(cursoId);
                } catch (err) {
                    mostrarAlerta("Erro: " + err.message, "erro");
                }
            }
        });
    };

    // 🔹 Perguntas
    const carregarPerguntas = async (video) => {
        const res = await fetch(`${URL}/perguntas?video_id=${video.id}`);
        setPerguntas(await res.json());
        setVideoSelecionado(video);
    };

    const handleSubmitPergunta = async (e) => {
        e.preventDefault();
        if (!videoSelecionado) return;

        const body = Object.fromEntries(new FormData(e.target).entries());
        body.video_id = videoSelecionado.id;

        try {
            if (perguntaEditando) {
                const res = await fetch(`${URL}/perguntas/${perguntaEditando.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(await res.text());
                mostrarAlerta("✏️ Pergunta atualizada!");
                setPerguntaEditando(null);
            } else {
                const res = await fetch(`${URL}/perguntas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(await res.text());
                mostrarAlerta("✅ Pergunta adicionada!");
            }

            e.target.reset();
            carregarPerguntas(videoSelecionado);
        } catch (err) {
            mostrarAlerta("Erro: " + err.message, "erro");
        }
    };

    const apagarPergunta = async (id) => {
        setAlerta({
            msg: "Confirmar exclusão da pergunta?", tipo: "confirm", acao: async () => {
                try {
                    const res = await fetch(`${URL}/perguntas/${id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error(await res.text());
                    mostrarAlerta("🗑️ Pergunta apagada!");
                    carregarPerguntas(videoSelecionado);
                } catch (err) {
                    mostrarAlerta("Erro: " + err.message, "erro");
                }
            }
        });
    };

    // 🔹 Modal genérico
    const Modal = ({ children, onClose }) => (
        <div className="icpn-modal-overlay" onClick={onClose}>
            <div className="icpn-modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
                <button className="icpn-btn-voltar" onClick={onClose}>⬅ Voltar</button>
            </div>
        </div>
    );

    return (
        <div className="icpn-painel-cursos">
            <h2>Painel de Cursos</h2>

            {/* Alerta customizado */}
            {alerta && (
                <div className={`icpn-alerta ${alerta.tipo}`}>
                    <p>{alerta.msg}</p>
                    {alerta.tipo === "confirm" && (
                        <div className="icpn-alerta-actions">
                            <button onClick={() => { alerta.acao(); setAlerta(null); }}>✅ Sim</button>
                            <button onClick={() => setAlerta(null)}>❌ Não</button>
                        </div>
                    )}
                </div>
            )}

            {/* 🔹 Formulário de curso */}
            <form onSubmit={handleSubmitCurso} className="icpn-form-curso">
                <h3>{cursoEditando ? "Editar Curso" : "Novo Curso"}</h3>
                <input name="titulo" placeholder="Título" required defaultValue={cursoEditando?.titulo || ""} />
                <input name="autor" placeholder="Autor" defaultValue={cursoEditando?.autor || ""} />
                <textarea name="descricao" placeholder="Descrição" defaultValue={cursoEditando?.descricao || ""}></textarea>
                <button type="submit">{cursoEditando ? "✏️ Atualizar" : "Salvar Curso"}</button>
            </form>

            {/* 🔹 Lista de cursos */}
            <div className="icpn-lista-cursos">
                <h3>📋 Cursos já cadastrados</h3>
                {cursos.length > 0 ? (
                    <ul>
                        {cursos.map((curso) => (
                            <li key={curso.id}>
                                <span>{curso.titulo}</span>
                                <button onClick={() => carregarVideos(curso.id)}>📺 Ver vídeos</button>
                                <button onClick={() => setCursoEditando(curso)}>✏️ Editar</button>
                                <button onClick={() => apagarCurso(curso.id)}>🗑️ Apagar</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum curso encontrado.</p>
                )}
            </div>

            {/* 🔹 Modal de vídeos */}
            {/* 🔹 Modal de vídeos */}
            {cursoSelecionado && (
                <Modal onClose={() => {
                    setCursoSelecionado(null);
                    setVideoEditando(null);
                }}>
                    <h3>📺 Vídeos do Curso {cursoSelecionado}</h3>

                    {/* Formulário de vídeo */}
                    <form onSubmit={(e) => handleSubmitVideo(e, cursoSelecionado)} className="icpn-form-video">
                        <h4>{videoEditando ? "✏️ Editar Vídeo" : "➕ Adicionar Vídeo"}</h4>
                        <input
                            name="titulo"
                            placeholder="Título do Vídeo"
                            required
                            defaultValue={videoEditando?.titulo || ""}
                        />
                        <textarea
                            name="link_embed"
                            placeholder="Código ou link embed"
                            required
                            defaultValue={videoEditando?.link_embed || ""}
                        ></textarea>
                        <button type="submit">
                            {videoEditando ? "✏️ Atualizar Vídeo" : "Salvar Vídeo"}
                        </button>
                    </form>

                    {/* Lista de vídeos */}
                    <div className="icpn-lista-videos">
                        {videos.length > 0 ? (
                            videos.map((video) => (
                                <div key={video.id} className="icpn-video-item">
                                    <p><strong>{video.titulo}</strong></p>
                                    <div className="icpn-video-actions">
                                        <button
                                            onClick={() => {
                                                const match = video.link_embed.match(/src="([^"]+)"/);
                                                setIframeAberto(match ? match[1] : video.link_embed);
                                            }}
                                        >
                                            ▶️ Assistir
                                        </button>
                                        <button onClick={() => carregarPerguntas(video)}>❓ Perguntas</button>
                                        <button onClick={() => setVideoEditando(video)}>✏️ Editar</button>
                                        <button onClick={() => apagarVideo(video.id, cursoSelecionado)}>🗑️ Apagar</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="icpn-sem-videos">Nenhum vídeo encontrado para este curso.</p>
                        )}
                    </div>
                </Modal>
            )}


            {/* 🔹 Modal perguntas */}
            {videoSelecionado && (
                <Modal onClose={() => { setVideoSelecionado(null); setPerguntaEditando(null); }}>
                    <h3>Perguntas do Vídeo {videoSelecionado.id} - {videoSelecionado.titulo}</h3>

                    <form onSubmit={handleSubmitPergunta}>
                        <input name="pergunta" placeholder="Pergunta" required defaultValue={perguntaEditando?.pergunta || ""} />
                        {[...Array(8)].map((_, i) => (
                            <input key={i} name={`resposta${i + 1}`} placeholder={`Resposta ${i + 1}`} defaultValue={perguntaEditando?.[`resposta${i + 1}`] || ""} />
                        ))}
                        <input name="correta" type="number" placeholder="Número da resposta correta" required defaultValue={perguntaEditando?.correta || ""} />
                        <button type="submit">{perguntaEditando ? "✏️ Atualizar Pergunta" : "Salvar Pergunta"}</button>
                    </form>

                    {perguntas.map((p) => (
                        <div key={p.id} className="icpn-pergunta-item">
                            <span>{p.pergunta}</span>
                            <button onClick={() => setPerguntaEditando(p)}>✏️</button>
                            <button onClick={() => apagarPergunta(p.id)}>🗑️</button>
                        </div>
                    ))}
                </Modal>
            )}

            {/* 🔹 Modal vídeo */}
            {iframeAberto && (
                <Modal onClose={() => setIframeAberto(null)}>
                    <iframe src={iframeAberto} title="Video" width="100%" height="400" frameBorder="0" allowFullScreen></iframe>
                </Modal>
            )}
        </div>
    );
}
