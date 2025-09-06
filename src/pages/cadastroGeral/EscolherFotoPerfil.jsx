import { useState } from "react";
import "./cadastrarse.css";
import { FRONT_URL } from "../../config";
import { URL } from "../../config";

export default function EscolherFotoPerfil() {
    const [fotoCarregada, setFotoCarregada] = useState(false);
    const token = localStorage.getItem("token");

    // 🔹 Função para redimensionar imagem antes do upload
    const resizeImage = (file, maxSize = 800) => {
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
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(
                            new File([blob], file.name, {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            })
                        );
                    }, "image/jpeg", 0.9); // qualidade 90%
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
        "5bcdb605-6f8d-4618-accf-f312dfa3e416.png",
        "6ab18ad7-97d5-4bfb-bd17-d7a9d7b49eee.png",
        "48c09ef1-c89f-4010-a34f-6da7ac5e6cf6.png",
        "84d89e0b-b962-48e1-a7c0-5650018831d6.png",
        "86b06058-b445-421e-8abc-d89e7d03e1fa.png",
        "d74de034-0a5e-4709-941a-9269b75b884f.png",
        "padrafemAZUL.png",
        "padrao.png",
        "padraoFemenino.png"
    ];

    return (
        <div className="modalEscolher-overlay">
            <div className="modalEscolher">
                <h2>Escolha sua Foto de Perfil</h2>

                <h3>📂 Avatares Disponíveis</h3>
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

                <h3>📤 Ou carregue uma foto</h3>
                <label htmlFor="upload" className="upload-label">📂 Escolher Arquivo</label>
                <input id="upload" type="file" accept="image/*" onChange={handleUpload} />
                <p id="file-name"></p>

                {fotoCarregada && <p className="foto-ok">✅ Foto carregada!</p>}

                <div className="botoes">
                    <button
                        className="btn-fechar"
                        onClick={() => window.location.href = `${FRONT_URL}/inicio`}
                    >
                        Finalizar Cadastro
                    </button>
                </div>
            </div>
        </div>
    );
}
