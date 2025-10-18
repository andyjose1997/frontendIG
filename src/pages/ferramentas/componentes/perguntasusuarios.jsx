import { useEffect, useState, useRef } from "react";
import "./perguntasusuarios.css";
import { URL } from "../../../config";
export default function PerguntasUsuarios() {
    const [faqs, setFaqs] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [formData, setFormData] = useState({ id: null, pergunta: "", resposta: "", link: "" });
    const [modoEdicao, setModoEdicao] = useState(false);

    const [busca, setBusca] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const [highlightId, setHighlightId] = useState(null);

    const [scrolled, setScrolled] = useState(false); // 🔹 controla efeito do header fixo

    const refs = useRef({});


    const carregarFaq = async () => {
        const res = await fetch(`${URL}/faq`);
        const data = await res.json();
        setFaqs(data);
    };
    // Detecta se a página foi rolada
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        carregarFaq();
    }, []);

    // 🔹 Atualiza sugestões
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

    const abrirModal = (faq = null) => {
        if (faq) {
            setFormData(faq);
            setModoEdicao(true);
        } else {
            setFormData({ id: null, pergunta: "", resposta: "", link: "" });
            setModoEdicao(false);
        }
        setModalAberto(true);
    };

    const fecharModal = () => setModalAberto(false);

    const salvarFaq = async () => {
        if (!formData.pergunta || !formData.resposta) {
            alert("Pergunta e resposta são obrigatórias!");
            return;
        }

        // 🔹 Garante que o link sempre tenha um valor
        const dados = {
            ...formData,
            link: formData.link && formData.link.trim() !== "" ? formData.link : "#",
        };


        const metodo = modoEdicao ? "PUT" : "POST";
        const url = modoEdicao
            ? `${URL}/faq/${formData.id}`
            : `${URL}/faq`;

        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            carregarFaq();
            fecharModal();
        } else {
            alert("Erro ao salvar FAQ");
        }
    };

    const apagarFaq = async () => {
        if (!formData.id) return;
        if (window.confirm("Tem certeza que deseja apagar esta pergunta?")) {
            const res = await fetch(`${URL}/faq/${formData.id}`, { method: "DELETE" });
            if (res.ok) {
                carregarFaq();
                fecharModal();
            } else {
                alert("Erro ao apagar FAQ");
            }
        }
    };

    // 🔹 Scroll e destaque
    const scrollToPergunta = (id) => {
        if (refs.current[id]) {
            refs.current[id].scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightId(id);
            setTimeout(() => setHighlightId(null), 1000);
        }
        setSugestoes([]);
        setBusca("");
    };

    return (
        <div className="faqBanco-admin">
            <div className={`faqBanco-topo-fixado ${scrolled ? "scrolled" : ""}`}>
                <h2>Gerenciar Perguntas Frequentes</h2>

                <div className="faqBanco-topo">
                    <button className="faqBanco-btn-adicionar" onClick={() => abrirModal()}>
                        ➕ Adicionar Pergunta
                    </button>

                    <div className="faqBanco-busca-container">
                        <input
                            type="text"
                            placeholder="🔍 Buscar pergunta..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="faqBanco-busca"
                        />
                        {sugestoes.length > 0 && (
                            <ul className="faqBanco-sugestoes">
                                {sugestoes.map(item => (
                                    <li key={item.id} onClick={() => scrollToPergunta(item.id)}>
                                        {item.pergunta}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <table className="faqBanco-tabela">
                <thead>
                    <tr>
                        <th>Pergunta</th>
                        <th>Resposta</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {faqs.map((faq) => (
                        <tr
                            key={faq.id}
                            ref={(el) => (refs.current[faq.id] = el)}
                            onClick={() => abrirModal(faq)}
                            className={highlightId === faq.id ? "faqBanco-highlight" : ""}
                        >
                            <td>{faq.pergunta}</td>
                            <td>{faq.resposta}</td>
                            <td>{faq.link}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalAberto && (
                <div className="faqBanco-modal-overlay" onClick={fecharModal}>
                    <div className="faqBanco-modal-form" onClick={(e) => e.stopPropagation()}>
                        <h3>{modoEdicao ? "Editar Pergunta" : "Adicionar Pergunta"}</h3>
                        <label>Pergunta:</label>
                        <input
                            type="text"
                            value={formData.pergunta}
                            required
                            onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
                        />
                        <label>Resposta:</label>
                        <textarea
                            value={formData.resposta}
                            required
                            onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
                        />
                        <input style={{ display: "none" }}
                            type="text"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />

                        {modoEdicao && (
                            <button className="faqBanco-btn-apagar" onClick={apagarFaq}>
                                🗑 Apagar
                            </button>
                        )}

                        <button className="faqBanco-btn-salvar" onClick={salvarFaq}>
                            {modoEdicao ? "Atualizar" : "Salvar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
