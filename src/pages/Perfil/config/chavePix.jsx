import { useEffect, useState } from 'react';
import { URL } from '../../../config';
import './chavePix.css';

export default function ChavePix({ onVoltar }) {
    const [chavePix, setChavePix] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [mostrarMensagens, setMostrarMensagens] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const linkIndicacao = "link pendente";

    useEffect(() => {
        buscarChavePix();
        buscarDadosUsuario();
    }, []);

    const buscarChavePix = async () => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${URL}/perfil/chave_pix`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resposta.json();
        setChavePix(data.chave_pix || '');
    };

    const buscarDadosUsuario = async () => {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resposta.json();
        setEmail(data.email || '');
        setWhatsapp(data.whatsapp || '');
        if (!chavePix) {
            setChavePix(data.email || '');  // ✅ Email como padrão só se não houver chave salva
        }
    };

    const salvarChavePix = async () => {
        const token = localStorage.getItem('token');
        await fetch(`${URL}/perfil/atualizar_chave_pix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ chave_pix: chavePix.trim() })
        });
        alert('Chave Pix atualizada com sucesso!');
    };

    const handleInputChange = (e) => {
        setChavePix(e.target.value);
        setMostrarSugestoes(true);
    };

    const inserirSugestao = (valor) => {
        setChavePix(valor);
        setMostrarSugestoes(true);  // Sugestões continuam visíveis para seguir clicando
    };

    const copiarLink = () => {
        navigator.clipboard.writeText(linkIndicacao);
        alert("Link copiado!");
    };

    return (
        <>
            <section className="privacidade-config">
                <h2>💳 Chave Pix</h2>
                <p>Por padrão, usamos seu e-mail como chave Pix, mas você pode alterá-la.</p>

                <input
                    type="text"
                    value={chavePix}
                    onChange={handleInputChange}
                    onFocus={() => setMostrarSugestoes(true)}
                    placeholder="Digite sua chave Pix"
                />

                {mostrarSugestoes && (
                    <div className="sugestoes-box">
                        <p onClick={() => inserirSugestao(email)}>📧 {email}</p>
                        <p onClick={() => inserirSugestao(whatsapp)}>📱 {whatsapp}</p>
                    </div>
                )}

                <div className="botoes-acoes">
                    <button className="botao-config" onClick={salvarChavePix}>
                        Salvar Chave Pix
                    </button>
                    <button className="botao-voltar" onClick={onVoltar}>
                        ← Voltar
                    </button>
                </div>
            </section>

            <div className="area-link">
                <h3 className="link-indicacao">{linkIndicacao}</h3>
                <div>
                    <button className="botao-config" onClick={copiarLink}>
                        Copiar Link
                    </button>
                    <button className="botao-config" onClick={() => setMostrarMensagens(true)}>
                        Mensagens para Postar
                    </button> </div>
            </div>

            {mostrarMensagens && (
                <div className="modal-overlay">
                    <div className="modal-mensagens">
                        <h2>Mensagens para Postar</h2>

                        <p>Mensagem 1 exemplo.</p>
                        <button onClick={() => {
                            navigator.clipboard.writeText("Mensagem 1 exemplo.");
                            alert("Mensagem copiada!");
                        }}>Copiar</button>

                        <hr />

                        <p>Mensagem 2 exemplo.</p>
                        <button onClick={() => {
                            navigator.clipboard.writeText("Mensagem 2 exemplo.");
                            alert("Mensagem copiada!");
                        }}>Copiar</button>

                        <hr />

                        <p>Mensagem 3 exemplo.</p>
                        <button onClick={() => {
                            navigator.clipboard.writeText("Mensagem 3 exemplo.");
                            alert("Mensagem copiada!");
                        }}>Copiar</button><br /><br />

                        <button className="botao-voltar" onClick={() => setMostrarMensagens(false)}>
                            Voltar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
