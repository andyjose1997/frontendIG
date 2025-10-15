import { useEffect, useState } from "react";
import { URL } from "../../config";
import "./propaganda.css";

export default function PropagandaInterna({ onVoltar }) {
    const [conteudos, setConteudos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [quantidadeVisivel, setQuantidadeVisivel] = useState(10);

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

        // 🔹 Primeira carga
        carregarConteudos();

        // 🔹 Conecta ao WebSocket para atualizações automáticas
        const socket = new WebSocket(`${URL.replace("http", "ws")}/ws/propagandas`);

        socket.onopen = () => {
            console.log("🔗 Conectado ao servidor de atualizações de propagandas");
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.acao === "atualizar") {
                console.log("📢 Atualização recebida — recarregando lista...");
                carregarConteudos(); // 🔁 Atualiza automaticamente
            }
        };

        socket.onerror = (err) => {
            console.error("❌ Erro no WebSocket:", err);
        };

        socket.onclose = () => {
            console.log("🔌 Conexão WebSocket encerrada");
        };

        // 🔹 Fecha conexão ao sair da página
        return () => socket.close();
    }, []);



    // 🔹 Filtrar por produto
    const conteudosFiltrados = conteudos.filter((item) =>
        item.produto.toLowerCase().includes(filtro.toLowerCase())
    );

    const conteudosVisiveis = conteudosFiltrados.slice(0, quantidadeVisivel);

    return (
        <div className="propaganda-interna">
            <button className="btn-vollltar" onClick={onVoltar}>
                ⬅ Voltar
            </button>

            <h2>📢 Ofertas nas plataformas</h2>
            <p className="descricao">
                Aqui te mostramos as melhores ofertas do mercado
            </p>

            <input
                type="text"
                placeholder="🔍 Filtrar por produto..."
                className="propaganda-filtro"
                value={filtro}
                onChange={(e) => {
                    setFiltro(e.target.value);
                    setQuantidadeVisivel(10);
                }}
            />

            {loading ? (
                <p>Carregando...</p>
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
                                {/* 🔹 IMAGEM */}
                                <div>
                                    <img
                                        src={item.imagem_url}
                                        alt={item.produto}
                                        className="propaganda-img"
                                    />

                                    {/* 💰 PREÇO ABAIXO DA IMAGEM */}
                                    <p className="preco-info">
                                        <strong>De:</strong>{" "}
                                        <span
                                            style={{
                                                textDecoration: "line-through",
                                                color: "#ff4d4d",
                                            }}
                                        >
                                            R$ {item.preco_de ? Number(item.preco_de).toFixed(2) : "0.00"}
                                        </span>
                                        &nbsp;&nbsp;
                                        <strong><br /> Por:</strong>{" "}
                                        <span
                                            style={{
                                                color: "#4dff88",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            R$ {item.preco_por ? Number(item.preco_por).toFixed(2) : "0.00"}
                                        </span>
                                    </p>
                                </div>


                                {/* 🔹 INFORMAÇÕES */}
                                <div className="propaganda-info">
                                    <a
                                        href={item.link || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <h3>{item.produto}</h3>
                                    </a>
                                    <p>{item.descricao || "Sem descrição."}</p>
                                    <p style={{ display: "none" }} ><strong>{item.dias}</strong> dias</p>
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
