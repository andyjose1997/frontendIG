// 📂 src/pages/cadastrogeral/EscolherFotoPerfil.jsx
import { useState, useEffect } from "react";
import "./cadastrarse.css";
import { URL as BACKEND_URL } from "../../config";
import Swal from "sweetalert2";

export default function EscolherFotoPerfil({ onClose }) {
    const [fotoAtual, setFotoAtual] = useState("/Logo/perfilPadrao/M.png"); // padrão
    const [preview, setPreview] = useState(null);
    const token = localStorage.getItem("token");

    // 🔹 Carrega a foto atual do usuário logado
    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario?.foto) {
            setFotoAtual(usuario.foto.startsWith("http") ? usuario.foto : `${BACKEND_URL}${usuario.foto}`);
        }
    }, []);

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
                        resolve(new File([blob], file.name, { type: fileType, lastModified: Date.now() }));
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

        const resizedFile = await resizeImage(file);
        const usuarioId = localStorage.getItem("usuario_id");
        const formData = new FormData();
        formData.append("foto", resizedFile);
        formData.append("usuario_id", usuarioId);

        try {
            const res = await fetch(`${BACKEND_URL}/upload_foto`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                const dados = await res.json();
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                usuario.foto = dados.url;
                localStorage.setItem("usuario", JSON.stringify(usuario));

                setFotoAtual(dados.url);
                setPreview(dados.url);
                Swal.fire({ icon: "success", title: "✅ Foto atualizada!" });
            } else {
                Swal.fire({ icon: "error", title: "❌ Erro ao enviar a foto", text: "Tente novamente." });
            }
        } catch {
            Swal.fire({ icon: "warning", title: "⚠️ Erro de conexão", text: "Verifique sua internet e tente de novo." });
        }
    };

    // 🔹 Escolher avatar pronto
    const handleEscolherAvatar = async (nomeArquivo) => {
        try {
            const blob = await fetch(`/fotos/${nomeArquivo}`).then((r) => r.blob());
            const file = new File([blob], nomeArquivo, { type: blob.type });

            const resizedFile = await resizeImage(file);
            const usuarioId = localStorage.getItem("usuario_id");
            const formData = new FormData();
            formData.append("foto", resizedFile);
            formData.append("usuario_id", usuarioId);

            const res = await fetch(`${BACKEND_URL}/upload_foto`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                const dados = await res.json();
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                usuario.foto = dados.url;
                localStorage.setItem("usuario", JSON.stringify(usuario));

                setFotoAtual(dados.url);
                setPreview(dados.url);
                Swal.fire({ icon: "success", title: "✅ Avatar escolhido com sucesso!" });
            } else {
                Swal.fire({ icon: "error", title: "❌ Erro ao salvar avatar", text: "Tente novamente." });
            }
        } catch {
            Swal.fire({ icon: "warning", title: "⚠️ Erro de conexão", text: "Verifique sua internet e tente de novo." });
        }
    };

    const avatares = [
        "umF.png", "umE.png", "umD.png", "umC.png", "umB.png", "umA.png",
        "um.png", "umG.png", "umH.png", "umI.png", "umM.png", "umAA.png", "umBB.png",
    ];

    return (
        <div className="modalEscolher-overlay">
            <div className="modalEscolher">
                <h2>Alterar Foto de Perfil</h2>

                {/* Foto atual */}
                <h3>📸 Sua Foto Atual</h3>
                <img src={fotoAtual} alt="Foto Atual" className="foto-preview" />

                {/* Avatares recomendados */}
                <h3>✨ Avatares Recomendados</h3>
                <div className="avatar-lista">
                    {avatares.map((img) => (
                        <img
                            key={img}
                            src={`/fotos/${img}`}
                            alt={img}
                            className="avatar-opcao"
                            onClick={() => handleEscolherAvatar(img)}
                        />
                    ))}
                </div>

                {/* Upload nova */}
                <h3>📤 Carregar Nova Foto</h3>
                <label htmlFor="upload" className="upload-label">📂 Escolher Arquivo</label>
                <input id="upload" type="file" accept="image/*" onChange={handleUpload} />

                {/* Preview nova foto */}
                {preview && (
                    <>
                        <h3>🆕 Nova Foto</h3>
                        <img src={preview} alt="Preview" className="foto-preview" />
                    </>
                )}

                <div className="botoes">
                    <button className="btn-fechar" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
