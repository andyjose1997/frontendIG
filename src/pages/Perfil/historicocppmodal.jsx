import { useEffect, useState } from "react";
import "./saldocppmodal.css";
import { URL } from "../../config";

export default function HistoricoCPPModal({ onClose, onVoltar }) {
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${URL}/saldo_cpp/historico`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar histórico");
                return res.json();
            })
            .then(data => {
                setHistorico(data);
                setCarregando(false);
            })
            .catch(() => {
                setErro("Erro ao carregar histórico.");
                setCarregando(false);
            });
    }, []);

    return (
        <div className="saldo-modal-overlay" onClick={onClose}>
            <div className="saldo-modal" onClick={(e) => e.stopPropagation()}>
                <h2>📜 Histórico de Vendas</h2>
                <div className="legenda-historico">
                    <div className="legenda-item">
                        <span className="badge badge-amarelo"></span>
                        <span>Vendas dos seus indicados</span>
                    </div>
                    <div className="legenda-item">
                        <span className="badge badge-verde"></span>
                        <span>Suas vendas</span>
                    </div>
                </div>

                {carregando ? (
                    <p>Carregando...</p>
                ) : erro ? (
                    <p className="erro">{erro}</p>
                ) : historico.length === 0 ? (
                    <p>Nenhuma venda encontrada.</p>
                ) : (
                    <ul className="historico-lista">
                        {historico.map((item, idx) => (
                            <li
                                key={idx}
                                className={`historico-item ${item.venda_usuario_id ? "fundo-amarelo" : "fundo-verde"
                                    }`}
                            >
                                <p>
                                    <strong>Data:</strong> {item.datahora}
                                </p>

                                {item.venda_usuario_id && (
                                    <p className="venda-usuario">
                                        <strong>Venda do usuário:</strong>{" "}
                                        {item.venda_usuario_nome} {item.venda_usuario_sobrenome} ({item.venda_usuario_id})
                                    </p>
                                )}

                                <p>
                                    <strong>Comprador:</strong>{" "}
                                    {item.comprador_nome} {item.comprador_sobrenome} ({item.comprador_id})
                                </p>

                                <p>
                                    <strong>Pacote:</strong> {item.pacote}
                                </p>
                                <p>
                                    <strong>Valor da compra:</strong> R${" "}
                                    {Number(item.valor).toFixed(2)}
                                </p>
                                <p>
                                    <strong>Valor recebido:</strong> R${" "}
                                    {Number(item.valor_recebido).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="painel-botoes">
                    <button className="botao-accao" onClick={onVoltar}>
                        Voltar
                    </button>
                    <button className="botao-accao" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
