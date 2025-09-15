import { useState } from "react";
import { useParams } from "react-router-dom";
import "./SalaCodigo.css";
import Swal from "sweetalert2";

export default function SalaCodigo() {
    const { nome } = useParams(); // nome do quiz vindo da rota
    const [codigo, setCodigo] = useState("");
    const [nomeJogador, setNomeJogador] = useState("");
    const [emojiSelecionado, setEmojiSelecionado] = useState("");

    // 🔹 Lista de emojis (principais, pode expandir depois)
    const emojis = [
        "😀", "😂", "😎", "😍", "🤓", "😡", "😭", "😴", "🤖", "👻",
        "🐶", "🐱", "🐵", "🐼", "🦊", "🐯", "🐸", "🐧", "🐢", "🐉",
        "⚽", "🏀", "🎮", "🎸", "🎤", "🎧", "📚", "💻", "🚀", "⭐"
    ];

    const entrarNaSala = () => {
        if (!codigo || !nomeJogador || !emojiSelecionado) {
            Swal.fire({
                icon: "warning",
                title: "Campos obrigatórios",
                text: "Preencha o código, seu nome e escolha um emoji!",
            });
            return;
        }

        // Aqui no futuro vamos integrar com o backend (rota /salas/entrar)
        console.log("Entrando na sala:", {
            quiz: nome,
            codigo,
            nomeJogador,
            emojiSelecionado
        });

        Swal.fire({
            icon: "success",
            title: "🚀 Entrando na sala!",
            text: `Bem-vindo, ${nomeJogador}!`,
            timer: 2000,
            showConfirmButton: false
        });
    };

    return (
        <div className="salaCodigo-container">
            <h2>🔑 Entrar na Sala</h2>
            <p>Quiz selecionado: <strong>{nome}</strong></p>

            <div className="salaCodigo-form">
                <label>
                    Código da Sala:
                    <input
                        type="text"
                        maxLength={4}
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Ex: 1234"
                    />
                </label>

                <label>
                    Seu Nome:
                    <input
                        type="text"
                        value={nomeJogador}
                        onChange={(e) => setNomeJogador(e.target.value)}
                        placeholder="Digite seu nome"
                    />
                </label>

                <label>
                    Escolha um Emoji:
                    <div className="salaCodigo-emojis">
                        {emojis.map((em, idx) => (
                            <span
                                key={idx}
                                className={`emoji-item ${emojiSelecionado === em ? "selecionado" : ""}`}
                                onClick={() => setEmojiSelecionado(em)}
                            >
                                {em}
                            </span>
                        ))}
                    </div>
                </label>

                <button className="salaCodigo-btnEntrar" onClick={entrarNaSala}>
                    🚀 Entrar na Sala
                </button>
            </div>
        </div>
    );
}
