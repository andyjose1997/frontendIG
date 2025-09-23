import "./saldocppmodal.css";
import react from "react";

export default function SaldoCPPModal({ onClose }) {
    return (
        <div className="saldo-modal-overlay" onClick={onClose}>
            <div className="saldo-modal" onClick={(e) => e.stopPropagation()}>
                <h2>💳 Seu Saldo</h2>
                <p><strong>Saldo do seu CPP:</strong> R$ 123,45</p>
                <p><strong>Saldo do seu CPP (próxima semana):</strong> R$ 67,89</p>

                <button className="botao-acao" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
}
