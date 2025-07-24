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
                    className="reacao-botao"
                    onClick={() => handleReacao("blz")}
                >
                    <img src="/reacoes/blz.png" alt="blz" />
                </button>

                <div className="reacoes-opcoes">
                    {tiposDeReacao.map(reacao => (
                        <button
                            key={reacao.tipo}
                            className="reacao-botao"
                            onClick={() => handleReacao(reacao.tipo)}
                        >
                            <img src={reacao.imagem} alt={reacao.tipo} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="contagem-reacoes">
                {(reacoesPorPost?.[post.id] || []).map(item => (
                    <span key={item.tipo_reacao} style={{ marginRight: "10px", fontSize: "16px" }}>
                        <img
                            src={tiposDeReacao.find(r => r.tipo === item.tipo_reacao)?.imagem}
                            alt={item.tipo_reacao}
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                marginRight: "5px",
                                verticalAlign: "middle"
                            }}
                        />
                        {item.total}
                    </span>
                ))}
            </div>
        </div>
    );
}

