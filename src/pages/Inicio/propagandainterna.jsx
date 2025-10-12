import { useEffect, useState } from "react";
import { URL } from "../../config";
import "./propaganda.css";

export default function PropagandaInterna({ onVoltar }) {
    const [conteudos, setConteudos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [quantidadeVisivel, setQuantidadeVisivel] = useState(10); // 🔹 controla quantos aparecem

    // 🔹 Buscar propagandas ativas
    useEffect(() => {
        const carregarConteudos = async () => {
            try {
                const res = await fetch(`${URL}/propagandas/conteudo_ativo`);
                if (res.ok) {
                    const data = await res.json();
                    setConteudos(data);
                } else {
                    console.error("Erro ao buscar propagandas ativas");
                }
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoading(false);
            }
        };
        carregarConteudos();
    }, []);

    // 🔹 Filtrar por produto (busca global)
    const conteudosFiltrados = conteudos.filter((item) =>
        item.produto.toLowerCase().includes(filtro.toLowerCase())
    );

    // 🔹 Mostrar apenas os primeiros X
    const conteudosVisiveis = conteudosFiltrados.slice(0, quantidadeVisivel);

    return (
        <div className="propaganda-interna">
            <button className="btn-voltar" onClick={onVoltar}>
                ⬅ Voltar
            </button>

            <h2>📢 Propaganda Interna</h2>
            <p className="descricao">
                Estas são as propagandas internas ativas no momento.
                Apenas conteúdos ainda dentro do prazo de exibição são mostrados.
            </p>

            <input
                type="text"
                placeholder="🔍 Filtrar por produto..."
                className="propaganda-filtro"
                value={filtro}
                onChange={(e) => {
                    setFiltro(e.target.value);
                    setQuantidadeVisivel(10); // 🔹 reseta para os primeiros 10 sempre que filtra
                }}
            />

            {loading ? (
                <p>Carregando propagandas...</p>
            ) : conteudosFiltrados.length === 0 ? (
                <p>Nenhuma propaganda interna ativa encontrada.</p>
            ) : (
                <>
                    <div className="propaganda-lista">
                        {conteudosVisiveis.map((item) => (
                            <div
                                key={item.id}
                                className={`propaganda-card plataforma-${item.plataforma?.toLowerCase().replace(/\s/g, '-')}`}
                            >
                                <img
                                    src={item.imagem_url}
                                    alt={item.produto}
                                    className="propaganda-img"
                                />
                                <div className="propaganda-info">
                                    <a
                                        href={item.link || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <h3>{item.produto}</h3>
                                    </a>
                                    <p>{item.descricao || "Sem descrição."}</p>
                                    <span className="dias-restantes">
                                        ⏳ {item.dias_restantes} dia
                                        {item.dias_restantes !== 1 ? "s" : ""} restante
                                        {item.dias_restantes !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🔹 Botão Ver Mais */}
                    {quantidadeVisivel < conteudosFiltrados.length && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <button
                                className="btn-ver-mais"
                                onClick={() =>
                                    setQuantidadeVisivel((prev) => prev + 10)
                                }
                            >
                                🔽 Ver mais
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
