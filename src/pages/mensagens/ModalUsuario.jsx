// 📂 src/pages/Perfil/ModalUsuario.jsx
import './ModalUsuario.css';
import { URL } from '../../config';
export default function ModalUsuario({ usuario, onClose }) {
    if (!usuario) return null;

    const linkWhatsapp = usuario.whatsapp
        ? `https://wa.me/55${usuario.whatsapp.replace(/\D/g, '')}`
        : null;

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="fechar" onClick={onClose}>✖</button>

                <img
                    src={usuario.foto
                        ? `${URL}/fotos/${usuario.foto}`
                        : "/perfilPadrao.png"}
                    alt="Foto do usuário"
                    className="modal-fotoUsu"
                />

                <h2>{usuario.nome} {usuario.sobrenome}</h2>

                {linkWhatsapp ? (
                    <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                        📲 Abrir WhatsApp
                    </a>
                ) : (
                    <button className="btn-whatsapp desabilitado" disabled>Sem WhatsApp</button>
                )}

                <div className="meta-box">
                    <p><b>Próxima Meta:</b></p>
                    <p>{usuario.comentario_perfil || "Nenhuma meta definida."}</p>
                </div>
            </div>
        </div>
    );
}
