// 📂 src/componentes/Propaganda.jsx
import { useEffect, useState } from "react";
import "./Propaganda.css";
import { URL } from "../../config";

export default function Propaganda() {
    const [propagandas, setPropagandas] = useState([]);

    useEffect(() => {
        fetch(`${URL}/propagandas`)
            .then((res) => res.json())
            .then((data) => setPropagandas(data))
            .catch((err) => console.error("Erro ao carregar propagandas:", err));
    }, []);

    return (
        <section className="propaganda-scroll-vertical">
            {propagandas.map((item) => (
                <div key={item.id} className={`propaganda-item ${item.site.toLowerCase()}`}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <h3>{item.site}</h3>
                    </a>
                    <p>{item.comentario}</p>
                </div>
            ))}
        </section>
    );
}
