import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../config";
import "./cursos.css";

export default function Cursos() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [proximoCurso, setProximoCurso] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Buscar cursos e próximo curso (mesma rota)
    useEffect(() => {
        fetch(`${URL}/cursos/`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.cursos)) {
                    setCursos(data.cursos);
                } else {
                    console.warn("Formato inesperado:", data);
                }

                if (data.proximo_curso) {
                    setProximoCurso(data.proximo_curso);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar cursos:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Carregando cursos...</p>;

    return (
        <div>
            <section className="pacotes-info">
                <h2>Breve Informação</h2>
                <p>
                    Este pacote reúne <strong>cursos cuidadosamente selecionados</strong> para o seu desenvolvimento
                    profissional e pessoal. O valor deste pacote é fixo em <strong>R$ 60,00</strong>.<br /><br />
                    🎯 Nosso objetivo é expandir continuamente! Estamos preparando <strong>mais de 20 novos cursos</strong> nas áreas de
                    <strong> Pacote Office, Programação e Idiomas</strong>, todos criados para ajudar você a evoluir em diferentes habilidades.
                    <br /><br />
                    🚀 Novos cursos serão adicionados constantemente à plataforma, e sempre anunciaremos aqui quais serão
                    os próximos lançamentos para que você possa se planejar e acompanhar cada novidade!
                </p>

            </section>

            <section className="pacote-geral">
                <h2>
                    <div className="Pacote">Pacote 1</div>
                    <br />📚 Idiomas e Programação
                </h2>
                <p>
                    Domine ferramentas práticas, idiomas essenciais e programação para alavancar sua carreira e produtividade.
                </p>

                {/* 🔹 Lista de cursos do banco */}
                <div className="lista-cursos">
                    {cursos.map((curso, index) => (
                        <div className="curso" key={index}>
                            <h3>{curso.titulo}</h3>
                            <p>{curso.descricao}</p>
                        </div>
                    ))}
                </div>
                <br />
                {/* 🔹 Exibir o próximo curso */}
                {proximoCurso && (
                    <div className="proximo-curso">
                        <h2>📅 Próximo curso</h2>
                        <h3>{proximoCurso.curso}</h3>
                        <p>
                            <strong>Data:</strong>{" "}
                            {new Date(proximoCurso.quando).toLocaleDateString("pt-BR")}
                        </p>
                        <p>{proximoCurso.descricao}</p>
                    </div>
                )}

                <br />
                <div className="comprar-pacote">
                    <p className="texto-compra">
                        💡 <strong>Para adquirir este pacote, é necessário ter uma conta IronGoals.</strong><br />
                        Durante o cadastro, você precisará informar o <strong>ID do seu Host</strong>, ou seja,
                        o representante que está vendendo o curso.<br /><br />
                        ❓ <em>Não possui um Host ainda?</em><br />
                        Fale diretamente com nossa equipe pelo WhatsApp:{" "}
                        <a
                            href="https://wa.me/5511921352636?text=Ol%C3%A1%2C%20tudo%20bem%3F%20Preciso%20de%20um%20ID%20para%20fazer%20meu%20cadastro."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-whatsapp"
                        >
                            <strong>clique aqui</strong>
                        </a>
                        {" "}para receber seu ID e concluir seu cadastro.
                    </p>

                    <div className="botao-container">
                        <button
                            onClick={() => navigate("/cadastrarse")}
                            className="botao-comprar"
                        >
                            🚀 Criar conta e comprar agora
                        </button>
                    </div>
                </div>


            </section>
        </div>
    );
}
