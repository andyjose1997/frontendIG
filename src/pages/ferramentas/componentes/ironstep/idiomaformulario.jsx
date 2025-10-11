import React, { useState } from "react";
import "./exerciciosdocurso.css";
import "./idiomaformulario.css"
import PreviewFaseIdioma from "./preview"; // 🔹 importar o preview atualizado

export default function FormularioFaseIdioma({ faseInicial, onVoltar, onSalvar }) {
    const [fase, setFase] = useState(faseInicial || {
        descricao: "",
        frase: "",
        tipo: "",
        opcoes: "",
        correta: ""
    });

    const handleChange = (campo, valor) => {
        setFase(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSalvar = () => {
        // 🔹 Validação dos campos obrigatórios
        if (!fase.descricao.trim() || !fase.tipo.trim() || !fase.correta.trim()) {
            alert("Preencha todos os campos obrigatórios: descrição, tipo e resposta correta.");
            return;
        }
        if (onSalvar) onSalvar(fase);
    };

    // 🔹 Exemplos dinâmicos para cada tipo
    const exemplos = {
        completar: {
            descricao: "Complete a frase",
            frase: "Good ___!",
            opcoes: "night;afternoon",
            correta: "morning"
        },
        traducao: {
            descricao: "Traduza para inglês",
            frase: "Boa tarde",
            opcoes: "",
            correta: "Good afternoon"
        },
        multipla: {
            descricao: "Escolha a tradução correta",
            frase: "“Olá” significa...",
            opcoes: "Bye;Thanks;Night",
            correta: "Hello; hi"
        },
        montar: {
            descricao: "Monta a traduçaõ da frase correta",
            frase: "Eu gosto de aprender inglês",
            opcoes: "banana;car;house;tomorrow",
            correta: "I like to learn English"
        }
    };

    const placeholder = exemplos[fase.tipo] || {
        descricao: "Descrição da fase",
        frase: "Frase da fase",
        opcoes: "Opções (separadas por ; )",
        correta: "Resposta correta"
    };

    return (
        <div className="fas-painel-exercicios-curso">
            <h2>✏️ Editar Fase</h2>
            <button className="fas-voltar-botao" onClick={onVoltar}>⬅ Voltar</button>

            {/* 🔹 Formulário */}
            <div className="fas-novo-exercicio-form">
                <label>
                    Descrição:
                    <textarea
                        placeholder={placeholder.descricao}
                        value={fase.descricao}
                        onChange={(e) => handleChange("descricao", e.target.value)}
                        required
                    />
                </label>

                <label>
                    Frase:
                    <input
                        type="text"
                        placeholder={placeholder.frase}
                        value={fase.frase}
                        onChange={(e) => handleChange("frase", e.target.value)}
                    />
                </label>

                <label>
                    Tipo:
                    <select
                        value={fase.tipo}
                        onChange={(e) => handleChange("tipo", e.target.value)}
                        required
                    >
                        <option value="">Selecione o tipo...</option>
                        <option value="completar">Completar</option>
                        <option value="traducao">Tradução</option>
                        <option value="multipla">Múltipla escolha</option>
                        <option value="montar">Montar frase/Palavra</option>
                    </select>
                </label>

                <label>
                    Opções:
                    <textarea
                        placeholder={placeholder.opcoes}
                        value={fase.opcoes}
                        onChange={(e) => handleChange("opcoes", e.target.value)}
                    />
                </label>

                <label>
                    Resposta correta:
                    <input
                        type="text"
                        placeholder={placeholder.correta}
                        value={fase.correta}
                        onChange={(e) => handleChange("correta", e.target.value)}
                        required
                    />
                </label>

                {/* 🔹 Botões de ação */}
                <div className="fas-acoes-formulario">
                    <button className="fas-btn-salvar" onClick={handleSalvar}>💾 Salvar</button>
                    <button className="fas-btn-cancelar" onClick={onVoltar}>❌ Cancelar</button>
                </div>
            </div>

            {/* 🔹 Preview em tempo real */}
            <h3 style={{ marginTop: "2rem", color: "#58a6ff" }}>👀 Pré-visualização:</h3>
            <PreviewFaseIdioma fase={fase} />
        </div>
    );
}
