import React, { useState, useEffect } from "react";
import "./ironstepvidas.css";
import { URL } from "../../../config";

export default function IronStepVidas({ vidas = 0 }) {
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 590);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const vidasAtuais = Math.max(0, vidas);

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
                window.open(data.init_point, "_blank");
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
            {vidasAtuais >= 4 ? (
                <div className="vidas-container" data-tooltip="Vidas infinitas">
                    <div className="vida-infinito">
                        {isMobile ? <span>💎</span> : <><span>💎</span><span>💎</span><span>💎</span></>}
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

            {vidasAtuais < 4 && (
                <>
                    <button
                        className="premium-btn premium-desktop"
                        onClick={() => setShowModal(true)}
                    >
                        💎 Seja Premium
                    </button>

                    <button
                        className="premium-btn premium-mobile"
                        onClick={() => setShowModal(true)}
                    >
                        💎
                    </button>
                </>
            )}

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
                                <button
                                    onClick={() => iniciarPagamento("mensal")}
                                    className="btn-assinar"
                                >
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
                                <button
                                    onClick={() => iniciarPagamento("anual")}
                                    className="btn-assinar"
                                >
                                    Assinar Anual
                                </button>
                            </div>
                        </div>

                        {/* ⚠️ Aviso Mercado Pago */}
                        {(() => {
                            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
                            const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
                            if (isMobile) {
                                return (
                                    <p className="aviso-mobile" style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#444" }}>
                                        ⚠️ <strong>Aviso:</strong> é necessário ter o aplicativo <strong>Mercado Pago</strong> instalado para concluir o pagamento.
                                        <br />
                                        O app pode pedir login antes de mostrar a tela de pagamento — isso é normal.
                                        <br />
                                        <a
                                            href={
                                                /iphone|ipad|ipod/i.test(userAgent)
                                                    ? "https://apps.apple.com/app/mercado-pago/id925436649"
                                                    : "https://play.google.com/store/apps/details?id=com.mercadopago.wallet"
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#007bff", textDecoration: "underline" }}
                                        >
                                            👉 Baixar o app Mercado Pago
                                        </a>
                                    </p>
                                );
                            }
                            return null;
                        })()}

                        <button
                            className="fechar-irontep-btn"
                            onClick={() => setShowModal(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
