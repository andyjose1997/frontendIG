import './botaoum.css';
import { useState, useEffect, useRef } from 'react';
import { URL } from '../../config';
import HostModal from './hostmodal';
import { useFerramentas } from '../../ferramentascontext';
import ModalQrCode from './config/modalqrcode';
import AlertaWhatsApp from "./alertawhatsapp";
import ChavePix from './config/chavepix';
import SaldoCPPModal from './saldocppmodal';

export default function BotaoUm() {
    const [mostrarNivel, setMostrarNivel] = useState(false);
    const [mostrarPosicao, setMostrarPosicao] = useState(false);
    const [mostrarFormularioZap, setMostrarFormularioZap] = useState(false);
    const [editarZap, setEditarZap] = useState(false);
    const [codigo, setCodigo] = useState("+55");
    const [ddd, setDdd] = useState("");
    const [numero, setNumero] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [alerta, setAlerta] = useState({ mostrar: false, tipo: "", mensagem: "" });
    const [mostrarChavePix, setMostrarChavePix] = useState(false);
    const [mostrarPacotes, setMostrarPacotes] = useState(false);
    const [mostrarSaldoCPP, setMostrarSaldoCPP] = useState(false);

    const linkAprendizagem = window.location.origin.includes("localhost")
        ? "http://localhost:5173/aprendizagem"
        : "https://irongoals.com/aprendizagem";

    const [textoBotaoZap, setTextoBotaoZap] = useState("📱 WhatsApp");

    useEffect(() => {
        if (!numero) {
            let mostrarAlternado = false;
            const interval = setInterval(() => {
                mostrarAlternado = !mostrarAlternado;
                setTextoBotaoZap(mostrarAlternado ? "✏️ Escreva seu WhatsApp" : "📱 WhatsApp");
            }, 3000);

            return () => clearInterval(interval);
        } else {
            setTextoBotaoZap("📱 WhatsApp");
        }
    }, [numero]);

    const [idHost, setIdHost] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setIdHost(data.id_host);
            });
    }, []);

    const botoesZapRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setIdHost(data.id_host);
            });
    }, []);

    const salvarWhatsapp = async () => {
        const token = localStorage.getItem("token");

        const codigoLimpo = codigo.replace(/\D/g, "").slice(0, 2); // 55
        const dddLimpo = ddd.replace(/\D/g, "").slice(0, 2);       // 31
        const numeroLimpo = numero.replace(/\D/g, "").slice(-9);   // 918547818

        const whatsappCompleto = `+${codigoLimpo}${dddLimpo}${numeroLimpo}`;

        try {
            const response = await fetch(`${URL}/perfil/atualizar_whatsapp`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ whatsapp: whatsappCompleto })
            });

            const data = await response.json();

            if (response.ok) {
                setAlerta({ mostrar: true, tipo: "sucesso", mensagem: "WhatsApp atualizado com sucesso!" });
                setEditarZap(false);
            } else {
                setAlerta({ mostrar: true, tipo: "erro", mensagem: "Erro ao atualizar WhatsApp: " + data.erro });
            }
        } catch (error) {
            setAlerta({ mostrar: true, tipo: "erro", mensagem: "Erro ao se comunicar com o servidor." });
        }
    };

    useEffect(() => {
        const buscarWhatsapp = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${URL}/perfil`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await response.json();

                if (response.ok && data.whatsapp) {
                    const regex = /^(\+\d{2})(\d{2})(\d{8,9})$/;
                    const match = data.whatsapp.match(regex);

                    if (match) {
                        setCodigo(match[1]); // +55
                        setDdd(match[2]);    // 11
                        setNumero(match[3]); // 912345678
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar WhatsApp:", error);
            }
        };

        buscarWhatsapp();
    }, []);

    useEffect(() => {
        const handleDoubleClickOutside = (e) => {
            if (mostrarFormularioZap && botoesZapRef.current && !botoesZapRef.current.contains(e.target)) {
                // 🔹 Só fecha se o clique não for em um input, select ou botão
                if (!["INPUT", "SELECT", "BUTTON"].includes(e.target.tagName)) {
                    setMostrarFormularioZap(false);
                    setEditarZap(false);
                }
            }
        };

        document.addEventListener("dblclick", handleDoubleClickOutside);
        return () => {
            document.removeEventListener("dblclick", handleDoubleClickOutside);
        };
    }, [mostrarFormularioZap]);


    const [mostrarFerramentas, setMostrarFerramentas] = useState(false);
    const [funcao, setFuncao] = useState("");
    const [chaveCorreta, setChaveCorreta] = useState("");
    const [palavraDigitada, setPalavraDigitada] = useState("");
    const [erroChave, setErroChave] = useState(false);
    const { setAcessoLiberado } = useFerramentas();

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setFuncao(data.funcao || "");
                setChaveCorreta(data.palavra_chave || "");
            });

    }, []);

    return (
        <div className="lista-vertical">
            {!mostrarFormularioZap ? (
                <div className="whatsapp-tooltip-wrapper">
                    <button onClick={() => setMostrarFormularioZap(true)} className="botao-acao">
                        {textoBotaoZap}
                    </button>

                    <span className="whatsapp-tooltip">
                        Aqui pode colocar seu WhatsApp para se comunicar com seus indicados e o seu host
                    </span>
                </div>
            ) : (
                <div className="botoes-zap" ref={botoesZapRef}>
                    <button
                        className="botao-acao"
                        onClick={() =>
                            window.open(`https://web.whatsapp.com/send?phone=${codigo}${ddd}${numero}`, "_blank")
                        }
                    >
                        🔗 Ir ao WhatsApp
                    </button>
                    <button className="botao-acao" onClick={() => setEditarZap(true)}>✏️ Editar WhatsApp</button>
                </div>
            )}

            {editarZap && (
                <div className="formulario-whatsapp">
                    {/* Código do país */}
                    <select value={codigo} onChange={(e) => setCodigo(e.target.value)}>
                        <option value="+55">🇧🇷 +55 (Brasil)</option>
                        <option value="+1">🇺🇸 +1 (EUA)</option>
                        <option value="+34">🇪🇸 +34 (Espanha)</option>
                        <option value="+351">🇵🇹 +351 (Portugal)</option>
                        <option value="+33">🇫🇷 +33 (França)</option>
                        <option value="+49">🇩🇪 +49 (Alemanha)</option>
                    </select>

                    {/* DDD */}
                    <input
                        type="tel"
                        placeholder="DDD (ex: 11)"
                        value={ddd}
                        onChange={(e) => setDdd(e.target.value.replace(/\D/g, ""))}
                        maxLength={2}
                    />

                    {/* Número */}
                    <input
                        type="tel"
                        placeholder="Número (ex: 912345678)"
                        value={numero}
                        onChange={(e) => {
                            let valor = e.target.value.replace(/\D/g, "");
                            // se o usuário digitar junto com DDD, corta e pega só os 8 ou 9 últimos
                            if (valor.length > 9) {
                                valor = valor.slice(-9);
                            }
                            setNumero(valor);
                        }}
                        maxLength={9}
                    />


                    <a
                        className="botao-salvar-forcado"
                        onClick={salvarWhatsapp}
                    >
                        💾 Salvar
                    </a>
                </div>
            )}

            <button onClick={() => setMostrarSaldoCPP(true)} className="botao-acao">
                💰 Saldo CPP
            </button>
            {mostrarSaldoCPP && (
                <SaldoCPPModal onClose={() => setMostrarSaldoCPP(false)} />
            )}

            <div className="indicacao-tooltip-wrapper">
                <button onClick={() => setMostrarNivel(true)} className="botao-acao">
                    🔗 Meu link de indicação
                </button>
                <span className="indicacao-tooltip">
                    Com o seu link de indicação, outras pessoas podem se cadastrar como seus indicados
                    e você receberá compensações pelas compras delas.
                </span>
            </div>

            {mostrarNivel && (
                <ModalQrCode
                    onClose={() => setMostrarNivel(false)}
                    linkIndicacao={`${window.location.origin}/cadastro/${idHost}`}
                />
            )}
            <div className="pix-tooltip-wrapper">
                <button onClick={() => setMostrarChavePix(true)} className="botao-acao">
                    💳 Chave Pix
                </button>
                <span className="pix-tooltip">
                    Aqui você pode visualizar e colocar sua chave Pix para suas compensações.
                </span>
            </div>

            <button onClick={() => setMostrarPacotes(true)} className="botao-acao">📦 Pacotes</button>
            <button onClick={() => setMostrarModal(true)} className="botao-acao">🧭 Host</button>
            {["admin", "coordinador", "auditor"].includes(funcao.toLowerCase()) && (
                <button onClick={() => setMostrarFerramentas(true)} className="botao-acao">🛠 Painel de controle</button>
            )}

            {mostrarFerramentas && (
                <div className="painel-modal-overlay">
                    <div className={`painel-modal ${erroChave ? "painel-erro" : ""}`}>
                        <h2>Bem-vindo ao painel de controle geral</h2>
                        <p>Sua função na plataforma é: <strong>{funcao}</strong></p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (
                                    palavraDigitada.trim().toLowerCase() ===
                                    chaveCorreta.trim().toLowerCase()
                                ) {
                                    setAcessoLiberado(true);
                                    localStorage.setItem("acessoFerramentas", "true");
                                    window.open(
                                        `${window.location.origin}/ferramentas/painelcontrole`,
                                        "_blank"
                                    );
                                } else {
                                    setErroChave(true);
                                    setTimeout(() => setErroChave(false), 3000);
                                }
                            }}
                        >
                            <input
                                type="password"
                                placeholder="Digite a palavra-chave para ingressar"
                                value={palavraDigitada}
                                onChange={(e) => setPalavraDigitada(e.target.value)}
                                autoComplete="off"
                                name="fake-password"
                            />

                            <div className="painel-botoes">
                                <button
                                    type="button"
                                    className="botao-acao painel-btn-voltar"
                                    onClick={() => setMostrarFerramentas(false)}
                                >
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarModal && idHost && (
                <HostModal idHost={idHost} onClose={() => setMostrarModal(false)} />
            )}

            {alerta.mostrar && (
                <AlertaWhatsApp
                    tipo={alerta.tipo}
                    mensagem={alerta.mensagem}
                    onClose={() => setAlerta({ mostrar: false, tipo: "", mensagem: "" })}
                />
            )}
            {mostrarPacotes && (
                <div
                    className="pacotes-modal-overlay"
                    onClick={() => setMostrarPacotes(false)}
                >
                    <div
                        className="pacotes-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {funcao.toLowerCase() === "explorer" ? (
                            <p>
                                Você não comprou nosso pacote. <br />
                                <a href={linkAprendizagem} rel="noopener noreferrer">
                                    Deseja comprar?
                                </a>
                            </p>
                        ) : (
                            <p>
                                Você adquiriu o pacote <strong>Idiomas e Programação</strong>. <br />
                                <a href={linkAprendizagem} rel="noopener noreferrer">
                                    Deseja ir?
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {mostrarChavePix && (
                <div className="pix-modal-overlay" onClick={() => setMostrarChavePix(false)}>
                    <div className="pix-modal" onClick={(e) => e.stopPropagation()}>
                        <ChavePix onVoltar={() => setMostrarChavePix(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
