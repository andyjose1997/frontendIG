import { useState, useEffect } from "react";
import { URL } from "../../../config";
import './perguntasseguranca.css';

export default function PerguntasSeguranca() {
    const [perguntas, setPerguntas] = useState({ p1: "", p2: "", p3: "" });
    const [respostas, setRespostas] = useState({ r1: "", r2: "", r3: "" });
    const [editando, setEditando] = useState(null);
    const [mensagem, setMensagem] = useState("");

    // 🔹 Buscar perguntas já salvas do backend
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${URL}/seguranca/minhas-perguntas`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.perguntas && data.perguntas.length >= 3) {
                    setPerguntas({
                        p1: data.perguntas[0].pergunta,
                        p2: data.perguntas[1].pergunta,
                        p3: data.perguntas[2].pergunta
                    });
                    setRespostas({
                        r1: data.perguntas[0].resposta,
                        r2: data.perguntas[1].resposta,
                        r3: data.perguntas[2].resposta
                    });
                }
            })
            .catch(() => setMensagem("❌ Erro ao carregar perguntas salvas."));
    }, []);

    const salvarPerguntas = async () => {
        if (!respostas.r1 || !respostas.r2 || !respostas.r3) {
            setMensagem("⚠️ Responda todas as perguntas antes de salvar.");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${URL}/seguranca/salvar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    pergunta1: perguntas.p1,
                    resposta1: respostas.r1,
                    pergunta2: perguntas.p2,
                    resposta2: respostas.r2,
                    pergunta3: perguntas.p3,
                    resposta3: respostas.r3
                })
            });

            const data = await res.json();
            if (!res.ok) {
                setMensagem(data.erro || "Erro ao salvar perguntas.");
                return;
            }
            setMensagem("✅ Perguntas de segurança salvas com sucesso!");
        } catch {
            setMensagem("❌ Erro de conexão com o servidor.");
        }
    };

    const renderPergunta = (campo, valor) => {
        if (editando === campo) {
            return (
                <input
                    type="text"
                    value={valor}
                    onChange={(e) => setPerguntas({ ...perguntas, [campo]: e.target.value })}
                    onBlur={() => setEditando(null)}
                    autoFocus
                    style={{ width: "100%", padding: "5px" }}
                />
            );
        } else {
            return (
                <span
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => setEditando(campo)}
                >
                    {valor || "Clique para editar a pergunta"}
                </span>
            );
        }
    };

    return (
        <div className="perguntas-container">
            <h2>🔐 Perguntas de Segurança</h2>
            <p>Clique em uma pergunta para editá-la. Responda todas antes de salvar.</p>
            <p style={{ fontSize: "1.3rem" }}>
                Essas perguntas de segurança são fundamentais para proteger sua conta.
                Caso você esqueça sua senha no futuro, será necessário responder corretamente
                a elas para recuperar o acesso. Escolha perguntas e respostas que apenas você saiba.
            </p>
            <div className="pergunta-bloco">
                <label>{renderPergunta("p1", perguntas.p1)}</label>
                <input
                    type="text"
                    value={respostas.r1}
                    onChange={(e) => setRespostas({ ...respostas, r1: e.target.value })}
                    placeholder="Sua resposta"
                />
            </div>

            <div className="pergunta-bloco">
                <label>{renderPergunta("p2", perguntas.p2)}</label>
                <input
                    type="text"
                    value={respostas.r2}
                    onChange={(e) => setRespostas({ ...respostas, r2: e.target.value })}
                    placeholder="Sua resposta"
                />
            </div>

            <div className="pergunta-bloco">
                <label>{renderPergunta("p3", perguntas.p3)}</label>
                <input
                    type="text"
                    value={respostas.r3}
                    onChange={(e) => setRespostas({ ...respostas, r3: e.target.value })}
                    placeholder="Sua resposta"
                />
            </div>

            <div className="botoes">
                <button className="botao-config" onClick={salvarPerguntas}>Salvar</button>
                <a
                    className="botao-voltar"
                    href={
                        window.location.hostname === "localhost"
                            ? "http://localhost:5173/TelaConfig"
                            : "https://irongoals.com/TelaConfig"
                    }
                >
                    ← Voltar
                </a>
            </div>

            {mensagem && <p className="status">{mensagem}</p>}
        </div>
    );
}
