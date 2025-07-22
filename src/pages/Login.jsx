import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const [errors, setErrors] = useState({ email: '', senha: '' });
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState(''); // ex: 'erro', 'sucesso'

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors(prev => ({
            ...prev,
            email: !value.includes('@') ? 'Email inválido' : ''
        }));
    };

    const handleSenhaChange = (e) => {
        const value = e.target.value;
        setSenha(value);
        setErrors(prev => ({
            ...prev,
            senha: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("senha", senha);

            const response = await fetch("http://localhost:8899/login", {
                method: "POST",
                body: formData,
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                const texto = await response.text();
                console.error("❌ Erro ao converter JSON:", e);
                console.error("📄 Resposta crua do backend:", texto);
                setMensagem("Resposta inesperada do servidor.");
                setTipoMensagem("erro");
                return;
            }

            console.log("🔁 Dados recebidos do backend:", data);

            if (!response.ok) {
                if (data?.erro === "Email não encontrado") {
                    setMensagem("Email não encontrado.");
                } else if (data?.erro === "Senha incorreta") {
                    setMensagem("Senha incorreta.");
                } else {
                    setMensagem(data?.erro || "Erro ao fazer login.");
                }
                setTipoMensagem("erro");
                return;
            }

            if (!data || !data.token || !data.usuario) {
                console.error("❌ Resposta inesperada:", data);
                setMensagem("Resposta inesperada do servidor.");
                setTipoMensagem("erro");
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            console.log("⚠️ Usuario recebido:", data.usuario);   // <-- para inspecionar
            localStorage.setItem('user_id', data.usuario.id);    // <-- ou id_usuario, dependendo do que for recebido

            localStorage.setItem('user_id', data.usuario.id);  // ✅ adicione esta linha

            login(data.usuario, data.token);

            console.log("✅ Login realizado, redirecionando...");
            navigate("/inicio");
        } catch (error) {
            console.error("Erro ao logar:", error);
            setMensagem("Erro de conexão com o servidor.");
            setTipoMensagem("erro");
        }
    };

    return (
        <div className="login-container">
            <div className="info-section">
                <h2>Bem-vindo(a)!</h2>
                <p>Ao fazer login, você pode:</p>
                <ul>
                    <li>✅ Acompanhar seus cursos</li>
                    <li>✅ Gerar certificados</li>
                    <li>✅ Falar com seu Host</li>
                    <li>✅ Participar do ranking de alunos</li>
                </ul>
                <p className="depoimento">
                    “A IronGoals me ajudou a crescer profissionalmente em pouco tempo!”
                </p>
                <p className="autor">- Depoimento de um usuário satisfeito</p>
            </div>

            <div className="form-section">
                <h2>Entrar na sua conta</h2>

                {mensagem && (
                    <div className={`mensagem ${tipoMensagem}`}>
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="FormularioLogin">
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Digite seu email"
                    /><br /><br />

                    <label>Senha:</label><br />
                    <div className="senha-wrapper">
                        <input
                            type={showSenha ? "text" : "password"}
                            value={senha}
                            onChange={handleSenhaChange}
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <br /><br />
                    <a id="EsqueciMinhaSenha" href="#">Esqueci minha senha</a><br /><br />

                    <button id="botaoInicio" type="submit">
                        Entrar
                    </button><br />
                </form>
            </div>
        </div>
    );
}
