import { useState } from "react";
import IreneConfig from "./ireneConfig";
import IreneConfigContexto from "./IreneConfigContexto";
import "./ireneConfigCompleta.css"; // opcional para estilizar

export default function IreneConfigCompleta() {
    const [painelAtivo, setPainelAtivo] = useState("config");

    return (
        <div className="irene-completa">
            <h2>⚙️ Configurações da Irene</h2>

            <div className="botoes-irene">
                <button
                    className={painelAtivo === "config" ? "ativo" : ""}
                    onClick={() => setPainelAtivo("config")}
                >
                    FAQ e Respostas
                </button>

                <button
                    className={painelAtivo === "contexto" ? "ativo" : ""}
                    onClick={() => setPainelAtivo("contexto")}
                >
                    Contexto de Conversa
                </button>
            </div>

            <div className="conteudo-irene">
                {painelAtivo === "config" && <IreneConfig />}
                {painelAtivo === "contexto" && <IreneConfigContexto />}
            </div>
        </div>
    );
}
