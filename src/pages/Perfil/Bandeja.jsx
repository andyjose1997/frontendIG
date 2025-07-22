import { useState } from 'react';
import './Bandeja.css';

const mensagens = [
    { nome: "Ana", mensagem: "Oi! Tudo bem?", hora: "09:12" },
    { nome: "Carlos", mensagem: "Vamos nos encontrar hoje?", hora: "08:47" },
    { nome: "Beatriz", mensagem: "Recebeu o arquivo?", hora: "Ontem" },
    { nome: "Diego", mensagem: "Ok, obrigado!", hora: "Ontem" },
    { nome: "Fernanda", mensagem: "Não posso agora 😕", hora: "Ontem" },
    { nome: "Gabriel", mensagem: "Haha, boa essa!", hora: "Ontem" },
    { nome: "Helena", mensagem: "Depois te ligo.", hora: "Dom" },
    { nome: "Igor", mensagem: "A aula começa às 14h", hora: "Dom" },
    { nome: "Juliana", mensagem: "Tô chegando!", hora: "Sáb" },
    { nome: "Kleber", mensagem: "Confirma a reunião?", hora: "Sáb" },
    { nome: "Larissa", mensagem: "Bom diaaa!", hora: "Sexta" },
    { nome: "Marcos", mensagem: "Terminou o projeto?", hora: "Sexta" }
];

export default function Bandeja() {
    const [selecionado, setSelecionado] = useState(null);
    const [mensagemNova, setMensagemNova] = useState("");

    if (selecionado) {
        return (
            <main className="mensagens-container">
                <button onClick={() => setSelecionado(null)} className="voltar-botao">⬅ Voltar</button>
                <h2>💬 Conversa com {selecionado.nome}</h2>

                <div className="conversa-historico">
                    <p><strong>{selecionado.nome}:</strong> {selecionado.mensagem}</p>
                    {/* aqui futuramente você pode listar várias mensagens */}
                </div>

                <div className="mensagem-input">
                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={mensagemNova}
                        onChange={(e) => setMensagemNova(e.target.value)}
                    />
                    <button>Enviar</button>
                </div>
            </main>
        );
    }

    return (
        <main className="mensagens-container">
            <h2>📨 Suas Mensagens</h2>
            <ul className="lista-mensagens">
                {mensagens.map((item, index) => (
                    <li key={index} className="mensagem-item" onClick={() => setSelecionado(item)}>
                        <div className="mensagem-avatar">{item.nome.charAt(0)}</div>
                        <div className="mensagem-detalhes">
                            <strong>{item.nome}</strong>
                            <p>{item.mensagem}</p>
                        </div>
                        <span className="mensagem-hora">{item.hora}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
