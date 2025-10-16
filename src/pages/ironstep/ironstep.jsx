import React, { useEffect, useState } from "react";
import IronStepHeader from "./paginas/ironstepheader";
import IronStepConteudo from "./paginas/ironstepconteudo";
import IronStepVidas from "./paginas/ironstepvidas";
import { URL } from "../../config";
import "./ironstep.css";  // 🔹 novo CSS

export default function IronStep() {
    const [usuarios, setUsuarios] = useState(null);
    const [vidas, setVidas] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 🔹 Função para carregar perfil e vidas
        const carregarDados = () => {
            Promise.all([
                fetch(`${URL}/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json()),

                fetch(`${URL}/vidas`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
            ])
                .then(([perfil, vidasData]) => {
                    console.log("DEBUG PERFIL:", perfil);
                    console.log("DEBUG VIDAS:", vidasData);

                    setUsuarios(perfil);
                    setVidas(vidasData.vidas ?? 0);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erro ao carregar dados:", err);
                    setLoading(false);
                });
        };

        // 🔹 Carrega de imediato
        carregarDados();

        // 🔹 Recarrega a cada 5 segundos
        const interval = setInterval(carregarDados, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main style={{ padding: "2rem" }}>
            {loading ? (
                <div className="loading-spinner">Carregando...</div>
            ) : (
                <div className="ironstep-conteudo fade-in">
                    {/* Cabeçalho */}
                    <IronStepHeader usuarios={usuarios} />


                    {/* Conteúdo */}
                    <IronStepConteudo vidas={vidas} />
                </div>
            )}
        </main>
    );
}
