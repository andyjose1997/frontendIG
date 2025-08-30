// 📂 src/componentes/FAQ.jsx
import { useEffect, useState, useRef } from "react";
import "./FAQ.css";
import { URL } from "../../config";
export default function FAQ({ onClose }) {
    const [faqs, setFaqs] = useState([]);
    const [busca, setBusca] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const [highlightId, setHighlightId] = useState(null); // 🔹 controla destaque
    const refs = useRef({});

    useEffect(() => {
        fetch(`${URL}/faq`)
            .then(res => res.json())
            .then(data => setFaqs(data))
            .catch(err => console.error("Erro ao carregar FAQ:", err));
    }, []);

    useEffect(() => {
        if (busca.trim() === "") {
            setSugestoes([]);
        } else {
            const filtradas = faqs.filter(f =>
                f.pergunta.toLowerCase().includes(busca.toLowerCase())
            );
            setSugestoes(filtradas);
        }
    }, [busca, faqs]);

    const scrollToPergunta = (id) => {
        if (refs.current[id]) {
            const modal = document.querySelector(".modalFAQ");
            const element = refs.current[id];

            const top = element.offsetTop - 20;
            modal.scrollTo({ top, behavior: "smooth" });

            setHighlightId(id);
            setTimeout(() => setHighlightId(null), 2000);
        }
        setSugestoes([]);
        setBusca("");
    };


    return (
        <div className="modalFAQ-overlay" onClick={onClose}>
            <div
                className="modalFAQ"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Perguntas Frequentes</h2>

                {/* 🔹 Buscador fixo */}
                <div className="faq-busca">
                    <input
                        type="text"
                        placeholder="🔍 Buscar pergunta..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    {sugestoes.length > 0 && (
                        <ul className="sugestoes">
                            {sugestoes.map(item => (
                                <li key={item.id} onClick={() => scrollToPergunta(item.id)}>
                                    {item.pergunta}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 🔹 Lista */}
                {faqs.length === 0 ? (
                    <p>Carregando...</p>
                ) : (
                    <ul className="faq-lista">
                        {faqs.map((item) => (
                            <li
                                key={item.id}
                                ref={(el) => (refs.current[item.id] = el)}
                                className={highlightId === item.id ? "faq-highlight" : ""}
                            >
                                <strong>{item.pergunta}</strong>
                                {item.link ? (
                                    <p>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            {item.resposta}
                                        </a>
                                    </p>
                                ) : (
                                    <p>{item.resposta}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <button className="btn-fechar" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}
