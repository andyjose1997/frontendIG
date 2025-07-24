// feed-completo/Postar.jsx
import React from 'react';

export default function Postar({ novaPostagem, setNovaPostagem, criarPostagem }) {
    return (
        <div className="nova-postagem-box">
            <input
                type="text"
                className="nova-postagem-input"
                placeholder="Escreva uma nova postagem..."
                value={novaPostagem}
                onChange={(e) => setNovaPostagem(e.target.value)}
            />
            <button
                className="nova-postagem-botao"
                style={{ color: "white" }}
                onClick={criarPostagem}
            >
                Postar
            </button>
        </div>
    );
}
