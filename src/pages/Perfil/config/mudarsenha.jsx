import { useState } from 'react';
import { URL } from '../../../config';
import './mudarsenha.css';

export default function MudarSenha({ onVoltar }) {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const validarSenha = senha => {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[.,;\/?@#$%&*]).{8,}$/.test(senha);
    };

    const handleSalvar = async () => {
        if (novaSenha !== confirmarSenha) {
            setMensagem("❌ As senhas não coincidem.");
            return;
        }

        if (!validarSenha(novaSenha)) {
            setMensagem("❌ Nova senha inválida. Deve conter mínimo 8 caracteres, 1 número, 1 letra maiúscula e 1 símbolo.");
            return;
        }

        const token = localStorage.getItem('token');

        const resposta = await fetch(`${URL}/perfil/alterar_senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                senha_atual: senhaAtual,
                nova_senha: novaSenha
            })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            setMensagem("✅ Senha alterada com sucesso!");
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
        } else {
            setMensagem(`❌ ${resultado.erro || "Erro ao alterar senha."}`);
        }
    };

    return (
        <section className="mudar-senha">
            <h2>🔑 Alterar Senha</h2>

            <input
                type="password"
                placeholder="Senha atual"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
            />

            <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
            />

            {mensagem && <p className="mensagem">{mensagem}</p>}

            <br /><br />
            <button onClick={handleSalvar} className="botao-config">Salvar Nova Senha</button><br /><br />
            <button onClick={onVoltar} className="botao-voltar">← Voltar</button>

        </section>
    );
}
