// 📂 src/pages/Perfil/modalusuariomensagem.jsx
import './modalusuario.css';
import { URL } from '../../config';

export default function ModalUsuarioMensagem({ usuario, onClose }) {
    if (!usuario) return null;

    const linkWhatsapp = usuario.whatsapp
        ? `https://wa.me/55${usuario.whatsapp.replace(/\D/g, '')}`
        : null;
    const supabaseBase =
        "https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/fotosdeperfis/";
    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="fechar" onClick={onClose}>✖</button>

                {/* Foto do usuário */}
                <img
                    src={usuario.foto || "/perfilPadrao.png"}
                    alt="Foto de perfil"
                    className="foto-perfil"
                />


                {/* Nome */}
                <h2>{usuario.nome} {usuario.sobrenome}</h2>

                {/* WhatsApp */}
                {linkWhatsapp ? (
                    <a
                        href={linkWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp"
                    >
                        📲 Abrir WhatsApp
                    </a>
                ) : (
                    <button className="btn-whatsapp desabilitado" disabled>
                        Sem WhatsApp
                    </button>
                )}

                {/* Meta */}
                <div className="meta-box">
                    <p><b>Próxima Meta:</b></p>
                    <p>{usuario.comentario_perfil || "Nenhuma meta definida."}</p>
                </div>
            </div>
        </div>
    );
}
