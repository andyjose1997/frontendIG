import { useState } from "react";
import "./modalsuporte.css";

export default function ModalSuporte({ onClose }) {
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");

    // Enviar por email
    const enviarEmail = (e) => {
        e.preventDefault();
        const mailtoLink = `mailto:support@irongoals.com?subject=Suporte - ${encodeURIComponent(
            nome
        )}&body=${encodeURIComponent(mensagem)}`;
        window.location.href = mailtoLink;
    };

    // Enviar por WhatsApp
    const enviarWhatsApp = (e) => {
        e.preventDefault();
        const numero = "5511921352636"; // DDI + DDD + número
        const texto = `Olá, meu nome é ${nome}. %0A%0A${mensagem}`;
        const whatsappLink = `https://wa.me/${numero}?text=${texto}`;
        window.open(whatsappLink, "_blank");
    };

    return (
        <div className="modal-suporte-overlay">
            <div className="modal-suporte">
                <button className="fecharModal" onClick={onClose}>✖</button>
                <h2>Suporte IronGoals</h2>
                <h3>Preencha suas informações e envie sua mensagem para nosso suporte por e-mail ou WhatsApp.</h3>
                <form onSubmit={enviarEmail}>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <textarea
                        name="mensagem"
                        placeholder="Digite sua mensagem..."
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        required
                        rows={8}
                    />

                    <button type="submit">📧 Enviar por Email</button>
                </form>

                <button onClick={enviarWhatsApp} className="whatsapp-btn">
                    💬 Enviar via WhatsApp
                </button>
            </div>
        </div>
    );
}
