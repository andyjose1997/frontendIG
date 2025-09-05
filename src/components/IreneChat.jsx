import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./IreneChat.css";
import { URL } from "../config";

export default function IreneChat() {
    const [aberto, setAberto] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [input, setInput] = useState("");
    const [carregando, setCarregando] = useState(false);

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
                setCarregando(false); // ✅ só libera quando terminou de digitar
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

    return (
        <div className="irene-container">
            {!aberto && (
                <button className="irene-botao" onClick={() => setAberto(true)}>
                    Assistente Virtual Irene
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

                    <div className="irene-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua pergunta..."
                            onKeyDown={(e) =>
                                e.key === "Enter" && !carregando && enviarPergunta()
                            }
                            disabled={carregando} // ✅ bloqueia enquanto carrega
                        />
                        <button onClick={enviarPergunta} disabled={carregando}>
                            {carregando ? "Aguarde..." : "Enviar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
