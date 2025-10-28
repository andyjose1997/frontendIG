// 📂 Todas as classes começam com "parceriaannet-"
import "./parceria.css";

export default function ParceriaAnnet() {
    return (
        <section className="parceriaannet-container" id="parcerias">
            <h2>💎 Parcerias e Colaborações</h2>
            <p>
                Trabalhamos com marcas e profissionais que compartilham o mesmo compromisso
                com a qualidade e o bem-estar.
            </p>

            <div className="parceriaannet-logos">
                <img src="/logo/annetf.png" alt="Annet Studios" />
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                    alt="Google"
                />
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                    alt="Amazon"
                />
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/87/Instagram_logo_2016.svg"
                    alt="Instagram"
                />
            </div>
        </section>
    );
}
