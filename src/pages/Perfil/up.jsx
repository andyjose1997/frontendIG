import { useState, useRef, useEffect } from "react";
import './up.css';
import { URL } from "../../config";
import { strong } from "framer-motion/client";

export default function Up() {
    const [user, setUser] = useState(null);
    const [fotoURL, setFotoURL] = useState("/Logo/perfilPadrao/M.png");
    const [comentario, setComentario] = useState("");
    const [editando, setEditando] = useState(false);
    const [alerta, setAlerta] = useState("");

    // 🔹 Controle de modais
    const [mostrarModalFoto, setMostrarModalFoto] = useState(false);
    const [mostrarModalInfo, setMostrarModalInfo] = useState(false);
    const [mensagemModal, setMensagemModal] = useState("");

    // 🔹 Modal de vídeo (perfil)
    const [mostrarModalVideo, setMostrarModalVideo] = useState(false);
    const [video, setVideo] = useState("");

    const inputFileRef = useRef(null);

    const mostrarAlerta = (texto) => {
        setAlerta(texto);
        setTimeout(() => setAlerta(""), 2000); // some em 2 segundos
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            mostrarAlerta("Sessão expirada. Faça login novamente.");
            localStorage.clear();
            window.location.href = "/login";
            return;
        }

        fetch(`${URL}/perfil`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    mostrarAlerta("❌ Sessão inválida ou expirada.");
                    localStorage.clear();
                    window.location.href = "/login";
                    return;
                }
                setUser(data);
                if (data.comentario_perfil) setComentario(data.comentario_perfil);

                if (res.ok && data.foto) {
                    setFotoURL(data.foto.startsWith("http") ? data.foto : `${URL}${data.foto}`);
                } else {
                    setFotoURL("/Logo/perfilPadrao/M.png");
                }
            })
            .catch(err => {
                console.error("❌ Erro de conexão:", err);
                mostrarAlerta("❌ Não foi possível conectar ao servidor.");
            });
    }, []);

    // 📸 Modal de foto
    function handleFotoClick() {
        setMostrarModalFoto(true);
    }
    function handleFecharModalFoto() {
        setMostrarModalFoto(false);
    }
    function handleEditarImagem() {
        inputFileRef.current.click();
        setMostrarModalFoto(false);
    }

    // 📤 Upload de imagem
    function handleFotoChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setFotoURL(e.target.result);
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("foto", file);

            const token = localStorage.getItem("token");
            fetch(`${URL}/upload_foto`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            })
                .then(async res => {
                    const data = await res.json();
                    if (res.ok && data.foto) {
                        setFotoURL(data.foto);
                    }
                })
                .catch(err => console.error("❌ Erro ao enviar imagem:", err));
        }
    }

    // 💬 Comentário
    function handleSalvarComentario() {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil/comentario_perfil`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ comentario }),
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    setUser(prev => ({ ...prev, comentario_perfil: comentario }));
                    setEditando(false);
                } else {
                    mostrarAlerta(data.erro || "Erro ao salvar comentário.");
                }
            })
            .catch(err => {
                console.error("❌ Erro ao salvar comentário:", err);
                mostrarAlerta("❌ Erro ao salvar comentário.");
            });
    }

    if (!user) return <p>Carregando...</p>;

    function getDiaSemana(cpp) {
        switch (cpp) {
            case "2": return "Segundas-feira";
            case "3": return "Terças-feira";
            case "4": return "Quartas-feira";
            case "5": return "Quintas-feira";
            case "6": return "Sextas-feira";
            default: return null;
        }
    }

    // 🔹 Abrir modal de vídeo (perfil)
    function abrirVideoPerfil() {
        fetch(`${URL}/indicacoes/perfil`)
            .then(res => res.json())
            .then(data => {
                if (data.video) {
                    setVideo(data.video);
                    setMostrarModalVideo(true);
                }
            })
            .catch(err => console.error("❌ Erro ao carregar vídeo:", err));
    }

    return (
        <main>
            <div id="blocoPerfil">
                <div className="perfilBox">
                    {/* FOTO */}
                    <div className="fotoWrapper">
                        <img
                            src={fotoURL}
                            alt={`Foto de ${user.nome}`}
                            className="fotoUsuario"
                            onClick={handleFotoClick}
                        />
                        <input
                            ref={inputFileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="infoBox">
                        <h1>
                            {user.nome} {user.sobrenome}
                            <span className="categoriaTexto">
                                ({user.categoria && user.categoria.trim() !== ""
                                    ? user.categoria.charAt(0).toUpperCase() + user.categoria.slice(1).toLowerCase()
                                    : "Explorer"})
                            </span>
                            {/* 🔹 Botão ℹ do lado da categoria */}
                            <button
                                className="botaoInfo"
                                onClick={abrirVideoPerfil}
                            >
                                ℹ
                            </button>
                        </h1>
                        <h2>
                            <span
                                className="link-info"
                                onClick={() => {
                                    let msg = "Esse é o seu ID de indicação.\n" +
                                        "Compartilhe este ID ou o link de indicação com seus amigos para que eles se cadastrem como seus indicados e você receba compensações pelas compras deles.\n\n";

                                    const categoria = user.categoria ? user.categoria.toLowerCase().trim() : "explorer";

                                    if (categoria === "explorer" || categoria === "") {
                                        msg += "👉 Você é **Explorer** (ainda não tem acesso pago):\n" +
                                            " • Você recebe 45% por cada compra do pacote de curso dos que você indicou\n" +
                                            " • O seu Host recebe 20%\n" +
                                            " • A plataforma fica com 35%\n";
                                    }
                                    else if (categoria === "member" || categoria === "mentor") {
                                        msg += "👉 Você é **Member** ou **Mentor** (já tem acesso pago):\n" +
                                            "As suas comissões aumentam conforme suas vendas:\n" +
                                            " • Vendas 1 a 5 → 🥈 Prata:\n" +
                                            "    - 50% para você\n" +
                                            "    - 20% para o seu Host\n" +
                                            "    - 30% para a plataforma\n\n" +
                                            " • Vendas 6 a 12 → 🥇 Ouro:\n" +
                                            "    - 60% para você\n" +
                                            "    - 15% para o seu Host\n" +
                                            "    - 25% para a plataforma\n\n" +
                                            " • A partir da 13ª venda → 💎 Diamante:\n" +
                                            "    - 65% para você\n" +
                                            "    - 10% para o seu Host\n" +
                                            "    - 25% para a plataforma\n";
                                    }
                                    else if (categoria === "founder") {
                                        msg += "👉 Você é **Founder**:\n" +
                                            " • Você recebe as mesmas porcentagens que um Member/Mentor no modelo progressivo, MAS também recebe a parte do Host.\n" +
                                            "   Isso significa que você acumula sua parte + a parte do Host em cada nível:\n\n" +
                                            "   • Vendas 1 a 5 → 🥈 Prata:\n" +
                                            "      - 70% para você (50% + 20% do Host)\n" +
                                            "      - 30% para a plataforma\n\n" +
                                            "   • Vendas 6 a 12 → 🥇 Ouro:\n" +
                                            "      - 75% para você (60% + 15% do Host)\n" +
                                            "      - 25% para a plataforma\n\n" +
                                            "   • A partir da 13ª venda → 💎 Diamante:\n" +
                                            "      - 75% para você (65% + 10% do Host)\n" +
                                            "      - 25% para a plataforma 🚀\n";
                                    }

                                    setMensagemModal(msg);
                                    setMostrarModalInfo(true);
                                }}
                            >
                                ID: {user.id}
                            </span>


                            {user.cpp && (
                                <span
                                    className="link-info"
                                    onClick={() => {
                                        setMensagemModal(`Você recebe suas compensações das compras dos seus indicados nas ${getDiaSemana(user.cpp)}s`);
                                        setMostrarModalInfo(true);
                                    }}
                                >
                                    | CPP: {user.cpp}
                                </span>
                            )}

                            {user.funcao && (
                                <span
                                    className="link-info"
                                    onClick={() => {
                                        setMensagemModal("🎉 Parabéns, você é um funcionário da empresa IronGoals");
                                        setMostrarModalInfo(true);
                                    }}
                                >
                                    | Função: {user.funcao}
                                </span>
                            )}

                            {user.funcao && user.cargo ? (
                                <span
                                    className="link-info"
                                    onClick={() => {
                                        setMensagemModal(user.responsabilidade && user.responsabilidade.trim() !== ""
                                            ? user.responsabilidade
                                            : "Nenhuma responsabilidade cadastrada");
                                        setMostrarModalInfo(true);
                                    }}
                                >
                                    | Cargo: {user.cargo}
                                </span>
                            ) : ""}
                        </h2>

                        <div className="comentarioBox">
                            {user.comentario_perfil && !editando ? (
                                <>
                                    <h3 className="comentarioTexto">
                                        {user.comentario_perfil
                                            ? user.comentario_perfil.charAt(0).toUpperCase() + user.comentario_perfil.slice(1).toLowerCase()
                                            : ""}
                                    </h3>
                                    <button className="botaoEditar" onClick={() => setEditando(true)}>✏️</button>
                                </>
                            ) : (
                                <>
                                    <input
                                        className="inputComentario"
                                        type="text"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="Qual é a sua próxima meta?"
                                    />
                                    <button style={{ color: "white", }} onClick={handleSalvarComentario}>Salvar</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Foto */}
            {mostrarModalFoto && (
                <div className="overlayModal">
                    <div className="conteudoModal">
                        <img src={fotoURL} alt="Foto Ampliada" className="imagemModal" />
                        <div className="botoesModal">
                            <button onClick={handleFecharModalFoto}>← Voltar</button>
                            <button onClick={handleEditarImagem}>Editar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Informações */}
            {mostrarModalInfo && (
                <div className="overlayModal">
                    <div className="conteudoModal">

                        <p className="textoModal">{mensagemModal}                         <button onClick={() => setMostrarModalInfo(false)}>← Fechar</button>
                        </p>
                        <div className="botoesModal">
                            <button
                                onClick={() => {
                                    if (user) {
                                        const nomeFormatado = (user.nome + user.sobrenome)
                                            .replace(/\s+/g, "")
                                            .toLowerCase();
                                        const linkIndicacao = `${window.location.origin}/criar-conta/${user.id}/${nomeFormatado}`;
                                        navigator.clipboard.writeText(linkIndicacao);
                                        mostrarAlerta("🔗 Link de indicação copiado!");
                                    }
                                }}
                            >
                                📋 Copiar Link de Indicação
                            </button>
                        </div>
                    </div>
                    {alerta && <div className="alerta-temporario">{alerta}</div>}
                </div>
            )}

            {/* Modal de Vídeo (Perfil) */}
            {mostrarModalVideo && (
                <div className="overlayModal">
                    <div className="conteudoModal">
                        <div dangerouslySetInnerHTML={{ __html: video }} />
                        <button onClick={() => setMostrarModalVideo(false)}>← Fechar</button>
                    </div>
                </div>
            )}

        </main>
    );
}
