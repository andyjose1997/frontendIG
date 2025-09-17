// 📂 src/componentes/ModalLogin.jsx
import "./modallogin.css";
import Login from "../login";

export default function ModalLogin({ onClose }) {
    return (
        <div className="modal-login-fundo">
            <div className="modal-login-conteudo">
                <button className="fechar-modal" onClick={onClose}>✖</button>
                {/* 🔹 Passa a prop redirectTo para Login */}
                <Login redirectTo="/Avaliacao" />
            </div>
        </div>
    );
}
