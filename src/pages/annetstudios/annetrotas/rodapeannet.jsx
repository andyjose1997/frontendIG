// 📂 src/pages/annetstudios/Rodannet.jsx
import "./rodapeannet.css";

export default function Rodannet() {
    return (
        <footer className="rodannet-container">
            <div className="rodannet-centro">
                <img
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/logo.png"
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

                {/* 🔹 Endereço com link do Google Maps */}
                <div className="rodannet-item">
                    <a
                        href="https://www.google.com/maps/place/Studio+Annett/@-23.3343154,-46.7595101,21z/data=!4m15!1m8!3m7!1s0x94cee3ef7a760bdd:0x6077130f87e5e2f1!2sR.+Jos%C3%A9+Faillace,+214+-+Vera+Tereza,+Caieiras+-+SP,+07700-000!3b1!8m2!3d-23.3345678!4d-46.7603381!16s%2Fg%2F11c5lf_br1!3m5!1s0x94cee3b37298379f:0xf679a6c5d2698ddf!8m2!3d-23.3343207!4d-46.7592509!16s%2Fg%2F11xsw00ylx?entry=ttu"
                        target="_blank"
                        rel="noreferrer"
                    >
                        📍 R. João Rosa da Silva, 101
                    </a>
                </div>
            </div>

            {/* 🔹 Só aparecerá no mobile */}
            <div className="rodannet-breaks"></div>
        </footer>
    );
}
