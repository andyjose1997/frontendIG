// 📂 src/componentes/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authcontext';
import './login.css';
import { URL } from '../config';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login({ redirectTo }) {
    const [loginField, setLoginField] = useState('');
    const [senha, setSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // --- Login com ID / Email / WhatsApp ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("login", loginField); // 🔹 pode ser id, email ou whatsapp
            formData.append("senha", senha);

            const res = await fetch(`${URL}/login`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                setMensagem(data?.erro || "Erro ao fazer login.");
                setTipoMensagem("erro");
                return;
            }
            // Salva token e usuário
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            localStorage.setItem("usuario_id", data.usuario.id);

            login(data.usuario, data.token);

            // 🔹 Se veio com redirectTo (ex: modal Avalie-nos), usa ele. Caso contrário vai para /inicio
            navigate(redirectTo || "/inicio");
        } catch (error) {
            setMensagem("Erro de conexão com o servidor.");
            setTipoMensagem("erro");
        }
    };

    // --- Login com Google ---
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const userInfo = jwtDecode(credentialResponse.credential);

            const formData = new FormData();
            formData.append("email", userInfo.email);
            formData.append("nome", userInfo.given_name || "");

            const res = await fetch(`${URL}/login-google`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                setMensagem(data?.erro || "Erro no login com Google.");
                setTipoMensagem("erro");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            localStorage.setItem("usuario_id", data.usuario.id);

            login(data.usuario, data.token);

            // 🔹 Redirecionamento dinâmico
            navigate(redirectTo || "/inicio");

        } catch (err) {
            console.error("Erro no login com Google:", err);
            setMensagem("Erro ao autenticar com Google.");
            setTipoMensagem("erro");
        }
    };

    return (
        <div className="login-container">
            <div className="info-section">
                <h2>Bem-vindo(a)!</h2>
                <p style={{ fontSize: "1.4rem" }} >Ao fazer login, você pode:</p>
                <ul>
                    <li>📚 Acessar cursos organizados e sempre disponíveis</li>
                    <li>🎓 Conquistar certificados reconhecidos na plataforma</li>
                    <li>🤝 Receber suporte direto do seu anfitrião</li>
                    <li>🏆 Evoluir no ranking e desbloquear novas oportunidades</li>
                </ul>
            </div>

            <div className="form-section">
                <h2>Entrar na sua conta</h2>

                {mensagem && (
                    <div className={`mensagem ${tipoMensagem}`}>
                        {mensagem}
                    </div>
                )}

                {/* Login tradicional */}
                <form onSubmit={handleSubmit} className="FormularioLogin">
                    <label style={{ fontSize: "1.4rem" }} >ID, Email ou WhatsApp:</label><br />
                    <input style={{ fontSize: "1.4rem" }}
                        type="text"
                        value={loginField}
                        onChange={(e) => setLoginField(e.target.value)}
                        placeholder="Digite seu ID, email ou WhatsApp"
                    /><br /><br />

                    <label style={{ fontSize: "1.4rem" }} >Senha:</label><br />
                    <div className="senha-wrapper">
                        <input style={{ fontSize: "1.4rem" }}
                            type={showSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <br />
                    <a style={{ fontSize: "1.4rem" }} id="EsqueciMinhaSenha" href="/recuperar-senha">Esqueci minha senha</a>

                    <button id="botaoInicio" type="submit">
                        Entrar
                    </button><br />
                </form>

                <div className="separador">ou</div>

                {/* Login com Google */}
                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setMensagem("Erro no login com Google")}
                    />
                </div>
            </div>
        </div>
    );
}
