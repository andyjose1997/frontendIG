import { useEffect, useState } from "react";
import "./propaganda.css";
import { URL } from "../../config";
import PropagandaInterna from "./PropagandaInterna"; // 🔹 novo componente

export default function Propaganda() {
    const [propagandas, setPropagandas] = useState([]);
    const [mostrarInterna, setMostrarInterna] = useState(false);

    useEffect(() => {
        fetch(`${URL}/propagandas`)
            .then((res) => {
                if (!res.ok) throw new Error("Erro na resposta do servidor");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) setPropagandas(data);
                else setPropagandas([]);
            })
            .catch((err) => console.error("Erro ao carregar propagandas:", err));
    }, []);

    if (mostrarInterna) {
        return <PropagandaInterna onVoltar={() => setMostrarInterna(false)} />;
    }

    return (
        <section className="propaganda-scroll-vertical">
            <h2>Recomendados</h2>
            {Array.isArray(propagandas) &&
                propagandas.map((item) => (
                    <div
                        key={item.id}
                        className={`propaganda-item ${item.site?.toLowerCase() || ""}`}
                        onClick={() => {
                            if (!item.link) setMostrarInterna(true);
                        }}
                    >
                        {item.link ? (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <h3>{item.site}</h3>
                            </a>
                        ) : (
                            <h3 className="clicavel">{item.site}</h3>
                        )}
                        <p>{item.comentario}</p>
                    </div>
                ))}
        </section>
    );
}
