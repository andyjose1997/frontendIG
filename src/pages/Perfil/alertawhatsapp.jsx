// AlertaWhatsApp.jsx
import "./alertawhatsApp.css";

export default function AlertaWhatsApp({ tipo, mensagem, onClose }) {
    return (
        <div className="alerta-overlay">
            <div className={`alerta-box ${tipo}`}>
                <p>{mensagem}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
}
