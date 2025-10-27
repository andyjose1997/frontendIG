import { useState, useEffect } from "react";
import "./cadastrarse.css";
import TermosModal from "./termosmodal";
import { useParams } from "react-router-dom";
import { URL } from "../../config";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Cadastrarse() {
    const { idHost, nomeHost } = useParams();

    const [hostData, setHostData] = useState(null);
    const [email, setEmail] = useState("");
    const [emailVerificado, setEmailVerificado] = useState(false);
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [carregandoCadastro, setCarregandoCadastro] = useState(false);
    const [mensagemFinal, setMensagemFinal] = useState("");
    const [carregandoHost, setCarregandoHost] = useState(true);

    // 🔹 Função auxiliar de capitalização
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // 🔹 Cadastro + login automático + redirecionamento
    const handleCadastroFinal = async (e) => {
        e.preventDefault();
        setCarregandoCadastro(true);
        setMensagemFinal("");

        try {
            const formData = new FormData();
            formData.append("nome", capitalizeFirstLetter(nome.trim()));
            formData.append("sobrenome", capitalizeFirstLetter(sobrenome.trim()));
            formData.append("id_host", idHost.trim().toLowerCase());
            formData.append("email", email);
            formData.append("senha", "null");
            formData.append("termos_aceitos", 1);

            const res = await fetch(`${URL}/cadastrar`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                console.log("✅ Cadastro concluído com sucesso!");

                // 🔹 Faz login automático
                const loginForm = new FormData();
                loginForm.append("login", email);
                loginForm.append("senha", "null");

                const loginRes = await fetch(`${URL}/login`, {
                    method: "POST",
                    body: loginForm,
                });

                if (loginRes.ok) {
                    const dados = await loginRes.json();
                    localStorage.setItem("token", dados.token);
                    localStorage.setItem("usuario", JSON.stringify(dados.usuario));
                    localStorage.setItem("usuario_id", dados.usuario.id);

                    // ✅ Redireciona para Boas-Vindas
                    window.location.href = "/boas-vindas";
                } else {
                    setMensagemFinal("⚠️ Erro ao fazer login automático.");
                }
            } else {
                const erro = await res.json();
                setMensagemFinal(erro?.erro || "Erro no cadastro.");
            }
        } catch {
            setMensagemFinal("⚠️ Erro de conexão com o servidor.");
        } finally {
            setCarregandoCadastro(false);
        }
    };

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

                setEmail(userInfo.email);
                setNome(userInfo.given_name || "");
                setSobrenome(userInfo.family_name || "");
                setEmailVerificado(true);
            } catch (error) {
                console.error("Erro ao buscar dados do Google:", error);
                setMensagemFinal("⚠️ Não foi possível verificar sua conta Google.");
            }
        },
        onError: () => setMensagemFinal("⚠️ Erro no login com Google."),
    });

    // 🔹 Buscar informações do Host
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
            } finally {
                setCarregandoHost(false);
            }
        };
        buscarHost();

        // 🔹 Registrar acesso
        fetch(`${URL}/ferramentas/acessos/registrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_host: idHost,
                nome_host: nomeHost,
            }),
        });
    }, [idHost, nomeHost]);
    const frases = [
        "Você está prestes a dar o primeiro passo rumo às suas maiores metas.",
        "Grandes conquistas começam com pequenas decisões.",
        "Acredite no processo, não apenas no resultado.",
        "O futuro pertence a quem se dedica hoje.",
        "Cada meta alcançada é uma vitória sobre quem você era ontem.",
        "A constância transforma o impossível em inevitável.",
        "Você não precisa ser o melhor, só precisa começar.",
        "O esforço de hoje é o sucesso de amanhã.",
        "Não espere motivação, crie disciplina.",
        "Você é capaz de muito mais do que imagina."
    ];

    const [fraseAtual, setFraseAtual] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setFraseAtual((prev) => (prev + 1) % frases.length);
        }, 10000);
        return () => clearInterval(intervalo);
    }, []);

    // 🔹 Exibe tela de carregamento até o host carregar
    if (carregandoHost) {
        return (
            <div className="overlay-carregando">
                <div className="spinner-box">
                    <p>⏳ Carregando...</p>
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="PainelCadastro">
                {/* 🔹 Exibição do Host */}
                {hostData && (
                    <div className="host-box">
                        <h2 key={fraseAtual} className="titulo-boasvindas">
                            {frases[fraseAtual]}
                        </h2>

                        <img src={hostData.foto} alt="Foto do Host" className="hhost-foto" />

                        <p className="host-texto-intro">
                            O responsável pelo seu progresso é{" "}
                            <b className="host-texto-intro-nome">
                                {hostData.nome} {hostData.sobrenome}!
                            </b>
                        </p>

                        {hostData.cargo_exibido && (
                            <p className="host-cargo">Cargo: {hostData.cargo_exibido}</p>
                        )}

                        <a
                            href={`https://www.irongoals.com/portfolio-publico?id=${hostData.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="btn-portfolio">🎓 Ver Portfólio</button>
                        </a>
                    </div>
                )}

                {/* 🔹 Login com Google (botão personalizado) */}
                {!emailVerificado && (
                    <div className="login-google">
                        <h3 className="login-google-titulo">Entre com o Google</h3>
                        <div className="googlecadastro">
                            <button
                                className="btn-google-personalizado"
                                onClick={() => loginComGoogle()}
                            >
                                <img
                                    alt="Google"
                                    className="icon-google"
                                />
                                Entrar com Google
                            </button>
                        </div>
                    </div>
                )}

                {/* 🔹 Formulário de confirmação */}
                {emailVerificado && (
                    <form className="FormularioLogin" onSubmit={handleCadastroFinal}>
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

                        <div
                            className="termos-info-piscando"
                            onClick={() => setMostrarTermos(true)}
                        >
                            ⚖️ Ao se cadastrar, você confirma que é maior de 18 anos e
                            concorda com os{" "}
                            <span className="link-termos">Termos de Uso</span>.
                        </div>

                        <button type="submit" className="btn-verde btn-proxima-etapa">
                            Finalizar Cadastro
                        </button>
                    </form>
                )}

                {mensagemFinal && <div className="alerta-erro">{mensagemFinal}</div>}
            </div>

            {/* 🔹 Modal de Termos */}
            {mostrarTermos && (
                <TermosModal
                    onClose={() => setMostrarTermos(false)}
                    onAceitar={() => setMostrarTermos(false)}
                />
            )}

            {/* 🔹 Tela de carregamento do cadastro final */}
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
