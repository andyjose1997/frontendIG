// feed-completo/Postar.jsx
import React, { useState } from 'react';

export default function Postar({ novaPostagem, setNovaPostagem, criarPostagem }) {
    const [abrirModal, setAbrirModal] = useState(false);

    const handleAbrirModal = () => setAbrirModal(true);
    const handleFecharModal = () => setAbrirModal(false);

    return (
        <div className="nova-postagem-box">
            <input
                type="text"
                className="nova-postagem-input"
                placeholder="Escreva uma nova postagem..."
                value={novaPostagem}
                onFocus={handleAbrirModal} // 🔹 abre modal ao clicar
                readOnly // 🔹 só abre o modal, não escreve direto aqui
            />

            {abrirModal && (
                <div className="modalPost-postagem-overlay">
                    <div className="modalPost-postagem-conteudo">
                        <h2 className="modalPost-postagemm-titulo">Criar nova postagem</h2>
                        <textarea
                            className="modalPost-postagem-textarea"
                            placeholder="Escreva sua mensagem..."
                            value={novaPostagem}
                            onChange={(e) => setNovaPostagem(e.target.value)}
                            rows={14}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // bloqueia só a quebra normal
                                    criarPostagem();
                                    handleFecharModal();
                                }
                                // Shift+Enter vai deixar o navegador inserir \n normalmente ✅
                            }}
                        />

                        <div className="modalPost-postagem-botoes">
                            <button className="modalPost-postagem-cancelar" onClick={handleFecharModal}>
                                Cancelar
                            </button>
                            <button
                                className="modalPost-postagem-confirmar"
                                onClick={() => {
                                    criarPostagem();
                                    handleFecharModal();
                                }}
                            >
                                Postar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
