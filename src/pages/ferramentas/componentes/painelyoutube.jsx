import { useState, useEffect } from "react";
import { URL } from "../../../config";
import "./painelyoutube.css";

export default function PainelYouTube() {
    const [subPainel, setSubPainel] = useState("cursos");
    const [alerta, setAlerta] = useState({ mensagem: "", tipo: "" });
    const [confirmacao, setConfirmacao] = useState({
        mostrar: false,
        mensagem: "",
        onConfirm: null,
    });

    // Função para exibir alerta customizado
    const mostrarAlerta = (mensagem, tipo = "sucesso") => {
        setAlerta({ mensagem, tipo });
        setTimeout(() => setAlerta({ mensagem: "", tipo: "" }), 3000);
    };

    // 🔹 Emite evento global para atualizar lista
    const atualizarLista = () => {
        window.dispatchEvent(new Event("atualizarCursos"));
    };

    return (
        <div className="painel-youtube">
            <h2>Gerenciamento do YouTube</h2>

            {/* Alerta personalizado */}
            {alerta.mensagem && (
                <div className={`alerta alerta-${alerta.tipo}`}>
                    {alerta.mensagem}
                </div>
            )}

            {/* Modal de confirmação */}
            {confirmacao.mostrar && (
                <div className="youtubemodal-overlay">
                    <div className="youtubemodal-confirmacao">
                        <p>{confirmacao.mensagem}</p>
                        <div className="botoes">
                            <button
                                className="btn-confirmar"
                                onClick={() => {
                                    confirmacao.onConfirm();
                                    setConfirmacao({ mostrar: false });
                                }}
                            >
                                Confirmar
                            </button>
                            <button
                                className="btn-cancelar"
                                onClick={() => setConfirmacao({ mostrar: false })}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botões de navegação */}
            <div className="youtube-botoes">
                <button
                    className={subPainel === "cursos" ? "ativo" : ""}
                    onClick={() => setSubPainel("cursos")}
                >
                    Cursos
                </button>
                <button
                    className={subPainel === "videos" ? "ativo" : ""}
                    onClick={() => setSubPainel("videos")}
                >
                    Vídeos
                </button>
                <button
                    className={subPainel === "perguntas" ? "ativo" : ""}
                    onClick={() => setSubPainel("perguntas")}
                >
                    Perguntas
                </button>
            </div>

            {/* Área dividida */}
            <div className="youtube-layout">
                <div className="youtube-conteudo">
                    {subPainel === "cursos" && (
                        <FormularioCurso mostrarAlerta={mostrarAlerta} atualizarLista={atualizarLista} />
                    )}
                    {subPainel === "videos" && (
                        <FormularioVideo mostrarAlerta={mostrarAlerta} atualizarLista={atualizarLista} />
                    )}
                    {subPainel === "perguntas" && (
                        <FormularioPergunta mostrarAlerta={mostrarAlerta} atualizarLista={atualizarLista} />
                    )}
                </div>

                {/* Lista lateral */}
                <ListaCursos mostrarAlerta={mostrarAlerta} setConfirmacao={setConfirmacao} />
            </div>
        </div>
    );
}

/* ================= LISTA DE CURSOS ================= */
function ListaCursos({ mostrarAlerta, setConfirmacao }) {
    const [cursos, setCursos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [cursoAtivo, setCursoAtivo] = useState(null);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        carregarCursos();

        // 🔹 Escuta evento para atualizar lista
        const atualizar = () => carregarCursos();
        window.addEventListener("atualizarCursos", atualizar);

        return () => window.removeEventListener("atualizarCursos", atualizar);
    }, []);

    const carregarCursos = () => {
        fetch(`${URL}/youtube/cursos`)
            .then((res) => res.json())
            .then(setCursos)
            .catch(console.error);
    };

    const handleSelecionarCurso = async (cursoId) => {
        if (cursoAtivo === cursoId) {
            setCursoAtivo(null);
            setVideos([]);
        } else {
            setCursoAtivo(cursoId);
            const res = await fetch(`${URL}/youtube/cursos/${cursoId}/videos`);
            const data = await res.json();
            setVideos(data);
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

    // 🔎 Filtrar cursos
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
                            className={`curso-item ${cursoAtivo === curso.id ? "ativo" : ""}`}
                            onClick={() => handleSelecionarCurso(curso.id)}
                        >
                            {curso.id} - {curso.titulo}
                        </span>
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

                        {cursoAtivo === curso.id && (
                            <ul className="videos-sublista">
                                {videos.map((video) => (
                                    <li key={video.id}>
                                        🎬 {video.id} - {video.titulo}
                                        <button
                                            onClick={() =>
                                                setConfirmacao({
                                                    mostrar: true,
                                                    mensagem: `Deseja realmente apagar o vídeo "${video.titulo}"?`,
                                                    onConfirm: () => handleDeletarVideo(video.id),
                                                })
                                            }
                                            className="btn-apagar"
                                        >
                                            🗑️
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ================= FORMULÁRIOS ================= */
function FormularioCurso({ mostrarAlerta, atualizarLista }) {
    const [form, setForm] = useState({ titulo: "", autor: "", descricao: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${URL}/youtube/cursos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            mostrarAlerta("✅ Curso cadastrado com sucesso!", "sucesso");
            setForm({ titulo: "", autor: "", descricao: "" });
            atualizarLista(); // 🔹 Atualiza lista
        } else {
            mostrarAlerta("❌ Erro ao cadastrar curso.", "erro");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Novo Curso</h3>
            <input
                type="text"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Autor"
                value={form.autor}
                onChange={(e) => setForm({ ...form, autor: e.target.value })}
            />
            <textarea
                placeholder="Descrição"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <button type="submit">Salvar Curso</button>
        </form>
    );
}

function FormularioVideo({ mostrarAlerta, atualizarLista }) {
    const [form, setForm] = useState({ curso_id: "", titulo: "", codigo_iframe: "" });
    const [confirmacao, setConfirmacao] = useState({ mostrar: false, cursoNome: "", onConfirm: null });

    const validarCurso = async () => {
        try {
            const res = await fetch(`${URL}/youtube/cursos`);
            if (!res.ok) return null;
            const cursos = await res.json();
            const curso = cursos.find(c => c.id === Number(form.curso_id));
            return curso || null;
        } catch {
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const curso = await validarCurso();
        if (!curso) {
            mostrarAlerta("❌ ID do curso inválido!", "erro");
            return;
        }

        setConfirmacao({
            mostrar: true,
            cursoNome: curso.titulo,
            onConfirm: async () => {
                const res = await fetch(`${URL}/youtube/videos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });

                if (res.ok) {
                    mostrarAlerta("✅ Vídeo cadastrado!", "sucesso");
                    setForm({ curso_id: "", titulo: "", codigo_iframe: "" });
                    atualizarLista(); // 🔹 Atualiza lista
                } else {
                    mostrarAlerta("❌ Erro ao cadastrar vídeo.", "erro");
                }

                setConfirmacao({ mostrar: false, cursoNome: "", onConfirm: null });
            },
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3>Novo Vídeo</h3>
                <input
                    type="number"
                    placeholder="ID do Curso"
                    value={form.curso_id}
                    onChange={(e) => setForm({ ...form, curso_id: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Título"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Código embed do YouTube"
                    value={form.codigo_iframe}
                    onChange={(e) => setForm({ ...form, codigo_iframe: e.target.value })}
                    required
                />
                <button type="submit">Salvar Vídeo</button>
            </form>

            {confirmacao.mostrar && (
                <div className="youtubemodal-overlay">
                    <div className="youtubemodal-confirmacao">
                        <p>
                            Deseja realmente salvar este vídeo para o curso{" "}
                            <strong>{confirmacao.cursoNome}</strong>?
                        </p>
                        <div className="botoes">
                            <button
                                className="btn-confirmar"
                                onClick={confirmacao.onConfirm}
                            >
                                Confirmar
                            </button>
                            <button
                                className="btn-cancelar"
                                onClick={() => setConfirmacao({ mostrar: false, cursoNome: "", onConfirm: null })}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function FormularioPergunta({ mostrarAlerta, atualizarLista }) {
    const [form, setForm] = useState({
        video_id: "",
        texto: "",
        opcao1: "",
        opcao2: "",
        opcao3: "",
        opcao4: "",
        opcao5: "",
        opcao6: "",
        resposta_correta: 1,
    });

    const validarOpcoes = () => {
        const opcoes = [form.opcao1, form.opcao2, form.opcao3, form.opcao4, form.opcao5, form.opcao6]
            .map(o => o.trim().toLowerCase())
            .filter(o => o !== "");

        const temDuplicadas = new Set(opcoes).size !== opcoes.length;
        return !temDuplicadas;
    };

    const validarVideo = async () => {
        try {
            const resVideo = await fetch(`${URL}/youtube/videos/${form.video_id}`);
            if (!resVideo.ok) return false;

            const resPerguntas = await fetch(`${URL}/youtube/videos/${form.video_id}/perguntas`);
            const perguntas = await resPerguntas.json();
            if (perguntas.length > 0) return false;

            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarOpcoes()) {
            mostrarAlerta("❌ As opções não podem ser iguais!", "erro");
            return;
        }

        const valido = await validarVideo();
        if (!valido) {
            mostrarAlerta("❌ ID do vídeo inválido ou já possui pergunta!", "erro");
            return;
        }

        const res = await fetch(`${URL}/youtube/perguntas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            mostrarAlerta("✅ Pergunta cadastrada!", "sucesso");
            setForm({
                video_id: "",
                texto: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
                opcao6: "",
                resposta_correta: 1,
            });
            atualizarLista(); // 🔹 Atualiza lista
        } else {
            mostrarAlerta("❌ Erro ao cadastrar pergunta.", "erro");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Nova Pergunta</h3>
            <input
                type="number"
                placeholder="ID do Vídeo"
                value={form.video_id}
                onChange={(e) => setForm({ ...form, video_id: e.target.value })}
                required
            />
            <textarea
                placeholder="Texto da pergunta"
                value={form.texto}
                onChange={(e) => setForm({ ...form, texto: e.target.value })}
                required
            />
            {[1, 2, 3, 4, 5, 6].map((num) => (
                <input
                    key={num}
                    type="text"
                    placeholder={`Opção ${num}`}
                    value={form[`opcao${num}`]}
                    onChange={(e) => setForm({ ...form, [`opcao${num}`]: e.target.value })}
                />
            ))}
            <input
                type="number"
                min="1"
                max="6"
                placeholder="Resposta correta"
                value={form.resposta_correta}
                onChange={(e) => setForm({ ...form, resposta_correta: e.target.value })}
                required
            />
            <button type="submit">Salvar Pergunta</button>
        </form>
    );
}
