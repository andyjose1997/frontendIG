import './Organizacao.css';



export default function Organizacao() {
    return (
        <div className="organizacao">
            <h2>Quem organiza a IronGoals?</h2>
            <p>
                Nossa equipe é composta por gerentes de visão e colaboradores dedicados,
                comprometidos em garantir que a plataforma funcione de forma eficaz e
                mantenha os princípios de confiança, qualidade e apoio mútuo entre os usuários.
            </p>
            <div className="responsaveis">
                <div className="responsavel">
                    <img id="GerenteUm" src="/fotos/andy.jpg" alt="Andy" />
                    <h2>Andy De Oliveira</h2>
                    <h4 id="TagUm"> Gerente de Desenvolvimento & Parcerias</h4>
                    <p> Responsável pela supervisão geral, definição de metas de crescimento,
                        visão estratégica e manutenção dos princípios da plataforma. Atua também
                        na liderança da equipe de tecnologia, supervisão da segurança de dados
                        e representação institucional em parcerias e eventos.</p>
                </div>

                <div className="responsavel">
                    <img id="GerenteUm" src="/fotos/flayra.jpg" alt="Flayra" />
                    <h2>Flayra De Oliveira</h2>
                    <h4 id="TagDois">Gerente de Operações Educacionais</h4>
                    <p>Focado no suporte aos anfitriões, qualidade do conteúdo e relacionamento
                        com os usuários. Atua desenvolvendo treinamentos, coordenando a produção
                        de materiais educativos, mediando feedbacks e supervisionando a equipe de
                        suporte para garantir um atendimento eficiente e uma experiência positiva
                        para todos.</p>
                </div>
            </div>

        </div>


    )
}