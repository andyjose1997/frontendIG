// 📂 src/componentes/Cadastrarse.jsx
import { useState, useEffect } from "react";
import "./cadastrarse.css";
import TermosModal from "./termosmodal";
import AlertaTermos from "./alertatermos";
import { useParams } from "react-router-dom";
import { URL } from "../../config";
import { jwtDecode } from "jwt-decode";

export default function Cadastrarse() {
    const { idHost, nomeHost } = useParams();

    const [hostData, setHostData] = useState(null);
    const [email, setEmail] = useState("");
    const [emailVerificado, setEmailVerificado] = useState(false);
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [mensagemFinal, setMensagemFinal] = useState("");
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [carregandoCadastro, setCarregandoCadastro] = useState(false);

    // 🔹 Funções auxiliares
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function validarSenha(senha) {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;])[A-Za-z\d@$!%*?&.,;]{8,}$/;
        return regex.test(senha);
    }

    // 🔹 Etapa: Próxima Etapa (verificação de senha)
    const handleProximaEtapa = (e) => {
        e.preventDefault();

        if (!validarSenha(senha)) {
            setMensagemFinal(
                "⚠️ A senha deve ter pelo menos 8 caracteres, incluindo 1 maiúscula, 1 minúscula, 1 número e 1 símbolo."
            );
            return;
        }

        if (senha !== confirmarSenha) {
            setMensagemFinal("⚠️ As senhas não coincidem.");
            return;
        }

        setMensagemFinal("");
        setMostrarTermos(true);
    };

    // 🔹 Etapa: Cadastro final
    const handleCadastroFinal = async () => {
        try {
            const formData = new FormData();
            formData.append("nome", capitalizeFirstLetter(nome.trim()));
            formData.append("sobrenome", capitalizeFirstLetter(sobrenome.trim()));
            formData.append("id_host", idHost.trim().toLowerCase());
            formData.append("email", email);
            formData.append("senha", senha);
            formData.append("termos_aceitos", 1);

            const res = await fetch(`${URL}/cadastrar`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const loginForm = new FormData();
                loginForm.append("login", email);
                loginForm.append("senha", senha);

                const loginRes = await fetch(`${URL}/login`, {
                    method: "POST",
                    body: loginForm,
                });

                if (loginRes.ok) {
                    const dados = await loginRes.json();
                    localStorage.setItem("token", dados.token);
                    localStorage.setItem("usuario", JSON.stringify(dados.usuario));
                    localStorage.setItem("usuario_id", dados.usuario.id);
                    window.location.href = "/inicio";
                }
            } else {
                const erro = await res.json();
                if (erro?.erro?.includes("já cadastrado")) {
                    setMensagemFinal(
                        "⚠️ Este email já está cadastrado. Faça login ou use outro email."
                    );
                } else {
                    setMensagemFinal(erro?.erro || "Erro no cadastro.");
                }
            }
        } catch {
            setMensagemFinal("⚠️ Erro de conexão com o servidor.");
        }
    };

    // 🔹 Login automático com Google One Tap
    useEffect(() => {
        /* global google */
        const initGoogle = () => {
            if (window.google?.accounts) {
                window.google.accounts.id.initialize({
                    client_id: "337060969671-5d1v2uv4ebkchts1eodkdka4caclginf.apps.googleusercontent.com",
                    callback: (response) => {
                        const userInfo = jwtDecode(response.credential);
                        setEmail(userInfo.email);
                        setNome(userInfo.given_name || "");
                        setSobrenome(userInfo.family_name || "");
                        setEmailVerificado(true);
                    },
                    auto_select: false, // mostra a lista de contas
                });
                window.google.accounts.id.prompt(); // mostra a seleção no topo
            }
        };
        initGoogle();
    }, []);

    // 🔹 Carregar dados do host automaticamente
    useEffect(() => {
        if (!idHost) return;
        const buscarHost = async () => {
            try {
                const res = await fetch(`${URL}/public/host/${idHost}`);
                if (res.ok) {
                    const data = await res.json();
                    setHostData(data);
                } else {
                    setHostData(null);
                    setMensagemFinal("⚠️ Host não encontrado.");
                }
            } catch {
                setMensagemFinal("⚠️ Erro ao carregar informações do host.");
            }
        };
        buscarHost();

        // 🔹 Registrar acesso para estatísticas
        fetch(`${URL}/ferramentas/acessos/registrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_host: idHost,
                nome_host: nomeHost,
            }),
        });
    }, [idHost, nomeHost]);

    return (
        <>
            <div className="PainelCadastro">
                {/* 🔹 Exibição do Host automático */}
                {hostData && (
                    <div className="host-box">
                        <h2 className="titulo-boasvindas">
                            Você está prestes a dar o primeiro passo rumo às suas maiores metas.
                        </h2>

                        <img
                            src={hostData.foto}
                            alt="Foto do Host"
                            className="hhost-foto"
                        />

                        <p className="host-texto-intro">
                            O responsável pelo seu progresso é{" "}
                            <b className="host-texto-intro-nome">
                                {hostData.nome} {hostData.sobrenome}!
                            </b>
                        </p>

                        {hostData.cargo_exibido && (
                            <p className="host-cargo">Cargo: {hostData.cargo_exibido}</p>
                        )}

                        {/* 🔹 Botão de Ver Portfólio */}
                        <a
                            href={`https://www.irongoals.com/portfolio-publico?id=${hostData.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="btn-portfolio">🎓 Ver Portfólio</button>
                        </a>
                    </div>
                )}

                {!emailVerificado && (
                    <div className="login-google">
                        <h3 className="login-google-titulo">
                            Selecione seu e-mail para continuar
                        </h3>
                        <p className="login-google-subtexto">
                            Use uma conta Google conectada ao seu navegador
                        </p>
                    </div>
                )}

                {/* 🔹 Etapa de formulário (dados pessoais e senha) */}
                {emailVerificado && (
                    <form className="FormularioLogin">
                        <h3 className="form-titulo">Dados Pessoais</h3>
                        <p className="form-email-info">
                            <b>Email usado:</b> {email}
                        </p>

                        <div className="form-group">
                            <label className="form-label">Nome</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="inputPadrao"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sobrenome</label>
                            <input
                                type="text"
                                value={sobrenome}
                                onChange={(e) => setSobrenome(e.target.value)}
                                className="inputPadrao"
                                required
                            />
                        </div>

                        <h3 className="form-titulo">Segurança</h3>
                        <div className="form-group">
                            <label className="form-label">Senha</label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="inputPadrao"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirmar Senha</label>
                            <input
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className="inputPadrao"
                                required
                            />
                        </div>

                        <button
                            onClick={handleProximaEtapa}
                            className="btn-verde btn-proxima-etapa"
                        >
                            Próxima Etapa
                        </button>
                    </form>
                )}

                {mensagemFinal && <div className="alerta-erro">{mensagemFinal}</div>}
            </div>

            {/* ==== Modais ==== */}
            {mostrarTermos && (
                <TermosModal
                    onClose={() => setMostrarTermos(false)}
                    onAceitar={async () => {
                        try {
                            const res = await fetch(`${URL}/cadastrar/verificar-email/${email}`);
                            const dados = await res.json();

                            if (dados.existe) {
                                setMostrarAlerta(true);
                                setMensagemFinal("⚠️ Este email já está cadastrado.");
                                return;
                            }

                            setAceitouTermos(true);
                            setMostrarTermos(false);
                            setCarregandoCadastro(true);
                            await handleCadastroFinal();
                            setCarregandoCadastro(false);
                        } catch {
                            setMostrarAlerta(true);
                            setMensagemFinal("⚠️ Erro ao verificar email no servidor.");
                            setCarregandoCadastro(false);
                        }
                    }}
                />
            )}

            {mostrarAlerta && (
                <AlertaTermos
                    mensagem={mensagemFinal}
                    onClose={() => setMostrarAlerta(false)}
                />
            )}

            {carregandoCadastro && (
                <div className="overlay-carregando">
                    <div className="spinner-box">
                        <p>⏳ Espere...</p>
                    </div>
                </div>
            )}
        </>
    );
}
