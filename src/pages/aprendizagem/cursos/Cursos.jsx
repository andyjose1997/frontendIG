// src/components/Cursos.jsx

import React, { useEffect, useState } from "react";
import PacoteDeCursosUm from "./pacotes/PacoteDeCursosUm";
import { URL } from "../../../config";

export const Cursos = () => {
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(true);

    // Buscar categoria do usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${URL}/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategoria(data.categoria);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar categoria:", err);
                setLoading(false);
            });
    }, []);

    // Enquanto carrega a categoria
    if (loading) {
        return <p>Carregando...</p>;
    }

    // Se já é membro → mostra Pacote
    if (categoria === "member" || categoria === "mentor" || categoria === "founder") {
        return <PacoteDeCursosUm />;
    }

    // Se não é membro → mostra botão de compra
    return (
        <div>
            <button
                onClick={async () => {
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(`${URL}/criar-preferencia`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        });

                        const data = await response.json();

                        if (data.init_point) {
                            // 🔹 Redireciona para o checkout MercadoPago
                            window.location.href = data.init_point;
                        } else {
                            alert("Erro ao iniciar pagamento.");
                        }
                    } catch (error) {
                        console.error("Erro:", error);
                        alert("Erro ao conectar com pagamento.");
                    }
                }}
                style={{
                    marginTop: "20px",
                    padding: "12px 20px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
                💳 Comprar Pacote de Cursos (R$60)
            </button>
        </div>
    );
};
