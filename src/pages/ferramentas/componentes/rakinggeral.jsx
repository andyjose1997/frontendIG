import { useState } from "react";
import "./rakinggeral.css";
import Vendas from "./rankings/vendas";
import DistribuicaoVendas from "./rankings/distribuicaovendas";
import DistribuicaoQuiz from "./rankings/distribuicaoquiz";
import CPP from "./rankings/cpp";

export default function RakingGeral() {
    const [componenteAtivo, setComponenteAtivo] = useState(null);

    return (
        <div className="ranking-container">
            <h1 className="ranking-titulo">Ranking Geral</h1>

            <div className="ranking-botoes">
                <button
                    className={`ranking-botao ${componenteAtivo === "vendas" ? "ativo" : ""}`}
                    onClick={() => setComponenteAtivo("vendas")}
                >
                    Vendas
                </button>
                <button
                    className={`ranking-botao ${componenteAtivo === "distribuicaoVendas" ? "ativo" : ""}`}
                    onClick={() => setComponenteAtivo("distribuicaoVendas")}
                >
                    Distribuição de Tabelas Vendas
                </button>
                <button
                    className={`ranking-botao ${componenteAtivo === "distribuicaoQuiz" ? "ativo" : ""}`}
                    onClick={() => setComponenteAtivo("distribuicaoQuiz")}
                >
                    Distribuição de Tabelas Quiz
                </button>
                <button
                    className={`ranking-botao ${componenteAtivo === "cpp" ? "ativo" : ""}`}
                    onClick={() => setComponenteAtivo("cpp")}
                >
                    CPP
                </button>
            </div>

            <div className="ranking-conteudo">
                {componenteAtivo === "vendas" && <Vendas />}
                {componenteAtivo === "distribuicaoVendas" && <DistribuicaoVendas />}
                {componenteAtivo === "distribuicaoQuiz" && <DistribuicaoQuiz />}
                {componenteAtivo === "cpp" && <CPP />}
            </div>
        </div>
    );
}
