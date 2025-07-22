import './BotaoUm.css';
import { useState, useEffect, useRef } from 'react';
import { URL } from '../../config';
import HostModal from './hostModal';

export default function BotaoUm() {
    const [mostrarNivel, setMostrarNivel] = useState(false);
    const [mostrarPosicao, setMostrarPosicao] = useState(false);
    const [mostrarFormularioZap, setMostrarFormularioZap] = useState(false);
    const [editarZap, setEditarZap] = useState(false);
    const [codigo, setCodigo] = useState("+55");
    const [numero, setNumero] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

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
                alert("WhatsApp atualizado com sucesso!");
                setEditarZap(false);
            } else {
                alert("Erro ao atualizar WhatsApp: " + data.erro);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao se comunicar com o servidor.");
        }
    };

    useEffect(() => {
        const buscarWhatsapp = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${URL}/perfil/obter_whatsapp`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await response.json();

                if (response.ok && data.whatsapp) {
                    const codigoExtraido = data.whatsapp.slice(0, 3);
                    const numeroExtraido = data.whatsapp.slice(3);

                    setCodigo(codigoExtraido);
                    setNumero(numeroExtraido);
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

    return (
        <div className="lista-vertical">
            {!mostrarFormularioZap ? (
                <button onClick={() => setMostrarFormularioZap(true)}>📱 WhatsApp</button>
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

            <button onClick={() => setMostrarNivel(true)}>🎯 Nível</button>
            <button onClick={() => setMostrarPosicao(true)}>📍 Última Posição</button>
            <button onClick={() => window.location.href = "/pacotes"}>📦 Pacotes</button>
            <button onClick={() => setMostrarModal(true)}>🧭 Host</button>

            {mostrarModal && idHost && (   // ✅ só renderiza se idHost estiver carregado
                <HostModal idHost={idHost} onClose={() => setMostrarModal(false)} />
            )}
        </div>
    );
}
