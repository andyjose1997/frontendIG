// 📂 src/componentes/ModalLogin.jsx
import "./modallogin.css";
import Login from "../login";

export default function ModalLogin({ onClose }) {
    return (
        <div className="modal-login-fundo">
            <div className="modal-login-conteudo">
                <button className="ffechar-modal" onClick={onClose}>✖</button>
                <h2>Precisa fazer login para nos avaliar</h2>

                {/* 🔹 Passa a prop redirectTo para Login */}
                <Login redirectTo="/Avaliacao" />
            </div>
        </div>
    );
}
