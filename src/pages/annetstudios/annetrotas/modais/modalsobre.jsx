// 📂 src/pages/annetstudios/modais/ModalSobre.jsx
import ReactDOM from "react-dom";
import "./modalsobre.css";

export default function ModalSobre({ onFechar }) {
    return ReactDOM.createPortal(
        <div className="sobreannet-overlay" onClick={onFechar}>
            <div
                className="sobreannet-conteudo"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="sobreannet-titulo">💖 Sobre</h2>

                <p className="sobreannet-texto">
                    A <strong>Annett Studios</strong> é um espaço dedicado à beleza,
                    criatividade e bem-estar. Nosso objetivo é fazer você se sentir
                    confiante e única em cada detalhe.
                </p>

                <p className="sobreannet-texto">
                    <strong>IronGoals</strong> é uma plataforma digital de aprendizado e
                    crescimento pessoal que conecta pessoas com cursos, desafios e
                    oportunidades reais de desenvolver habilidades e gerar renda. Seu foco
                    está em inspirar e capacitar quem busca alcançar seus objetivos de
                    forma prática e acessível.
                </p>

                <p className="sobreannet-texto">
                    A parceria entre <strong>Annett Studios</strong> e{" "}
                    <strong>IronGoals</strong> nasceu da missão em comum de incentivar o
                    talento e o empoderamento. Juntos, unimos o cuidado com a beleza e a
                    arte com o desenvolvimento pessoal e profissional — criando experiências
                    únicas que valorizam tanto o corpo quanto a mente.
                </p>

                <button className="sobreannet-fechar" onClick={onFechar}>
                    Fechar
                </button>
            </div>
        </div>,
        document.body
    );
}
