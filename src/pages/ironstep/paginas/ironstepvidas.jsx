import React, { useState } from "react";
import "./ironstepvidas.css";
import { URL } from "../../../config"; // ajuste o caminho do seu config.js

export default function IronStepVidas({ vidas = 0 }) {
    const [showModal, setShowModal] = useState(false);

    // Garantir que vidas não seja negativo
    const vidasAtuais = Math.max(0, vidas);

    // 🔹 Função genérica de pagamento
    const iniciarPagamento = async (plano) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Você precisa estar logado para assinar.");
                return;
            }

            const res = await fetch(`${URL}/pagamento/criar-preferencia/${plano}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                throw new Error("Erro ao criar pagamento.");
            }

            const data = await res.json();
            if (data.init_point) {
                window.open(data.init_point, "_blank"); // abre checkout em nova aba
            } else {
                alert("Não foi possível iniciar o pagamento.");
            }
        } catch (err) {
            console.error("Erro no pagamento:", err);
            alert("Erro ao iniciar pagamento. Tente novamente.");
        }
    };

    return (
        <div className="vidas-wrapper">
            {/* 🔹 Mostrar as vidas */}
            {vidasAtuais >= 4 ? (
                <div className="vidas-container" data-tooltip="Vidas infinitas">
                    <div className="vida-infinito">
                        <span>👑</span>
                        <span>👑</span>
                        <span>👑</span>
                    </div>
                </div>
            ) : (
                <div className="vidas-container" data-tooltip="São as vidas">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`vida-circle ${i < vidasAtuais ? "metal" : "empty"}`}
                        />
                    ))}
                </div>
            )}

            {/* 🔹 Botão para abrir modal */}
            {vidasAtuais < 4 && (
                <>
                    {/* Versão normal (desktop) */}
                    <button className="premium-btn premium-desktop" onClick={() => setShowModal(true)}>
                        💎 Seja Premium
                    </button>

                    {/* Versão só emoji (mobile) */}
                    <button className="premium-btn premium-mobile" onClick={() => setShowModal(true)}>
                        💎
                    </button>
                </>
            )}




            {/* 🔹 Modal de preços */}
            {showModal && (
                <div className="modal-ironstep-overlay">
                    <div className="modal-content premium-modal">
                        <h2 className="modal-title">✨ Torne-se Premium ✨</h2>
                        <p className="modal-subtitle">
                            Desbloqueie <strong>vidas infinitas</strong> 👑 e jogue sem propagandas 🚫
                        </p>

                        <div className="precos-container">
                            <div className="preco-card mensal">


                                <h3>Plano Mensal</h3>
                                <p className="preco">R$ 8,00</p>
                                <ul>
                                    <li>✔ Vidas infinitas por 1 mês</li>
                                    <li>✔ Zero propagandas</li>
                                </ul>
                                <button onClick={() => iniciarPagamento("mensal")} className="btn-assinar">
                                    Assinar Mensal
                                </button>
                            </div>

                            <div className="preco-card anual">
                                <h3>Plano Anual</h3>
                                <p className="preco">R$ 68,00</p>
                                <small>Economize R$ 28,00 comparado ao mensal</small>
                                <ul>
                                    <li>✔ Vidas infinitas por 12 meses</li>
                                    <li>✔ Zero propagandas</li>
                                </ul>
                                <button onClick={() => iniciarPagamento("anual")} className="btn-assinar">
                                    Assinar Anual
                                </button>
                            </div>
                        </div>

                        <button className="fechar-irontep-btn" onClick={() => setShowModal(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
