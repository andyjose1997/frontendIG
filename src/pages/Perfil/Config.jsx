import { useState } from 'react';
import './Config.css';
import ModoPP from './config/ModoPP';
import DadosConta from './config/dadosConta';
import ChavePix from './config/ChavePix';  // ✅ Importado
import MudarSenha from './config/MudarSenha';  // ✅ Importado

export default function Config() {
    const [mostrarPrivacidade, setMostrarPrivacidade] = useState(false);
    const [mostrarDadosConta, setMostrarDadosConta] = useState(false);
    const [mostrarChavePix, setMostrarChavePix] = useState(false);  // ✅ Estado existente
    const [mostrarMudarSenha, setMostrarMudarSenha] = useState(false);  // ✅ Novo estado

    let conteudo = null;

    if (mostrarPrivacidade) {
        conteudo = <ModoPP onVoltar={() => setMostrarPrivacidade(false)} />;
    } else if (mostrarDadosConta) {
        conteudo = <DadosConta onVoltar={() => setMostrarDadosConta(false)} />;
    } else if (mostrarChavePix) {
        conteudo = <ChavePix onVoltar={() => setMostrarChavePix(false)} />;
    } else if (mostrarMudarSenha) {   // ✅ Nova condição
        conteudo = <MudarSenha onVoltar={() => setMostrarMudarSenha(false)} />;
    } else {
        conteudo = (
            <section className="botoes-config">
                <button className="botao-config" onClick={() => setMostrarDadosConta(true)}>
                    Dados da Conta
                </button>

                <button className="botao-config" onClick={() => setMostrarMudarSenha(true)}>   {/* ✅ Botão funcional */}
                    Mudar Senha
                </button>

                <button
                    className="botao-config"
                    onClick={() => setMostrarChavePix(true)}
                >
                    Alterar Chave Pix
                </button>

                <button className="botao-config">Gerenciar Assinatura</button>
                <button
                    className="botao-config"
                    onClick={() => setMostrarPrivacidade(true)}
                >
                    Tornar Conta Pública/Privada
                </button>
                <button className="botao-config">Fale Conosco</button>
            </section>
        );
    }

    return (
        <div className="config-wrapper">
            <main className="configuracoes-page">
                <h1>⚙️ Configurações da Conta</h1>
                {conteudo}
            </main>
        </div>
    );
}
