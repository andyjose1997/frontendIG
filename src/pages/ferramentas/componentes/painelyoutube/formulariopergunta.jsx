import { useState } from "react";
import { URL } from "../../../../config";
import AlertaFlutuante from "./alertaflutuante";

export default function FormularioPergunta({ atualizarLista }) {
    const [form, setForm] = useState({
        video_id: "",
        texto: "",
        opcao1: "",
        opcao2: "",
        opcao3: "",
        opcao4: "",
        opcao5: "",
        opcao6: "",
        resposta_correta: 1,
    });

    const [alerta, setAlerta] = useState({ mensagem: "", tipo: "" });

    const mostrarAlerta = (mensagem, tipo) => {
        setAlerta({ mensagem, tipo });
        setTimeout(() => setAlerta({ mensagem: "", tipo: "" }), 4500);
    };

    const validarOpcoes = () => {
        const opcoes = [form.opcao1, form.opcao2, form.opcao3, form.opcao4, form.opcao5, form.opcao6]
            .map(o => o.trim().toLowerCase())
            .filter(o => o !== "");
        return new Set(opcoes).size === opcoes.length;
    };

    const validarVideo = async () => {
        try {
            const resVideo = await fetch(`${URL}/youtube/videos/${form.video_id}`);
            if (!resVideo.ok) return false;

            const resPerguntas = await fetch(`${URL}/youtube/videos/${form.video_id}/perguntas`);
            const perguntas = await resPerguntas.json();
            return perguntas.length === 0;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarOpcoes()) {
            mostrarAlerta("❌ As opções não podem ser iguais!", "erro");
            return;
        }

        const valido = await validarVideo();
        if (!valido) {
            mostrarAlerta("❌ ID do vídeo inválido ou já possui pergunta!", "erro");
            return;
        }

        const res = await fetch(`${URL}/youtube/perguntas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            mostrarAlerta("✅ Pergunta cadastrada!", "sucesso");
            setForm({
                video_id: "",
                texto: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
                opcao6: "",
                resposta_correta: 1,
            });
            atualizarLista();
        } else {
            mostrarAlerta("❌ Erro ao cadastrar pergunta.", "erro");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3>Nova Pergunta</h3>
                <input
                    type="number"
                    placeholder="ID do Vídeo"
                    value={form.video_id}
                    onChange={(e) => setForm({ ...form, video_id: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Texto da pergunta"
                    value={form.texto}
                    onChange={(e) => setForm({ ...form, texto: e.target.value })}
                    required
                />
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <input
                        key={num}
                        type="text"
                        placeholder={`Opção ${num}`}
                        value={form[`opcao${num}`]}
                        onChange={(e) => setForm({ ...form, [`opcao${num}`]: e.target.value })}
                    />
                ))}
                <input
                    type="number"
                    min="1"
                    max="6"
                    placeholder="Resposta correta"
                    onChange={(e) => setForm({ ...form, resposta_correta: e.target.value })}
                    required
                />
                <button type="submit">Salvar Pergunta</button>
            </form>

            <AlertaFlutuante
                mensagem={alerta.mensagem}
                tipo={alerta.tipo}
                onClose={() => setAlerta({ mensagem: "", tipo: "" })}
            />
        </>
    );
}
