import { useEffect, useState } from "react";
import { URL } from "../../config";
import "./Redes.css";

// 🔹 Ícones do lucide-react
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, MessageCircle } from "lucide-react";

export default function Redes({ onClose }) {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const carregarLinks = async () => {
            try {
                const res = await fetch(`${URL}/links`);
                const data = await res.json();
                setLinks(data);
            } catch (err) {
                console.error("Erro ao carregar links:", err);
            }
        };
        carregarLinks();
    }, []);

    // 🔹 Função para escolher ícone baseado no nome da rede
    const getIcon = (nome) => {
        const rede = nome.toLowerCase();
        if (rede.includes("facebook")) return <Facebook size={20} />;
        if (rede.includes("instagram")) return <Instagram size={20} />;
        if (rede.includes("linkedin")) return <Linkedin size={20} />;
        if (rede.includes("twitter") || rede.includes("x")) return <Twitter size={20} />;
        if (rede.includes("youtube")) return <Youtube size={20} />;
        if (rede.includes("whatsapp")) return <MessageCircle size={20} />;
        return <Globe size={20} />; // ícone genérico se não reconhecer
    };

    return (
        <div className="redes-overlay">
            <div className="redes-modal">
                <h2>🌐 Nossas Redes</h2>

                <div className="redes-grid">
                    {links.map((item, index) => (
                        <button
                            key={index}
                            className="rede-btn"
                            onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
                        >
                            <span className="icon">{getIcon(item.rede)}</span>
                            <span>{item.rede}</span>
                        </button>
                    ))}
                </div>

                <button className="fechar-btn" onClick={onClose}>
                    ❌ Fechar
                </button>
            </div>
        </div>
    );
}
