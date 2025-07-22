import { useNavigate } from "react-router-dom";
import './Cursos.css';


export default function Cursos() {
    const navigate = useNavigate();
    return (

        <div>
            <section className="pacotes-info">
                <h2>Informações sobre os Pacotes</h2>
                <p>
                    Cada pacote contém 12 cursos cuidadosamente selecionados para seu desenvolvimento profissional e pessoal.
                    O valor do primeiro pacote é fixo em <strong>R$ 60,00</strong>. A partir da compra do segundo pacote,
                    cada novo pacote custará apenas <strong>R$ 30,00</strong>.
                    No momento, ainda não temos outros pacotes disponíveis, mas nossa equipe está trabalhando para
                    lançar novos conteúdos em breve!
                </p>
            </section>
            <section className="pacote-geral">
                <h2> <div className="Pacote">Pacote 1 </div> <br />📚 Idiomas e Programação</h2>
                <p>Domine ferramentas práticas, idiomas essenciais e programação para alavancar sua carreira e produtividade.</p>

                <div className="lista-cursos">
                    <div className="curso">
                        <h3>Excel</h3>
                        <p>Organizar, analisar e apresentar dados de forma eficiente.</p>
                    </div>
                    <div className="curso">
                        <h3>Word</h3>
                        <p>Criar documentos profissionais e formatar textos de forma avançada.</p>
                    </div>
                    <div className="curso">
                        <h3>PowerPoint</h3>
                        <p>Desenvolver apresentações impactantes e visualmente atrativas.</p>
                    </div>
                    <div className="curso">
                        <h3>Google Sheets</h3>
                        <p>Trabalhar com planilhas online colaborativas, fórmulas e gráficos.</p>
                    </div>
                    <div className="curso">
                        <h3>Inglês</h3>
                        <p>Melhorar a comunicação global e aumentar oportunidades profissionais.</p>
                    </div>
                    <div className="curso">
                        <h3>Espanhol</h3>
                        <p>Expandir a comunicação em países de língua espanhola para negócios e viagens.</p>
                    </div>
                    <div className="curso">
                        <h3>HTML5</h3>
                        <p>Estruturar páginas web do zero com códigos limpos e semânticos.</p>
                    </div>
                    <div className="curso">
                        <h3>CSS3</h3>
                        <p>Estilizar e criar layouts responsivos para sites modernos.</p>
                    </div>
                    <div className="curso">
                        <h3>JavaScript (Basico intermediario)</h3>
                        <p>Adicionar interatividade e dinamismo a páginas web.</p>
                    </div>
                    <div className="curso">
                        <h3>React (Basico intermediario)</h3>
                        <p>Criar aplicações web modernas com componentes reutilizáveis.</p>
                    </div>
                    <div className="curso">
                        <h3>Python (Base para Back-end)</h3>
                        <p>Automatizar tarefas, trabalhar com dados e aprender lógica de programação.</p>
                    </div>
                    <div className="curso">
                        <h3>Git & GitHub</h3>
                        <p>Controlar versões de projetos e colaborar de forma organizada.</p>
                    </div>
                </div>
                <br /><br />
                <div id="divBotao">
                    <button
                        onClick={() => navigate("/cadastrarse")}
                        id="PacoteBotao"
                    >
                        Compre o Pacote agora
                    </button>

                </div>
            </section>


        </div>
    )
}