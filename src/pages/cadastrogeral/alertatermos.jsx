import { useEffect } from "react";
import "./alertatermos.css";

export default function AlertaTermos({ mensagem, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // fecha automaticamente em 3 segundos
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="alerta-termos">
            <p>{mensagem}</p>
        </div>
    );
}
