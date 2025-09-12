import { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./vendas.css";

export default function Vendas() {
    const [vendas, setVendas] = useState([]);

    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await fetch(`${URL}/vendas/lista`);
                const data = await res.json();
                setVendas(data);
            } catch (err) {
                console.error("Erro ao carregar vendas:", err);
            }
        };
        carregar();
    }, []);

    return (
        <div className="vendas-container">
            <h1>Vendas</h1>

            {vendas.map((venda, index) => (
                <div key={index} className="venda-card">
                    <h2>{venda.valor} reais</h2>
                    <p className="venda-data">{venda.data}</p>

                    {/* 🔹 Vendedor */}
                    {venda.vendedor?.nome && (
                        <p>
                            <strong>Vendedor:</strong> {venda.vendedor.nome} {venda.vendedor.sobrenome}
                            {" — "} Recebeu: R$ {venda.vendedor.recebeu}
                            {" — "} 📅 {venda.data}
                        </p>
                    )}

                    {/* 🔹 Host do vendedor */}
                    {venda.host_vendedor?.nome && (
                        <p>
                            <strong>Host do vendedor:</strong> {venda.host_vendedor.nome} {venda.host_vendedor.sobrenome}
                            {" — "} Recebeu: R$ {venda.host_vendedor.recebeu}
                            {" — "} 📅 {venda.data}
                        </p>
                    )}

                    {/* 🔹 Comprador */}
                    {venda.comprador?.nome && (
                        <p>
                            <strong>Comprador:</strong> {venda.comprador.nome} {venda.comprador.sobrenome}
                            {" — "} 📅 {venda.data}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
