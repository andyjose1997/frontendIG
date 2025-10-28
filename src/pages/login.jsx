// 📂 src/componentes/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authcontext';
import './login.css';
import { URL } from '../config';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login({ redirectTo }) {
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    // 🔹 Frases inspiradoras
    const frases = [
        "Você está prestes a transformar sua jornada em algo extraordinário.",
        "Cada meta alcançada começa com um simples passo de fé.",
        "A constância vence o talento quando o talento não se esforça.",
        "O sucesso é construído um dia de cada vez.",
        "Acredite no processo, mesmo quando os resultados ainda não apareceram.",
        "Grandes conquistas nascem de pequenas decisões diárias.",
        "Você é o protagonista da sua história. Comece hoje!",
        "O futuro pertence a quem age, não apenas a quem sonha.",
        "Persistir é a prova mais pura de fé em si mesmo.",
        "Seja constante — o tempo recompensa quem não desiste."
    ];

    const [fraseAtual, setFraseAtual] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setFraseAtual((prev) => (prev + 1) % frases.length);
        }, 10000); // muda a cada 10 segundos

        return () => clearInterval(intervalo);
    }, []);

    // 🔹 Login via Google com botão personalizado
    const loginComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfoRes = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const userInfo = userInfoRes.data;
                console.log("🔹 Google user info:", userInfo);

                // Envia para backend
                const formData = new FormData();
                formData.append("email", userInfo.email);
                formData.append("nome", userInfo.given_name || "");

                const res = await fetch(`${URL}/login-google`, {
                    method: "POST",
                    body: formData,
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
                navigate(redirectTo || "/inicio");
            } catch (error) {
                console.error("Erro ao buscar dados do Google:", error);
                setMensagem("⚠️ Não foi possível verificar sua conta Google.");
                setTipoMensagem("erro");
            }
        },
        onError: () => setMensagem("⚠️ Erro no login com Google."),
    });

    return (
        <div className="login-container">
            <div className="info-section">
                <h2>Bem-vindo(a)!</h2>
                <p style={{ fontSize: "1.4rem" }}>Ao fazer login, você pode:</p>
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
                {/* 🔹 Frases inspiradoras dinâmicas */}
                <h2 key={fraseAtual} className="frase-inspiradora">
                    {frases[fraseAtual]}
                </h2>

                {/* 🔹 Botão personalizado do Google */}
                <div className="google-login-area">
                    <h3 className="login-google-titulo">Entre com o Google</h3>
                    <button className="btn-google-iron" onClick={() => loginComGoogle()}>
                        <div className="google-icon-wrap">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="google-icon"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.94 0 6.58 1.7 8.09 3.13l5.91-5.9C34.08 3.14 29.41 1 24 1 14.82 1 7.06 6.58 3.9 14.1l6.88 5.35C12.26 14.21 17.68 9.5 24 9.5z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M46.5 24.5c0-1.61-.15-3.14-.43-4.62H24v9.08h12.65c-.55 2.96-2.22 5.46-4.72 7.15l7.24 5.63C43.86 37.56 46.5 31.48 46.5 24.5z"
                                />
                                <path
                                    fill="#4A90E2"
                                    d="M9.9 28.25a14.47 14.47 0 010-8.5l-6.88-5.35A23.86 23.86 0 000 24c0 3.9.94 7.59 2.62 10.87l7.28-5.62z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M24 47c6.41 0 11.79-2.12 15.72-5.78l-7.24-5.63c-2.01 1.36-4.58 2.16-8.48 2.16-6.32 0-11.74-4.71-13.22-11.05l-7.28 5.62C7.06 41.42 14.82 47 24 47z"
                                />
                            </svg>
                        </div>
                        <span className="google-text">Fazer login com Google</span>
                    </button>

                </div>
            </div>
        </div>
    );
}
