// 📂 src/componentes/configuracoes/DadosConta.jsx
import { useEffect, useState } from 'react';
import './dadosconta.css';
import { URL } from '../../../config';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function DadosConta({ onVoltar }) {
    const [dados, setDados] = useState(null);
    const [editandoCampo, setEditandoCampo] = useState(null);

    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [emailSecundario, setEmailSecundario] = useState("");
    const [frase, setFrase] = useState("");
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);

    const [alerta, setAlerta] = useState("");

    useEffect(() => {
        buscarDadosConta();
    }, []);

    const buscarDadosConta = async () => {
        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch(`${URL}/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await resposta.json();
            setDados(data);

            setNome(data.nome || "");
            setSobrenome(data.sobrenome || "");
            setEmail(data.email || "");
            setEmailSecundario(data.email_secundario || "");
            setFrase(data.comentario_perfil || "");
            setNotificacoesAtivas(data.notificacoes || false);

        } catch {
            setAlerta("❌ Erro ao carregar dados da conta.");
            setTimeout(() => setAlerta(""), 2000);
        }
    };
    const confirmarSalvar = async () => {
        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch(`${URL}/perfil/atualizar_perfil`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    sobrenome: sobrenome.trim(),
                    email: email.trim(),
                    email_secundario: emailSecundario.trim(),
                    comentario_perfil: frase,
                    notificacoes: notificacoesAtivas,
                    senha: "google_autenticado"
                })
            });

            const data = await resposta.json();

            if (data.erro) {
                setAlerta("❌ Erro ao atualizar dados.");
                setTimeout(() => setAlerta(""), 2000);
                return;
            }

            setAlerta("✅ Dados atualizados com sucesso!");
            setTimeout(() => {
                setAlerta("");
                window.location.href = "/perfil"; // 🔹 redireciona direto para o perfil
            }, 1500);
        } catch {
            setAlerta("❌ Erro ao salvar alterações.");
            setTimeout(() => setAlerta(""), 2000);
        }
    };


    const renderCampo = (campo, valor, setValor) => {
        if (editandoCampo === campo) {
            return (
                <input
                    type="text"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    onBlur={() => setEditandoCampo(null)}
                    autoFocus
                    style={{ fontSize: '16px', width: '100%', padding: '5px' }}
                />
            );
        } else {
            return (
                <span onClick={() => setEditandoCampo(campo)} style={{ cursor: 'pointer' }}>
                    {valor || "(Clique para editar)"}
                </span>
            );
        }
    };

    // 🔹 Login com Google para confirmar identidade
    const loginComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const emailGoogle = userInfo.data.email;
                console.log("Email do Google:", emailGoogle);

                if (emailGoogle.trim().toLowerCase() === email.trim().toLowerCase()) {
                    confirmarSalvar(); // ✅ mesmo email, pode salvar
                } else {
                    setAlerta("❌ O e-mail selecionado não corresponde ao da conta.");
                    setTimeout(() => setAlerta(""), 2500);
                }
            } catch (err) {
                console.error("Erro ao validar login Google:", err);
                setAlerta("❌ Erro ao autenticar com o Google.");
                setTimeout(() => setAlerta(""), 2500);
            }
        },
        onError: () => {
            setAlerta("❌ Erro ao conectar com o Google.");
            setTimeout(() => setAlerta(""), 2500);
        },
    });

    return (
        <section className="privacidade-config">
            <h2>👤 Dados da Conta</h2>
            <h4>clique em cada area para editar</h4>

            <p><strong>Nome:</strong> {renderCampo("nome", nome, setNome)}</p>
            <p><strong>Sobrenome:</strong> {renderCampo("sobrenome", sobrenome, setSobrenome)}</p>
            <p style={{ display: "none" }}><strong>Email:</strong> {renderCampo("email", email, setEmail)}</p>
            <p style={{ display: "none" }}><strong>Email Secundário (recuperação):</strong> {renderCampo("email_secundario", emailSecundario, setEmailSecundario)}</p>
            <p><strong>Próxima Meta:</strong> {renderCampo("frase", frase, setFrase)}</p>

            <div style={{ marginTop: '20px', display: "none" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={notificacoesAtivas}
                        onChange={e => setNotificacoesAtivas(e.target.checked)}
                    />
                    Ativar Notificações
                </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                <button
                    className="botao-config"
                    onClick={() => loginComGoogle()}
                >
                    Salvar Alterações
                </button>


            </div>

            {alerta && <div className="toasta-alerta">{alerta}</div>}
        </section>
    );
}
