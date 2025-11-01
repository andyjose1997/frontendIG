// 📂 src/pages/annetstudios/modais/ModalServicos.jsx
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import "./modalservicos.css";
import { URL } from "../../../../config";

export default function ModalServicos({ onFechar }) {
    const [servicos, setServicos] = useState([]);
    const [fotos, setFotos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // 🔹 Função para converter minutos em formato hora
    const formatarTempo = (minutos) => {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        return `${h}h${m > 0 ? m : ""}`;
    };

    useEffect(() => {
        const carregar = async () => {
            try {
                const [resServicos, resFotos] = await Promise.all([
                    fetch(`${URL}/annett/servicos/listar`),
                    fetch(`${URL}/annett/servicos/fotos/listar`), // ✅ CERTO
                ]);

                const dadosServicos = await resServicos.json();
                const dadosFotos = await resFotos.json();

                setServicos(dadosServicos);
                setFotos(dadosFotos);
            } catch (err) {
                console.error("Erro ao carregar serviços/fotos:", err);
            } finally {
                setCarregando(false);
            }
        };

        carregar();
    }, []);

    if (carregando) {
        return ReactDOM.createPortal(
            <div className="modalannet-overlay">
                <div className="modalannet-conteudo">
                    <p>Carregando serviços...</p>
                </div>
            </div>,
            document.body
        );
    }

    return ReactDOM.createPortal(
        <div className="modalannet-overlay" onClick={onFechar}>
            <div
                className="modalannet-conteudo"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>💼 Serviços</h2>

                <div className="modalannet-lista-servicos">
                    {servicos.map((servico) => (
                        <div key={servico.id} className="modalannet-servico">
                            <h3>{servico.servico}</h3>
                            <p className="modalannet-preco">
                                💰 {Number(servico.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                            <p className="modalannet-tempo">
                                ⏰ {formatarTempo(servico.tempo_minutos)}
                            </p>

                            {/* 🔹 Fotos correspondentes */}
                            <div className="modalannet-fotos">
                                {fotos
                                    .filter((f) => f.id_servico === servico.id)
                                    .map((foto) => (
                                        <img
                                            key={foto.id}
                                            src={foto.foto}
                                            alt={servico.servico}
                                            className="modalannet-foto"
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="modalannet-fechar" onClick={onFechar}>
                    Fechar
                </button>
            </div>
        </div>,
        document.body
    );
}
