import { useEffect, useState } from "react";
import "./bv.css";
import { URL } from "../../config";

export default function ModalVideo({ onClose }) {
    const [podeFechar, setPodeFechar] = useState(false);
    const [contador, setContador] = useState(12); // 90 segundos = 1min30s

    // 🔹 Contador regressivo
    useEffect(() => {
        const intervalo = setInterval(() => {
            setContador((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalo);
                    setPodeFechar(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

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
                    src="https://www.youtube.com/embed/woWqstLf8y0"
                    title="Boas vindas"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>

                <button
                    className="fechar-btn"
                    onClick={handleEntendi}
                    disabled={!podeFechar}
                >
                    {podeFechar ? "Entendi" : `Aguarde`}
                </button>
            </div>
        </div>
    );
}
