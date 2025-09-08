import { useState } from "react";
import "./ireneConversaModal.css";

// imports dos modais
import IreneFormulario from "./IreneFormulario";
import IreneContextoFormulario from "./IreneContextoFormulario";

export default function IreneConversaModal({ dados, onClose, onResponder }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarContexto, setMostrarContexto] = useState(false);

    if (!dados) return null;

    // Lista fixa com todas as colunas da tabela
    const mensagens = [
        dados.anteriorum,
        dados.anteriordois,
        dados.anteriortres,
        dados.anteriorquatro,
        dados.anteriorcinco,
        dados.anteriorseis,
        dados.pergunta, // última pergunta
    ];

    return (
        <div className="irene-modal-overlay">
            <div className="irene-modal">
                <h3>📜 Conversa Completa</h3>

                <ul className="conversa-lista">
                    {mensagens.map((msg, i) => {
                        if (!msg) return null;

                        // 🔹 Verifica de quem é a mensagem
                        let classeExtra = "";
                        if (msg.toLowerCase().startsWith("usuario")) {
                            classeExtra = "usuario-msg";
                        } else if (msg.toLowerCase().startsWith("irene")) {
                            classeExtra = "irene-msg";
                        }

                        // 🔹 Última mensagem (a que fica embaixo)
                        if (i === mensagens.length - 1) {
                            classeExtra = "ultima-msg";
                        }

                        return (
                            <li key={i} className={`mensagemContexto ${classeExtra}`}>
                                <span className="textoContexto">{msg}</span>
                            </li>
                        );
                    })}
                </ul>



                <div className="botoes">
                    <button
                        className="btn-unica"
                        onClick={() => setMostrarFormulario(true)}
                    >
                        📝 Resposta Única
                    </button>
                    <button
                        className="btn-gatilho"
                        onClick={() => setMostrarContexto(true)}
                    >
                        ⚡ Resposta Gatilho
                    </button>
                    <button className="btn-voltar" onClick={onClose}>
                        🔙 Voltar
                    </button>
                </div>
            </div>

            {/* Modal de Resposta Única */}
            {mostrarFormulario && (
                <IreneFormulario
                    modo="criar"
                    dados={{ naoRespondidaId: dados.id }}
                    onClose={() => setMostrarFormulario(false)}
                    onSaved={onResponder}
                />
            )}

            {/* Modal de Resposta Gatilho */}
            {mostrarContexto && (
                <IreneContextoFormulario
                    dados={null} // novo gatilho
                    onClose={() => setMostrarContexto(false)}
                    onSaved={onResponder}
                />
            )}
        </div>
    );
}
