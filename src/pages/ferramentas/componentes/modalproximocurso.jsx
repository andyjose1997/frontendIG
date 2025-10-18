import { useState, useEffect } from "react";
import { URL } from "../../../config";
import "./modalproximocurso.css";

export default function ModalProximoCurso({ onClose, onSucesso }) {
    const [curso, setCurso] = useState("");
    const [quando, setQuando] = useState("");
    const [descricao, setDescricao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [lista, setLista] = useState([]);
    const [editando, setEditando] = useState(null);

    // 🔹 Carregar lista ao abrir o modal
    useEffect(() => {
        carregarLista();
    }, []);

    const carregarLista = async () => {
        try {
            const res = await fetch(`${URL}/cursos/proximo_curso`);
            const data = await res.json();
            setLista(data);
        } catch (err) {
            console.error("Erro ao carregar lista:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { curso, quando, descricao };

            const url = editando
                ? `${URL}/cursos/proximo_curso/${editando.id}`
                : `${URL}/cursos/proximo_curso`;

            const metodo = editando ? "PUT" : "POST";

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(await res.text());

            setMensagem(editando ? "✏️ Curso atualizado!" : "✅ Curso cadastrado!");
            setCurso("");
            setQuando("");
            setDescricao("");
            setEditando(null);
            await carregarLista();
            onSucesso?.();
        } catch (err) {
            setMensagem("❌ Erro: " + err.message);
        }
    };

    const apagar = async (id) => {
        if (!confirm("Deseja realmente apagar este curso?")) return;
        try {
            const res = await fetch(`${URL}/cursos/proximo_curso/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            setMensagem("🗑️ Curso apagado!");
            await carregarLista();
        } catch (err) {
            setMensagem("❌ Erro: " + err.message);
        }
    };

    const editar = (item) => {
        setEditando(item);
        setCurso(item.curso);
        setQuando(item.quando);
        setDescricao(item.descricao);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                <h2>{editando ? "Editar Próximo Curso" : "Novo Próximo Curso"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome do curso"
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        value={quando}
                        onChange={(e) => setQuando(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    ></textarea>
                    <button type="submit">
                        {editando ? "✏️ Atualizar" : "💾 Salvar"}
                    </button>
                </form>

                {mensagem && <p className="mensagem">{mensagem}</p>}

                {/* 🔹 Lista de próximos cursos */}
                <h3 style={{ marginTop: "20px" }}>📋 Próximos Cursos</h3>
                <ul className="lista-proximos">
                    {lista.length > 0 ? (
                        lista.map((item) => (
                            <li key={item.id}>
                                <strong>{item.curso}</strong> — {item.quando}
                                <p>{item.descricao}</p>
                                <div className="acoes">
                                    <button onClick={() => editar(item)}>✏️ Editar</button>
                                    <button onClick={() => apagar(item.id)}>🗑️ Apagar</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Nenhum curso cadastrado.</p>
                    )}
                </ul>

                <button className="btn-fechar" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}
