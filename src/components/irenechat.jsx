import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./irenechat.css";
import { URL } from "../config";
import { useLocation } from "react-router-dom";

export default function IreneChat() {
    const [aberto, setAberto] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [input, setInput] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [perguntas, setPerguntas] = useState([]); // sugestões vindas do backend
    const location = useLocation();
    const isMensagens = location.pathname.toLowerCase().includes("mensagens");

    const mensagensFimRef = useRef(null);
    const usuarioId = localStorage.getItem("usuario_id");

    // 🔹 Sempre rolar pro final quando mensagens mudarem
    useLayoutEffect(() => {
        if (mensagensFimRef.current) {
            mensagensFimRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [mensagens, carregando]);

    // 🔹 Carregar histórico ao abrir o chat
    useEffect(() => {
        if (!aberto || !usuarioId) return;

        const controller = new AbortController();

        fetch(`${URL}/irene/historico/${usuarioId}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => {
                const msgs = [];
                data.forEach((item) => {
                    msgs.push({ autor: "user", texto: item.pergunta });
                    if (item.resposta) msgs.push({ autor: "irene", texto: item.resposta });
                });
                setMensagens(msgs);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Erro ao carregar histórico:", err);
                }
            });

        return () => controller.abort();
    }, [aberto, usuarioId]);

    // 🔹 Buscar perguntas no backend conforme digita
    const buscarPerguntas = async (texto) => {
        if (!texto) {
            setPerguntas([]);
            return;
        }

        try {
            const res = await fetch(`${URL}/irene/faq/perguntas?q=${encodeURIComponent(texto)}`);
            const data = await res.json();
            setPerguntas(data.perguntas || []);
        } catch (err) {
            console.error("Erro ao buscar perguntas:", err);
        }
    };

    // 🔹 Função para digitar letra por letra
    const digitarResposta = (texto) => {
        let i = 0;
        setMensagens((prev) => [...prev, { autor: "irene", texto: "" }]);

        const interval = setInterval(() => {
            i++;
            setMensagens((prev) => {
                const novas = [...prev];
                novas[novas.length - 1].texto = texto.slice(0, i);
                return novas;
            });

            if (i >= texto.length) {
                clearInterval(interval);
                setCarregando(false);
            }
        }, 40);
    };

    // 🔹 Enviar pergunta
    const enviarPergunta = async () => {
        if (!input.trim() || carregando) return;

        const perguntaUsuario = input;
        setMensagens((prev) => [...prev, { autor: "user", texto: perguntaUsuario }]);
        setInput("");
        setCarregando(true);

        try {
            const payload = { pergunta: perguntaUsuario };
            if (usuarioId) payload.usuario_id = usuarioId;

            const res = await fetch(`${URL}/irene/pergunta`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            digitarResposta(data.resposta || "❌ Sem resposta.");
        } catch (error) {
            digitarResposta("⚠️ Não consegui conectar com a Irene. Tente novamente.");
        }
    };
    const [largura, setLargura] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setLargura(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`irene-container ${isMensagens ? "esquerda" : "direita"}`}>
            {!aberto && (
                <button className="irene-botao" onClick={() => setAberto(true)}>
                    {largura <= 850 ? "💭" : "Assistente Virtual Irene"}
                </button>
            )}


            {aberto && (
                <div className="irene-chat">
                    <div className="irene-header">
                        <h4>
                            Assistente Virtual <strong>Irene</strong>
                        </h4>
                        <button onClick={() => setAberto(false)} aria-label="Fechar chat">
                            ✖
                        </button>
                    </div>

                    <div className="irene-mensagens">
                        {mensagens.map((msg, i) => (
                            <div
                                key={i}
                                className={`msg ${msg.autor === "user" ? "user" : "irene"}`}
                            >
                                {msg.texto}
                            </div>
                        ))}

                        {carregando && (
                            <div className="msg irene">✍️ Irene está digitando...</div>
                        )}

                        <div ref={mensagensFimRef} />
                    </div>

                    {/* 🔹 Input + sugestões */}
                    <div className="irene-input">
                        <input
                            list="perguntas"
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                buscarPerguntas(e.target.value); // 🔹 chama backend enquanto digita
                            }}
                            placeholder="Digite ou escolha uma pergunta..."
                            onKeyDown={(e) =>
                                e.key === "Enter" && !carregando && enviarPergunta()
                            }
                            disabled={carregando}
                        />

                        {/* 🔹 Datalist com sugestões do backend */}
                        <datalist id="perguntas">
                            {[...new Set(perguntas)] // 🔹 remove duplicadas
                                .slice(0, 5)          // 🔹 limita a 5 sugestões
                                .map((p, i) => (
                                    <option key={i} value={p} />
                                ))}
                        </datalist>


                        <button onClick={enviarPergunta} disabled={carregando}>
                            {carregando ? "Aguarde..." : "Enviar"}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
