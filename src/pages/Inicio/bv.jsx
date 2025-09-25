import "./bv.css";
import { URL } from "../../config";

export default function ModalVideo({ onClose }) {
    // 🔹 Ao clicar em "Entendi", envia para backend
    const handleEntendi = () => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/usuarios/assistiu`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then(() => onClose())
            .catch((err) => console.error("Erro ao atualizar assistiu:", err));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <iframe
                    src="https://www.youtube.com/embed/NOebfEFJW6Y?list=RDNOebfEFJW6Y"
                    title="I Will Be"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>

                <button className="fechar-btn" onClick={handleEntendi}>
                    Entendi
                </button>
            </div>
        </div>
    );
}
