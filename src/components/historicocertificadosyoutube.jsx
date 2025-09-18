// src/pages/Historico/historicocertificadosyoutube.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../config";
import "./historicocertificadosyoutube.css";
import Rodape from "../pages/rodape";

export default function HistoricoCertificadosYouTube() {
    const { codigo: codigoUrl } = useParams(); // 👈 pega da URL
    const [codigo, setCodigo] = useState("");
    const [pdfUrl, setPdfUrl] = useState(null);
    const [dadosCertificado, setDadosCertificado] = useState(null);

    // 🔹 Busca dados extras do certificado
    const buscarDetalhes = async (codigoBusca) => {
        try {
            const res = await fetch(`${URL}/certificados/detalhes/${codigoBusca}`);
            if (!res.ok) return;
            const data = await res.json();
            setDadosCertificado(data);
        } catch {
            setDadosCertificado(null);
        }
    };

    const handleVerCertificado = () => {
        if (!codigo.trim()) return;
        const url = `${URL}/certificados/ver/${codigo}`;
        setPdfUrl(url);
        buscarDetalhes(codigo);
    };

    // 👇 se tiver código na URL, já preenche e carrega
    useEffect(() => {
        if (codigoUrl) {
            setCodigo(codigoUrl);
            const url = `${URL}/certificados/ver/${codigoUrl}`;
            setPdfUrl(url);
            buscarDetalhes(codigoUrl);
        }
    }, [codigoUrl]);

    return (
        <main className="historico-certificados">
            <h1>📜 Certificados de Conclusão — YouTube via IronGoals</h1>

            {/* 🔹 Busca por código */}
            <div className="busca-certificado">
                <input
                    type="text"
                    placeholder="Digite o código do certificado"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />
                <button onClick={handleVerCertificado}>Ver Certificado</button>
            </div>

            {/* 🔹 Informações detalhadas */}
            {dadosCertificado && (
                <div className="info-certificado">
                    <h2>Informações do Certificado</h2>
                    <ul>
                        <li><strong>Aluno:</strong> {dadosCertificado.nome} {dadosCertificado.sobrenome}</li>
                        <li><strong>Categoria:</strong> {dadosCertificado.categoria}</li>
                        <li><strong>Curso:</strong> {dadosCertificado.curso}</li>
                        <li><strong>Instrutor:</strong> {dadosCertificado.instrutor}</li>
                        <li>
                            <strong>Canal do Autor:</strong>{" "}
                            <a href={dadosCertificado.canal_autor} target="_blank" rel="noopener noreferrer">
                                {dadosCertificado.canal_autor}
                            </a>
                        </li>
                        <li><strong>Data de Emissão:</strong> {dadosCertificado.data_emissao}</li>
                        <li><strong>Código:</strong> {dadosCertificado.codigo}</li>
                        <li><strong>Nº Registro:</strong> {dadosCertificado.registro_interno}</li>
                        <li><strong>Status:</strong> ✅ Certificado válido e emitido pela IronGoals</li>
                    </ul>

                    {/* 🔹 Lista de vídeos */}
                    {dadosCertificado.videos && dadosCertificado.videos.length > 0 && (
                        <div className="lista-videos">
                            <h3>🎬 Vídeos do Curso</h3>
                            <ul>
                                {dadosCertificado.videos.map((video, idx) => (
                                    <li key={idx}>{video}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* 🔹 PDF Viewer */}
            {pdfUrl && (
                <div className="certificado-viewer">
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                        title="Certificado"
                    ></iframe>
                </div>
            )}

            {/* 🔹 Botão para IronGoals */}
            <div className="botoes-irongoals">
                <a
                    href="https://irongoals.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-irongoals"
                >
                    🌐 Ir para IronGoals
                </a>
            </div>

            {/* 🔹 Rodapé */}
            <Rodape />
        </main>
    );
}
