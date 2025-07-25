import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisualizarBanco from './componentes/visualizarBanco';
import RankingGeral from './componentes/rakingGeral';
import './painelcontrole.css';

export default function PainelControle() {
    const navigate = useNavigate();
    const [painelAtivo, setPainelAtivo] = useState("visualizarBanco");

    useEffect(() => {
        const acesso = localStorage.getItem("acessoFerramentas");
        const token = localStorage.getItem("token");

        if (!token || acesso !== "true") {
            console.warn("⛔ Acesso negado: redirecionando para /");
            navigate("/");
        }
    }, [navigate]);

    return (
        <div id='painelc'>
            <h1>Painel de Controle</h1>

            <div className="botoes-paineis">
                <button
                    className={painelAtivo === "visualizarBanco" ? "ativo" : ""}
                    onClick={() => setPainelAtivo("visualizarBanco")}
                >
                    📊 Banco de Dados
                </button>

                <button
                    className={painelAtivo === "rankingGeral" ? "ativo" : ""}
                    onClick={() => setPainelAtivo("rankingGeral")}
                >
                    🏆 Ranking Geral
                </button>
            </div>

            {painelAtivo === "visualizarBanco" && <VisualizarBanco />}
            {painelAtivo === "rankingGeral" && <RankingGeral />}
        </div>
    );
}
