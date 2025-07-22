import './Feed.css';
import { useState, useRef } from 'react';
import Info from './Info';

export default function Feed() {
    const sectionRef = useRef(null);

    const [posts, setPosts] = useState([
        { id: 1, autor: "Maria Souza", imagem: "https://i.pravatar.cc/40?img=1", data: "25 de junho de 2025", titulo: "Como aprendi programação em 3 meses" },
        { id: 2, autor: "João Silva", imagem: "https://i.pravatar.cc/40?img=2", data: "24 de junho de 2025", titulo: "Dicas para ser mais produtivo estudando online" },
        { id: 3, autor: "Ana Lima", imagem: "https://i.pravatar.cc/40?img=3", data: "22 de junho de 2025", titulo: "Meu primeiro projeto usando React" },
        { id: 4, autor: "Carlos Mendes", imagem: "https://i.pravatar.cc/40?img=4", data: "21 de junho de 2025", titulo: "Vale a pena estudar JavaScript em 2025?" },
        { id: 5, autor: "Fernanda Costa", imagem: "https://i.pravatar.cc/40?img=5", data: "20 de junho de 2025", titulo: "Consegui meu primeiro cliente como freelancer!" },
        { id: 6, autor: "Bruno Rocha", imagem: "https://i.pravatar.cc/40?img=6", data: "19 de junho de 2025", titulo: "Como estudar 1h por dia com foco total" },
        { id: 7, autor: "Patrícia Oliveira", imagem: "https://i.pravatar.cc/40?img=7", data: "18 de junho de 2025", titulo: "Erros que cometi no meu primeiro projeto" },
        { id: 8, autor: "Lucas Santos", imagem: "https://i.pravatar.cc/40?img=8", data: "17 de junho de 2025", titulo: "React ou Vue: o que escolhi para meu app?" },
        { id: 9, autor: "Juliana Ribeiro", imagem: "https://i.pravatar.cc/40?img=9", data: "16 de junho de 2025", titulo: "Estudando com vídeos gratuitos no YouTube" },
        { id: 10, autor: "Ricardo Almeida", imagem: "https://i.pravatar.cc/40?img=10", data: "15 de junho de 2025", titulo: "Montei meu portfólio com HTML e CSS" },
    ]);

    const [novaPostagem, setNovaPostagem] = useState("");
    const [comentariosPorPost, setComentariosPorPost] = useState({});
    const [mostrarComentarios, setMostrarComentarios] = useState({});
    const [mostrarCampoComentario, setMostrarCampoComentario] = useState({});
    const [novosComentarios, setNovosComentarios] = useState({});
    const [refreshCount, setRefreshCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const usuario = {
        nome: "Seu Nome",
        imagem: "/perfil.png"
    };

    const handlePostar = () => {
        if (novaPostagem.trim() === "") return;

        const novoPost = {
            id: Date.now(),
            autor: usuario.nome,
            imagem: usuario.imagem,
            data: new Date().toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            titulo: novaPostagem,
        };

        setPosts([novoPost, ...posts]);
        setNovaPostagem("");
    };

    const toggleMostrarComentarios = (postId) => {
        setMostrarComentarios((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const toggleCampoComentario = (postId) => {
        setMostrarCampoComentario((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const adicionarComentario = (postId) => {
        const texto = (novosComentarios[postId] || "").trim();
        if (texto === "") return;

        setComentariosPorPost((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] || []), texto]
        }));

        setNovosComentarios((prev) => ({
            ...prev,
            [postId]: ""
        }));

        setMostrarCampoComentario((prev) => ({
            ...prev,
            [postId]: false
        }));

        setMostrarComentarios((prev) => ({
            ...prev,
            [postId]: true
        }));
    };

    return (
        <div className="FeedWrapper" key={refreshCount}>
            <section ref={sectionRef} className="FeedSectionScroll">

                <h3>Últimas Noticias</h3>
                {posts.map((post) => (
                    <div key={post.id} className="card-post">
                        <div className="autor-info">
                            <img src={post.imagem} alt="Perfil" />
                            <div>
                                <strong>{post.autor}</strong><br />
                                <small>{post.data}</small>
                            </div>
                        </div>

                        <h4>{post.titulo}</h4>
                        <a href="#" className="btn-vermais-link">Ver mais</a>

                        <div className="comentario-acoes">
                            <button className="btn-link" onClick={() => toggleCampoComentario(post.id)}>
                                Comentar
                            </button>
                            <button className="btn-link" onClick={() => toggleMostrarComentarios(post.id)}>
                                Comentários ({(comentariosPorPost[post.id] || []).length})
                            </button>
                        </div>

                        {mostrarCampoComentario[post.id] && (
                            <div className="comentario-box">
                                <input
                                    type="text"
                                    placeholder="Escreva um comentário..."
                                    className="input-comentario"
                                    value={novosComentarios[post.id] || ""}
                                    onChange={(e) =>
                                        setNovosComentarios((prev) => ({
                                            ...prev,
                                            [post.id]: e.target.value
                                        }))
                                    }
                                />
                                <button className="btn-comentar" onClick={() => adicionarComentario(post.id)}>
                                    Comentar
                                </button>
                            </div>
                        )}

                        {mostrarComentarios[post.id] && (
                            <ul className="lista-comentarios">
                                {(comentariosPorPost[post.id] || []).map((comentario, i) => (
                                    <li key={i}>{comentario}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
                <button
                    className="btn-voltar-topo"
                    onClick={() => {
                        setLoading(true);  // Mostra a bolinha de carregamento

                        setTimeout(() => {
                            if (sectionRef.current) {
                                sectionRef.current.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }
                            setRefreshCount((prev) => prev + 1);  // Força re-renderização

                            setLoading(false);  // Esconde o carregamento
                        }, 1000);  // Tempo do "carregando"
                    }}
                >
                    {loading ? (
                        <span className="spinner"></span>  // Mostra a bolinha enquanto está carregando
                    ) : (
                        "Voltar ao topo do Feed"
                    )}
                </button>



                <br /><br /><br />
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid black",
                    borderRadius: "50px"
                }}>
                    <Info />
                </div>
                <br /><br /><br /><br />
            </section>
        </div>

    );
}
