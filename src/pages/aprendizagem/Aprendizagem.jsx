// src/pages/Aprendizagem.jsx
import "./Aprendizagem.css";
import Rodape from "../Rodape";
import { useState } from "react";
import { URL } from "../../config";

export default function Aprendizagem() {
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
        referencias: ""
    });

    // ✅ formata: início do texto e após . ! ? → maiúscula (exceto email)
    // Deixa primeira letra maiúscula + maiúscula depois de . ou !
    const formatarTexto = (texto) => {
        if (!texto) return "";
        // transforma tudo em minúsculo
        let novo = texto.toLowerCase();
        // primeira letra
        novo = novo.charAt(0).toUpperCase() + novo.slice(1);
        // após . ! ?
        return novo.replace(/([.!?]\s*)([a-zà-ú])/g, (m, separador, letra) => {
            return separador + letra.toUpperCase();
        });
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
            Object.keys(form).forEach((key) => {
                formData.append(key, form[key]);
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
        <div>
            <main className="aprendizagem-container">
                <h1>Área de Aprendizagem</h1>
                <p>Explore os cursos e crie seu currículo profissional.</p>

                {/* 🔹 Seção de Cursos */}
                <section className="aprendizagem-section">
                    <h2>📚 Cursos</h2>
                    <div className="cursos-grid">
                        <div className="curso-card">Curso 1</div>
                        <div className="curso-card">Curso 2</div>
                        <div className="curso-card">Curso 3</div>
                    </div>
                </section>

                {/* 🔹 Seção de Currículo */}
                <section className="aprendizagem-section">
                    <h2>📄 Gerador de Currículo</h2>
                    <form className="form-curriculo" onSubmit={handleSubmit}>
                        <h3>Dados Pessoais</h3>
                        <input type="text" placeholder="Nome" name="nome" value={form.nome} onChange={handleChange} required />
                        <input type="text" placeholder="Sobrenome" name="sobrenome" value={form.sobrenome} onChange={handleChange} required />
                        <input type="text" placeholder="Cargo desejado" name="cargo" value={form.cargo} onChange={handleChange} required />
                        <input type="text" placeholder="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />
                        <input type="text" placeholder="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
                        <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} />

                        <h3>Objetivo</h3>
                        <textarea placeholder="Objetivo profissional" name="objetivo" value={form.objetivo} onChange={handleChange} />

                        <h3>Formação</h3>
                        <input type="text" placeholder="Nome da escola" name="nome_escola" value={form.nome_escola} onChange={handleChange} />
                        <input type="text" placeholder="Cidade" name="cidade" value={form.cidade} onChange={handleChange} />
                        <input type="text" placeholder="Estado" name="estado" value={form.estado} onChange={handleChange} />
                        <textarea placeholder="Resumo da formação" name="resumo_formacao" value={form.resumo_formacao} onChange={handleChange} />

                        <h3>Experiências</h3>
                        <input type="text" placeholder="Datas (experiência 1)" name="datas_experiencia_1" value={form.datas_experiencia_1} onChange={handleChange} />
                        <input type="text" placeholder="Cargo (experiência 1)" name="cargo_experiencia_1" value={form.cargo_experiencia_1} onChange={handleChange} />
                        <input type="text" placeholder="Empresa (experiência 1)" name="empresa_experiencia_1" value={form.empresa_experiencia_1} onChange={handleChange} />

                        <input type="text" placeholder="Datas (experiência 2)" name="datas_experiencia_2" value={form.datas_experiencia_2} onChange={handleChange} />
                        <input type="text" placeholder="Cargo (experiência 2)" name="cargo_experiencia_2" value={form.cargo_experiencia_2} onChange={handleChange} />
                        <input type="text" placeholder="Empresa (experiência 2)" name="empresa_experiencia_2" value={form.empresa_experiencia_2} onChange={handleChange} />

                        <input type="text" placeholder="Datas (experiência 3)" name="datas_experiencia_3" value={form.datas_experiencia_3} onChange={handleChange} />
                        <input type="text" placeholder="Cargo (experiência 3)" name="cargo_experiencia_3" value={form.cargo_experiencia_3} onChange={handleChange} />
                        <input type="text" placeholder="Empresa (experiência 3)" name="empresa_experiencia_3" value={form.empresa_experiencia_3} onChange={handleChange} />

                        <textarea placeholder="Resumo geral das experiências" name="resumo_experiencia" value={form.resumo_experiencia} onChange={handleChange} />

                        <h3>Habilidades</h3>
                        <input type="text" placeholder="Habilidade 1" name="habilidade_1" value={form.habilidade_1} onChange={handleChange} />
                        <input type="text" placeholder="Habilidade 2" name="habilidade_2" value={form.habilidade_2} onChange={handleChange} />
                        <input type="text" placeholder="Habilidade 3" name="habilidade_3" value={form.habilidade_3} onChange={handleChange} />
                        <input type="text" placeholder="Habilidade 4" name="habilidade_4" value={form.habilidade_4} onChange={handleChange} />
                        <input type="text" placeholder="Habilidade 5" name="habilidade_5" value={form.habilidade_5} onChange={handleChange} />

                        <h3>Comunicação</h3>
                        <textarea placeholder="Resumo de comunicação" name="comunicacao" value={form.comunicacao} onChange={handleChange} />

                        <h3>Liderança</h3>
                        <textarea placeholder="Resumo de liderança" name="lideranca" value={form.lideranca} onChange={handleChange} />

                        <h3>Referências</h3>
                        <textarea placeholder="Referências" name="referencias" value={form.referencias} onChange={handleChange} />

                        <button type="submit">Gerar Currículo</button>
                    </form>
                </section>
            </main>
            <Rodape />
        </div>
    );
}
