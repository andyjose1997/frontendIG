import { useState } from "react";
import "./cadastrarse.css";
import { FRONT_URL } from "../../config";
import { URL } from "../../config";

export default function EscolherFotoPerfil() {
    const [fotoCarregada, setFotoCarregada] = useState(false);
    const token = localStorage.getItem("token");
    // 🔹 Função para redimensionar imagem mantendo formato original e qualidade máxima
    const resizeImage = (file, maxSize = 1200) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    // Mantém proporção
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
                    ctx.imageSmoothingQuality = "high"; // 🔹 suavização máxima
                    ctx.drawImage(img, 0, 0, width, height);

                    // Mantém formato original (PNG ou JPEG)
                    const fileType = file.type.includes("png") ? "image/png" : "image/jpeg";

                    canvas.toBlob((blob) => {
                        resolve(
                            new File([blob], file.name, {
                                type: fileType,
                                lastModified: Date.now(),
                            })
                        );
                    }, fileType, 1.0); // 🔹 qualidade 100%
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };


    // 🔹 Upload da foto do usuário
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Redimensiona antes de enviar
        const resizedFile = await resizeImage(file);

        const formData = new FormData();
        formData.append("foto", resizedFile);

        try {
            const res = await fetch(`${URL}/upload_foto`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                setFotoCarregada(true);
            } else {
                alert("❌ Erro ao enviar a foto");
            }
        } catch (err) {
            alert("⚠️ Erro de conexão");
        }
    };

    // 🔹 Escolher um avatar pronto
    const handleEscolherAvatar = async (nomeArquivo) => {
        try {
            const blob = await fetch(`/fotos/${nomeArquivo}`).then((r) => r.blob());
            const file = new File([blob], nomeArquivo, { type: blob.type });

            // Redimensiona avatar também
            const resizedFile = await resizeImage(file);

            const formData = new FormData();
            formData.append("foto", resizedFile);

            const res = await fetch(`${URL}/upload_foto`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                setFotoCarregada(true);
            } else {
                alert("❌ Erro ao salvar avatar");
            }
        } catch (err) {
            alert("⚠️ Erro de conexão");
        }
    };

    const avatares = [
        "umF.png",
        "umE.png",
        "umD.png",
        "umC.png",
        "umB.png",
        "umA.png",
        "um.png",
        "umG.png",
        "umH.png",
        "umI.png",
        "umM.png",
        "umAA.png",
        "umBB.png",
    ];


    return (
        <div className="modalEscolher-overlay">
            <div className="modalEscolher">
                <h2>Escolha sua Foto de Perfil</h2>

                <h3>📂 Avatares Disponíveis</h3>
                <div className="avatar-lista">
                    {avatares.map((img) => (
                        <img style={{ width: "100px", height: "100px" }}
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
                <p id="file-name"></p>

                {fotoCarregada && <p className="foto-ok">✅ Foto carregada!</p>}

                <div className="botoes">
                    <button
                        className="btn-fechar"
                        onClick={() => window.location.href = "/inicio"}
                    >
                        Finalizar Cadastro
                    </button>
                </div>
            </div>
        </div>
    );
}
