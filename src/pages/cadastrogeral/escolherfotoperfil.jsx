// 📂 src/pages/cadastrogeral/EscolherFotoPerfil.jsx
import { useState } from "react";
import "./cadastrarse.css";
import { URL as BACKEND_URL } from "../../config"; // renomeado para não conflitar

export default function EscolherFotoPerfil() {
    const [fotoCarregada, setFotoCarregada] = useState(false);
    const [preview, setPreview] = useState(null);
    const token = localStorage.getItem("token");

    // 🔹 Redimensiona imagem mantendo qualidade
    const resizeImage = (file, maxSize = 1200) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(img, 0, 0, width, height);

                    const fileType = file.type.includes("png") ? "image/png" : "image/jpeg";

                    canvas.toBlob((blob) => {
                        resolve(
                            new File([blob], file.name, {
                                type: fileType,
                                lastModified: Date.now(),
                            })
                        );
                    }, fileType, 1.0);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // 🔹 Upload de arquivo
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file)); // ✅ corrigido

        const resizedFile = await resizeImage(file);

        const usuarioId = localStorage.getItem("usuario_id");
        const formData = new FormData();
        formData.append("foto", resizedFile);
        formData.append("usuario_id", usuarioId);

        try {
            const res = await fetch(`${BACKEND_URL}/upload_foto`, { // ✅ endpoint correto
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                const dados = await res.json();
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                usuario.foto = dados.url;
                localStorage.setItem("usuario", JSON.stringify(usuario));
                setFotoCarregada(true);
            } else {
                alert("❌ Erro ao enviar a foto");
            }
        } catch {
            alert("⚠️ Erro de conexão");
        }
    };

    // 🔹 Escolher avatar pronto
    const handleEscolherAvatar = async (nomeArquivo) => {
        try {
            const blob = await fetch(`/fotos/${nomeArquivo}`).then((r) => r.blob());
            const file = new File([blob], nomeArquivo, { type: blob.type });

            setPreview(URL.createObjectURL(file)); // ✅ corrigido

            const resizedFile = await resizeImage(file);

            const usuarioId = localStorage.getItem("usuario_id");
            const formData = new FormData();
            formData.append("foto", resizedFile);
            formData.append("usuario_id", usuarioId);

            const res = await fetch(`${BACKEND_URL}/upload_foto`, { // ✅ endpoint correto
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                const dados = await res.json();
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                usuario.foto = dados.url;
                localStorage.setItem("usuario", JSON.stringify(usuario));
                setFotoCarregada(true);
            } else {
                alert("❌ Erro ao salvar avatar");
            }
        } catch {
            alert("⚠️ Erro de conexão");
        }
    };

    const avatares = [
        "umF.png", "umE.png", "umD.png", "umC.png", "umB.png", "umA.png",
        "um.png", "umG.png", "umH.png", "umI.png", "umM.png", "umAA.png", "umBB.png",
    ];

    return (
        <div className="modalEscolher-overlay">
            <div className="modalEscolher">
                <h2>Escolha sua Foto de Perfil</h2>

                <h3>📂 Avatares Disponíveis</h3>
                <div className="avatar-lista">
                    {avatares.map((img) => (
                        <img
                            style={{ width: "100px", height: "100px" }}
                            key={img}
                            src={`/fotos/${img}`}
                            alt={img}
                            className="avatar-opcao"
                            onClick={() => handleEscolherAvatar(img)}
                        />
                    ))}
                </div>

                <h3>📤 Ou carregue uma foto</h3>
                <label htmlFor="upload" className="upload-label">📂 Escolher Arquivo</label>
                <input id="upload" type="file" accept="image/*" onChange={handleUpload} />

                {preview && <img src={preview} alt="Preview" className="foto-preview" />}
                {fotoCarregada && <p className="foto-ok">✅ Foto carregada!</p>}

                <div className="botoes">
                    <button className="btn-fechar" onClick={() => window.location.href = "/inicio"}>
                        Finalizar Cadastro
                    </button>
                </div>
            </div>
        </div>
    );
}
