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

    return (
        <main>
            <div id="fundo">
                <div className="perfil">
                    <div className="foto-container">
                        <img
                            src={fotoURL}
                            alt={`Foto de ${user.nome}`}
                            className="foto-perfil"
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

                    <div className="info">
                        <h1>
                            {user.nome.charAt(0).toUpperCase() + user.nome.slice(1).toLowerCase()}{" "}
                            {user.sobrenome.charAt(0).toUpperCase() + user.sobrenome.slice(1).toLowerCase()}
                            {" "}
                            <span style={{ fontSize: "0.8em", color: "#ccc", marginLeft: "10px" }}>
                                ({user.categoria && user.categoria.trim() !== ""
                                    ? user.categoria.charAt(0).toUpperCase() + user.categoria.slice(1).toLowerCase()
                                    : "Explorer"})
                            </span>
                        </h1>
                        <h2>ID: {user.id}</h2>



                        <div className="comentario-perfilUp">
                            {user.comentario_perfil && !editando ? (
                                <>
                                    <h3 style={{
                                        color: "white"
                                    }} >
                                        {user.comentario_perfil
                                            ? user.comentario_perfil.charAt(0).toUpperCase() + user.comentario_perfil.slice(1).toLowerCase()
                                            : ""}
                                    </h3>
                                    <button className="btn-postar editar" onClick={() => setEditando(true)}>✏️ </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        className="input-comentario"
                                        type="text"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="Qual é a sua próxima meta?"
                                    />
                                    <button className="btn-postar salvar" onClick={handleSalvarComentario}>Salvar</button>
                                </>
                            )}
                        </div>


                    </div>
                </div>
            </div>

            {/* Modal da imagem */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                        <img src={fotoURL} alt="Foto Ampliada" className="modal-imagem" />
                        <div className="modal-botoes">
                            <button onClick={handleFecharModal}>← Voltar</button>
                            <button onClick={handleEditarImagem}>Editar</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
