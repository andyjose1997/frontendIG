// 📂 src/pages/annetstudios/modais/ModalServicos.jsx
import ReactDOM from "react-dom";
import "./modalservicos.css";

export default function ModalServicos({ onFechar }) {
    return ReactDOM.createPortal(
        <div className="modalannet-overlay" onClick={onFechar}>
            <div
                className="modalannet-conteudo"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>💼 Serviços</h2>
                <p>Conteúdo de teste para o modal de Serviços.</p>
                <button className="modalannet-fechar" onClick={onFechar}>
                    Fechar
                </button>
            </div>
        </div>,
        document.body
    );
}
