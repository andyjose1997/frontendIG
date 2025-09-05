import { useState } from "react";
import "./curriculo.css";
import { URL } from "../../../config"; // ✅ mantém como no seu projeto

export default function FormularioCurriculo({ isVisible, toggleVisibility }) {
    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
        cargo: "",
        endereco: "",
        telefone: "",
        email: "",
        objetivo: "",
        nome_escola: "",
        cidade: "",
        estado: "",
        resumo_formacao: "",
        datas_experiencia_1: "",
        cargo_experiencia_1: "",
        empresa_experiencia_1: "",
        datas_experiencia_2: "",
        cargo_experiencia_2: "",
        empresa_experiencia_2: "",
        datas_experiencia_3: "",
        cargo_experiencia_3: "",
        empresa_experiencia_3: "",
        resumo_experiencia: "",
        habilidade_1: "",
        habilidade_2: "",
        habilidade_3: "",
        habilidade_4: "",
        habilidade_5: "",
        comunicacao: "",
        lideranca: "",
        referencias: "",
    });

    const formatarTexto = (texto) => {
        if (!texto) return "";
        let novo = texto.toLowerCase();
        novo = novo.charAt(0).toUpperCase() + novo.slice(1);
        return novo.replace(/([.!?]\s*)([a-zà-ú])/g, (m, sep, letra) => sep + letra.toUpperCase());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const novoValor = name === "email" ? value : formatarTexto(value);
        setForm({ ...form, [name]: novoValor });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const response = await fetch(`${URL}/curriculos/gerar`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Erro ao gerar currículo");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `curriculo_${form.nome}_${form.sobrenome}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erro:", err);
            alert("❌ Erro ao gerar currículo");
        }
    };

    return (
        <div className={`form-curriculo-container ${isVisible ? "active" : ""}`}>
            <div className="form-curriculo">
                <button className="close-btn" onClick={toggleVisibility}>X</button>
                <form className="form-curriculo-form" onSubmit={handleSubmit}>
                    <h3>Dados Pessoais</h3>
                    <input type="text" placeholder="Nome" name="nome" value={form.nome} onChange={handleChange} required maxLength={30} />
                    <input type="text" placeholder="Sobrenome" name="sobrenome" value={form.sobrenome} onChange={handleChange} required maxLength={30} />
                    <input type="text" placeholder="Cargo desejado" name="cargo" value={form.cargo} onChange={handleChange} required maxLength={40} />
                    <input type="text" placeholder="Endereço" name="endereco" value={form.endereco} onChange={handleChange} maxLength={80} />
                    <input type="text" placeholder="Telefone" name="telefone" value={form.telefone} onChange={handleChange} maxLength={20} />
                    <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} maxLength={60} />

                    <h3>Objetivo</h3>
                    <textarea placeholder="Objetivo profissional" name="objetivo" value={form.objetivo} onChange={handleChange} maxLength={300} />

                    <h3>Formação</h3>
                    <input type="text" placeholder="Nome da escola" name="nome_escola" value={form.nome_escola} onChange={handleChange} maxLength={60} />
                    <input type="text" placeholder="Cidade" name="cidade" value={form.cidade} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Estado" name="estado" value={form.estado} onChange={handleChange} maxLength={20} />
                    <textarea placeholder="Resumo da formação" name="resumo_formacao" value={form.resumo_formacao} onChange={handleChange} maxLength={400} />

                    <h3>Experiências</h3>
                    <input type="text" placeholder="Datas (experiência 1)" name="datas_experiencia_1" value={form.datas_experiencia_1} onChange={handleChange} maxLength={30} />
                    <input type="text" placeholder="Cargo (experiência 1)" name="cargo_experiencia_1" value={form.cargo_experiencia_1} onChange={handleChange} maxLength={50} />
                    <input type="text" placeholder="Empresa (experiência 1)" name="empresa_experiencia_1" value={form.empresa_experiencia_1} onChange={handleChange} maxLength={60} />

                    <input type="text" placeholder="Datas (experiência 2)" name="datas_experiencia_2" value={form.datas_experiencia_2} onChange={handleChange} maxLength={30} />
                    <input type="text" placeholder="Cargo (experiência 2)" name="cargo_experiencia_2" value={form.cargo_experiencia_2} onChange={handleChange} maxLength={50} />
                    <input type="text" placeholder="Empresa (experiência 2)" name="empresa_experiencia_2" value={form.empresa_experiencia_2} onChange={handleChange} maxLength={60} />

                    <input type="text" placeholder="Datas (experiência 3)" name="datas_experiencia_3" value={form.datas_experiencia_3} onChange={handleChange} maxLength={30} />
                    <input type="text" placeholder="Cargo (experiência 3)" name="cargo_experiencia_3" value={form.cargo_experiencia_3} onChange={handleChange} maxLength={50} />
                    <input type="text" placeholder="Empresa (experiência 3)" name="empresa_experiencia_3" value={form.empresa_experiencia_3} onChange={handleChange} maxLength={60} />

                    <textarea placeholder="Resumo geral das experiências" name="resumo_experiencia" value={form.resumo_experiencia} onChange={handleChange} maxLength={500} />

                    <h3>Habilidades</h3>
                    <input type="text" placeholder="Habilidade 1" name="habilidade_1" value={form.habilidade_1} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 2" name="habilidade_2" value={form.habilidade_2} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 3" name="habilidade_3" value={form.habilidade_3} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 4" name="habilidade_4" value={form.habilidade_4} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 5" name="habilidade_5" value={form.habilidade_5} onChange={handleChange} maxLength={40} />

                    <h3>Comunicação</h3>
                    <textarea placeholder="Resumo de comunicação" name="comunicacao" value={form.comunicacao} onChange={handleChange} maxLength={300} />

                    <h3>Liderança</h3>
                    <textarea placeholder="Resumo de liderança" name="lideranca" value={form.lideranca} onChange={handleChange} maxLength={300} rows={4} />

                    <h3>Referências</h3>
                    <textarea placeholder="Referências" name="referencias" value={form.referencias} onChange={handleChange} maxLength={300} />

                    <button type="submit" style={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#2ecc71",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease, transform 0.3s ease",
                    }}>
                        Gerar Currículo
                    </button>
                </form>
            </div>

        </div>
    );
}
