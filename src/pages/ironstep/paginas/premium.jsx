// src/components/IronStep/PremiumModal.jsx
import React from "react";
import "./ironstepvidas.css";
import { URL } from "../../../config";

export default function PremiumModal({ onClose }) {
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

                <button className="fechar-irontep-btn" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
}
