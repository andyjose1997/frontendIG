// src/pages/Historico/historicocertificadosyoutube.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../config";
import "./historicocertificadosyoutube.css";
import Rodape from "../pages/rodape";

// 🔹 Importa a busca alternativa
import { buscarDetalhesCodigo } from "./buscardetalhescodigo";

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

    const handleVerCertificado = async () => {
        if (!codigo.trim()) return;

        let data = null;

        if (codigo.trim().length === 10) {
            // 🔹 Se o código tem 10 caracteres → busca alternativa
            data = await buscarDetalhesCodigo(codigo);
            if (data) {
                setDadosCertificado(data);
                setCertUrl(data.link_publico || null);
            } else {
                setDadosCertificado(null);
                setCertUrl(null);
            }
        } else {
            // 🔹 Caso contrário → busca padrão
            buscarDetalhes(codigo);
        }
    };

    useEffect(() => {
        if (codigoUrl) {
            setCodigo(codigoUrl);
            if (codigoUrl.trim().length === 10) {
                buscarDetalhesCodigo(codigoUrl).then((data) => {
                    if (data) {
                        setDadosCertificado(data);
                        setCertUrl(data.link_publico || null);
                    }
                });
            } else {
                buscarDetalhes(codigoUrl);
            }
        }
    }, [codigoUrl]);

    // 🔹 Define o título dinamicamente
    const getTitulo = () => {
        if (codigo.trim().length === 8) {
            return "Certificados de Conclusão YouTube via IronGoals";
        }
        if (codigo.trim().length === 10) {
            return "📜 Certificados de Conclusão via IronGoals";
        }
        return "📜 Certificados de Conclusão";
    };

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
            <h1>{getTitulo()}</h1>

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
                    <p className="texto-confianca">
                        Este certificado foi emitido de forma autenticada pelo sistema IronGoals,
                        utilizando registro único em banco de dados e validação online para garantir
                        sua originalidade e veracidade. Cada código é exclusivo e pode ser conferido
                        publicamente através desta página.
                    </p>

                    <ul>
                        <li><strong>Aluno:</strong> {dadosCertificado.nome} {dadosCertificado.sobrenome}</li>
                        <li><strong>Categoria na IronGoals:</strong> {dadosCertificado.categoria}</li>
                        <li><strong>Curso:</strong> {dadosCertificado.curso}</li>
                        <li><strong>Instrutor:</strong> {dadosCertificado.instrutor}</li>
                        <li>
                            <strong></strong>{" "}
                            <a href={dadosCertificado.canal_autor} target="_blank" rel="noopener noreferrer">
                                Canal do Autor
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
