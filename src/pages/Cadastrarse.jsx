import { useState } from "react";
import './Cadastrarse.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Cadastrarse() {
    const [mostrarPainel, setMostrarPainel] = useState("faq");
    const [mostrarExplicacaoHost, setMostrarExplicacaoHost] = useState(false);

    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [idAnfitiao, setIdAnfitiao] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [mensagemCadastro, setMensagemCadastro] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        idAnfitiao: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const handleNomeChange = (e) => setNome(e.target.value);
    const handleSobrenomeChange = (e) => setSobrenome(e.target.value);
    const handleDataNascimentoChange = (e) => setDataNascimento(e.target.value);

    const handleIdChange = (e) => {
        const value = e.target.value;
        setIdAnfitiao(value);
        setErrors(prev => ({ ...prev, idAnfitiao: !value ? 'erro' : '' }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors(prev => ({ ...prev, email: !value.includes('@') ? 'erro' : '' }));
    };

    const validarSenha = (value) => {
        const regexMaiuscula = /[A-Z]/;
        const regexSimbolo = /[.,\-!?@#$%&*]/;
        if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
        if (!regexMaiuscula.test(value)) return 'A senha deve ter ao menos uma letra maiúscula.';
        if (!regexSimbolo.test(value)) return 'A senha deve conter ao menos um símbolo (. , - ! ? @ # $ % & *).';
        return '';
    };

    const handleSenhaChange = (e) => {
        const value = e.target.value;
        setSenha(value);
        setErrors(prev => ({
            ...prev,
            senha: validarSenha(value),
            confirmarSenha: (confirmarSenha && value !== confirmarSenha) ? 'As senhas não coincidem.' : ''
        }));
    };

    const handleConfirmarSenhaChange = (e) => {
        const value = e.target.value;
        setConfirmarSenha(value);
        setErrors(prev => ({
            ...prev,
            confirmarSenha: value !== senha ? 'As senhas não coincidem.' : ''
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        const sobrenomeFormatado = sobrenome.charAt(0).toUpperCase() + sobrenome.slice(1).toLowerCase();
        const errosValidacao = [];

        // ID do Host
        if (!idAnfitiao.trim()) {
            errosValidacao.push("ID do Host é obrigatório.");
        }

        // Data de nascimento
        const dataNasc = new Date(dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNasc.getFullYear(); // ← corrigido aqui
        const mes = hoje.getMonth() - dataNasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
            idade--;
        }

        if (isNaN(dataNasc.getTime()) || idade < 18) {
            errosValidacao.push("Você deve ter ao menos 18 anos para ser membro.");
        }

        // Email
        if (!email.includes("@")) {
            errosValidacao.push("Email inválido.");
        }

        // Senha
        const erroSenha = validarSenha(senha);
        if (erroSenha) {
            errosValidacao.push(erroSenha);
        }

        // Confirmar Senha
        if (senha !== confirmarSenha) {
            errosValidacao.push("As senhas não coincidem.");
        }
        // Aceite dos Termos
        if (!aceitouTermos) {
            errosValidacao.push("Você deve aceitar os Termos de Uso.");
        }


        if (errosValidacao.length > 0) {
            setMensagemCadastro(errosValidacao.join("\n"));
            setTipoMensagem("erro");
            return;
        }

        const formData = new FormData();
        formData.append("nome", nomeFormatado);
        formData.append("sobrenome", sobrenomeFormatado);
        formData.append("data_nascimento", dataNascimento);
        formData.append("id_host", idAnfitiao);
        formData.append("email", email);
        formData.append("senha", senha);
        formData.append("termos_aceitos", aceitouTermos ? 1 : 0);

        try {
            const response = await fetch("http://localhost:8899/cadastrar", {
                method: "POST",
                body: formData,
            });

            let data;
            let textoErro = "";

            try {
                data = await response.json();
            } catch (e) {
                textoErro = await response.text();
            }

            if (response.ok) {
                setMensagemCadastro("✅ Cadastro realizado com sucesso!");
                setTipoMensagem("sucesso");

                setTimeout(async () => {
                    const loginForm = new FormData();
                    loginForm.append("email", email);
                    loginForm.append("senha", senha);

                    const loginResponse = await fetch("http://localhost:8899/login", {
                        method: "POST",
                        body: loginForm,
                    });

                    const loginData = await loginResponse.json();

                    if (loginResponse.ok && loginData.token && loginData.usuario) {
                        localStorage.setItem("token", loginData.token);
                        localStorage.setItem("usuario", JSON.stringify(loginData.usuario));
                        localStorage.setItem("user_id", loginData.usuario.id);
                        login(loginData.usuario, loginData.token);
                        navigate("/inicio");
                    } else {
                        setMensagemCadastro(loginData?.erro || "⚠️ Erro ao logar automaticamente.");
                        setTipoMensagem("erro");
                    }
                }, 3000);
                return;
            }

            // Se não for OK (erro do backend)
            const erroMsg = data?.erro || textoErro || "Erro ao tentar cadastrar.";
            if (erroMsg.includes("email já está cadastrado")) {
                setMensagemCadastro("Email já cadastrado. Tente outro ou recupere sua senha.");
            } else {
                setMensagemCadastro(erroMsg);
            }
            setTipoMensagem("erro");

        } catch (error) {
            setMensagemCadastro("Erro na conexão com o servidor.");
            setTipoMensagem("erro");
        }

    };

    return (
        <div className="PainelCadastro" style={{ display: "flex", alignItems: "center" }}>
            {mostrarPainel === "faq" && (
                <section className="FAQmini">
                    <h2>Perguntas Frequentes</h2>
                    <h4>Preciso pagar algo?</h4>
                    <p>Não, o cadastro é gratuito...</p>
                    <h4>Posso trocar de Host?</h4>
                    <p>Sim, é possível solicitar a troca...</p>
                    <h4>O que ganho usando a plataforma?</h4>
                    <p>Você conquista certificados...</p>
                    <h4>Como recebo suporte?</h4>
                    <p>Seu Host é seu primeiro ponto de apoio...</p>
                    <h4>Posso vender meus serviços aqui?</h4>
                    <p>Sim! Usuários qualificados podem oferecer serviços...</p>
                    <h4>É possível cancelar minha conta?</h4>
                    <p>Sim. Você pode solicitar o cancelamento a qualquer momento.</p>
                </section>
            )}

            {mostrarPainel === "termos" && (
                <div className="modal-overlay">
                    <div style={{ textAlign: "center" }} className="modal-termos">
                        <h1>Termos de Uso - IronGoals</h1>
                        <p>Este documento apresenta um resumo...</p>
                        <h2>1. Direitos Autorais</h2>
                        <p>Todo o conteúdo é protegido por direitos autorais...</p>
                        <h2>2. Categorias de Usuários</h2>
                        <p>Explorer, Member e Mentor...</p>
                        <h2>3. Sistema de Indicação e Comissão</h2>
                        <p>Usuários recebem comissão...</p>
                        <h2>4. Aulas Individuais e Coletivas</h2>
                        <p>Mentores são responsáveis pelas aulas...</p>
                        <h2>5. Cancelamentos e Reembolsos</h2>
                        <p>Cancelamentos seguem política...</p>
                        <h2>6. Penalidades</h2>
                        <p>Fraudes podem resultar em bloqueio...</p>
                        <h2>Cláusula X</h2>
                        <p>É responsabilidade do usuário ler os Termos...</p>
                        <button className="btn-aceito" onClick={() => {
                            setAceitouTermos(true);
                            setMostrarPainel("faq");
                        }}>LI E ACEITO OS TERMOS DE USO</button>
                        <button className="btn-fechar-modal" onClick={() => setMostrarPainel("faq")} aria-label="Fechar">&times;</button>
                    </div>
                </div>
            )}
            {mensagemCadastro && (
                <div className="modal-feedback">
                    <div className="caixa-feedback">

                        {tipoMensagem === "erro" && (
                            <div style={{ marginTop: '0px' }}>
                                <button
                                    className="btn-fechar-modal-xx"
                                    onClick={() => {
                                        setMensagemCadastro("");
                                        setTipoMensagem("");
                                        setMostrarExplicacaoHost(false);
                                    }}
                                    aria-label="Fechar"
                                >
                                    fechar                                </button>
                                <p style={{ whiteSpace: 'pre-line' }}>{mensagemCadastro}</p>


                                {mensagemCadastro.includes("ID do host informado não existe") && (
                                    <>
                                        <button
                                            className="btn-explicacao-host"
                                            onClick={() => setMostrarExplicacaoHost(true)}
                                        >
                                            O que é um Host?
                                        </button>

                                        <button
                                            className="btn-facebook"
                                            onClick={() => window.open("https://www.facebook.com/IronGoalsOficial", "_blank")}
                                        >
                                            Ir para o Facebook
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
            {mostrarExplicacaoHost && (
                <div className="modal-feedback">
                    <div className="caixa-feedback">
                        <h3>O que é um Host?</h3>
                        <p>
                            Um Host é um usuário da plataforma que pode indicar novos membros,
                            responder dúvidas e acompanhar os indicados.
                            <br />
                            Ao se cadastrar com o ID de um Host, você recebe suporte personalizado
                            e o Host recebe comissão pelas suas conquistas.
                            <br /><br />
                            Se você ainda não tem um Host, pode conhecer mais clicando abaixo.
                        </p>

                        <div style={{ marginTop: '20px' }}>


                            <button
                                className="btn-facebook"
                                onClick={() => window.open("https://www.facebook.com", "_blank")}
                            >
                                Ir para o Facebook
                            </button>
                            <button
                                className="btn-fechar-modal"
                                onClick={() => setMostrarExplicacaoHost(false)}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <div className="Cadastro-login">
                <h2>Faça seu cadastro</h2>

                {mensagemCadastro && (
                    <div className={`mensagem ${tipoMensagem}`}>
                        {mensagemCadastro}
                    </div>
                )}

                <form className="FormularioLogin" onSubmit={handleSubmit}>
                    <label htmlFor="Nome">Nome</label><br />
                    <input id="Nome" type="text" placeholder="Digite seu nome" value={nome} onChange={handleNomeChange} className="inputPadrao" required /><br /><br />

                    <label htmlFor="Sobrenome">Sobrenome</label><br />
                    <input id="Sobrenome" type="text" placeholder="Digite seu sobrenome" value={sobrenome} onChange={handleSobrenomeChange} className="inputPadrao" required /><br /><br />

                    <label htmlFor="DataNascimento">Data de Nascimento</label><br />
                    <input id="DataNascimento" type="date" value={dataNascimento} onChange={handleDataNascimentoChange} className="inputPadrao" required /><br /><br />

                    <label htmlFor="ID">ID do Host</label><br />
                    <input id="ID" type="text" placeholder="Digite o ID do Host" autoComplete="off" value={idAnfitiao} onChange={handleIdChange} className={`inputPadrao ${errors.idAnfitiao ? 'bordaVermelha' : ''}`} required /><br /><br />

                    <label htmlFor="Email">Email</label><br />
                    <input id="Email" type="email" placeholder="Digite seu email" value={email} onChange={handleEmailChange} className={`inputPadrao ${errors.email ? 'bordaVermelha' : ''}`} required />
                    {errors.email && <div style={{ color: "red", fontSize: "0.9rem" }}>{errors.email}</div>}<br /><br />

                    <label htmlFor="Senha">Senha</label><br />
                    <input id="Senha" type="password" placeholder="Digite sua senha" value={senha} onChange={handleSenhaChange} className={`inputPadrao ${errors.senha ? 'bordaVermelha' : ''}`} required />
                    {errors.senha && <div style={{ color: "red", fontSize: "0.9rem" }}>{errors.senha}</div>}<br /><br />

                    <label htmlFor="ConfirmarSenha">Confirmar Senha</label><br />
                    <input id="ConfirmarSenha" type="password" placeholder="Confirme sua senha" value={confirmarSenha} onChange={handleConfirmarSenhaChange} className={`inputPadrao ${errors.confirmarSenha ? 'bordaVermelha' : ''}`} required />
                    {errors.confirmarSenha && <div style={{ color: "red", fontSize: "0.9rem" }}>{errors.confirmarSenha}</div>}<br /><br />

                    <input type="radio" name="Termos" id="Termos" checked={aceitouTermos} readOnly onClick={() => {
                        if (!aceitouTermos) {
                            alert("Você deve ler e aceitar os Termos de Uso clicando em Termos de abaixo dos Termos.");
                        }
                    }} /><br />

                    <label htmlFor="Termos">
                        Eu li e aceito os{" "}
                        <span onClick={(e) => {
                            e.preventDefault();
                            setMostrarPainel("termos");
                            setTimeout(() => {
                                document.getElementById("painelTermos")?.scrollIntoView({ behavior: "smooth" });
                            }, 50);
                        }} style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>
                            Termos de Uso
                        </span>
                    </label><br /><br />

                    <input type="submit" id="botaoCad" value="Enviar" />
                </form>
            </div>
        </div>
    );
}
