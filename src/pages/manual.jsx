import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./manual.css";
import { URL } from "../config";

// 🔹 API sempre com barra no final
const API_URL = `${URL}/clausulas/`;

export default function ManualDocumento() {
    const [clausulas, setClausulas] = useState([]);
    const [mostrarTopo, setMostrarTopo] = useState(false);
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
            console.log("ScrollY:", window.scrollY); // debug
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
            <div className="documento-gerado">{renderDocumento(clausulas)}</div>

            {/* ⬆️ Botão de topo */}
            {mostrarTopo && (
                <button className="botao-topo" onClick={irParaTopo}>
                    ⬆️ Topo
                </button>
            )}
        </main>
    );
}
