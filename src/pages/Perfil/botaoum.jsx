import './Botaoum.css';
import { useState, useEffect, useRef } from 'react';
import { URL } from '../../config';
import HostModal from './hostmodal';
import { useFerramentas } from '../../ferramentascontext';
import ModalQrCode from './config/modalqrcode';
import AlertaWhatsApp from "./alertawhatsApp";

export default function BotaoUm() {
    const [mostrarNivel, setMostrarNivel] = useState(false);
    const [mostrarPosicao, setMostrarPosicao] = useState(false);
    const [mostrarFormularioZap, setMostrarFormularioZap] = useState(false);
    const [editarZap, setEditarZap] = useState(false);
    const [codigo, setCodigo] = useState("+55");
    const [numero, setNumero] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [alerta, setAlerta] = useState({ mostrar: false, tipo: "", mensagem: "" });

    const [idHost, setIdHost] = useState("");   // ✅ ID do host da pessoa logada
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log("🛠️ ID HOST recebido:", data.id_host);  // ✅ Veja o console
                setIdHost(data.id_host);
            });
    }, []);

    const botoesZapRef = useRef(null);

    // ✅ Buscar automaticamente o id_host da pessoa logada
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setIdHost(data.id_host);   // ✅ salva o id_host recebido
            });
    }, []);

    // ... (todo o resto do seu código permanece idêntico)

    const salvarWhatsapp = async () => {
        const token = localStorage.getItem("token");
        const whatsappCompleto = `${codigo}${numero}`;

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
            console.error("Erro na requisição:", error);
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
                    // separa código e número
                    const regex = /^(\+\d{1,4})(\d+)$/;
                    const match = data.whatsapp.match(regex);

                    if (match) {
                        setCodigo(match[1]);   // exemplo: +55 ou +351
                        setNumero(match[2]);   // exemplo: 11999999999
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
                setMostrarFormularioZap(false);
                setEditarZap(false);
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

    // Buscar função e chave da pessoa logada
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log("🔍 Função recebida:", data.funcao);
                console.log("🔑 Palavra-chave recebida:", data.palavra_chave);

                setFuncao(data.funcao || "");
                setChaveCorreta(data.palavra_chave || "");
            });

    }, []);


    return (
        <div className="lista-vertical">
            {!mostrarFormularioZap ? (
                <div className="whatsapp-tooltip-wrapper">
                    <button onClick={() => setMostrarFormularioZap(true)} className="whatsapp-button">
                        📱 WhatsApp
                    </button>
                    <span className="whatsapp-tooltip">
                        Aqui pode colocar seu WhatsApp para se comunicar com seus indicados e o seu host
                    </span>
                </div>
            ) : (
                <div className="botoes-zap" ref={botoesZapRef}>
                    <button onClick={() => window.open(`https://web.whatsapp.com/send?phone=${codigo}${numero}`, "_blank")}>🔗 Ir ao WhatsApp</button>
                    <button onClick={() => setEditarZap(true)}>✏️ Editar WhatsApp</button>
                </div>
            )}

            {editarZap && (
                <div className="formulario-whatsapp">
                    <select value={codigo} onChange={(e) => setCodigo(e.target.value)}>
                        <option value="+55">🇧🇷 +55 (Brasil)</option>
                        <option value="+1">🇺🇸 +1 (EUA)</option>
                        <option value="+34">🇪🇸 +34 (Espanha)</option>
                        <option value="+351">🇵🇹 +351 (Portugal)</option>
                        <option value="+33">🇫🇷 +33 (França)</option>
                        <option value="+49">🇩🇪 +49 (Alemanha)</option>
                    </select>
                    <input
                        type="tel"
                        placeholder="Digite seu número"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                    />
                    <a
                        className="botao-salvar-forcado"
                        onClick={salvarWhatsapp}
                    >
                        💾 Salvar
                    </a>


                </div>
            )}

            <div className="indicacao-tooltip-wrapper">
                <button onClick={() => setMostrarNivel(true)}>
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
            <button onClick={() => setMostrarPosicao(true)}>📍 Última Posição</button>
            <button onClick={() => window.location.href = "/pacotes"}>📦 Pacotes</button>
            <button onClick={() => setMostrarModal(true)}>🧭 Host</button>
            {["admin", "coordinador", "auditor"].includes(funcao.toLowerCase()) && (
                <button onClick={() => setMostrarFerramentas(true)}>🛠 Painel de controle</button>
            )}

            {mostrarFerramentas && (
                <div className="painel-modal-overlay">
                    <div className={`painel-modal ${erroChave ? "painel-erro" : ""}`}>
                        <h2>Bem-vindo ao painel de controle geral</h2>
                        <p>Sua função na plataforma é: <strong>{funcao}</strong></p>
                        <input
                            type="password"
                            placeholder="Digite a palavra-chave para ingressar"
                            value={palavraDigitada}
                            onChange={(e) => setPalavraDigitada(e.target.value)}
                        />
                        <div className="painel-botoes">
                            <button
                                className="painel-btn-entrar"
                                onClick={() => {
                                    if (
                                        palavraDigitada.trim().toLowerCase() ===
                                        chaveCorreta.trim().toLowerCase()
                                    ) {
                                        setAcessoLiberado(true);
                                        localStorage.setItem("acessoFerramentas", "true"); // ← ESSENCIAL
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
                                Entrar
                            </button>
                            <button
                                className="painel-btn-voltar"
                                onClick={() => setMostrarFerramentas(false)}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {mostrarModal && idHost && (   // ✅ só renderiza se idHost estiver carregado
                <HostModal idHost={idHost} onClose={() => setMostrarModal(false)} />
            )}
            {alerta.mostrar && (
                <AlertaWhatsApp
                    tipo={alerta.tipo}
                    mensagem={alerta.mensagem}
                    onClose={() => setAlerta({ mostrar: false, tipo: "", mensagem: "" })}
                />
            )}

        </div>
    );
}
