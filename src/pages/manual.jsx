import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./manual.css";
import { URL } from "../config";

// 🔹 API sempre com barra no final
const API_URL = `${URL}/clausulas/`;

export default function ManualDocumento() {
    const [clausulas, setClausulas] = useState([]);
    const [mostrarTopo, setMostrarTopo] = useState(false);
    const [filtro, setFiltro] = useState(""); // 🔹 estado para filtro
    const navigate = useNavigate();

    const carregar = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (Array.isArray(data)) {
                setClausulas(data);
            } else {
                setClausulas([]);
            }
        } catch (err) {
            console.error("Erro ao carregar cláusulas:", err);
            setClausulas([]);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    // 🔹 Detectar scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setMostrarTopo(true);
            } else {
                setMostrarTopo(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const irParaTopo = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🔹 Função para filtrar cláusulas
    const filtrarClausulas = (lista) => {
        if (!filtro.trim()) return lista;
        const termo = filtro.toLowerCase();

        const buscarRecursivo = (c) => {
            const corresponde =
                c.numero.toLowerCase().includes(termo) ||
                (c.texto && c.texto.toLowerCase().includes(termo));

            const filhosFiltrados = c.filhos
                ? c.filhos.map(buscarRecursivo).filter(Boolean)
                : [];

            if (corresponde || filhosFiltrados.length > 0) {
                return { ...c, filhos: filhosFiltrados };
            }
            return null;
        };

        return lista.map(buscarRecursivo).filter(Boolean);
    };

    // 🔹 Renderizar documento somente leitura
    const renderDocumento = (lista, nivel = 0) =>
        lista
            .filter((c) => c.texto && c.texto.trim() !== "")
            .map((c) => (
                <div
                    key={c.id}
                    style={{
                        marginLeft: nivel * 20,
                        background: "#fff",
                        color: "#000",
                        padding: "10px 0",
                    }}
                >
                    <strong>Cláusula {c.numero}:</strong> <br />
                    <span style={{ whiteSpace: "pre-line" }}>{c.texto}</span>
                    {c.filhos && renderDocumento(c.filhos, nivel + 1)}
                </div>
            ));

    return (
        <main className="manual-documento">
            {/* 🔙 Botão de voltar */}
            <button className="botao-retornar" onClick={() => navigate(-1)}>
                🔙 Voltar
            </button>

            <h1>Manual Geral IronGoals</h1>

            {/* 🔹 Campo de filtro */}
            <div className="filtro-container">
                <input
                    type="text"
                    placeholder="Filtrar cláusulas..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
                {filtro && (
                    <button className="limpar-btn" onClick={() => setFiltro("")}>
                        ❌ Limpar
                    </button>
                )}
            </div>

            <div className="documento-gerado">{renderDocumento(filtrarClausulas(clausulas))}</div>

            {/* ⬆️ Botão de topo */}
            {mostrarTopo && (
                <button className="botao-topo" onClick={irParaTopo}>
                    ⬆️ Topo
                </button>
            )}
        </main>
    );
}
