// 📂 src/componentes/Cadastrarse.jsx
import { useState, useEffect } from "react";
import './cadastrarse.css';
import TermosModal from "./termosmodal";
import AlertaTermos from "./alertatermos";
import { useParams, useNavigate } from "react-router-dom";
import { URL } from "../../config";
import ModalFundadores from "./modalfundadores";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Redes from "./redes";

export default function Cadastrarse() {
    const { idHost } = useParams();
    const navigate = useNavigate();

    const [idAnfitiao, setIdAnfitiao] = useState(idHost || "");
    const [hostData, setHostData] = useState(null);
    const [mostrarModalHost, setMostrarModalHost] = useState(false);
    const [mensagemErroHost, setMensagemErroHost] = useState("");
    const [mostrarFAQ, setMostrarFAQ] = useState(false);
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mostrarModalFundadores, setMostrarModalFundadores] = useState(false);
    const [mostrarLinks, setMostrarLinks] = useState(false);
    const [carregandoCadastro, setCarregandoCadastro] = useState(false);

    const [email, setEmail] = useState("");
    const [emailVerificado, setEmailVerificado] = useState(false);

    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [mensagemFinal, setMensagemFinal] = useState("");

    // Funções auxiliares
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function validarSenha(senha) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;])[A-Za-z\d@$!%*?&.,;]{8,}$/;
        return regex.test(senha);
    }

    const handleVerificarHost = async () => {
        try {
            const res = await fetch(`${URL}/public/host/${idAnfitiao}`);
            if (res.ok) {
                const data = await res.json();

                if (idAnfitiao.trim().toLowerCase() === "a00001") {
                    const valorFundador = Number(data.fundadores);
                    if (valorFundador !== 1) {
                        setMostrarModalFundadores(true);
                        return;
                    }
                }

                setHostData(data);
                setMostrarModalHost(true);
                setMensagemErroHost("");
            } else {
                setHostData(null);
                setMensagemErroHost("❌ ID do Host não encontrado.");
            }
        } catch {
            setMensagemErroHost("⚠️ Erro ao conectar com o servidor.");
        }
    };

    const handleProximaEtapa = (e) => {
        e.preventDefault();

        if (!validarSenha(senha)) {
            setMensagemFinal("⚠️ A senha deve ter pelo menos 8 caracteres, incluindo 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.");
            return;
        }

        if (senha !== confirmarSenha) {
            setMensagemFinal("⚠️ As senhas não coincidem.");
            return;
        }

        setMensagemFinal("");
        setMostrarTermos(true);
    };

    const handleCadastroFinal = async () => {
        try {
            const formData = new FormData();
            formData.append("nome", capitalizeFirstLetter(nome.trim()));
            formData.append("sobrenome", capitalizeFirstLetter(sobrenome.trim()));
            formData.append("id_host", idAnfitiao.trim().toLowerCase());
            formData.append("email", email);
            formData.append("senha", senha);
            formData.append("termos_aceitos", 1);

            const res = await fetch(`${URL}/cadastrar`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                // 🔹 Login com FormData (campo correto "login")
                const loginForm = new FormData();
                loginForm.append("login", email); // 👈 backend espera "login"
                loginForm.append("senha", senha);

                const loginRes = await fetch(`${URL}/login`, {
                    method: "POST",
                    body: loginForm
                });

                if (loginRes.ok) {
                    const dados = await loginRes.json();
                    localStorage.setItem("token", dados.token);
                    localStorage.setItem("usuario", JSON.stringify(dados.usuario));
                    localStorage.setItem("usuario_id", dados.usuario.id);

                    // 🔹 redireciona para início com modal de foto
                    window.location.href = "/inicio";
                }
            } else {
                const erro = await res.json();
                if (erro?.erro?.includes("já cadastrado")) {
                    setMensagemFinal("⚠️ Este email já está cadastrado. Faça login ou use outro email.");
                } else {
                    setMensagemFinal(erro?.erro || "Erro no cadastro.");
                }
            }
        } catch {
            setMensagemFinal("⚠️ Erro de conexão com o servidor.");
        }
    };

    useEffect(() => {
        if (idHost) {
            handleVerificarHost();
        }
    }, [idHost]);

    return (
        <>
            <div className="PainelCadastro">

                {/* Host */}
                {hostData && !mostrarModalHost && (
                    <div className="host-box">
                        <p className="host-texto-intro">Seu Host será...</p>
                        <img src={hostData.foto} alt="Foto do Host" className="hhost-foto" />
                        <p className="host-nome">
                            <b>{hostData.nome} {hostData.sobrenome}!!</b>
                        </p>
                        {hostData.cargo_exibido && (
                            <p className="host-cargo">Cargo: {hostData.cargo_exibido}</p>
                        )}
                    </div>
                )}

                {!hostData && (
                    <div className="host-verificacao">
                        <label className="host-label">ID do Host</label>
                        <input
                            type="text"
                            value={idAnfitiao}
                            onChange={(e) => setIdAnfitiao(e.target.value)}
                            placeholder="Digite o ID do Host"
                            className="inputPadrao"
                        />
                        <button onClick={handleVerificarHost} className="btn-verificar-host">Verificar Host</button>
                        {mensagemErroHost && <p className="host-erro">{mensagemErroHost}</p>}
                    </div>
                )}

                {/* Login com Google */}
                {hostData && !mostrarModalHost && !emailVerificado && (
                    <div className="login-google">
                        <h3 className="login-google-titulo">Entre com o Google</h3>
                        <div className="googlecadastro" >
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    const userInfo = jwtDecode(credentialResponse.credential);
                                    setEmail(userInfo.email);
                                    setNome(userInfo.given_name || "");
                                    setSobrenome(userInfo.family_name || "");
                                    setEmailVerificado(true);
                                }}
                                onError={() => console.log("Erro no login com Google")}
                            />

                        </div>
                    </div>
                )}

                {/* Cadastro final */}
                {emailVerificado && (
                    <form className="FormularioLogin">
                        <h3 className="form-titulo">Dados Pessoais</h3>
                        <p className="form-email-info"><b>Email usado:</b> {email}</p>

                        <div className="form-group">
                            <label className="form-label">Nome</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="inputPadrao" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sobrenome</label>
                            <input type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} className="inputPadrao" required />
                        </div>

                        <h3 className="form-titulo">Segurança</h3>
                        <div className="form-group">
                            <label className="form-label">Senha</label>
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="inputPadrao" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirmar Senha</label>
                            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="inputPadrao" required />
                        </div>
                        <button onClick={handleProximaEtapa} className="btn-verde btn-proxima-etapa">Próxima Etapa</button>
                    </form>
                )}
                <br />
                {mensagemFinal && (
                    <div className="alerta-erro">{mensagemFinal}</div>
                )}

                <button className="FaqAzul btn-encontrar-host" onClick={() => setMostrarLinks(true)}>
                    Não tenho um ID do Host, me ajuda achar um
                </button>

                {mostrarLinks && <Redes onClose={() => setMostrarLinks(false)} />}
                {mostrarFAQ && <FAQ onClose={() => setMostrarFAQ(false)} />}
            </div>

            {/* ==== Modais fora do Painel ==== */}
            {mostrarModalHost && hostData && (
                <div className="modalCadastro-overlay">
                    <div className="modalCadastro-host">
                        <h2 className="modal-titulo">Este é o usuário que te recomendou?</h2>
                        <img src={hostData.foto} alt="Foto do Host" className="host-foto" />
                        <h3 className="modal-host-nome">
                            {hostData.nome} {hostData.sobrenome}
                        </h3>
                        {hostData.cargo_exibido && (
                            <p className="modal-host-cargo"><strong>Cargo na plataforma:</strong> <br />  {hostData.cargo_exibido}</p>
                        )}
                        <div className="botoes-modal">
                            <button className="btn-vermelho" onClick={() => { setMostrarModalHost(false); setHostData(null); setIdAnfitiao(""); }}>
                                ❌ Não é esse
                            </button>
                            <button className="btn-verde" onClick={() => setMostrarModalHost(false)}>
                                ✅ Esse mesmo
                            </button>
                        </div>

                        {/* 🔹 Novo botão Ver Portfólio */}
                        <a
                            href={`https://www.irongoals.com/portfolio-publico?id=${hostData.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="btn-portfolio">🎓 Ver Portfólio</button>
                        </a>
                        <br />
                        <br />
                        <button
                            className="btn-conhecer"
                            onClick={() => window.open("/", "_blank")}
                        >
                            Quero conhecer o site antes de fazer o cadastro
                        </button>
                    </div>
                </div>
            )}


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

            {mostrarModalFundadores && <ModalFundadores onClose={() => setMostrarModalFundadores(false)} />}
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