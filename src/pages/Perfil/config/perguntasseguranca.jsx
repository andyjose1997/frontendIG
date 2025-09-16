import { useState } from "react";
import { URL } from "../../config";
import './recuperarsenha.css';
import Rodape from "../rodape";

export default function RecuperarSenha() {
    const [step, setStep] = useState(1);
    const [loginField, setLoginField] = useState("");
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState(["", "", ""]);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [usuarioId, setUsuarioId] = useState(null);

    // Etapa 1: Buscar perguntas
    const handleBuscar = async () => {
        const res = await fetch(`${URL}/seguranca/recuperar-inicio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginField })
        });
        const data = await res.json();

        if (!res.ok) {
            setMensagem(data.erro || "Usuário não encontrado.");
            return;
        }
        setPerguntas(data.perguntas);
        setUsuarioId(data.usuario_id);
        setStep(2);
    };

    // Etapa 2: Validar respostas
    const handleValidar = async () => {
        const res = await fetch(`${URL}/seguranca/validar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioId, respostas })
        });
        const data = await res.json();

        if (!res.ok) {
            setMensagem(data.erro || "Respostas incorretas.");
            return;
        }
        setStep(3);
    };

    // Etapa 3: Resetar senha
    const handleResetarSenha = async () => {
        if (novaSenha !== confirmarSenha) {
            setMensagem("⚠️ As senhas não coincidem.");
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,*)(&%$#@!]).{8,}$/;
        if (!regex.test(novaSenha)) {
            setMensagem("⚠️ Senha deve ter 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.");
            return;
        }

        const res = await fetch(`${URL}/seguranca/resetar-senha`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioId, nova_senha: novaSenha })
        });
        const data = await res.json();

        if (!res.ok) {
            setMensagem(data.erro || "Erro ao redefinir senha.");
            return;
        }
        setMensagem("✅ Senha redefinida com sucesso! Faça login.");
        setStep(4);
    };

    return (
        <div className="recuperar-container">
            <h2 className="recuperar-titulo">🔑 Recuperar Senha</h2>
            {mensagem && <p className="recuperar-mensagem">{mensagem}</p>}

            {step === 1 && (
                <div className="recuperar-etapa etapa1">
                    <p style={{ fontSize: "1.4rem" }} className="recuperar-instrucao">Digite seu ID ou Email:</p>
                    <input
                        className="recuperar-input"
                        type="text"
                        value={loginField}
                        onChange={(e) => setLoginField(e.target.value)}
                        placeholder="Digite seu ID ou Email"
                    />
                    <button className="recuperar-btn" onClick={handleBuscar}>
                        Continuar
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="recuperar-etapa etapa2">
                    <h3 className="recuperar-subtitulo">Responda suas perguntas de segurança</h3>
                    {perguntas.map((p, i) => (
                        <div key={i} className="recuperar-pergunta-bloco">
                            <label className="recuperar-label">{p}</label>
                            <input
                                className="recuperar-input"
                                type="text"
                                value={respostas[i]}
                                onChange={(e) => {
                                    const novas = [...respostas];
                                    novas[i] = e.target.value;
                                    setRespostas(novas);
                                }}
                                placeholder="Sua resposta"
                            />
                        </div>
                    ))}
                    <button className="recuperar-btn" onClick={handleValidar}>
                        Validar
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="recuperar-etapa etapa3">
                    <h3 className="recuperar-subtitulo">Digite sua nova senha</h3>
                    <input
                        className="recuperar-input"
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="Nova senha"
                    />
                    <input
                        className="recuperar-input"
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="Confirmar senha"
                    />
                    <button className="recuperar-btn" onClick={handleResetarSenha}>
                        Redefinir Senha
                    </button>
                </div>
            )}

            {step === 4 && (
                <div className="recuperar-etapa etapa4">
                    <p className="recuperar-sucesso">✅ Senha alterada com sucesso!</p>
                    <a className="recuperar-link" href="/login">Ir para Login</a>
                </div>
            )}

            <div className="recuperar-rodape">
                <Rodape />
            </div>
        </div>
    );
}