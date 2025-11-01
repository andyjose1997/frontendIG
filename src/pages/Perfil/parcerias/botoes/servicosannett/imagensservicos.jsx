import { useState, useEffect } from "react";
import "./imagensservicos.css";
import { URL } from "../../../../../config";

export default function ImagensServicos({ servicoSelecionado }) {
    const [fotos, setFotos] = useState([]);
    const [arquivo, setArquivo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (servicoSelecionado) carregarFotos();
    }, [servicoSelecionado]);

    const carregarFotos = async () => {
        try {
            const res = await fetch(`${URL}/annett/servicos/fotos/${servicoSelecionado.id}`);
            const data = await res.json();
            setFotos(data);
        } catch (err) {
            console.error("Erro ao carregar fotos:", err);
        }
    };

    // 🔹 Ao escolher imagem → mostra preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setArquivo(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    // 🔹 Enviar imagem
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!arquivo) {
            setMensagem("⚠️ Selecione uma imagem antes de enviar.");
            return;
        }

        setCarregando(true);
        const formData = new FormData();
        formData.append("id_servico", servicoSelecionado.id);
        formData.append("nome_servico", servicoSelecionado.servico);
        formData.append("arquivo", arquivo);

        try {
            const res = await fetch(`${URL}/annett/servicos/fotos/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Erro ao enviar imagem.");

            setMensagem("✅ Foto enviada com sucesso!");
            setArquivo(null);
            setPreview(null);
            carregarFotos();
        } catch (err) {
            setMensagem("❌ " + err.message);
        } finally {
            setCarregando(false);
        }

        setTimeout(() => setMensagem(""), 4000);
    };

    // 🔹 Apagar foto
    const apagarFoto = async (id) => {
        if (!window.confirm("Deseja apagar esta foto?")) return;

        try {
            const res = await fetch(`${URL}/annett/servicos/fotos/deletar/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Erro ao deletar foto.");
            setMensagem("🗑️ Foto removida com sucesso!");
            carregarFotos();
        } catch (err) {
            setMensagem("❌ " + err.message);
        }

        setTimeout(() => setMensagem(""), 3000);
    };

    if (!servicoSelecionado) return null;

    return (
        <div className="imagens-servicos-container">
            <h3 className="imagens-servicos-titulo">
                🖼️ Galeria de <span>{servicoSelecionado.servico}</span>
            </h3>

            <form className="imagens-servicos-form" onSubmit={handleUpload}>
                {/* 🔹 Input de arquivo corrigido */}
                <div className="file-area">
                    <input
                        id="arquivo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="arquivo" className="file-label">
                        📁 {arquivo ? arquivo.name : "Selecionar imagem"}
                    </label>
                </div>

                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Pré-visualização" className="preview-img" />
                        <button
                            type="button"
                            className="remover-preview"
                            onClick={() => {
                                setPreview(null);
                                setArquivo(null);
                            }}
                        >
                            ✖
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="imagens-servicos-botao"
                    disabled={carregando}
                >
                    {carregando ? "⏳ Enviando..." : "📤 Enviar Foto"}
                </button>
            </form>

            {mensagem && (
                <p
                    className={`imagens-servicos-mensagem ${mensagem.startsWith("✅")
                            ? "sucesso"
                            : mensagem.startsWith("❌")
                                ? "erro"
                                : "aviso"
                        }`}
                >
                    {mensagem}
                </p>
            )}

            <div className="imagens-servicos-galeria">
                {fotos.length > 0 ? (
                    fotos.map((f) => (
                        <div key={f.id} className="imagens-servicos-card">
                            <img src={f.foto} alt="foto do serviço" className="foto-galeria" />
                            <button
                                className="botao-apagar"
                                onClick={() => apagarFoto(f.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="nenhuma-foto">Nenhuma imagem enviada ainda.</p>
                )}
            </div>
        </div>
    );
}
