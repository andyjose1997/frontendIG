import { useEffect, useState } from "react";
import "./saldocppmodal.css";
import { URL } from "../../config";
import HistoricoCPPModal from "./historicocppmodal";

export default function SaldoCPPModal({ onClose }) {
    const [saldoAtual, setSaldoAtual] = useState(null);
    const [saldoProximaSemana, setSaldoProximaSemana] = useState(null);
    const [chavePix, setChavePix] = useState(""); // 👈 estado para chave_pix
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [mostrarHistorico, setMostrarHistorico] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // 🔹 Buscar saldos
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

        // 🔹 Buscar chave PIX do usuário
        fetch(`${URL}/saldo_cpp/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.chave_pix) {
                    setChavePix(data.chave_pix);
                }
            })
            .catch(() => {
                setChavePix("");
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

    return (
        <div className="saldo-modal-overlay" onClick={onClose}>
            <div className="saldo-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="titulo-saldo">
                    💳 Seu Saldo
                    <span className="info-tooltip">
                        <p style={{ fontSize: "2rem", margin: 0 }}>ℹ</p>
                        <span className="tooltip-text">
                            As vendas ficam disponíveis no seu dia de CPP.<br />
                            • Vendas com <strong>menos de 8 dias</strong> → liberadas no <strong>CPP seguinte</strong>.<br />
                            • Vendas com <strong>8 dias ou mais</strong> → liberadas já no <strong>próximo CPP</strong>.
                        </span>
                    </span>
                </h2>

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

                        {/* 🔹 Exibir chave PIX */}
                        {chavePix ? (
                            <p className="pix-ok">
                                <strong>Seu PIX informado é:</strong> {chavePix}
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
