import React from "react";
import "./certificadosmodal.css";

export default function CertificadosModal({ certificados, onClose }) {
    const dominio = window.location.origin.includes("localhost")
        ? "http://localhost:5173"
        : "https://irongoals.com";

    return (
        <div className="certificados-modal-overlay" onClick={onClose}>
            <div className="certificados-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Certificados emitidos</h2>

                {certificados.length === 0 ? (
                    <p>Você ainda não possui certificados emitidos.</p>
                ) : (
                    <ul>
                        {certificados.map((cert, index) => (
                            <li key={cert.id}>
                                <a
                                    href={`${dominio}/historico-certificados/${cert.codigo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {index + 1}. {cert.curso_nome} (
                                    {new Date(cert.data_emissao).toLocaleDateString("pt-BR")})
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                <button onClick={onClose} className="botao-acao">
                    Fechar
                </button>
            </div>
        </div>
    );
}
