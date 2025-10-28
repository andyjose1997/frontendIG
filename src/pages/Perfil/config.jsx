import { useState, useEffect } from 'react';
import './config.css';
import ModoPP from './config/modopp';
import DadosConta from './config/dadosconta';
import ChavePix from './config/chavepix';
import MudarSenha from './config/mudarsenha';
import PerguntasSeguranca from './config/perguntasseguranca';
import { URL } from '../../config';

export default function Config() {
    const [mostrarPrivacidade, setMostrarPrivacidade] = useState(false);
    const [mostrarDadosConta, setMostrarDadosConta] = useState(true);
    const [mostrarChavePix, setMostrarChavePix] = useState(false);
    const [mostrarMudarSenha, setMostrarMudarSenha] = useState(false);
    const [mostrarPerguntasSeguranca, setMostrarPerguntasSeguranca] = useState(false);

    const [precisaPerguntas, setPrecisaPerguntas] = useState(false);

    // 🔎 Buscar se o usuário já preencheu perguntas
    useEffect(() => {
        const verificarPerguntas = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${URL}/seguranca/verificar`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (!data.tem_perguntas) {
                    setPrecisaPerguntas(true);
                }
            } catch (e) {
                console.error("Erro ao verificar perguntas de segurança:", e);
            }
        };

        verificarPerguntas();
    }, []);

    let conteudo = null;

    if (mostrarPrivacidade) {
        conteudo = <ModoPP onVoltar={() => setMostrarPrivacidade(false)} />;
    } else if (mostrarDadosConta) {
        conteudo = <DadosConta onVoltar={() => setMostrarDadosConta(false)} />;
    } else if (mostrarChavePix) {
        conteudo = <ChavePix onVoltar={() => setMostrarChavePix(false)} />;
    } else if (mostrarMudarSenha) {
        conteudo = <MudarSenha onVoltar={() => setMostrarMudarSenha(false)} />;
    } else if (mostrarPerguntasSeguranca) {
        conteudo = <PerguntasSeguranca onVoltar={() => setMostrarPerguntasSeguranca(false)} />;
    } else {
        conteudo = (
            <section className="botoes-config">
                <button className="botao-config" onClick={() => setMostrarDadosConta(true)}>
                    Dados da Conta
                </button>

                <button style={{ display: "none" }} className="botao-config" onClick={() => setMostrarMudarSenha(true)}>
                    Mudar Senha
                </button>

                <button
                    className={`botao-config ${precisaPerguntas ? "alerta-perguntas" : ""}`}
                    onClick={() => setMostrarPerguntasSeguranca(true)}
                >
                    Perguntas de Segurança
                </button>

                <button className="botao-config" onClick={() => setMostrarChavePix(true)}>
                    Alterar Chave Pix
                </button>

                <button style={{ display: "none" }} className="botao-config">Gerenciar Assinatura</button>
                <button style={{ display: "none" }}
                    className="botao-config"
                    onClick={() => setMostrarPrivacidade(true)}
                >
                    Tornar Conta Pública/Privada
                </button>
                <button style={{ display: "none" }} className="botao-config">Fale Conosco</button>
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
