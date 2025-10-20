// 📂 src/componentes/configuracoes/DadosConta.jsx
import { useEffect, useState } from 'react';
import './dadosconta.css';
import { URL } from '../../../config';

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
    const [mostrarSenhaModal, setMostrarSenhaModal] = useState(false); // 🔹 novo estado
    const [senhaDigitada, setSenhaDigitada] = useState(""); // 🔹 senha digitada pelo usuário

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

    // 🔹 Função principal de salvar (somente chamada após senha validada)
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
                    senha: senhaDigitada // 🔹 senha enviada
                })
            });

            const data = await resposta.json();

            if (data.erro) {
                setAlerta("❌ Senha incorreta.");
                setTimeout(() => setAlerta(""), 2000);
                return;
            }

            setAlerta("✅ Dados atualizados com sucesso!");
            setTimeout(() => {
                setAlerta("");
                setMostrarSenhaModal(false);
                onVoltar();
            }, 2000);
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

    return (
        <section className="privacidade-config">
            <h2>👤 Dados da Conta</h2>
            <h4>clique em cada area para editar</h4>

            <p><strong>Nome:</strong> {renderCampo("nome", nome, setNome)}</p>
            <p><strong>Sobrenome:</strong> {renderCampo("sobrenome", sobrenome, setSobrenome)}</p>
            <p style={{ display: "none" }}><strong>Email:</strong> {renderCampo("email", email, setEmail)}</p>
            <p><strong>Email Secundário (recuperação):</strong> {renderCampo("email_secundario", emailSecundario, setEmailSecundario)}</p>
            <p><strong>Próxima Meta:</strong> {renderCampo("frase", frase, setFrase)}</p>

            <div style={{ marginTop: '20px' }}>
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
                <button className="botao-config" onClick={() => setMostrarSenhaModal(true)}>
                    Salvar Alterações
                </button>

                <button className="botao-voltar" onClick={onVoltar}>
                    ← Voltar
                </button>
            </div>

            {/* 🔹 Modal pedindo senha */}
            {mostrarSenhaModal && (
                <div className="modal-senha">
                    <div className="modal-senha-content">
                        <h3>🔒 Confirme sua Senha</h3>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senhaDigitada}
                            onChange={e => setSenhaDigitada(e.target.value)}
                        />
                        <div className="modal-botoes">
                            <button onClick={confirmarSalvar}>Confirmar</button>
                            <button onClick={() => setMostrarSenhaModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {alerta && <div className="toasta-alerta">{alerta}</div>}
        </section>
    );
}
