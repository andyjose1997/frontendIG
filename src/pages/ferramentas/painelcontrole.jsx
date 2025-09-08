import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisualizarBanco from './componentes/visualizarBanco';
import RankingGeral from './componentes/rakinggeral';
import ListaUsuariosSimples from './componentes/listausuariossimples';
import PerguntasUsuarios from './componentes/perguntasUsuarios';
import TermosUso from './componentes/TermosUso'; // 🔹 novo componente
import PermitirFundadores from './componentes/PermitirFundadores';
import LinksRedes from './componentes/LinksRedes';
import Propaganda from './componentes/Propaganda';
import IreneConfig from './componentes/irene/ireneconfig';
import IreneConfigCompleta from './componentes/irene/ireneconfigcompleta';
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
        <div id='controle-painel'>
            <h1>Painel de Controle</h1>

            <div className="controle-botoes-paineis">
                <button
                    className={painelAtivo === "visualizarBanco" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("visualizarBanco")}
                >
                    Banco de Dados
                </button>

                <button
                    className={painelAtivo === "listaUsuarios" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("listaUsuarios")}
                >
                    Lista de Funcionarios
                </button>

                <button
                    className={painelAtivo === "irene" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("irene")}
                >
                    Irene
                </button>

                <button
                    className={painelAtivo === "infoCadastro" ? "controle-ativo" : ""}
                    onClick={() => {
                        setPainelAtivo("infoCadastro");
                        setSubPainelCadastro(null); // reseta escolha
                    }}
                >
                    Info de cadastro
                </button>

                <button style={{ display: "block" }}  // mudar para none quando nao precise mais
                    className={painelAtivo === "permitirFundadores" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("permitirFundadores")}
                >
                    Permitir Fundadores
                </button>

                <button
                    className={painelAtivo === "linksRedes" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("linksRedes")}
                >
                    Redes sociais
                </button>

                <button
                    className={painelAtivo === "propaganda" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("propaganda")}
                >
                    Propaganda
                </button>

                <button
                    className={painelAtivo === "rankingGeral" ? "controle-ativo" : ""}
                    onClick={() => setPainelAtivo("rankingGeral")}
                >
                    Rankings gerais
                </button>
            </div>

            {painelAtivo === "visualizarBanco" && <VisualizarBanco />}
            {painelAtivo === "rankingGeral" && <RankingGeral />}
            {painelAtivo === "linksRedes" && <LinksRedes />}
            {painelAtivo === "propaganda" && <Propaganda />}
            {painelAtivo === "irene" && <IreneConfigCompleta />}
            {painelAtivo === "permitirFundadores" && <PermitirFundadores />}
            {painelAtivo === "listaUsuarios" && <ListaUsuariosSimples />}

            {/* 🔹 Novo fluxo Info de Cadastro */}
            {painelAtivo === "infoCadastro" && (
                <div className="controle-subpainel-cadastro">
                    <div className="controle-botoes-subpainel">
                        <button style={{ display: "none" }}
                            className={subPainelCadastro === "faq" ? "controle-ativo" : ""}
                            onClick={() => setSubPainelCadastro("faq")}
                        >
                            Perguntas Frequentes
                        </button>
                        <button
                            className={subPainelCadastro === "termos" ? "controle-ativo" : ""}
                            onClick={() => setSubPainelCadastro("termos")}
                        >
                            Termos de Uso
                        </button>
                    </div>

                    <div className="controle-conteudo-subpainel">
                        {subPainelCadastro === "faq" && <PerguntasUsuarios />}
                        {subPainelCadastro === "termos" && <TermosUso />}
                    </div>
                </div>
            )}
        </div>
    );
}