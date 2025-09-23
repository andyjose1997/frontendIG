import { useEffect, useState } from "react";
import "./saldocppmodal.css";
import { URL } from "../../config";
import HistoricoCPPModal from "./historicocppmodal";

export default function SaldoCPPModal({ onClose }) {
    const [saldoAtual, setSaldoAtual] = useState(null);
    const [saldoProximaSemana, setSaldoProximaSemana] = useState(null);
    const [chavePix, setChavePix] = useState("");
    const [diaPagamento, setDiaPagamento] = useState(null); // 👈 novo estado
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [mostrarHistorico, setMostrarHistorico] = useState(false);
    const [mostrarInfo, setMostrarInfo] = useState(false);

    // 🔹 Mapeamento de número → dia da semana
    const diasSemana = {
        2: "Segundas-feira",
        3: "Terças-feira",
        4: "Quartas-feira",
        5: "Quintas-feira",
        6: "Sextas-feira"
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${URL}/saldo_cpp`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setSaldoAtual(data.saldo_atual);
                setSaldoProximaSemana(data.saldo_proxima_semana);
                setCarregando(false);
            })
            .catch(() => {
                setErro("Erro ao carregar saldo.");
                setCarregando(false);
            });

        fetch(`${URL}/saldo_cpp/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    if (data.chave_pix) setChavePix(data.chave_pix);
                    if (data.cpp) setDiaPagamento(data.cpp);
                }
            })
            .catch(() => {
                setChavePix("");
                setDiaPagamento(null);
            });
    }, []);

    if (mostrarHistorico) {
        return (
            <HistoricoCPPModal
                onClose={onClose}
                onVoltar={() => setMostrarHistorico(false)}
            />
        );
    }

    if (mostrarInfo) {
        return (
            <div className="saldo-modal-overlay" onClick={() => setMostrarInfo(false)}>
                <div className="saldo-modal" onClick={(e) => e.stopPropagation()}>
                    <h3>ℹ Informações do CPP</h3>
                    <p>
                        As vendas ficam disponíveis no seu dia de CPP. <br /><br />
                        • Vendas com <strong>menos de 8 dias</strong> → liberadas no <strong>CPP seguinte</strong>. <br />
                        • Vendas com <strong>8 dias ou mais</strong> → liberadas já no <strong>próximo CPP</strong>.
                    </p>
                    <button className="botao-accao" onClick={() => setMostrarInfo(false)}>
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="saldo-modal-overlay" onClick={onClose}>
            <div className="saldo-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="titulo-saldo">
                    💳 Seu Saldo
                    <button
                        onClick={() => setMostrarInfo(true)}
                        style={{ marginLeft: "10px", fontSize: "1.2rem", cursor: "pointer" }}
                    >
                        ℹ
                    </button>
                </h3>

                {carregando ? (
                    <p>Carregando...</p>
                ) : erro ? (
                    <p className="erro">{erro}</p>
                ) : (
                    <>
                        <p>
                            <strong>Saldo do seu CPP:</strong> R${" "}
                            {saldoAtual?.toFixed(2)}
                        </p>
                        <p>
                            <strong>Saldo do seu CPP (próxima semana):</strong> R${" "}
                            {saldoProximaSemana?.toFixed(2)}
                        </p>

                        {/* 🔹 Mostrar dia de pagamento */}
                        {diaPagamento && (
                            <p className="dia-pagamento">
                                <strong>Seu dia de pagamento é nas{" "}
                                    {diasSemana[diaPagamento] || `Dia ${diaPagamento}`}s</strong>
                            </p>
                        )}

                        {/* 🔹 Exibir chave PIX */}
                        {chavePix ? (
                            <p className="pix-ok">
                                <strong>Seu PIX informado é: </strong><span style={{ textDecoration: "underline" }} >{chavePix}</span>
                            </p>
                        ) : (
                            <p className="pix-alerta">
                                ⚠ Informe sua chave PIX para receber. <br />
                                Se não informar antes do seu CPP, só poderá receber na semana seguinte.
                            </p>
                        )}
                    </>
                )}

                <div className="painel-botoes">
                    <button
                        className="botao-accao"
                        onClick={() => setMostrarHistorico(true)}
                    >
                        Ver histórico
                    </button>
                    <button className="botao-accao" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
