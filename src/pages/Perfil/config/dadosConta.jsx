import { useEffect, useState } from 'react';
import './dadosConta.css';
import { URL } from '../../../config';

export default function DadosConta({ onVoltar }) {
    const [dados, setDados] = useState(null);

    const [editandoCampo, setEditandoCampo] = useState(null);

    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [frase, setFrase] = useState("");
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);

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
            setFrase(data.comentario_perfil || "");
            setNotificacoesAtivas(data.notificacoes || false);

        } catch {
            alert("Erro ao carregar dados da conta.");
        }
    };

    const salvarAlteracoes = async () => {
        const token = localStorage.getItem('token');

        await fetch(`${URL}/perfil/atualizar_perfil`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                email: email.trim(),
                comentario_perfil: frase,
                notificacoes: notificacoesAtivas
            })
        });

        alert("Dados atualizados!");
    };

    const atualizarNotificacoes = async (novoStatus) => {
        setNotificacoesAtivas(novoStatus);

        const token = localStorage.getItem('token');

        await fetch(`${URL}/perfil/atualizar_perfil`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                sobrenome,
                email,
                comentario_perfil: frase,
                notificacoes: novoStatus
            })
        });
    };

    if (!dados) {
        return <p>Carregando dados...</p>;
    }

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
            <p><strong>Email:</strong> {renderCampo("email", email, setEmail)}</p>

            <p><strong>Próxima Meta:</strong> {renderCampo("frase", frase, setFrase)}</p>


            <div style={{ marginTop: '20px' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={notificacoesAtivas}
                        onChange={e => atualizarNotificacoes(e.target.checked)}
                    />
                    Ativar Notificações
                </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                <button className="botao-config" onClick={salvarAlteracoes}>
                    Salvar Alterações
                </button>

                <button className="botao-voltar" onClick={onVoltar}>
                    ← Voltar
                </button>
            </div>
        </section>
    );
}
