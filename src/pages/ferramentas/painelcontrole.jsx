import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisualizarBanco from './componentes/visualizarBanco';
import RankingGeral from './componentes/rakingGeral';
import ListaUsuariosSimples from './componentes/ListaUsuariosSimples';
import PerguntasUsuarios from './componentes/perguntasUsuarios';
import TermosUso from './componentes/TermosUso'; // 🔹 novo componente
import './painelcontrole.css';

export default function PainelControle() {
    const navigate = useNavigate();
    const [painelAtivo, setPainelAtivo] = useState("visualizarBanco");
    const [subPainelCadastro, setSubPainelCadastro] = useState(null); // 🔹 controla FAQ/Termos

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
                    Banco de Dados
                </button>

                <button
                    className={painelAtivo === "listaUsuarios" ? "ativo" : ""}
                    onClick={() => setPainelAtivo("listaUsuarios")}
                >
                    Lista de Funcionarios
                </button>

                <button
                    className={painelAtivo === "infoCadastro" ? "ativo" : ""}
                    onClick={() => {
                        setPainelAtivo("infoCadastro");
                        setSubPainelCadastro(null); // 🔹 reseta escolha
                    }}
                >
                    Info de cadastro
                </button>

                <button
                    className={painelAtivo === "rankingGeral" ? "ativo" : ""}
                    onClick={() => setPainelAtivo("rankingGeral")}
                >
                    Ranking Geral
                </button>
            </div>

            {painelAtivo === "visualizarBanco" && <VisualizarBanco />}
            {painelAtivo === "rankingGeral" && <RankingGeral />}
            {painelAtivo === "listaUsuarios" && <ListaUsuariosSimples />}

            {/* 🔹 Novo fluxo Info de Cadastro */}
            {painelAtivo === "infoCadastro" && (
                <div className="subpainel-cadastro">
                    <div className="botoes-subpainel">
                        <button
                            className={subPainelCadastro === "faq" ? "ativo" : ""}
                            onClick={() => setSubPainelCadastro("faq")}
                        >
                            Perguntas Frequentes
                        </button>
                        <button
                            className={subPainelCadastro === "termos" ? "ativo" : ""}
                            onClick={() => setSubPainelCadastro("termos")}
                        >
                            Termos de Uso
                        </button>
                    </div>

                    <div className="conteudo-subpainel">
                        {subPainelCadastro === "faq" && <PerguntasUsuarios />}
                        {subPainelCadastro === "termos" && <TermosUso />}
                    </div>
                </div>
            )}
        </div>
    );
}
