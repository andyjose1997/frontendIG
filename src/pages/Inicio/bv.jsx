// 📂 src/pages/Inicio/bv.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bv.css";
import { URL } from "../../config";

export default function BoasVindasInterativo() {
    const [passo, setPasso] = useState(0);
    const [host, setHost] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    // 🔹 Buscar dados do usuário e do host
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setCarregando(false);
        fetch(`${URL}/usuarios/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setHost({
                    id: data.id_host,
                    nome: data.host_nome,
                    sobrenome: data.host_sobrenome,
                    foto: data.host_foto,
                });
                setCarregando(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar host:", err);
                setCarregando(false);
            });
    }, []);

    // 🔹 Textos explicativos (cada passo)
    const mensagens = [
        "👋 Olá! Seja muito bem-vindo(a) à IronGoals!",
        "💼 Aqui, além de aprender, você pode gerar renda extra enquanto estuda.",
        "📘 Você poderá fazer exercícios práticos e evoluir de forma divertida.",
        "🎥 Todas as terças, quintas e sábados às 20h temos uma live especial no Facebook explicando tudo sobre a plataforma e tirando suas dúvidas.",
        "📲 Recomendamos que siga nossa página para se manter atualizado nas novidades.",
        "🧭 E o melhor: você tem um host que será o seu orientador. Ele recebe uma porcentagem das suas vendas e compras, como reconhecimento por te guiar no seu caminho rumo à autossuficiência.",
        "📍 Você pode encontrar o contato com seu host em Perfil → Informações → Host.",
        "💰 As vendas funcionam assim: no mesmo menu, em Perfil → Informações → Meu link de indicação, você encontrará o link do seu perfil. Envie esse link para outras pessoas se cadastrarem. Quando elas fizerem uma compra dos serviços da plataforma, você recebe automaticamente sua porcentagem no seu dia CPP.",
        "💡 A CPP (Categoria de Pagamento Programado) define o seu dia de pagamento — você recebe suas comissões de vendas que tenham 8 ou mais dias de confirmação no dia da sua CPP.",
    ];

    // 🔹 Avançar etapas
    const proximoPasso = () => {
        setCarregando(true);
        setTimeout(() => {
            setPasso((prev) => prev + 1);
            setCarregando(false);
        }, 300);
    };

    // 🔹 Finaliza (Entendi OU Pular)
    const finalizarBoasVindas = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setCarregando(true);
            await fetch(`${URL}/usuarios/assistiu`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // ✅ Redireciona direto para o início
            navigate("/inicio");
        } catch (err) {
            console.error("Erro ao atualizar assistiu:", err);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="boas-vindas-container">
            {carregando ? (
                <div className="mensagem carregando">⏳ Carregando...</div>
            ) : (
                <>
                    {/* 🔹 Passos 0–5 */}
                    {passo < 6 && (
                        <>
                            <div className="mensagem">{mensagens[passo]}</div>

                            {passo === 3 && (
                                <a
                                    href="https://www.facebook.com/profile.php?id=61580492555279"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-live"
                                >
                                    👉 Acesse a página aqui
                                </a>
                            )}

                            {passo === 4 && (
                                <a
                                    href="https://www.facebook.com/profile.php?id=61580492555279"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-live"
                                >
                                    🌐 Seguir página da IronGoals no Facebook
                                </a>
                            )}

                            <div className="botoes-container">
                                <button
                                    onClick={proximoPasso}
                                    className="btn-proximo"
                                    disabled={carregando}
                                >
                                    Próximo
                                </button>
                                <button
                                    onClick={finalizarBoasVindas}
                                    className="btn-pular"
                                    disabled={carregando}
                                >
                                    Pular
                                </button>
                            </div>
                        </>
                    )}

                    {/* 🔹 Mostra o host (passo 6) */}
                    {passo === 6 && (
                        <>
                            {host ? (
                                <div className="host-info">
                                    <img
                                        src={host.foto}
                                        alt="Foto do Host"
                                        className="host-foto"
                                    />
                                    {host.id?.toString() === "a00001" ? (
                                        <p>
                                            Seu host é{" "}
                                            <strong>
                                                {host.nome} {host.sobrenome}
                                            </strong>{" "}
                                            👑<br />
                                            Ele é o fundador da IronGoals e,
                                            junto com a equipe diretiva, é
                                            responsável pela sua
                                            autossuficiência dentro da
                                            plataforma.
                                        </p>
                                    ) : (
                                        <p>
                                            Seu host é{" "}
                                            <strong>
                                                {host.nome} {host.sobrenome}
                                            </strong>{" "}
                                            🧭<br />
                                            Ele será o responsável por te
                                            orientar e te ajudar a começar!
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="mensagem carregando">
                                    ⏳ Carregando informações do host...
                                </div>
                            )}

                            <div className="botoes-container">
                                <button
                                    onClick={proximoPasso}
                                    className="btn-proximo"
                                    disabled={carregando}
                                >
                                    Próximo
                                </button>
                                <button
                                    onClick={finalizarBoasVindas}
                                    className="btn-pular"
                                    disabled={carregando}
                                >
                                    Pular
                                </button>
                            </div>
                        </>
                    )}

                    {/* 🔹 Passos 7 e 8 */}
                    {(passo === 7 || passo === 8) && (
                        <>
                            <div className="mensagem">{mensagens[passo - 1]}</div>
                            <div className="botoes-container">
                                <button
                                    onClick={proximoPasso}
                                    className="btn-proximo"
                                    disabled={carregando}
                                >
                                    Próximo
                                </button>
                                <button
                                    onClick={finalizarBoasVindas}
                                    className="btn-pular"
                                    disabled={carregando}
                                >
                                    Pular
                                </button>
                            </div>
                        </>
                    )}

                    {/* 🔹 Último passo */}
                    {passo === 9 && (
                        <>
                            <div className="mensagem">{mensagens[8]}</div>
                            <button
                                onClick={finalizarBoasVindas}
                                className="btn-entendi"
                                disabled={carregando}
                            >
                                Entendi
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
