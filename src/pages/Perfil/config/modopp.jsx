import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './modopp.css';
import { URL } from '../../../config';

export default function ModoPP({ onVoltar }) {
    const [status, setStatus] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);  // ✅ Controle do modal
    const [idHost, setIdHost] = useState("");                  // ✅ ID do host

    useEffect(() => {
        buscarStatus();
        buscarIdHost();
    }, []);

    const buscarStatus = async () => {
        setCarregando(true);
        const token = localStorage.getItem("token");

        try {
            const resposta = await fetch(`${URL}/status_perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const dados = await resposta.json();
            setStatus(dados.publico);
        } catch (error) {
            setMensagem("Erro ao buscar status.");
        }

        setCarregando(false);
    };

    const buscarIdHost = async () => {
        const token = localStorage.getItem("token");

        try {
            const resposta = await fetch(`${URL}/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const dados = await resposta.json();
            setIdHost(dados.id_host);
        } catch (error) {
            console.error("Erro ao buscar ID do host", error);
        }
    };

    const alternarStatus = async () => {
        setCarregando(true);
        const token = localStorage.getItem("token");

        try {
            const resposta = await fetch(`${URL}/alterar_status_perfil`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });

            const dados = await resposta.json();
            setMensagem(dados.mensagem || "Status atualizado.");
            await buscarStatus();
        } catch (error) {
            setMensagem("Erro ao alterar status.");
        }

        setCarregando(false);
    };

    return (
        <section className="privacidade-config">
            <h2>🔒 Configurações de Privacidade do Perfil</h2>

            <p>
                <strong style={{ fontSize: "40px" }}>🔐 Perfil Privado:</strong><br />
                <p>
                    Conforme a <Link to="/manual">🧾 <span className="link-text">Cláusula 1.6 do Manual</span></Link>, você possui controle total sobre a visibilidade do seu perfil dentro da plataforma IronGoals.
                </p>

                <p>
                    <strong>🔐 Perfil Privado (1.6.2):</strong><br />
                    Quando seu perfil estiver configurado como <strong>Privado</strong>, apenas pessoas indicadas diretamente por você e seu{" "}
                    <strong
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => setMostrarModal(true)}
                    >
                        Host
                    </strong>{" "}
                    terão acesso às seguintes informações:
                </p>

                <ul>
                    <li>Nome e Sobrenome;</li>
                    <li>Fotografias ou imagens disponibilizadas voluntariamente;</li>
                    <li>Comentários ou informações adicionais inseridas no perfil;</li>
                    <li>Meio de contato (WhatsApp) para orientação de seus indicados.</li>
                </ul>

                <p>
                    Para todos os demais usuários da plataforma, essas informações permanecerão restritas e invisíveis.
                </p>

                <p>
                    ⚙️ Você pode alterar suas preferências de visibilidade a qualquer momento nesta tela, conforme descrito no item 1.6.6 do Manual.
                </p>
            </p>

            <p>
                <strong style={{ fontSize: "40px" }}>🌍 Perfil Público:</strong><br />
                Caso você opte por manter seu perfil como <strong>Público</strong>, autoriza que todas as pessoas da comunidade IronGoals possam visualizar as seguintes informações do seu perfil:
            </p>

            <ul>
                <li>Nome e Sobrenome;</li>
                <li>Fotografias ou imagens disponibilizadas voluntariamente;</li>
                <li>Comentários ou informações adicionais inseridas no perfil;</li>
                <li>Meio de contato (WhatsApp) para comunicação direta.</li>
            </ul>

            <p>
                Exceto pela confidencialidade obrigatória da sua Categoria de Pagamento Programado (CPP), todas essas informações estarão visíveis para qualquer usuário da plataforma, conforme previsto na Cláusula 1.6.3 do Manual.
            </p>

            <p>
                <strong>🔒 Sigilo do CPP (1.6.4):</strong><br />
                Sua Categoria de Pagamento Programado (CPP) permanecerá sempre confidencial, independentemente da visibilidade escolhida.
            </p>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                {carregando ? (
                    <strong>Carregando status...</strong>
                ) : (
                    <>Status atual do seu perfil: <strong>{status ? "PÚBLICO" : "PRIVADO"}</strong></>
                )}
            </p>

            {mensagem && (
                <p style={{ color: "#ffcc00", textAlign: "center", fontWeight: "bold" }}>{mensagem}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '15px' }}>
                <button className="botao-config" onClick={alternarStatus} disabled={carregando}>
                    {status ? "Tornar Privado" : "Tornar Público"}
                </button>

                <button className="botao-voltar" onClick={onVoltar}>
                    ← Voltar
                </button>
            </div>

            {mostrarModal && idHost && (
                <HostModal idHost={idHost} onClose={() => setMostrarModal(false)} />
            )}
        </section>
    );
}
