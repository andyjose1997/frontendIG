import { useState, useRef, useEffect } from "react";
import './Up.css';
import { URL } from "../../config";

export default function Up() {
    const [user, setUser] = useState(null);
    const [fotoURL, setFotoURL] = useState("/Logo/perfilPadrao/M.png");
    const [comentario, setComentario] = useState("");
    const [editando, setEditando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const inputFileRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Sessão expirada. Faça login novamente.");
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
                    alert("❌ Sessão inválida ou expirada.");
                    localStorage.clear();
                    window.location.href = "/login";
                    return;
                }
                setUser(data);
                if (data.comentario_perfil) setComentario(data.comentario_perfil);
                if (data.foto) {
                    const nomeArquivo = data.foto.split("/").pop();
                    setFotoURL(`${URL}/fotos/${nomeArquivo}`);
                }
            })
            .catch(err => {
                console.error("❌ Erro de conexão:", err);
                alert("❌ Não foi possível conectar ao servidor.");
            });
    }, []);

    function handleFotoClick() {
        setMostrarModal(true);
    }

    function handleFecharModal() {
        setMostrarModal(false);
    }

    function handleEditarImagem() {
        inputFileRef.current.click();
        setMostrarModal(false);
    }

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
                        const nomeArquivo = data.foto.split("/").pop();
                        setFotoURL(`${URL}/fotos/${nomeArquivo}`);
                    }
                })
                .catch(err => console.error("❌ Erro ao enviar imagem:", err));
        }
    }

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
                    alert(data.erro || "Erro ao salvar comentário.");
                }
            })
            .catch(err => {
                console.error("❌ Erro ao salvar comentário:", err);
            });
    }

    if (!user) return <p>Carregando...</p>;
    function getDiaSemana(cpp) {
        switch (cpp) {
            case "2": return "Segunda-feira";
            case "3": return "Terça-feira";
            case "4": return "Quarta-feira";
            case "5": return "Quinta-feira";
            case "6": return "Sexta-feira";
            default: return null;
        }
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
                        </h1>
                        <h2>
                            <span className="id-wrapper">
                                ID: {user.id}
                                <span className="id-msg">
                                    Esse é o seu ID de indicação. <br />
                                    Compartilhe este ID ou o link de indicação com seus amigos para que eles se cadastrem <br /> como seus indicados e vôce receba compensações pelas compras deles.
                                </span>
                            </span>

                            {user.cpp && (
                                <span className="cpp-wrapper">
                                    | CPP: {user.cpp}
                                    <span className="cpp-msg">
                                        Você recebe suas compensações das compras dos seus indicados nas {getDiaSemana(user.cpp)}s
                                    </span>
                                </span>
                            )}

                            {user.funcao && (
                                <span className="funcao-wrapper">
                                    | Função: {user.funcao}
                                    <span className="funcao-msg">
                                        🎉 Parabéns, você é um funcionário da empresa IronGoals
                                    </span>
                                </span>
                            )}
                            {user.funcao && user.cargo ? (
                                <span className="funcao-wrapper">
                                    | Cargo: {user.cargo}
                                    <span className="funcao-msg">
                                        {user.responsabilidade && user.responsabilidade.trim() !== ""
                                            ? user.responsabilidade
                                            : "Nenhuma responsabilidade cadastrada"}
                                    </span>
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
                                    <button className="botaoSalvar" onClick={handleSalvarComentario}>Salvar</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {mostrarModal && (
                <div className="overlayModal">
                    <div className="conteudoModal">
                        <img src={fotoURL} alt="Foto Ampliada" className="imagemModal" />
                        <div className="botoesModal">
                            <button onClick={handleFecharModal}>← Voltar</button>
                            <button onClick={handleEditarImagem}>Editar</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );

}
