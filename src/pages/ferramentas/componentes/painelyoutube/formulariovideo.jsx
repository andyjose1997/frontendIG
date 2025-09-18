import { useState } from "react";
import { URL } from "../../../../config";

export default function FormularioVideo({ mostrarAlerta, atualizarLista }) {
    const [form, setForm] = useState({
        curso_id: "",
        titulo: "",
        codigo_iframe: "",
        tempo: "", // 🔹 campo visível para usuário (mm:ss ou hh:mm:ss)
    });
    const [confirmacao, setConfirmacao] = useState({ mostrar: false, cursoNome: "", onConfirm: null });

    const validarCurso = async () => {
        try {
            const res = await fetch(`${URL}/youtube/cursos`);
            if (!res.ok) return null;
            const cursos = await res.json();
            return cursos.find(c => c.id === Number(form.curso_id)) || null;
        } catch {
            return null;
        }
    };

    // 🔹 Converte texto (mm:ss ou hh:mm:ss) para segundos
    const converterParaSegundos = (valor) => {
        const partes = valor.split(":").map(Number);
        if (partes.length === 2) {
            const [min, sec] = partes;
            return min * 60 + sec;
        } else if (partes.length === 3) {
            const [h, min, sec] = partes;
            return h * 3600 + min * 60 + sec;
        }
        return 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const curso = await validarCurso();
        if (!curso) {
            mostrarAlerta("❌ ID do curso inválido!", "erro");
            return;
        }

        const tempoSegundos = converterParaSegundos(form.tempo);

        setConfirmacao({
            mostrar: true,
            cursoNome: curso.titulo,
            onConfirm: async () => {
                const res = await fetch(`${URL}/youtube/videos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...form, tempo: tempoSegundos }), // 🔹 manda segundos pro backend
                });

                if (res.ok) {
                    mostrarAlerta("✅ Vídeo cadastrado!", "sucesso");
                    setForm({ curso_id: "", titulo: "", codigo_iframe: "", tempo: "" }); // reset
                    atualizarLista();
                } else {
                    mostrarAlerta("❌ Erro ao cadastrar vídeo.", "erro");
                }
                setConfirmacao({ mostrar: false, cursoNome: "", onConfirm: null });
            },
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3>Novo Vídeo</h3>
                <input
                    type="number"
                    placeholder="ID do Curso"
                    value={form.curso_id}
                    onChange={(e) => setForm({ ...form, curso_id: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Título"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Código embed do YouTube"
                    value={form.codigo_iframe}
                    onChange={(e) => setForm({ ...form, codigo_iframe: e.target.value })}
                    required
                />

                {/* 🔹 Campo de tempo do vídeo */}
                <input
                    type="text"
                    placeholder="Tempo do vídeo (mm:ss ou hh:mm:ss)"
                    value={form.tempo}
                    onChange={(e) => setForm({ ...form, tempo: e.target.value })}
                    required
                />

                <button type="submit">Salvar Vídeo</button>
            </form>

            {confirmacao.mostrar && (
                <div className="youtubemodal-overlay">
                    <div className="youtubemodal-confirmacao">
                        <p>
                            Deseja realmente salvar este vídeo para o curso{" "}
                            <strong>{confirmacao.cursoNome}</strong>?
                        </p>
                        <div className="botoes">
                            <button className="btn-confirmar" onClick={confirmacao.onConfirm}>
                                Confirmar
                            </button>
                            <button
                                className="btn-cancelar"
                                onClick={() => setConfirmacao({ mostrar: false, cursoNome: "", onConfirm: null })}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
