// src/pages/Historico/historicocertificadosyoutube.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../config";
import "./historicocertificadosyoutube.css";
import Rodape from "../pages/rodape";

export default function HistoricoCertificadosYouTube() {
    const { codigo: codigoUrl } = useParams();
    const [codigo, setCodigo] = useState("");
    const [certUrl, setCertUrl] = useState(null);
    const [dadosCertificado, setDadosCertificado] = useState(null);

    const buscarDetalhes = async (codigoBusca) => {
        try {
            const res = await fetch(`${URL}/certificados/detalhes/${codigoBusca}`);
            if (!res.ok) {
                setDadosCertificado(null);
                setCertUrl(null);
                return;
            }
            const data = await res.json();
            setDadosCertificado(data);
            setCertUrl(data.link_publico || null);
        } catch {
            setDadosCertificado(null);
            setCertUrl(null);
        }
    };

    const handleVerCertificado = () => {
        if (!codigo.trim()) return;
        buscarDetalhes(codigo);
    };

    useEffect(() => {
        if (codigoUrl) {
            setCodigo(codigoUrl);
            buscarDetalhes(codigoUrl);
        }
    }, [codigoUrl]);

    // 🔹 Função para decidir se é PDF ou imagem
    const renderCertificado = () => {
        if (!certUrl) return null;

        if (certUrl.toLowerCase().endsWith(".pdf")) {
            return (
                <div className="certificado-viewer">
                    <iframe
                        src={certUrl}
                        width="100%"
                        height="600px"
                        title="Certificado PDF"
                    ></iframe>
                    <p>
                        Se o certificado não abrir,{" "}
                        <a href={certUrl} target="_blank" rel="noopener noreferrer">
                            clique aqui para baixar
                        </a>.
                    </p>
                </div>
            );
        }

        if (certUrl.toLowerCase().endsWith(".png") || certUrl.toLowerCase().endsWith(".jpg")) {
            return (
                <div className="certificado-viewer">
                    <img
                        src={certUrl}
                        alt="Certificado"
                        style={{ maxWidth: "100%", border: "1px solid #ccc" }}
                    />
                    <p>
                        <a href={certUrl} target="_blank" rel="noopener noreferrer">
                            Abrir certificado em nova aba
                        </a>
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <main className="historico-certificados">
            <h1>📜 Certificados de Conclusão — YouTube via IronGoals</h1>

            <div className="busca-certificado">
                <input
                    type="text"
                    placeholder="Digite o código do certificado"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />
                <button onClick={handleVerCertificado}>Ver Certificado</button>
            </div>

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

            {/* 🔹 Renderiza PDF ou PNG */}
            {renderCertificado()}

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

            <Rodape />
        </main>
    );
}
