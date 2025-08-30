// Cadastrarse.jsx
import { useState, useEffect } from "react";
import './Cadastrarse.css';
import VerificarEmail from "./VerificarEmail";
import EscolherFotoPerfil from "./EscolherFotoPerfil";
import FAQ from "./FAQ";
import TermosModal from "./TermosModal";
import AlertaTermos from "./AlertaTermos";
import { useParams } from "react-router-dom";
import { URL } from "../../config";

export default function Cadastrarse() {
    const { idHost } = useParams(); // pega o valor da URL
    const [idAnfitiao, setIdAnfitiao] = useState(idHost || "");
    const [hostData, setHostData] = useState(null);
    const [mostrarModalHost, setMostrarModalHost] = useState(false);
    const [mensagemErroHost, setMensagemErroHost] = useState("");
    const [mostrarFAQ, setMostrarFAQ] = useState(false);
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const [email, setEmail] = useState("");
    const [emailVerificado, setEmailVerificado] = useState(false);

    // 🔹 Campos do cadastro final
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [mensagemFinal, setMensagemFinal] = useState("");
    const [mostrarEscolherFoto, setMostrarEscolherFoto] = useState(false); // 🔹 controla modal de foto

    const handleVerificarHost = async () => {
        try {
            const res = await fetch(`${URL}/public/host/${idAnfitiao}`);
            if (res.ok) {
                const data = await res.json();
                setHostData(data);
                setMostrarModalHost(true);
                setMensagemErroHost("");
            } else {
                setHostData(null);
                setMensagemErroHost("❌ ID do Host não encontrado.");
            }
        } catch (err) {
            setMensagemErroHost("⚠️ Erro ao conectar com o servidor.");
        }
    };
    // 🔹 Função auxiliar para deixar a primeira letra maiúscula
    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleCadastroFinal = async (e) => {
        e.preventDefault();

        if (senha !== confirmarSenha) {
            setMensagemFinal("⚠️ As senhas não coincidem.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nome", capitalizeFirstLetter(nome.trim()));
            formData.append("sobrenome", capitalizeFirstLetter(sobrenome.trim()));
            formData.append("data_nascimento", dataNascimento);
            formData.append("id_host", idAnfitiao);
            formData.append("email", email);
            formData.append("senha", senha);
            formData.append("termos_aceitos", aceitouTermos ? 1 : 0);

            const res = await fetch(`${URL}/cadastrar`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                setMensagemFinal("✅ Cadastro concluído com sucesso!");

                // 🔹 Login automático após cadastro
                const loginForm = new FormData();
                loginForm.append("email", email);
                loginForm.append("senha", senha);

                const loginRes = await fetch(`${URL}/login`, {
                    method: "POST",
                    body: loginForm
                });

                if (loginRes.ok) {
                    const dados = await loginRes.json();
                    localStorage.setItem("token", dados.token);
                    localStorage.setItem("id", dados.id);   // 👈 salva o id do usuário logado

                    // 🔹 abre modal de foto
                    setMostrarEscolherFoto(true);
                }

            } else {
                const erro = await res.json();
                setMensagemFinal(erro?.erro || "Erro no cadastro.");
            }
        } catch (err) {
            setMensagemFinal("⚠️ Erro de conexão com o servidor.");
        }
    };
    useEffect(() => {
        if (idHost) {
            handleVerificarHost(); // valida automaticamente
        }
    }, [idHost]);
    return (
        <div className="PainelCadastro">

            {/* 🔹 Box fixo no topo com host confirmado */}
            {hostData && !mostrarModalHost && (
                <div className="host-box">
                    <p>Seu Host será...</p>
                    <img
                        src={`${URL}/fotos/${hostData.foto}`}
                        alt="Foto do Host"
                        className="host-foto"
                    />
                    <p><b>{hostData.nome} {hostData.sobrenome}!!</b></p>
                </div>
            )}

            {/* 🔹 Campo para verificar host */}
            {!hostData && (
                <div className="host-verificacao">
                    <label htmlFor="ID">ID do Host</label><br />
                    <input
                        type="text"
                        value={idAnfitiao}
                        onChange={(e) => setIdAnfitiao(e.target.value)}
                        placeholder="Digite o ID do Host"
                        className="inputPadrao"
                    />
                    <button onClick={handleVerificarHost}>Verificar Host</button>
                    {mensagemErroHost && <p style={{ color: "red" }}>{mensagemErroHost}</p>}
                </div>
            )}

            {/* 🔹 Modal de confirmação do host */}
            {mostrarModalHost && hostData && (
                <div className="modalCadastro-overlay">
                    <div className="modalCadastro-host">
                        <h2>Este é o usuario que te recomendou?</h2>
                        <img
                            src={`${URL}/fotos/${hostData.foto}`}
                            alt="Foto do Host"
                            className="host-foto"
                        />
                        <h3>{hostData.nome} {hostData.sobrenome}</h3>
                        <div className="botoes-modal">
                            <button
                                className="btn-vermelho"
                                onClick={() => {
                                    setMostrarModalHost(false);
                                    setHostData(null);
                                    setIdAnfitiao("");
                                }}
                            >
                                ❌ Esse não é
                            </button>

                            <button
                                className="btn-verde"
                                onClick={() => {
                                    setMostrarModalHost(false);
                                    // 🔹 agora libera próxima etapa: verificar email
                                }}
                            >
                                ✅ Esse mesmo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Etapa 2: Verificação de email */}
            {hostData && !mostrarModalHost && !emailVerificado && (
                <>
                    <VerificarEmail
                        email={email}
                        setEmail={setEmail}
                        onVerificado={() => setEmailVerificado(true)}
                    />

                    {/* 🔹 Botão abaixo do VerificarEmail */}
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btnn-info"
                    >
                        🌐 Conhecer antes de me cadastrar
                    </a><br />
                </>
            )}


            {/*Etapa 3: Cadastro final */}
            {emailVerificado && (
                <form className="FormularioLogin" onSubmit={handleCadastroFinal}>
                    <h3>Dados Pessoais</h3>

                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome"
                            className="inputPadrao"
                            required
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="sobrenome">Sobrenome</label>
                        <input
                            id="sobrenome"
                            type="text"
                            value={sobrenome}
                            onChange={(e) => setSobrenome(e.target.value)}
                            placeholder="Digite seu sobrenome"
                            className="inputPadrao"
                            required
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input
                            id="dataNascimento"
                            type="date"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            className="inputPadrao"
                            required
                        />
                    </div>
                    <br />
                    <h3>Segurança</h3>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Crie uma senha segura"
                            className="inputPadrao"
                            required
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label htmlFor="confirmarSenha">Confirmar Senha</label>
                        <input
                            id="confirmarSenha"
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Digite novamente sua senha"
                            className="inputPadrao"
                            required
                        />
                    </div>
                    <br />
                    <div className="termos">
                        <input
                            id="termos"
                            type="checkbox"
                            checked={aceitouTermos}
                            onChange={(e) => {
                                if (!aceitouTermos) {
                                    e.preventDefault();
                                    setMostrarAlerta(true);
                                }
                            }}
                        />
                        <label
                            htmlFor="termos"
                            onClick={(e) => {
                                e.preventDefault();
                                setMostrarTermos(true);
                            }}
                            style={{ cursor: "pointer", color: "#0077ff", textDecoration: "underline", fontSize: "25px" }}
                        >
                            Termos de Uso
                        </label>
                    </div>

                    {mostrarTermos && (
                        <TermosModal
                            onClose={() => setMostrarTermos(false)}
                            onAceitar={() => setAceitouTermos(true)}
                        />
                    )}

                    {mostrarAlerta && (
                        <AlertaTermos
                            mensagem="⚠️ Para continuar, clique no link 'Termos de Uso' e leia o conteúdo antes de aceitar."
                            onClose={() => setMostrarAlerta(false)}
                        />
                    )}


                    <button type="submit" className="btn-verde">Proxima Etapa</button>
                </form>
            )}

            {/* 🔹 Modal Escolher Foto após cadastro */}
            {mostrarEscolherFoto && (
                <EscolherFotoPerfil onClose={() => setMostrarEscolherFoto(false)} />
            )}
            <br />
            <button
                className="FaqAzul"
                onClick={() => setMostrarFAQ(true)}
            >
                ❓ Perguntas Frequentes
            </button>

            {/* Modal FAQ */}
            {mostrarFAQ && <FAQ onClose={() => setMostrarFAQ(false)} />}
        </div>
    );
}
