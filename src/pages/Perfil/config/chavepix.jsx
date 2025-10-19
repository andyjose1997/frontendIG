import { useEffect, useState } from 'react';
import { FRONT_URL, URL } from '../../../config';
import './chavepix.css';
import { QRCodeCanvas } from "qrcode.react";
import ModalQrCode from './modalqrcode';

export default function ChavePix({ onVoltar }) {
    const [chavePix, setChavePix] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const [linkIndicacao, setLinkIndicacao] = useState('link pendente');
    const [mostrarMensagens, setMostrarMensagens] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [alerta, setAlerta] = useState("");
    const [mostrarQrModal, setMostrarQrModal] = useState(false);

    useEffect(() => {
        buscarChavePix();
        buscarDadosUsuario();
    }, []);

    const buscarChavePix = async () => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${URL}/perfil/chave_pix`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resposta.json();
        setChavePix(data.chave_pix || '');
    };

    const buscarDadosUsuario = async () => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resposta.json();
        setEmail(data.email || '');
        setWhatsapp(data.whatsapp || '');
        if (!chavePix) {
            setChavePix(data.email || '');
        }
        if (data.id) {
            setIdUsuario(data.id);

            // junta nome e sobrenome e remove espaços
            const nomeFormatado = (data.nome + data.sobrenome).replace(/\s+/g, '').toLowerCase();

            setLinkIndicacao(`${FRONT_URL}/criar-conta/${data.id}/${nomeFormatado}`);
        }

    };

    const salvarChavePix = async () => {
        const token = localStorage.getItem('token');
        try {
            const resposta = await fetch(`${URL}/perfil/atualizar_chave_pix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ chave_pix: chavePix.trim() })
            });

            if (resposta.ok) {
                mostrarAlerta("✅ Chave Pix atualizada com sucesso!");
            } else {
                const erro = await resposta.json();
                mostrarAlerta(`❌ Erro: ${erro.detail || "Não foi possível salvar."}`);
            }
        } catch (e) {
            mostrarAlerta("⚠️ Erro de conexão com o servidor.");
        }
    };


    const handleInputChange = (e) => {
        setChavePix(e.target.value);
        setMostrarSugestoes(true);
    };

    const inserirSugestao = (valor) => {
        setChavePix(valor);
        setMostrarSugestoes(true);
    };

    const copiarLink = () => {
        navigator.clipboard.writeText(linkIndicacao);
        mostrarAlerta("🔗 Link copiado!");
    };

    const copiarMensagem = (mensagem) => {
        navigator.clipboard.writeText(mensagem);
        mostrarAlerta("📋 Mensagem copiada!");
    };

    const mostrarAlerta = (texto) => {
        setAlerta(texto);
        setTimeout(() => setAlerta(""), 2000);
    };

    return (
        <>
            <section className="privacidade-config">
                <h2>💳 Chave Pix</h2>
                <p>Por favor coloque sua chave pix para receber as suas compensações conforme a sua CPP.
                    <br />
                </p>

                <input
                    type="text"
                    value={chavePix}
                    onChange={handleInputChange}
                    onFocus={() => setMostrarSugestoes(true)}
                    placeholder="Digite sua chave Pix"
                />

                {mostrarSugestoes && (
                    <div className="sugestoes-box">
                        <p onClick={() => inserirSugestao(email)}>📧 {email}</p>
                        <p onClick={() => inserirSugestao(whatsapp)}>📱 {whatsapp}</p>
                    </div>
                )}

                <div className="botoes-acoes">
                    <button className="botao-config" onClick={salvarChavePix}>
                        Salvar Chave Pix
                    </button>

                </div>
            </section>



            <button style={{ display: "none" }} className="botao-config" onClick={() => setMostrarMensagens(true)}>
                Mensagens para Postar
            </button><br />
            <button className="botao-voltar" onClick={onVoltar}>
                ← Voltar
            </button>

            {mostrarMensagens && (
                <div className="modal-overlay">
                    <div className="modal-mensagens">
                        <h2>Mensagens para Postar</h2>

                        <p>🚀 Estou transformando meus estudos em resultados reais com a IronGoals! Aqui aprendo idiomas, programação e ainda posso gerar renda com meu desempenho. Já conhece?</p>
                        <button onClick={() => copiarMensagem("🚀 Estou transformando meus estudos em resultados reais com a IronGoals! Aqui aprendo idiomas, programação e ainda posso gerar renda com meu desempenho. Já conhece?")}>Copiar</button>
                        <hr />

                        <p>🎯 A IronGoals é muito mais que uma plataforma de cursos — é um ecossistema de crescimento pessoal, aprendizado inteligente e recompensas reais!</p>
                        <button onClick={() => copiarMensagem("🎯 A IronGoals é muito mais que uma plataforma de cursos — é um ecossistema de crescimento pessoal, aprendizado inteligente e recompensas reais!")}>Copiar</button>
                        <hr />

                        <p>🌍 Estudo inglês, espanhol e até programação, tudo num ambiente gamificado que me desafia a evoluir todos os dias. É divertido, prático e 100% online. #IronGoals</p>
                        <button onClick={() => copiarMensagem("🌍 Estudo inglês, espanhol e até programação, tudo num ambiente gamificado que me desafia a evoluir todos os dias. É divertido, prático e 100% online. #IronGoals")}>Copiar</button>
                        <hr />

                        <p>🔥 O diferencial da IronGoals? Você aprende, aplica e ainda ganha comissões reais por ajudar outras pessoas a estudar também. É aprendizado com propósito!</p>
                        <button onClick={() => copiarMensagem("🔥 O diferencial da IronGoals? Você aprende, aplica e ainda ganha comissões reais por ajudar outras pessoas a estudar também. É aprendizado com propósito!")}>Copiar</button>
                        <hr />

                        <p>💡 Se você acredita que conhecimento é poder, precisa conhecer a IronGoals. Cursos rápidos, certificados, desafios diários e uma comunidade que inspira!</p>
                        <button onClick={() => copiarMensagem("💡 Se você acredita que conhecimento é poder, precisa conhecer a IronGoals. Cursos rápidos, certificados, desafios diários e uma comunidade que inspira!")}>Copiar</button>
                        <hr />

                        <p>📚 IronGoals me mostrou que estudar pode ser envolvente, moderno e recompensador. Hoje aprendo e cresço pessoal, profissional e financeiramente!</p>
                        <button onClick={() => copiarMensagem("📚 IronGoals me mostrou que estudar pode ser envolvente, moderno e recompensador. Hoje aprendo e cresço pessoal, profissional e financeiramente!")}>Copiar</button>
                        <hr />

                        <p>💻 Com IronGoals, cada curso é uma nova missão. Cada etapa concluída soma pontos, e cada conquista me aproxima da autossuficiência!</p>
                        <button onClick={() => copiarMensagem("💻 Com IronGoals, cada curso é uma nova missão. Cada etapa concluída soma pontos, e cada conquista me aproxima da autossuficiência!")}>Copiar</button>
                        <hr />

                        <p>🧭 Quer mudar de vida? Comece aprendendo algo novo todos os dias. Na IronGoals, o conhecimento se transforma em oportunidades reais.</p>
                        <button onClick={() => copiarMensagem("🧭 Quer mudar de vida? Comece aprendendo algo novo todos os dias. Na IronGoals, o conhecimento se transforma em oportunidades reais.")}>Copiar</button>
                        <hr />

                        <p>🎓 Estudar inglês, espanhol ou programação e ainda ganhar recompensas? Só a IronGoals une tudo isso em uma experiência gamificada que motiva!</p>
                        <button onClick={() => copiarMensagem("🎓 Estudar inglês, espanhol ou programação e ainda ganhar recompensas? Só a IronGoals une tudo isso em uma experiência gamificada que motiva!")}>Copiar</button>
                        <hr />

                        <p>🚪 A IronGoals abre portas para quem busca independência financeira e crescimento pessoal. O primeiro passo é se cadastrar. O segundo é acreditar!</p>
                        <button onClick={() => copiarMensagem("🚪 A IronGoals abre portas para quem busca independência financeira e crescimento pessoal. O primeiro passo é se cadastrar. O segundo é acreditar!")}>Copiar</button>
                        <hr />

                        <p>🌟 Seja um Founder IronGoals e garanta acesso vitalício, bônus exclusivos e maior comissão por venda. É a chance de crescer junto com o projeto!</p>
                        <button onClick={() => copiarMensagem("🌟 Seja um Founder IronGoals e garanta acesso vitalício, bônus exclusivos e maior comissão por venda. É a chance de crescer junto com o projeto!")}>Copiar</button>
                        <hr />

                        <p>📆 Toda quarta-feira às 20h tem live no Facebook da IronGoals! Dicas, treinamentos e estratégias para quem quer vender mais e crescer na plataforma.</p>
                        <button onClick={() => copiarMensagem("📆 Toda quarta-feira às 20h tem live no Facebook da IronGoals! Dicas, treinamentos e estratégias para quem quer vender mais e crescer na plataforma.")}>Copiar</button>
                        <hr />

                        <p>💬 Compartilhe seu link, convide amigos e mostre que estudar pode ser um caminho para a autossuficiência. IronGoals é o futuro da educação inteligente!</p>
                        <button onClick={() => copiarMensagem("💬 Compartilhe seu link, convide amigos e mostre que estudar pode ser um caminho para a autossuficiência. IronGoals é o futuro da educação inteligente!")}>Copiar</button>
                        <hr />

                        <p>📲 Acesse agora www.irongoals.com e descubra como transformar conhecimento em resultados. Você vai se surpreender com o que é possível!</p>
                        <button onClick={() => copiarMensagem("📲 Acesse agora www.irongoals.com e descubra como transformar conhecimento em resultados. Você vai se surpreender com o que é possível!")}>Copiar</button>
                        <hr />

                        <p>🏆 IronGoals Onde aprender é o primeiro passo para conquistar liberdade.</p>
                        <button onClick={() => copiarMensagem("🏆 IronGoals — Onde aprender é o primeiro passo para conquistar liberdade.")}>Copiar</button>
                        <hr />

                        <br />
                        <button className="botao-voltar" onClick={() => setMostrarMensagens(false)}>Voltar</button>
                    </div>

                </div>
            )}

            {mostrarQrModal && (
                <ModalQrCode
                    onClose={() => setMostrarQrModal(false)}
                    linkIndicacao={linkIndicacao}
                />
            )}

            {alerta && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        background: alerta.includes("✅") ? "#4CAF50" : alerta.includes("❌") ? "#f44336" : "#ff9800",
                        color: "white",
                        padding: "14px 24px",
                        borderRadius: "10px",
                        boxShadow: "0px 6px 12px rgba(0,0,0,0.25)",
                        zIndex: 9999,
                        fontSize: "15px",
                        fontWeight: "500",
                        opacity: "1",
                        transform: "translateX(0)",
                        animation: "slideIn 0.4s ease, fadeOut 0.5s ease 1.8s forwards"
                    }}
                >
                    {alerta}
                </div>
            )}


        </>
    );
}
