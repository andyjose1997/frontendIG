// VerificarEmail.jsx
import { useState } from "react";
import "./Cadastrarse.css";
import { URL } from "../../config";
export default function VerificarEmail({ onVerificado, email, setEmail }) {
    const [aguardandoCodigo, setAguardandoCodigo] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    // 🔹 Função para validar email com regex
    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEnviarCodigo = async () => {
        // 1. Verificação local de formato
        if (!validarEmail(email)) {
            setMensagem("⚠️ Insira um email válido.");
            setTipoMensagem("erro");
            return;
        }

        try {
            // 2. Verificar no backend se email já existe
            const resCheck = await fetch(`${URL}/public/verificar-email-existe?email=${encodeURIComponent(email)}`);
            const dataCheck = await resCheck.json();

            if (resCheck.ok && dataCheck.existe) {
                setMensagem("❌ Este email já está cadastrado.");
                setTipoMensagem("erro");
                return; // não prossegue
            }

            // 3. Se passou nas verificações, envia o código
            const formData = new FormData();
            formData.append("email", email);

            const res = await fetch(`${URL}/enviar-codigo-email`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                setMensagem("📧 Código enviado para seu email.");
                setTipoMensagem("sucesso");
                setAguardandoCodigo(true);
            } else {
                const erro = await res.json();
                setMensagem(erro?.erro || "Erro ao enviar código.");
                setTipoMensagem("erro");
            }
        } catch (err) {
            setMensagem("⚠️ Erro de conexão ao enviar código.");
            setTipoMensagem("erro");
        }
    };

    const handleVerificarCodigo = async () => {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("codigo", codigo);

            const res = await fetch(`${URL}/verificar-email`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                setMensagem("✅ Email verificado com sucesso!");
                setTipoMensagem("sucesso");
                setAguardandoCodigo(false);

                // 🔹 chama função do pai para liberar próxima etapa
                onVerificado();
            } else {
                const erro = await res.json();
                setMensagem(erro?.erro || "Código inválido.");
                setTipoMensagem("erro");
            }
        } catch (err) {
            setMensagem("⚠️ Erro ao verificar código.");
            setTipoMensagem("erro");
        }
    };

    return (
        <div className="verificar-email">
            <label>Email</label><br />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="inputPadrao"
            />
            <button onClick={handleEnviarCodigo}>Enviar Código</button>

            {mensagem && <p className={tipoMensagem}>{mensagem}</p>}

            {aguardandoCodigo && (
                <div className="modalCadastro-overlay">
                    <div className="modalCadastro-host">
                        <h3>Confirme seu email</h3>
                        <p>Digite o código que enviamos para <b>{email}</b></p>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Código de 6 dígitos"
                            className="inputPadrao"
                        />
                        <button onClick={handleVerificarCodigo}>Confirmar Código</button>
                    </div>
                </div>
            )}
        </div>
    );
}
