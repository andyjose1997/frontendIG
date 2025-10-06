// FormularioFaseProgramacao.jsx
import React, { useState } from "react";
import PreviewPro from "./previewpro";

export default function FormularioFaseProgramacao({ faseInicial, onSalvar, onVoltar }) {
    const [fase, setFase] = useState(faseInicial);

    const handleChange = (campo, valor) => {
        setFase({ ...fase, [campo]: valor });
    };

    return (
        <div className="pro-painel-exercicios-curso">
            <h2>✏️ Editar/Adicionar Fase de Programação</h2>
            <button className="pro-voltar-botao" onClick={onVoltar}>⬅ Voltar</button>

            <div className="pro-novo-exercicio-form">
                <label>
                    Descrição:
                    <textarea
                        value={fase.descricao}
                        placeholder="Ex: Complete a declaração do DOCTYPE"
                        onChange={(e) => handleChange("descricao", e.target.value)}
                    />
                </label>

                <label>
                    Frase:
                    <textarea
                        value={fase.frase}
                        placeholder={
                            fase.tipo === "completar_codigo" ? "<!___ html>" :
                                fase.tipo === "montar_codigo" ? "---" :
                                    fase.tipo === "identificar_erro" ? "<html><head><title>Teste</head>" :
                                        fase.tipo === "traducao_codigo" ? "<!DOCTYPE html>" : ""
                        }
                        onChange={(e) => handleChange("frase", e.target.value)}
                    />
                </label>

                <label>
                    Tipo:
                    <select
                        value={fase.tipo}
                        onChange={(e) => handleChange("tipo", e.target.value)}
                        style={{ backgroundColor: "black", color: "white" }}
                    >
                        <option style={{ color: "white" }} value="completar_codigo">Completar Código</option>
                        <option style={{ color: "white" }} value="montar_codigo">Montar Código</option>
                        <option style={{ color: "white" }} value="identificar_erro">Identificar Erro</option>
                        <option style={{ color: "white" }} value="traducao_codigo">Tradução Código</option>
                    </select>
                </label>

                <label>
                    Opções (separadas por ponto e vírgula):
                    <textarea
                        value={fase.opcoes}
                        placeholder={
                            fase.tipo === "completar_codigo" ? "DOCTYPE;doctype;HTML" :
                                fase.tipo === "montar_codigo" ? "<head>;<body>;<p>" :
                                    fase.tipo === "identificar_erro" ? "Está correto;Falta fechar tag head;Falta html" :
                                        fase.tipo === "traducao_codigo" ? "Indica o tipo de documento;Configurações do navegador" : ""
                        }
                        onChange={(e) => handleChange("opcoes", e.target.value)}
                    />
                </label>

                <label>
                    Resposta Correta:
                    <input
                        type="text"
                        value={fase.correta}
                        placeholder={
                            fase.tipo === "completar_codigo" ? "DOCTYPE" :
                                fase.tipo === "montar_codigo" ? "<head></head>" :
                                    fase.tipo === "identificar_erro" ? "Falta fechar a tag head" :
                                        fase.tipo === "traducao_codigo" ? "Indica ao navegador que o documento segue o padrão" : ""
                        }
                        onChange={(e) => handleChange("correta", e.target.value)}
                    />
                </label>

                <div className="pro-acoes-formulario">
                    <button className="pro-btn-salvar" onClick={() => onSalvar(fase)}>💾 Salvar</button>
                    <button className="pro-btn-cancelar" onClick={onVoltar}>❌ Cancelar</button>
                </div>
            </div>

            {/* Preview embaixo */}
            <h3>👀 Preview</h3>
            <PreviewPro fase={fase} />
        </div>
    );
}
