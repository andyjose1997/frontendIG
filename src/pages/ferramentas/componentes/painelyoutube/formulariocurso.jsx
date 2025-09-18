import { useState } from "react";
import { URL } from "../../../../config";

export default function FormularioCurso({ mostrarAlerta, atualizarLista }) {
    const [form, setForm] = useState({ titulo: "", autor: "", descricao: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${URL}/youtube/cursos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            mostrarAlerta("✅ Curso cadastrado com sucesso!", "sucesso");
            setForm({ titulo: "", autor: "", descricao: "" });
            atualizarLista();
        } else {
            mostrarAlerta("❌ Erro ao cadastrar curso.", "erro");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Novo Curso</h3>
            <input
                type="text"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Autor"
                value={form.autor}
                onChange={(e) => setForm({ ...form, autor: e.target.value })}
            />
            <textarea
                placeholder="Descrição"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <button type="submit">Salvar Curso</button>
        </form>
    );
}
