import { useState } from 'react';
import './Config.css';
import ModoPP from './config/ModoPP';
import DadosConta from './config/dadosConta';

export default function Config() {
    const [mostrarPrivacidade, setMostrarPrivacidade] = useState(false);
    const [mostrarDadosConta, setMostrarDadosConta] = useState(false);

    let conteudo = null;

    if (mostrarPrivacidade) {
        conteudo = <ModoPP onVoltar={() => setMostrarPrivacidade(false)} />;
    } else if (mostrarDadosConta) {
        conteudo = <DadosConta onVoltar={() => setMostrarDadosConta(false)} />;
    } else {
        conteudo = (
            <section className="botoes-config">
                <button className="botao-config" onClick={() => setMostrarDadosConta(true)}>
                    Dados da Conta
                </button>
                <button className="botao-config">Mudar Senha</button>
                <button className="botao-config">Alterar Chave Pix</button>
                <button className="botao-config">Gerenciar Assinatura</button>
                <button className="botao-config">Ativar/Desativar Modo Escuro</button>
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
