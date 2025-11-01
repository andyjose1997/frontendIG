// 📂 src/pages/annetstudios/annetrotas/formannet.jsx
import { useEffect, useState } from "react";
import "./formulario.css";
import FormularioDois from "./formulariodois";
import { URL } from "../../../config";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Formannet() {
    const [maiorIdade, setMaiorIdade] = useState(null);
    const [temPermissao, setTemPermissao] = useState(false);
    const [etapa, setEtapa] = useState("formulario");
    const [usuario, setUsuario] = useState({});
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [cadastroPendente, setCadastroPendente] = useState(false);
    const [termos, setTermos] = useState([]);
    const [carregandoTermos, setCarregandoTermos] = useState(true);
    const [erroTermos, setErroTermos] = useState("");
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [condicao, setCondicao] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    // 🔹 Buscar dados do usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setUsuarioLogado(true);

        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUsuario(data))
            .catch((err) => console.error("Erro ao carregar perfil:", err));
    }, []);

    // 🔹 Carregar termos de uso
    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await fetch(`${URL}/termos`);
                if (!res.ok) throw new Error("Erro ao carregar termos");
                const data = await res.json();
                setTermos(data);
            } catch {
                setErroTermos("⚠️ Não foi possível carregar os Termos de Uso.");
            } finally {
                setCarregandoTermos(false);
            }
        };
        carregar();
    }, []);

    // 🔹 Fundo da página
    useEffect(() => {
        document.body.style.background =
            "linear-gradient(135deg, #e3c1b3, #d3a998, #c7988a)";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.boxShadow = "inset 0 0 80px rgba(255, 255, 255, 0.05)";
        return () => {
            document.body.style.background = "";
            document.body.style.boxShadow = "";
        };
    }, []);

    // ========================================================
    // 🔹 LOGIN GOOGLE
    // ========================================================
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

    // ========================================================
    // 🔹 CADASTRO GOOGLE
    // ========================================================
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
                formData.append("id_host", "a00041");
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

    // ========================================================
    // 🔹 Se não estiver logado
    // ========================================================
    if (!usuarioLogado) {
        return (
            <main className="formannet-container">
                <h1 className="formannet-titulo">Agendamento — Annett Studios</h1>
                <p className="formannet-subtitulo">
                    Para garantir uma melhor experiência, é necessário estar logado
                    na sua conta IronGoals antes de agendar um serviço.
                </p>

                {!cadastroPendente ? (
                    <>
                        <button className="formannet-btn" onClick={() => loginComGoogle()}>
                            🔑 Entrar com Google
                        </button>
                        <button
                            className="formannet-btn"
                            style={{ marginTop: "10px" }}
                            onClick={() => setCadastroPendente(true)}
                        >
                            📝 Criar conta gratuita
                        </button>
                    </>
                ) : (
                    <div className="cadastro-area">
                        <button className="formannet-btn" onClick={() => cadastroComGoogle()}>
                            🪪 Escolher e-mail Google
                        </button>
                        <p className="formannet-termos">
                            Ao se cadastrar, você aceita os Termos de Uso abaixo.
                        </p>
                        <div className="formannet-termos-area">
                            <h2>Termos de Uso da IronGoals</h2>
                            {carregandoTermos && <p>⏳ Carregando termos...</p>}
                            {erroTermos && <p style={{ color: "red" }}>{erroTermos}</p>}
                            {!carregandoTermos && !erroTermos && (
                                <ol className="formannet-termos-lista">
                                    {termos
                                        .filter((t) => t.cadastro && t.cadastro.trim() !== "")
                                        .map((t) => (
                                            <li key={t.id}>{t.cadastro}</li>
                                        ))}
                                </ol>
                            )}
                        </div>
                    </div>
                )}
            </main>
        );
    }

    // ========================================================
    // 🔹 Etapa 2 — serviços
    // ========================================================
    if (etapa === "servicos") {
        return (
            <FormularioDois
                onVoltar={() => setEtapa("formulario")}
                maiorIdade={maiorIdade ? 1 : 0}
                temPermissao={temPermissao ? 1 : 0}
                nomeResponsavel={nomeResponsavel}
                condicao={condicao}
                whatsapp={whatsapp || usuario.whatsapp || ""}
                nomeCompleto={
                    usuario.nome && usuario.sobrenome
                        ? `${usuario.nome} ${usuario.sobrenome}`
                        : usuario.nome_completo || usuario.nome || ""
                }
            />

        );
    }

    // ========================================================
    // 🔹 Etapa 1 — formulário principal
    // ========================================================
    return (
        <main className="formannet-container">
            <p className="formannet-etapa">Etapa 1/3</p><br />
            <h1 className="formannet-titulo">Agendamento — Annett Studios</h1>
            <p className="formannet-subtitulo">
                Preencha o formulário abaixo para agendar seu serviço.
                Todas as informações são confidenciais e usadas apenas para garantir sua segurança.
            </p>

            <form
                className="formannet-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!maiorIdade && !temPermissao) {
                        alert("⚠️ É necessário permissão do responsável para continuar.");
                        return;
                    }
                    setEtapa("servicos");
                }}
            >
                <label>
                    Nome completo:
                    <input
                        type="text"
                        required
                        value={
                            usuario.nome_completo
                                ? usuario.nome_completo
                                : usuario.nome && usuario.sobrenome
                                    ? `${usuario.nome} ${usuario.sobrenome}`
                                    : usuario.nome || ""
                        }
                    />

                </label>

                <label>
                    É maior de idade?
                    <div className="formannet-radio-grupo">
                        <label>
                            <input
                                type="radio"
                                name="idade"
                                onChange={() => setMaiorIdade(true)}
                            />{" "}
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="idade"
                                onChange={() => setMaiorIdade(false)}
                            />{" "}
                            Não
                        </label>
                    </div>
                </label>

                {!maiorIdade && maiorIdade !== null && (
                    <div className="formannet-menor-area">
                        <label>
                            Nome completo do responsável:
                            <input
                                type="text"
                                value={nomeResponsavel}
                                onChange={(e) => setNomeResponsavel(e.target.value)}
                                required={!maiorIdade}
                            />
                        </label>

                        <label>
                            Tenho permissão do meu responsável para realizar o serviço:
                            <select
                                onChange={(e) =>
                                    setTemPermissao(e.target.value === "sim")
                                }
                            >
                                <option value="">Selecione</option>
                                <option value="sim">Sim</option>
                                <option value="nao">Não</option>
                            </select>
                        </label>
                    </div>
                )}

                <label>
                    WhatsApp:
                    <input
                        type="text"
                        placeholder="(DDD) 99999-9999"
                        value={whatsapp || usuario.whatsapp || ""}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Possui alguma condição médica ou alergia?
                    <textarea
                        value={condicao}
                        onChange={(e) => setCondicao(e.target.value)}
                        placeholder="Esta informação é confidencial e não será compartilhada."
                    ></textarea>
                </label>

                <button
                    type="submit"
                    disabled={!maiorIdade && !temPermissao}
                    className="formannet-btn"
                >
                    Próximo Passo
                </button>
            </form>
        </main>
    );
}
