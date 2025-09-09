// feed-completo/Reacoes.jsx
import React from 'react';

export default function Reacoes({
    post,
    tiposDeReacao,
    enviarReacao,
    enviarReacaoComentario,
    reacoesPorPost
}) {
    const isComentario = post?.isComentario === true;

    const handleReacao = (tipo) => {
        const acao = isComentario ? enviarReacaoComentario : enviarReacao;
        if (acao) {
            console.log("🧠 ID recebido em Reacoes.jsx:", post.id, typeof post.id);
            acao(Number(post.id), tipo);
        }
    };

    return (
        <div className="reacoes-box">
            <div className="reacoes-container">
                <button
                    className="reacoes-botao"
                    onClick={() => handleReacao("blz")}
                >
                    <img src="/reacoes/blz.png" alt="blz" className="reacoes-icone" />
                </button>

                <div className="reacoes-opcoes">
                    {tiposDeReacao.map(reacao => (
                        <button
                            key={reacao.tipo}
                            className="reacoes-botao"
                            onClick={() => handleReacao(reacao.tipo)}
                        >
                            <img
                                src={reacao.imagem}  // ✅ já vem completo
                                alt={reacao.tipo}
                                className="reacoes-icone"
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="reacoes-contagem">
                {(reacoesPorPost?.[post.id] || []).map(item => {
                    const reacao = tiposDeReacao.find(r => r.tipo === item.tipo_reacao);
                    return (
                        <span key={item.tipo_reacao} className="reacoes-item">
                            {reacao && (
                                <img
                                    src={reacao.imagem} // ✅ já vem completo
                                    alt={item.tipo_reacao}
                                    className="reacoes-icone-contagem"
                                />
                            )}
                            {item.total}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
