import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authcontext";

import "./manual.css";


export default function Manual() {
    const pdfURL = "/Manual.pdf";

    const perguntas = [
        "Não consigo abrir",
        "Pergunta 2",
        "Pergunta 3",
        "Pergunta 4",
        "Pergunta 5",
        "Pergunta 6",
        "Pergunta 7",
        "Pergunta 8",
        "Pergunta 9",
        "pergunta 10",
    ];

    const respostas = [
        "Resposta da Pergunta " + perguntas[0] + " : .",
        "Resposta da Pergunta " + perguntas[1] + " : .",
        "Resposta da Pergunta " + perguntas[2] + " : .",
        "Resposta da Pergunta " + perguntas[3] + " : .",
        "Resposta da Pergunta " + perguntas[4] + " : .",
        "Resposta da Pergunta " + perguntas[5] + " : .",
        "Resposta da Pergunta " + perguntas[6] + " : .",
        "Resposta da Pergunta " + perguntas[7] + " : .",
        "Resposta da Pergunta " + perguntas[8] + " : .",
        "Resposta da Pergunta " + perguntas[9] + " : .",
    ];

    const [mostrarPerguntas, setMostrarPerguntas] = useState(false);
    const [respostaAtiva, setRespostaAtiva] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    const redirecionar = () => {
        if (user) {
            navigate("/inicio");
        } else {
            navigate("/");
        }
    };


    return (
        <main className="Manual">
            <button
                onClick={() => {
                    const salvo = localStorage.getItem("user");
                    const estaLogado = salvo && JSON.parse(salvo)?.email;

                    if (estaLogado) {
                        navigate("/inicio");
                    } else {
                        navigate("/");
                    }
                }}
                className="botao-retornar"
            >
                🔙 Voltar para a página inicial
            </button>


            <h1>Termos de Uso — IronGoals</h1>

            <div className="ManualContainer">
                <div className="Botoes">
                    <button
                        className="AbaBotao"
                        onClick={() => {
                            setMostrarPerguntas(!mostrarPerguntas);
                            setRespostaAtiva(null);
                        }}
                    >
                        Tenho Dúvidas
                    </button>

                    {mostrarPerguntas && (
                        <div className="SubBotoes">
                            {perguntas.map((pergunta, index) => (
                                <div key={index}>
                                    <button
                                        className="SubBotao"
                                        onClick={() =>
                                            setRespostaAtiva(
                                                respostaAtiva === index ? null : index
                                            )
                                        }
                                    >
                                        {pergunta}
                                    </button>
                                    {respostaAtiva === index && (
                                        <div className="Resposta">
                                            <p>{respostas[index]}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="Visualizador">
                    <iframe
                        src={pdfURL}
                        width="100%"
                        height="600px"
                        title="Visualizador PDF"
                    ></iframe>
                </div>
            </div><br /><br /><br /><br />
            <h3 style={{
                textAlign: "center",
                textDecoration: "none",
            }}>
                <a href="/Cadastrarse">Li e aceito — quero criar minha conta!</a> ou <br /><br />
                <a href="/login">Entrar na minha conta existente</a>
            </h3>
        </main>
    );
}
