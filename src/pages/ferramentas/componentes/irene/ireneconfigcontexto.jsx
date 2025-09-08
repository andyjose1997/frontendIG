import { useState, useEffect } from "react";
import { URL } from "../../../../config";
import "./ireneconfigcontexto.css";
import IreneContextoFormulario from "./irenecontextoformulario";

export default function IreneConfigContexto() {
    const [contextos, setContextos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editarDados, setEditarDados] = useState(null);
    const [confirmarDelete, setConfirmarDelete] = useState(null);
    const [mostrarAjuda, setMostrarAjuda] = useState(false); // 🔹 controla o modal de ajuda

    const carregarContextos = async () => {
        try {
            const res = await fetch(`${URL}/irene_admin/contexto`);
            setContextos(await res.json());
        } catch (err) {
            console.error("Erro ao carregar contextos:", err);
        }
    };

    useEffect(() => {
        carregarContextos();
    }, []);

    const abrirFormulario = (modo, item = null) => {
        setEditarDados(item ? { ...item } : null);
        setMostrarFormulario(true);
    };

    const handleDelete = async (id_chave) => {
        if (confirmarDelete === id_chave) {
            await fetch(`${URL}/irene_admin/contexto/${id_chave}`, {
                method: "DELETE",
            });
            carregarContextos();
            setConfirmarDelete(null);
        } else {
            setConfirmarDelete(id_chave); // só o id clicado fica em "confirmar"
            setTimeout(() => setConfirmarDelete(null), 2000);
        }
    };


    return (
        <div style={{ width: "100%" }} className="contexto-config">
            {/* 🔹 Botão de ajuda */}
            <button className="contexto-ajuda" onClick={() => setMostrarAjuda(true)}>
                ❓ O que é Palavra-chave, Gatilho e Resposta?
            </button>

            <h2 className="contexto-titulo">🧠 Contextos de Conversa</h2>
            <button className="contexto-novo" onClick={() => abrirFormulario("criar")}>
                ➕ Novo Contexto
            </button>

            <ul className="contexto-lista">
                {contextos.map((ctx) => (
                    <li key={ctx.id} className="contexto-item">
                        <span className="contexto-texto">
                            <strong>🔑 {ctx.chave}</strong> | ⚡ {ctx.gatilho} | 💬 {ctx.resposta}
                        </span>
                        <div className="contexto-acoes">
                            <button
                                className="contexto-editar"
                                onClick={() => abrirFormulario("editar", ctx)}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                className="contexto-apagar"
                                onClick={() => handleDelete(ctx.id_chave)}
                            >
                                {confirmarDelete === ctx.id_chave ? "❗ Confirmar" : "🗑️ Apagar"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {mostrarFormulario && (
                <IreneContextoFormulario
                    dados={editarDados}
                    onClose={() => setMostrarFormulario(false)}
                    onSaved={() => {
                        setMostrarFormulario(false);
                        carregarContextos();
                    }}
                />
            )}

            {/* 🔹 Modal de ajuda */}
            {mostrarAjuda && (
                <div className="contexto-overlay">
                    <div className="contexto-modal">
                        <h3 className="contexto-modal-titulo">ℹ️ Como funcionam os Contextos?</h3>
                        <p className="contexto-modal-paragrafo">
                            <strong>🔑 Palavra-chave</strong>: tema principal do contexto.<br />
                            Exemplo: <em>"senha"</em>, <em>"cadastro"</em>, <em>"curso"</em>.
                        </p>
                        <p className="contexto-modal-paragrafo">
                            <strong>⚡ Gatilho</strong>: situação ou pergunta específica dentro da palavra-chave.<br />
                            Exemplo (para <em>"senha"</em>): <em>"mudar"</em>, <em>"esqueci"</em>, <em>"acessar"</em>.
                        </p>
                        <p className="contexto-modal-paragrafo">
                            <strong>💬 Resposta</strong>: o que a Irene vai responder quando detectar o gatilho.<br />
                            Exemplo (para gatilho <em>"mudar"</em>): <br />
                            - "Você pode alterar sua senha em Perfil → Configurações"<br />
                            - "A troca de senha também pode ser feita clicando em 'Esqueci minha senha'"
                        </p>

                        <h4 className="contexto-exemplo-titulo">📌 Exemplo de Conversa 1 (Senha)</h4>
                        <div className="contexto-exemplo">
                            <p><strong>Usuário:</strong> Oi, como faço para <em>mudar minha senha</em>?</p>
                            <p><strong>Irene:</strong> Você pode alterar sua senha em <em>Perfil → Configurações</em>.</p>
                            <p><strong>Usuário:</strong> Ah, e se eu esquecer a senha?</p>
                            <p><strong>Irene:</strong> A troca de senha também pode ser feita clicando em <em>“Esqueci minha senha”</em> na tela de login.</p>
                        </div>

                        <h4 className="contexto-exemplo-titulo">📌 Exemplo de Conversa 2 (Curso)</h4>
                        <div className="contexto-exemplo">
                            <p><strong>Usuário:</strong> Onde eu acesso os <em>cursos</em>?</p>
                            <p><strong>Irene:</strong> Os cursos ficam disponíveis no menu <em>Aprendizagem</em>.</p>
                            <p><strong>Usuário:</strong> Preciso pagar para fazer um curso?</p>
                            <p><strong>Irene:</strong> Alguns cursos são gratuitos e outros são pagos, você pode ver isso na tela de detalhes do curso.</p>
                        </div>

                        <div className="contexto-modal-acoes">
                            <button className="contexto-modal-fechar" onClick={() => setMostrarAjuda(false)}>
                                ✅ Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}
