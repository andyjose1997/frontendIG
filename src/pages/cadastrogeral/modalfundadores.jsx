import { useEffect, useState } from "react";
import "./modalfundadores.css";
import { URL } from "../../config";

// 🔹 Ícones
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, MessageCircle } from "lucide-react";

export default function ModalFundadores({ onClose }) {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetch(`${URL}/fundadores/links`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setLinks(data);
                } else {
                    console.error("Resposta inesperada:", data);
                }
            })
            .catch(err => console.error("Erro ao carregar links:", err));
    }, []);

    // 🔹 Função para escolher o ícone baseado no nome da rede
    const getIcon = (nome) => {
        const rede = nome.toLowerCase();
        if (rede.includes("facebook")) return <Facebook size={18} />;
        if (rede.includes("instagram")) return <Instagram size={18} />;
        if (rede.includes("linkedin")) return <Linkedin size={18} />;
        if (rede.includes("twitter") || rede.includes("x")) return <Twitter size={18} />;
        if (rede.includes("youtube")) return <Youtube size={18} />;
        if (rede.includes("whatsapp")) return <MessageCircle size={18} />;
        return <Globe size={18} />;
    };

    return (
        <div className="modalFundadores-overlay">
            <div className="modalFundadores-content">
                <h2 className="modalFundadores-title">ID para cadastro Bloqueado</h2>
                <p className="modalFundadores-message">
                    Não é possível fazer o cadastro com este ID, pois ele é reservado para os fundadores do site.
                </p>

                <div className="modalFundadores-buttons">
                    {links.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modalFundadores-btn"
                        >
                            <span className="modalFundadores-icon">{getIcon(item.rede)}</span>
                            <span>{item.rede}</span>
                        </a>
                    ))}
                </div>

                <button className="modalFundadores-close" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}
