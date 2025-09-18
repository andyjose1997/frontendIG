import "./alertaflutuante.css";

export default function AlertaFlutuante({ mensagem, tipo, onClose }) {
    if (!mensagem) return null;

    return (
        <div className={`alerta-flutuante alerta-${tipo}`}>
            <span>{mensagem}</span>
            <button onClick={onClose}>✖</button>
        </div>
    );
}
