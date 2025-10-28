// Todas as classes começam com "rodannet-"

import "./rodapeannet.css";

export default function Rodannet() {
    return (
        <footer className="rodannet-container">
            <div className="rodannet-conteudo">
                <div className="rodannet-coluna">
                    <h3>Annet Studios</h3>
                    <p>Beleza, cuidado e confiança em cada detalhe.</p>
                </div>

                <div className="rodannet-coluna">
                    <h4>Contato</h4>
                    <p>📍 Rua das Rosas, 215 - São Paulo, SP</p>
                    <p>📞 (11) 91234-5678</p>
                    <p>📧 contato@annetstudios.com</p>
                </div>

                <div className="rodannet-coluna">
                    <h4>Redes Sociais</h4>
                    <div className="rodannet-redes">
                        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">🌸 Instagram</a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">💖 Facebook</a>
                        <a href="https://wa.me/5511912345678" target="_blank" rel="noreferrer">💬 WhatsApp</a>
                    </div>
                </div>
            </div>

            <div className="rodannet-copy">
                © {new Date().getFullYear()} Annet Studios — Todos os direitos reservados.
            </div>
        </footer>
    );
}
