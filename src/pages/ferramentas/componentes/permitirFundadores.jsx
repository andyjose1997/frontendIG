import { useEffect, useState } from "react";
import { URL } from "../../../config";

export default function PermitirFundadores() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Carregar status ao montar
    useEffect(() => {
        fetch(`${URL}/fundadores/`)
            .then(res => res.json())
            .then(data => {
                if (data.fundadores !== undefined) {
                    setStatus(data.fundadores);
                }
                setLoading(false);
            });
    }, []);

    // 🔹 Alternar status
    const toggleFundadores = async () => {
        const res = await fetch(`${URL}/fundadores/toggle`, {
            method: "POST",
        });
        const data = await res.json();
        if (data.fundadores !== undefined) {
            setStatus(data.fundadores);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div style={{ marginTop: "20px" }}>
            <button
                onClick={toggleFundadores}
                style={{
                    backgroundColor: status === 1 ? "red" : "green",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                {status === 1 ? "Não permitir fundadores" : "Permitir fundadores"}
            </button>

        </div>
    );
}
