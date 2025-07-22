import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Feed from "./Feed";
import Buscador from "./Buscador";
import Propaganda from "./Propaganda";
import Indicados from "./Indicados";
import './Inicio.css';
import { URL } from "../../config";

function Inicio() {
    const [mostrarIndicados, setMostrarIndicados] = useState(false);
    const [mostrarPropaganda, setMostrarPropaganda] = useState(false);
    const [modoMobilePropaganda, setModoMobilePropaganda] = useState(false);
    const [modoMobileIndicados, setModoMobileIndicados] = useState(false);
    const [mensagem, setMensagem] = useState("Carregando do backend...");
    const [mensagemUsuario, setMensagemUsuario] = useState("");
    const [nome, setNome] = useState("");
    const [respostaBackend, setRespostaBackend] = useState("");

    const navigate = useNavigate();

    // 🔐 Proteção da rota: verifica se há token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);





    const enviarNome = () => {
        fetch(`${URL}/enviar-nome`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome: nome })
        })
            .then((res) => res.json())
            .then((data) => setRespostaBackend(data.message))
            .catch(() => setRespostaBackend("Erro ao enviar nome"));
    };

    return (
        <section id="contenedor">
            <div className="Buscador">
                <Buscador />
            </div>

            <div className="Feed">
                <Feed />
            </div>

            <div className="Propaganda">
                <button
                    onClick={() => {
                        if (window.innerWidth <= 480) {
                            setModoMobilePropaganda(true);
                        } else {
                            setMostrarPropaganda(!mostrarPropaganda);
                        }
                    }}
                >
                    {mostrarPropaganda ? "Ocultar Sites recomendados" : "Mostrar Sites recomendados"}
                </button>

                {modoMobilePropaganda && window.innerWidth <= 480 && (
                    <div className="fullscreen-propaganda">
                        <button className="voltar" onClick={() => setModoMobilePropaganda(false)}>🔙 Voltar</button>
                        <Propaganda />
                    </div>
                )}

                <br /><br />
                {mostrarPropaganda && <Propaganda />}
            </div>

            <div className="Indicados">
                <button
                    onClick={() => {
                        if (window.innerWidth <= 480) {
                            setModoMobileIndicados(true);
                        } else {
                            setMostrarIndicados(!mostrarIndicados);
                        }
                    }}
                >
                    {mostrarIndicados ? "Ocultar Indicados" : "Mostrar Indicados"}
                </button>

                {modoMobileIndicados && window.innerWidth <= 480 && (
                    <div className="fullscreen-indicados">
                        <button className="voltar" onClick={() => setModoMobileIndicados(false)}>🔙 Voltar</button>
                        <Indicados />
                    </div>
                )}

                <br />
                {mostrarIndicados && <Indicados />}
            </div>
        </section>
    );
}

export default Inicio;
