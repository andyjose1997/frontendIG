import { useState } from "react";
import './Cadastrarse.css';

export default function Cadastrarse() {
    const [mostrarPainel, setMostrarPainel] = useState("faq");

    // Estados para campos e erros
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [idAnfitiao, setIdAnfitiao] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [errors, setErrors] = useState({
        idAnfitiao: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    // Validação dinâmica
    const handleNomeChange = (e) => {
        setNome(e.target.value);
    };

    const handleSobrenomeChange = (e) => {
        setSobrenome(e.target.value);
    };

    const handleDataNascimentoChange = (e) => {
        setDataNascimento(e.target.value);
    };

    const handleIdChange = (e) => {
        const value = e.target.value;
        setIdAnfitiao(value);
        setErrors(prev => ({
            ...prev,
            idAnfitiao: !value ? 'erro' : ''
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors(prev => ({
            ...prev,
            email: !value.includes('@') ? 'erro' : ''
        }));
    };

    const validarSenha = (value) => {
        const regexMaiuscula = /[A-Z]/;
        const regexSimbolo = /[.,\-!?@#$%&*]/;

        if (value.length < 8) {
            return 'A senha deve ter pelo menos 8 caracteres.';
        }
        if (!regexMaiuscula.test(value)) {
            return 'A senha deve ter ao menos uma letra maiúscula.';
        }
        if (!regexSimbolo.test(value)) {
            return 'A senha deve conter ao menos um símbolo (. , - ! ? @ # $ % & *).';
        }
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

        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("sobrenome", sobrenome);
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

            const data = await response.json();

            if (response.ok) {
                alert("Usuário cadastrado com sucesso!");
            } else {
                if (data.erro === "Este email já está cadastrado.") {
                    setErrors(prev => ({
                        ...prev,
                        email: data.erro
                    }));
                } else {
                    alert(data.erro || "Erro desconhecido ao tentar cadastrar.");
                }
            }

        } catch (error) {
            alert("Erro na conexão com o servidor.");
        }
    };








    return (
        <div
            className="PainelCadastro"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Formulário */}
            <div className="Cadastro-login">
                <h2>Faça seu cadastro</h2>
                <form className="FormularioLogin" onSubmit={handleSubmit}>
                    <label htmlFor="Nome">Nome</label><br />
                    <input
                        id="Nome"
                        type="text"
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={handleNomeChange}
                        className="inputPadrao"
                        required
                    /><br /><br />

                    <label htmlFor="Sobrenome">Sobrenome</label><br />
                    <input
                        id="Sobrenome"
                        type="text"
                        placeholder="Digite seu sobrenome"
                        value={sobrenome}
                        onChange={handleSobrenomeChange}
                        className="inputPadrao"
                        required
                    /><br /><br />

                    <label htmlFor="DataNascimento">Data de Nascimento</label><br />
                    <input
                        id="DataNascimento"
                        type="date"
                        value={dataNascimento}
                        onChange={handleDataNascimentoChange}
                        className="inputPadrao"
                        required
                    /><br /><br />

                    <label htmlFor="ID">ID do Host</label><br />
                    <input
                        id="ID"
                        type="text"
                        placeholder="Digite o ID do Host"
                        value={idAnfitiao}
                        onChange={handleIdChange}
                        className={`inputPadrao ${errors.idAnfitiao ? 'bordaVermelha' : ''}`}
                        required
                    /><br /><br />

                    <label htmlFor="Email">Email</label><br />
                    <input
                        id="Email"
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`inputPadrao ${errors.email ? 'bordaVermelha' : ''}`}
                        required
                    /><br />
                    {errors.email && (
                        <div style={{ color: "red", fontSize: "0.9rem" }}>{errors.email}</div>
                    )}
                    <br /><br />


                    <label htmlFor="Senha">Senha</label><br />
                    <input
                        id="Senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={handleSenhaChange}
                        className={`inputPadrao ${errors.senha ? 'bordaVermelha' : ''}`}
                        required
                    />
                    {errors.senha && (
                        <div style={{ color: "red", fontSize: "0.9rem" }}>{errors.senha}</div>
                    )}
                    <br /><br />

                    <label htmlFor="ConfirmarSenha">Confirmar Senha</label><br />
                    <input
                        id="ConfirmarSenha"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={handleConfirmarSenhaChange}
                        className={`inputPadrao ${errors.confirmarSenha ? 'bordaVermelha' : ''}`}
                        required
                    />
                    {errors.confirmarSenha && (
                        <div style={{ color: "red", fontSize: "0.9rem" }}>{errors.confirmarSenha}</div>
                    )}
                    <br /><br />

                    <input
                        type="radio"
                        name="Termos"
                        id="Termos"
                        checked={aceitouTermos}
                        readOnly
                        onClick={() => {
                            if (!aceitouTermos) {
                                alert(
                                    "Você deve ler e aceitar os Termos de Uso clicando em Termos de abaixo dos Termos."
                                );
                            }
                        }}
                    /><br />

                    <label htmlFor="Termos">
                        Eu li e aceito os{" "}
                        <span
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMostrarPainel("termos");
                                setTimeout(() => {
                                    document
                                        .getElementById("painelTermos")
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }, 50);
                            }}
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Termos de Uso
                        </span>
                    </label>

                    <br /><br />
                    <input type="submit" id="botaoCad" value="Enviar" />
                </form>
            </div>

            {/* FAQ */}
            {mostrarPainel === "faq" && (
                <section className="FAQmini">
                    <h2>Perguntas Frequentes</h2>

                    <h4>Preciso pagar algo?</h4>
                    <p>
                        Não, o cadastro é gratuito. Você só paga pelos pacotes ou serviços
                        extras que desejar usar.
                    </p>

                    <h4>Posso trocar de Host?</h4>
                    <p>
                        Sim, é possível solicitar a troca mediante análise da plataforma.
                    </p>

                    <h4>O que ganho usando a plataforma?</h4>
                    <p>
                        Você conquista certificados, currículo gerado, participa de rankings e
                        pode oferecer ou contratar serviços.
                    </p>

                    <h4>Como recebo suporte?</h4>
                    <p>
                        Seu Host é seu primeiro ponto de apoio. Além disso, nosso time
                        está disponível via WhatsApp e email.
                    </p>

                    <h4>Posso vender meus serviços aqui?</h4>
                    <p>
                        Sim! Usuários qualificados podem oferecer serviços ou cursos seguindo
                        as diretrizes da plataforma.
                    </p>

                    <h4>É possível cancelar minha conta?</h4>
                    <p>
                        Sim. Você pode solicitar o cancelamento a qualquer momento através do
                        suporte.
                    </p>
                </section>
            )}

            {/* Termos */}
            {mostrarPainel === "termos" && (
                <main
                    id="painelTermos"
                    style={{
                        fontFamily: "Arial, sans-serif",
                        lineHeight: "1.6",
                        maxWidth: "800px",
                    }}
                >
                    <h1>Termos de Uso - IronGoals</h1>

                    <p>
                        Este documento apresenta um resumo dos principais pontos dos Termos de
                        Uso. Para mais informações,{" "}
                        <a href="/Manual" target="_blank" rel="noopener noreferrer">
                            consulte as cláusulas completas no Manual de Políticas e Termos de
                            Uso.
                        </a>
                    </p>

                    <h2>1. Direitos Autorais</h2>
                    <p>
                        Todo o conteúdo disponibilizado na plataforma é protegido por direitos
                        autorais. É proibido copiar, distribuir ou reproduzir o material sem
                        autorização escrita e assinada por um representante da IronGoals.
                    </p>

                    <h2>2. Categorias de Usuários</h2>
                    <p>
                        Existem três categorias: Explorer, Member e Mentor, cada uma com
                        permissões específicas.
                    </p>

                    <h2>3. Sistema de Indicação e Comissão</h2>
                    <p>
                        Usuários podem promover a plataforma com links exclusivos e recebem
                        comissão conforme as regras internas.
                    </p>

                    <h2>4. Aulas Individuais e Coletivas</h2>
                    <p>
                        Mentores são responsáveis pelas aulas. O registro de presença é
                        obrigatório para acessar o link da videoconferência.
                    </p>

                    <h2>5. Cancelamentos e Reembolsos</h2>
                    <p>
                        Cancelamentos seguem a política de reembolso, variando conforme a data
                        de solicitação e progresso das aulas.
                    </p>

                    <h2>6. Penalidades</h2>
                    <p>
                        Fraudes ou descumprimento das regras podem resultar em bloqueio de
                        conta e medidas legais.
                    </p>

                    <h2>Cláusula X — Responsabilidade pela Leitura dos Termos</h2>
                    <p>
                        Ao acessar e utilizar a plataforma IronGoals, o usuário declara
                        estar ciente de que é sua inteira responsabilidade ler, compreender e
                        cumprir todas as disposições destes Termos de Uso e eventuais
                        documentos complementares. <br />
                        A IronGoals não se responsabiliza por danos, prejuízos ou
                        inconvenientes decorrentes do uso indevido da plataforma por usuários
                        que não tenham lido ou não tenham buscado esclarecimentos sobre o
                        conteúdo destes Termos.
                    </p>

                    <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                        Para mais informações detalhadas,{" "}
                        <a href="/Manual"> leia o documento completo das cláusulas.</a>
                    </p>
                    <br />

                    <button
                        id="liEAceito"
                        onClick={() => {
                            setAceitouTermos(true);
                            setMostrarPainel("faq");
                            setTimeout(() => {
                                document
                                    .querySelector(".Cadastro-login")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                            }, 50);
                        }}
                    >
                        LI E ACEITO OS TERMOS DE USO
                    </button>
                </main>
            )}
        </div>
    );
}
