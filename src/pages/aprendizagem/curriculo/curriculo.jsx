import { useState } from "react";
import "./curriculo.css";
import { URL } from "../../../config";

export default function FormularioCurriculo({ isVisible, toggleVisibility }) {
    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
        destinario: "",
        cargo: "",
        endereco: "",
        telefone: "",
        email: "",
        datas_experiencia_1: "",
        cargo_experiencia_1: "",
        empresa_esperiencia_1: "",
        habilidade_1: "",
        habilidade_2: "",
        habilidade_3: "",
        habilidade_4: "",
        habilidade_5: "",
        nome_escola: "",
        cidade: "",
        estado: "",
        resumo_formacao: ""
    });

    const formatarTexto = (texto) => {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "telefone") {
            // remove tudo que não for número
            const numeros = value.replace(/\D/g, "").slice(0, 11);

            // aplica máscara (XX) XXXXX-XXXX
            let formatado = numeros;
            if (numeros.length > 2) {
                formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}`;
                if (numeros.length > 7) {
                    formatado += `-${numeros.slice(7, 11)}`;
                }
            }

            setForm({ ...form, [name]: formatado });
            return;
        }

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
                <h2>Gerador de curriculo para uma empresa especifica ainda precisa fazer seu curriculo completo</h2>
                <form className="form-curriculo-form" onSubmit={handleSubmit}>
                    <h3>Dados Pessoais</h3>
                    <input type="text" placeholder="Nome" name="nome" value={form.nome} onChange={handleChange} required maxLength={30} />
                    <input type="text" placeholder="Sobrenome" name="sobrenome" value={form.sobrenome} onChange={handleChange} required maxLength={30} />
                    <input type="text" placeholder="Destinatário (Ex: Gerente de RH)" name="destinario" value={form.destinario} onChange={handleChange} required maxLength={60} />
                    <input type="text" placeholder="Cargo desejado" name="cargo" value={form.cargo} onChange={handleChange} required maxLength={40} />
                    <input type="text" placeholder="Endereço (ex. Rua Carlos Fernandes 20, mariporã)" name="endereco" value={form.endereco} onChange={handleChange} maxLength={80} />
                    <input
                        type="text"
                        placeholder="Telefone (apenas números)"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        maxLength={15}
                    />
                    <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} maxLength={60} />

                    <h3>Experiência</h3>
                    <input type="text" placeholder="Tempo (ex. 1 ano 4 meses) " name="datas_experiencia_1" value={form.datas_experiencia_1} onChange={handleChange} maxLength={30} />
                    <input type="text" placeholder="Cargo (ex: Analista de Sistemas)" name="cargo_experiencia_1" value={form.cargo_experiencia_1} onChange={handleChange} maxLength={50} />
                    <input type="text" placeholder="Empresa (ex: Tech Solutions)" name="empresa_esperiencia_1" value={form.empresa_esperiencia_1} onChange={handleChange} maxLength={60} />

                    <h3>Habilidades</h3>
                    <input type="text" placeholder="Habilidade 1" name="habilidade_1" value={form.habilidade_1} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 2" name="habilidade_2" value={form.habilidade_2} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 3" name="habilidade_3" value={form.habilidade_3} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 4 a mais destacada" name="habilidade_4" value={form.habilidade_4} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Habilidade 5 a mais destacada" name="habilidade_5" value={form.habilidade_5} onChange={handleChange} maxLength={40} />

                    <h3>Formação</h3>
                    <input type="text" placeholder="Nome da escola" name="nome_escola" value={form.nome_escola} onChange={handleChange} maxLength={60} />
                    <input type="text" placeholder="Cidade" name="cidade" value={form.cidade} onChange={handleChange} maxLength={40} />
                    <input type="text" placeholder="Estado" name="estado" value={form.estado} onChange={handleChange} maxLength={20} />
                    <textarea placeholder="Resumo da formação" name="resumo_formacao" value={form.resumo_formacao} onChange={handleChange} maxLength={400} />

                    <h3>Empresa contatada</h3>
                    <input
                        type="text"
                        placeholder="Empresa de contato (ex: Google Brasil)"
                        name="empresa_contato_1"
                        value={form.empresa_contato_1}
                        onChange={handleChange}
                        maxLength={60}
                    />

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
