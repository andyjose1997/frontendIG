// 📂 src/pages/areaafastada/avaliacao.jsx
import { useState, useEffect } from "react";
import "./avaliacao.css";
import Rodape from "../rodape";
import { URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function Avaliacao() {
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [avaliacao, setAvaliacao] = useState(0);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState(""); // ✅ sucesso | erro
    const [hover, setHover] = useState(0);
    const [media, setMedia] = useState(null);

    const navigate = useNavigate();

    // 🔹 Recupera usuário salvo no localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    // Calcular média de estrelas
    const calcularMedia = (lista) => {
        if (!lista.length) return null;
        const total = lista.reduce((acc, item) => acc + item.estrelas, 0);
        return (total / lista.length).toFixed(1); // 1 casa decimal
    };

    // Carregar avaliações ao abrir a página
    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await fetch(`${URL}/avaliacao/`);
                if (!res.ok) throw new Error("Erro ao carregar avaliações");
                const data = await res.json();
                setComentarios(data);
                setMedia(calcularMedia(data));
            } catch (err) {
                console.error("Erro ao carregar avaliações:", err);
                setMensagem("Erro ao carregar avaliações.");
                setTipoMensagem("erro");
            }
        };
        carregar();
    }, []);

    // 🔹 Auto limpar mensagem depois de 5s
    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                setMensagem("");
                setTipoMensagem("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    // Enviar avaliação
    const handleEnviar = async () => {
        if (!usuario?.nome) {
            setMensagem("⚠️ Você precisa estar logado para avaliar.");
            setTipoMensagem("erro");
            return;
        }

        if (!novoComentario.trim() || avaliacao === 0) {
            setMensagem("⚠️ Preencha comentário e estrelas antes de enviar.");
            setTipoMensagem("erro");
            return;
        }

        try {
            const res = await fetch(`${URL}/avaliacao/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: usuario.nome || "Desconhecido",
                    sobrenome: usuario.sobrenome || "",
                    estrelas: avaliacao,
                    comentario: novoComentario,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Erro detalhado:", data);
                setMensagem("Erro ao salvar avaliação.");
                setTipoMensagem("erro");
                return;
            }

            setMensagem(data.mensagem);
            setTipoMensagem("sucesso");

            // Recarregar lista
            const res2 = await fetch(`${URL}/avaliacao/`);
            const data2 = await res2.json();
            setComentarios(data2);
            setMedia(calcularMedia(data2));

            // Resetar formulário
            setNovoComentario("");
            setAvaliacao(0);
            setHover(0);
        } catch (err) {
            console.error("Erro no envio:", err);
            setMensagem("Erro ao salvar sua avaliação.");
            setTipoMensagem("erro");
        }
    };

    return (
        <div>
            {/* 🔹 Botões no topo direito */}
            <div className="avaliacao-topo">
                <button onClick={() => navigate("/inicio")} className="avaliacao-btn">
                    🏠 Início
                </button>
                <button onClick={() => navigate("/perfil")} className="avaliacao-btn">
                    👤 Perfil
                </button>
            </div>

            <div className="avaliacao-container">
                <h2>Deixe sua Avaliação e diga-nos em que podemos melhorar</h2>

                {/* Exibir média */}
                {media && (
                    <p className="media-estrelas">
                        ⭐ Média: <strong>{media}</strong> ({comentarios.length} avaliações)
                    </p>
                )}

                {/* Mensagem de feedback */}
                {mensagem && (
                    <p className={tipoMensagem === "sucesso" ? "msg-sucesso" : "msg-erro"}>
                        {mensagem}
                    </p>
                )}

                {/* Lista de comentários */}
                <div className="comentarios-lista">
                    {comentarios.map((c) => (
                        <div key={c.id} className="ccomentario-item">
                            <p>
                                <strong> {c.nome} {c.sobrenome} </strong> ⭐ {c.estrelas}
                            </p>
                            <p>{c.comentario}</p>
                        </div>
                    ))}
                </div>

                {/* Avaliação por estrelas */}
                <div className="estrelas" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setAvaliacao(star)}
                            onMouseEnter={() => setHover(star)}
                            className={
                                hover >= star || avaliacao >= star
                                    ? "estrela ativa"
                                    : "estrela"
                            }
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Área de comentário */}
                <textarea
                    placeholder="Escreva seu comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                />

                <button className="avaliacao-btn" onClick={handleEnviar}>
                    Salvar / Atualizar
                </button>
            </div>

            <Rodape />
        </div>
    );
}
