// 📂 src/componentes/Propaganda.jsx
import { useEffect, useState } from "react";
import "./propaganda.css";
import { URL } from "../../config";

export default function Propaganda() {
    const [propagandas, setPropagandas] = useState([]);

    useEffect(() => {
        fetch(`${URL}/propagandas`)
            .then((res) => {
                if (!res.ok) throw new Error("Erro na resposta do servidor");
                return res.json();
            })
            .then((data) => {
                // 🔹 Garante que só entra array no estado
                if (Array.isArray(data)) {
                    setPropagandas(data);
                } else {
                    console.error("Resposta inesperada:", data);
                    setPropagandas([]);
                }
            })
            .catch((err) => console.error("Erro ao carregar propagandas:", err));
    }, []);

    return (
        <section className="propaganda-scroll-vertical">
            {Array.isArray(propagandas) &&
                propagandas.map((item) => (
                    <div
                        key={item.id}
                        className={`propaganda-item ${item.site?.toLowerCase() || ""}`}
                    >
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <h3>{item.site}</h3>
                        </a>
                        <p>{item.comentario}</p>
                    </div>
                ))}
        </section>
    );
}
