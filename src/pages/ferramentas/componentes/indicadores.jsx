// src/pages/PainelControle/componentes/indicadores.jsx
import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./indicadores.css";

export default function Indicadores() {
    const [indicacoes, setIndicacoes] = useState([]);
    const [indicacao, setIndicacao] = useState("");
    const [video, setVideo] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    // 🔹 Estados para alertas personalizados
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso"); // "sucesso" | "erro" | "aviso"

    // 🔹 Buscar lista
    useEffect(() => {
        fetch(`${URL}/indicacoes`)
            .then(res => res.json())
            .then(data => setIndicacoes(data))
            .catch(err => console.error(err));
    }, []);

    // 🔹 Função para mostrar alerta
    const mostrarAlerta = (msg, tipo = "sucesso") => {
        setMensagem(msg);
        setTipoMensagem(tipo);
        setTimeout(() => setMensagem(""), 3000); // some em 3s
    };

    // 🔹 Enviar nova ou atualizar
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { indicacao, video };

        try {
            if (editandoId) {
                await fetch(`${URL}/indicacoes/${editandoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                mostrarAlerta("Indicação atualizada com sucesso!", "sucesso");
            } else {
                await fetch(`${URL}/indicacoes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                mostrarAlerta("Indicação adicionada com sucesso!", "sucesso");
            }
            setIndicacao("");
            setVideo("");
            setEditandoId(null);
            const res = await fetch(`${URL}/indicacoes`);
            setIndicacoes(await res.json());
        } catch (err) {
            mostrarAlerta("Erro ao salvar. Tente novamente.", "erro");
        }
    };

    // 🔹 Deletar
    const handleDelete = async (id) => {
        // Alerta de confirmação personalizado
        if (!window.confirm("Tem certeza que deseja excluir?")) return;
        try {
            await fetch(`${URL}/indicacoes/${id}`, { method: "DELETE" });
            setIndicacoes(indicacoes.filter(i => i.id !== id));
            mostrarAlerta("Indicação apagada com sucesso!", "aviso");
        } catch (err) {
            mostrarAlerta("Erro ao apagar.", "erro");
        }
    };

    // 🔹 Editar (preenche o form)
    const handleEdit = (item) => {
        setIndicacao(item.indicacao);
        setVideo(item.video);
        setEditandoId(item.id);
        mostrarAlerta("Editando indicação selecionada", "aviso");
    };

    return (
        <div className="indicadores-container">
            <h2>Indicadores</h2>

            {/* 🔹 Alerta personalizado */}
            {mensagem && (
                <div className={`alerta alerta-${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="indicadores-form">
                <input
                    type="text"
                    placeholder="Nome da indicação"
                    value={indicacao}
                    onChange={(e) => setIndicacao(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Código do vídeo (iframe)"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    required
                />
                <button type="submit">
                    {editandoId ? "Atualizar" : "Adicionar"}
                </button>
            </form>

            {/* Lista */}
            <ul className="indicadores-lista">
                {indicacoes.map((item) => (
                    <li key={item.id}>
                        <strong>{item.indicacao}</strong>
                        <div
                            className="video-preview"
                            dangerouslySetInnerHTML={{ __html: item.video }}
                        />
                        <div className="indicadores-acoes">
                            <button onClick={() => handleEdit(item)}>✏️ Editar</button>
                            <button onClick={() => handleDelete(item.id)}>🗑️ Apagar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
