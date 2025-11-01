// 📂 src/pages/annetstudios/ParceriaAnnet.jsx
import { useState, useEffect } from "react";
import "./parceria.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { URL } from "../../../config";

export default function ParceriaAnnet() {
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [fraseAtual, setFraseAtual] = useState(0);

    // 🔹 Frases explicativas (mudam automaticamente)
    const frases = [
        "A IronGoals é uma plataforma onde você aprende com vídeos, faz testes e conquista certificados.",
        "Monte seu portfólio profissional e mostre suas habilidades para empresas e clientes.",
        "Participe de desafios, ganhe pontos e suba no ranking da comunidade IronGoals.",
        "Aqui suas metas se tornam resultados — estudo, prática e conquistas reais.",
        "Acesse cursos, certificados e oportunidades de forma simples e gratuita.",
        "Use sua conta Google para entrar e começar a transformar seu aprendizado em resultados."
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setUsuarioLogado(true);
    }, []);

    // alternar frases a cada 10 segundos
    useEffect(() => {
        const intervalo = setInterval(() => {
            setFraseAtual((prev) => (prev + 1) % frases.length);
        }, 10000);
        return () => clearInterval(intervalo);
    }, []);

    // 🔹 LOGIN GOOGLE
    const loginComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfoRes = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );
                const userInfo = userInfoRes.data;
                const formData = new FormData();
                formData.append("email", userInfo.email);
                formData.append("nome", userInfo.given_name || "");

                const res = await fetch(`${URL}/login-google`, { method: "POST", body: formData });
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("usuario", JSON.stringify(data.usuario));
                    localStorage.setItem("usuario_id", data.usuario.id);
                    window.location.reload();
                } else {
                    alert(data?.erro || "Erro ao fazer login com Google.");
                }
            } catch {
                alert("⚠️ Erro ao verificar conta Google.");
            }
        },
        onError: () => alert("⚠️ Erro no login com Google."),
    });

    // 🔹 CADASTRO GOOGLE (com id_host fixo “a00004”)
    const cadastroComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfoRes = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );
                const userInfo = userInfoRes.data;
                const formData = new FormData();
                formData.append("nome", userInfo.given_name || "");
                formData.append("sobrenome", userInfo.family_name || "");
                formData.append("id_host", "a00004");
                formData.append("email", userInfo.email);
                formData.append("senha", "null");
                formData.append("termos_aceitos", 1);

                const res = await fetch(`${URL}/cadastrar`, { method: "POST", body: formData });
                if (res.ok) {
                    const loginForm = new FormData();
                    loginForm.append("login", userInfo.email);
                    loginForm.append("senha", "null");
                    const loginRes = await fetch(`${URL}/login`, { method: "POST", body: loginForm });
                    if (loginRes.ok) {
                        const dados = await loginRes.json();
                        localStorage.setItem("token", dados.token);
                        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
                        localStorage.setItem("usuario_id", dados.usuario.id);
                        window.location.reload();
                    }
                } else {
                    const erro = await res.json();
                    alert(erro?.erro || "Erro ao cadastrar.");
                }
            } catch {
                alert("⚠️ Erro de conexão no cadastro.");
            }
        },
        onError: () => alert("⚠️ Erro no cadastro com Google."),
    });

    return (
        <section className="parceriaannet-container" id="parcerias">
            <h2>Annett Studio <br /> Onde sua beleza encontra arte</h2>
            <p>✨ Em parceria com</p>
            <h2 className="titulo-iron"> <b>IronGoals</b> <br />Onde suas metas se tornam resultados.</h2>


            <div className="parceriaannet-logos">
                <img
                    className="parceriaannet-logo-img"
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/logo.png"
                    alt="Annett Studios"
                />
                <div className="parceriaannet-linha"></div>
                <img
                    className="parceriaannet-logo-img"
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/fotosdeperfis/perfis/I_round.png"
                    alt="IronGoals"
                />
            </div>

            {!usuarioLogado && (
                <button style={{ display: "none" }} className="parceriaannet-btn" onClick={() => setMostrarLogin(true)}>
                    🔑 Abrir conta
                </button>
            )}

            {/* 🔹 MODAL LOGIN */}
            {mostrarLogin && (
                <div className="parceriaannet-modal-overlay" onClick={() => setMostrarLogin(false)}>
                    <div className="parceriaannet-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Entrar na sua conta</h2>
                        <h3 key={fraseAtual} className="frase-inspiradora">
                            {frases[fraseAtual]}
                        </h3>

                        <button className="btn-google-iron" onClick={() => loginComGoogle()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="google-icon">
                                <path fill="#EA4335" d="M24 9.5c3.94 0 6.58 1.7 8.09 3.13l5.91-5.9C34.08 3.14 29.41 1 24 1 14.82 1 7.06 6.58 3.9 14.1l6.88 5.35C12.26 14.21 17.68 9.5 24 9.5z" />
                                <path fill="#34A853" d="M46.5 24.5c0-1.61-.15-3.14-.43-4.62H24v9.08h12.65c-.55 2.96-2.22 5.46-4.72 7.15l7.24 5.63C43.86 37.56 46.5 31.48 46.5 24.5z" />
                                <path fill="#4A90E2" d="M9.9 28.25a14.47 14.47 0 010-8.5l-6.88-5.35A23.86 23.86 0 000 24c0 3.9.94 7.59 2.62 10.87l7.28-5.62z" />
                                <path fill="#FBBC05" d="M24 47c6.41 0 11.79-2.12 15.72-5.78l-7.24-5.63c-2.01 1.36-4.58 2.16-8.48 2.16-6.32 0-11.74-4.71-13.22-11.05l-7.28 5.62C7.06 41.42 14.82 47 24 47z" />
                            </svg>
                            <span>Fazer login com Google</span>
                        </button>

                        <p className="texto-menor">Ainda sem conta?</p>
                        <button
                            className="btn-cadastrar"
                            onClick={() => {
                                setMostrarLogin(false);
                                setMostrarCadastro(true);
                            }}
                        >
                            📝 Cadastrar-se
                        </button>

                        <button
                            className="btn-conhecer"
                            onClick={() => window.open("https://www.irongoals.com", "_blank")}
                        >
                            🌐 Quero conhecer
                        </button>
                    </div>
                </div>
            )}

            {/* 🔹 MODAL CADASTRO */}
            {mostrarCadastro && (
                <div className="parceriaannet-modal-overlay" onClick={() => setMostrarCadastro(false)}>
                    <div className="parceriaannet-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Crie sua conta gratuita</h2>
                        <h3 key={fraseAtual} className="frase-inspiradora">
                            {frases[fraseAtual]}
                        </h3>

                        <button className="btn-google-iron" onClick={() => cadastroComGoogle()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="google-icon">
                                <path fill="#EA4335" d="M24 9.5c3.94 0 6.58 1.7 8.09 3.13l5.91-5.9C34.08 3.14 29.41 1 24 1 14.82 1 7.06 6.58 3.9 14.1l6.88 5.35C12.26 14.21 17.68 9.5 24 9.5z" />
                                <path fill="#34A853" d="M46.5 24.5c0-1.61-.15-3.14-.43-4.62H24v9.08h12.65c-.55 2.96-2.22 5.46-4.72 7.15l7.24 5.63C43.86 37.56 46.5 31.48 46.5 24.5z" />
                                <path fill="#4A90E2" d="M9.9 28.25a14.47 14.47 0 010-8.5l-6.88-5.35A23.86 23.86 0 000 24c0 3.9.94 7.59 2.62 10.87l7.28-5.62z" />
                                <path fill="#FBBC05" d="M24 47c6.41 0 11.79-2.12 15.72-5.78l-7.24-5.63c-2.01 1.36-4.58 2.16-8.48 2.16-6.32 0-11.74-4.71-13.22-11.05l-7.28 5.62C7.06 41.42 14.82 47 24 47z" />
                            </svg>
                            <span>Cadastrar com Google</span>
                        </button>

                        <button
                            className="btn-conhecer"
                            onClick={() => window.open("https://www.irongoals.com", "_blank")}
                        >
                            🌐 Quero conhecer
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
