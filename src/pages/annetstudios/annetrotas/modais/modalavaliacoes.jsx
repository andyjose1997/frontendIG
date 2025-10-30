// 📂 src/pages/annetstudios/modais/ModalAvaliacoes.jsx
import ReactDOM from "react-dom";
import "./modalavaliacoes.css";
import { useState, useEffect, useRef } from "react";
import { URL } from "../../../../config";

export default function ModalAvaliacoes({ onFechar }) {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [media, setMedia] = useState(0);
    const [mensagem, setMensagem] = useState("");
    const [estrelas, setEstrelas] = useState(0);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [quantidadeVisivel, setQuantidadeVisivel] = useState(5);

    const textareaRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const id =
                    payload?.id ||
                    payload?.user_id ||
                    payload?.usuarios?.id ||
                    payload?.sub ||
                    null;
                if (id) setUsuarioLogado(id);
            } catch (err) {
                console.warn("Erro ao decodificar token:", err);
            }
        }

        carregarAvaliacoes();
    }, []);

    // 🔄 Faz a rolagem começar no final (últimos comentários)
    useEffect(() => {
        const conteudo = document.querySelector(".modalavaliacoes-conteudo");
        if (conteudo) {
            setTimeout(() => {
                conteudo.scrollTop = conteudo.scrollHeight;
            }, 600);
        }
    }, [carregando]);

    const carregarAvaliacoes = async () => {
        setCarregando(true);
        try {
            const res = await fetch(`${URL}/avaliacoes`);
            const data = await res.json();

            // 🔄 Inverter: mais antigas primeiro, recentes por último
            const lista = (data.avaliacoes || []).reverse();

            setAvaliacoes(lista);
            setMedia(data.media || 0);
        } catch (err) {
            console.error("Erro ao carregar avaliações:", err);
        } finally {
            setCarregando(false);
        }
    };

    const enviarAvaliacao = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Faça login para avaliar.");

        const estrelasParaEnviar = estrelas > 0 ? estrelas : null;

        const res = await fetch(`${URL}/avaliacoes/avaliar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                estrelas: estrelasParaEnviar,
                mensagem,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Avaliação enviada!");
            setMensagem("");
            setEstrelas(0);
            setEditandoId(null);
            carregarAvaliacoes();
        } else {
            alert(data.erro || "Erro ao enviar avaliação.");
        }
    };

    const apagarAvaliacao = async (id) => {
        if (!window.confirm("Deseja realmente apagar sua avaliação?")) return;
        const token = localStorage.getItem("token");
        if (!token) return alert("Faça login para apagar.");

        const res = await fetch(`${URL}/avaliacoes/apagar/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
            alert("Avaliação removida!");
            carregarAvaliacoes();
        } else {
            alert(data.detail || "Erro ao apagar.");
        }
    };

    const iniciarEdicao = (av) => {
        setMensagem(av.mensagem);
        setEstrelas(av.estrelas || 0);
        setEditandoId(av.id);

        setTimeout(() => {
            textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            textareaRef.current?.focus();
        }, 500);
    };

    // 🆕 Ver mais: mostra mais 5 acima (mantém scroll no final)
    const verMais = () => {
        const conteudo = document.querySelector(".modalavaliacoes-conteudo");
        const posicao = conteudo.scrollHeight - conteudo.scrollTop;
        setQuantidadeVisivel((prev) => prev + 5);

        // Mantém posição da rolagem após renderização
        setTimeout(() => {
            conteudo.scrollTop = conteudo.scrollHeight - posicao;
        }, 300);
    };

    // 🔹 Selecionar apenas os 5 mais recentes inicialmente
    const avaliacoesVisiveis = avaliacoes.slice(-quantidadeVisivel);

    return ReactDOM.createPortal(
        <div className="modalavaliacoes-overlay" onClick={onFechar}>
            <div
                className="modalavaliacoes-conteudo"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="avaliacoes-header-fixo">
                    <h2>⭐ Avaliações</h2>
                    <p className="avaliacoes-media">
                        Média geral: <strong>{media.toFixed(1)}</strong> ⭐
                    </p>
                </div>
                <br />
                {carregando ? (
                    <p>Carregando avaliações...</p>
                ) : (
                    <>
                        {/* 🆕 Botão "Ver mais" acima das avaliações */}
                        {avaliacoes.length > avaliacoesVisiveis.length && (
                            <button className="annetbtn-vermais" onClick={verMais}>
                                Ver mais avaliações ↑
                            </button>
                        )}

                        <div className="avaliacoes-lista">
                            {avaliacoesVisiveis.length > 0 ? (
                                avaliacoesVisiveis.map((av, i) => (
                                    <div key={i} className="avaliacao-item">
                                        <div className="avaliacao-cabecalho">
                                            <div className="avaliacao-nome">
                                                <strong>
                                                    {av.nome_usuario || "Usuário anônimo"}
                                                </strong>
                                                {av.estrelas && (
                                                    <span className="avaliacao-estrelas">
                                                        {"★".repeat(av.estrelas)}{" "}
                                                        {"☆".repeat(5 - av.estrelas)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="avaliacao-data">
                                                {av.data_hora || ""}
                                            </span>
                                        </div>

                                        <p className="avaliacao-mensagem">
                                            {av.mensagem}
                                        </p>

                                        {usuarioLogado && av.id_usuario === usuarioLogado && (
                                            <div className="avaliacao-acoes">
                                                <button
                                                    className="annetbtn-editar"
                                                    onClick={() => iniciarEdicao(av)}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    className="annetbtn-apagar"
                                                    onClick={() =>
                                                        apagarAvaliacao(av.id)
                                                    }
                                                >
                                                    🗑️ Apagar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma avaliação ainda.</p>
                            )}
                        </div>

                        <div className="avaliacoes-enviar">
                            {usuarioLogado ? (
                                <>
                                    <div className="avaliacoes-estrelas-container">
                                        <p className="avaliacoes-instrucao">
                                            ⭐ Avalie sua experiência
                                        </p>
                                        <div className="avaliacoes-estrelas">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <span
                                                    key={n}
                                                    className={`estrela ${n <= estrelas ? "ativa" : ""}`}
                                                    onClick={() => usuarioLogado && setEstrelas(n)}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        placeholder="Escreva sua avaliação ou comentário..."
                                        value={mensagem}
                                        onChange={(e) => setMensagem(e.target.value)}
                                    />
                                    <button className="annetenviar"
                                        onClick={enviarAvaliacao}
                                        disabled={!mensagem.trim()}
                                    >
                                        {editandoId ? "Salvar Alterações" : "Enviar"}
                                    </button>
                                </>
                            ) : (
                                <p className="avaliacoes-aviso">
                                    🔒 Faça login para deixar sua opinião.
                                </p>
                            )}
                        </div>
                    </>
                )}

                <button className="modalavaliacoes-fechar" onClick={onFechar}>
                    Fechar
                </button>
            </div>
        </div>,
        document.body
    );
}
