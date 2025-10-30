// 📂 src/pages/annetstudios/Rodannet.jsx
import "./rodapeannet.css";

export default function Rodannet() {
    return (
        <footer className="rodannet-container">
            <div className="rodannet-centro">
                <img
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/ChatGPT%20Image%2028%20de%20out%20(1).%20de%202025,%2015_28_46"
                    alt="Logo Annett Studios"
                    className="rodannet-logo"
                />
                <h3 className="rodannet-nome">Annett Studios</h3>
                <p className="rodannet-direitos">
                    © {new Date().getFullYear()} Annett Studios — Todos os direitos reservados.
                </p>
            </div>

            <div className="rodannet-infos">
                <div className="rodannet-item">
                    <a
                        href="https://www.instagram.com/studio_annett?igsh=Ym16dWZrNHZwaHk3"
                        target="_blank"
                        rel="noreferrer"
                    >
                        🌸 Instagram
                    </a>
                </div>

                <div className="rodannet-item">
                    <a href="https://wa.me/5511915305613" target="_blank" rel="noreferrer">
                        💬 WhatsApp: +55 11 91530-5613
                    </a>
                </div>

                <div className="rodannet-item">
                    <a href="mailto:torresannett17@gmail.com">📧 torresannett17@gmail.com</a>
                </div>
            </div>

            {/* 🔹 Só aparecerá no mobile */}
            <div className="rodannet-breaks"></div>
        </footer>
    );
}
