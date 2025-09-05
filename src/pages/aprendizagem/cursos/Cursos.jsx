// src/components/Cursos.jsx

import React, { useEffect, useState } from "react";
import PacoteDeCursosUm from "./pacotes/PacoteDeCursosUm";

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

        fetch("http://localhost:8899/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategoria(data.categoria); // 🔹 precisa que o backend /me retorne categoria
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar categoria:", err);
                setLoading(false);
            });
    }, []);

    // Enquanto carrega a categoria, pode mostrar algo temporário
    if (loading) {
        return <p>Carregando...</p>;
    }

    // Se for member ou mentor → já mostra PacoteDeCursosUm
    if (categoria === "member" || categoria === "mentor" || categoria === "founder") {
        return <PacoteDeCursosUm />;
    }

    // Se não for → mostra botão temporário
    return (
        <div>
            <button
                onClick={async () => {
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch("http://localhost:8899/ativar-member", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        const data = await response.json();
                        alert(data.mensagem || "Usuário atualizado para MEMBER!");
                        setCategoria("member"); // 🔹 muda direto para member → recarrega PacoteDeCursosUm
                    } catch (error) {
                        console.error("Erro ao atualizar:", error);
                        alert("Erro ao se tornar membro.");
                    }
                }}
                style={{
                    marginTop: "20px",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px"
                }}
            >
                Ativar Membro (TEMPORÁRIO)
            </button>
        </div>
    );
};
