import { useState, useEffect } from "react";
import "./linkinfo.css";
import { URL } from "../../../config";

export default function LinkInfo() {
    const [ativo, setAtivo] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [linkCompleto, setLinkCompleto] = useState("");
    const [textoEditavel, setTextoEditavel] = useState("");
    const [editando, setEditando] = useState(false);
    const [alerta, setAlerta] = useState("");

    const botoes = [
        {
            id: "freelancers",
            nome: "💼 Freelancers",
            texto: "Já pensou em ter um portfólio que fala por você?\nMostre seu talento, mostre seus resultados.\nCrie sua página na IronGoals e deixe o mundo ver o profissional que você é. 🌍\n\nVenha se cadastrar e aproveite os grandes recursos para mostrar seu talento!"
        },
        {
            id: "devs",
            nome: "👨‍💻 Desenvolvedores e programadores",
            texto: "Seu código muda o mundo, mas será que o mundo está vendo?\nMonte seu portfólio, junte certificados e suba de nível no IronStep.\nIronGoals é onde sua evolução aparece.\n\nVenha se cadastrar e mostre ao mundo o poder das suas linhas de código!"
        },
        {
            id: "analistas",
            nome: "📊 Analistas e profissionais de dados",
            texto: "Seus relatórios contam histórias, mas quem está ouvindo?\nMostre seu domínio em dados, suba no ranking e expanda suas oportunidades.\nIronGoals é onde resultados viram reconhecimento.\n\nVenha se cadastrar e transforme seus resultados em reconhecimento!"
        },
        {
            id: "designers",
            nome: "✍️ Designers",
            texto: "Quantas vezes seu talento ficou escondido em uma pasta?\nCrie um portfólio vivo, bonito e público.\nNa IronGoals, cada arte que você faz pode abrir uma porta nova. 🎨\n\nVenha se cadastrar e dê visibilidade às suas criações!"
        },
        {
            id: "estudantes",
            nome: "🎓 Estudantes e recém-formados",
            texto: "Tá começando agora e quer mostrar do que é capaz?\nCrie seu portfólio, ganhe certificados e acompanhe seu progresso no IronStep.\nTodo começo merece ser visto.\n\nVenha se cadastrar e comece a construir seu futuro hoje mesmo!"
        },
        {
            id: "instrutores",
            nome: "🧑‍🏫 Instrutores e professores",
            texto: "Você ensina todos os dias, mas quem está contando sua história?\nMostre seu perfil, acompanhe seus resultados e inspire mais pessoas na IronGoals.\nSeu conhecimento merece palco. 🎓\n\nVenha se cadastrar e inspire outros com sua jornada!"
        },
        {
            id: "empreendedores",
            nome: "🚀 Empreendedores e pequenos negócios",
            texto: "Quantas pessoas conhecem o que você faz de verdade?\nMostre sua marca, seus cursos e seus resultados.\nA IronGoals é o espaço para quem transforma ideias em conquistas. 💡\n\nVenha se cadastrar e apresente sua marca ao mundo!"
        },
    ];

    const clicarBotao = (id) => {
        if (ativo === id) {
            setAtivo(null);
            setEditando(false);
            setAlerta("");
            return;
        }
        setAtivo(id);
        setTextoEditavel(botoes.find((b) => b.id === id).texto);
        setEditando(false);
        setAlerta("");
    };

    useEffect(() => {
        const carregarUsuario = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${URL}/perfil`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.id && data.nome && data.sobrenome) {
                    const nomeCompleto = (data.nome + data.sobrenome)
                        .replace(/\s+/g, "")
                        .toLowerCase();
                    const link = `https://www.irongoals.com/criar-conta/${data.id}/${nomeCompleto}`;
                    setLinkCompleto(link);
                }
            } catch (err) {
                console.error("Erro ao carregar usuário:", err);
            }
        };

        carregarUsuario();
    }, []);

    const copiarTexto = () => {
        const textoFinal = `${textoEditavel}\n\n${linkCompleto}`;
        navigator.clipboard.writeText(textoFinal);
        setAlerta("🔗 Texto copiado!");
        setTimeout(() => setAlerta(""), 2000);
    };

    const botaoAtivo = botoes.find((b) => b.id === ativo);

    return (
        <div className="post-container">
            <h2 className="post-tituloo">Tipos de Postagem</h2>
            <p className="avisopost" style={{ fontSize: "1.5rem", fontWeight: "bold" }} >Conheça os tipos de profissionais que mais aproveitam tudo que a IronGoals oferece.</p>            <div className="post-categorias">
                {botoes.map((b) => (
                    <button
                        key={b.id}
                        className={`post-botao ${ativo === b.id ? "ativo" : ""}`}
                        onClick={() => clicarBotao(b.id)}
                    >
                        {b.nome}
                    </button>
                ))}
            </div>

            {botaoAtivo && (
                <div className="post-conteudo">
                    <div className="post-texto">
                        {!editando ? (
                            <pre className="post-texto-pronto">{textoEditavel}</pre>
                        ) : (
                            <textarea
                                value={textoEditavel}
                                onChange={(e) => setTextoEditavel(e.target.value)}
                                className="post-textarea"
                            />
                        )}
                    </div>

                    {linkCompleto && (
                        <div className="post-link-area">
                            <a
                                href={linkCompleto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="post-link"
                            >
                                {linkCompleto}
                            </a>
                        </div>
                    )}

                    <div className="post-acoes">
                        <button
                            onClick={() => setEditando(!editando)}
                            className="post-btn post-btn-editar"
                        >
                            ✏️ {editando ? "Cancelar" : "Editar"}
                        </button>

                        <button onClick={copiarTexto} className="post-btn post-btn-copiar">
                            📋 Copiar
                        </button>
                    </div>

                    {alerta && <div className="post-alerta">{alerta}</div>}
                </div>
            )}
        </div>
    );
}
