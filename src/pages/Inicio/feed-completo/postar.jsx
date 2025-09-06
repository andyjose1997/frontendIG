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
                readOnly
            />

            {abrirModal && (
                <div className="modalPost-overlay">
                    <div className="modalPost-conteudo">
                        <h2 className="modalPost-titulo">Criar nova postagem</h2>
                        <textarea
                            className="modalPost-textarea"
                            placeholder="Escreva sua mensagem..."
                            value={novaPostagem}
                            onChange={(e) => setNovaPostagem(e.target.value)}
                            rows={14}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    criarPostagem();
                                    handleFecharModal();
                                }
                            }}
                        />

                        <div className="modalPost-botoes">
                            <button
                                className="modalPost-cancelar"
                                onClick={handleFecharModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="modalPost-confirmar"
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
