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
                    O sistema vai recomendar o seu email, mas pode confirmar ou alterar
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
                    <button className="botao-voltar" onClick={onVoltar}>
                        ← Voltar
                    </button>
                </div>
            </section>

            <div className="area-link">
                <h2>🔗 Seu link exclusivo de indicação como Host</h2>
                <h3 className="link-indicacao">{linkIndicacao}</h3>

                {/* 🔹 Gerar QRCode (clicável) */}
                <div
                    className="qrcode-container"
                    onClick={() => setMostrarQrModal(true)}
                    style={{ cursor: "pointer" }}
                >
                    <QRCodeCanvas value={linkIndicacao} size={150} bgColor="#ffffff" fgColor="#000000" />
                </div>
                <br />
                <div>
                    <button className="botao-config" onClick={copiarLink}>
                        Copiar Link
                    </button>
                    <button className="botao-config" onClick={() => setMostrarMensagens(true)}>
                        Mensagens para Postar
                    </button>
                </div>
            </div>

            {mostrarMensagens && (
                <div className="modal-overlay">
                    <div className="modal-mensagens">
                        <h2>Mensagens para Postar</h2>
                        <p>Mensagem 1 exemplo.</p>
                        <button onClick={() => copiarMensagem("Mensagem 1 exemplo.")}>Copiar</button>
                        <hr />
                        <p>Mensagem 2 exemplo.</p>
                        <button onClick={() => copiarMensagem("Mensagem 2 exemplo.")}>Copiar</button>
                        <hr />
                        <p>Mensagem 3 exemplo.</p>
                        <button onClick={() => copiarMensagem("Mensagem 3 exemplo.")}>Copiar</button>
                        <br /><br />
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
