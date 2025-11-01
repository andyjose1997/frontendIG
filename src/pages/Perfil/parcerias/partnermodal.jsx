import "./partnermodal.css";
import { useEffect, useState } from "react";
import { URL } from "../../../config";
import PainelPartner from "./painelpartner";

export default function PartnerModal({ onClose }) {
    const [usuario, setUsuario] = useState({});
    const [parceirosUnicos, setParceirosUnicos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [senhaDigitada, setSenhaDigitada] = useState("");
    const [erro, setErro] = useState(false);
    const [temaSelecionado, setTemaSelecionado] = useState("");
    const [temaAnnet, setTemaAnnet] = useState(false);
    const [modoBotoes, setModoBotoes] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setCarregando(true);

        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsuario(data);

                // 🔹 Se for Annett Studios
                if (
                    data.parceiro &&
                    data.parceiro.trim().toLowerCase() === "annett studios"
                ) {
                    setTemaAnnet(true);
                    setTemaSelecionado("Annett Studios");
                    setModoBotoes(false);
                    setCarregando(false);
                }
                // 🔹 Se for admin, coordenador ou auditor → modo botões
                else if (
                    ["admin", "coordenador", "auditor"].includes(
                        data.funcao?.toLowerCase()
                    )
                ) {
                    fetch(`${URL}/perfil/usuarios/parceiros`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then((res) => res.json())
                        .then((lista) => {
                            const unicos = [
                                ...new Set(
                                    lista
                                        .map((i) => i.parceiro || "Não definido")
                                        .filter((v) => v.trim() !== "")
                                ),
                            ];
                            setParceirosUnicos(unicos);
                            setModoBotoes(true);
                            setCarregando(false);
                        })
                        .catch((err) =>
                            console.error("Erro ao buscar parceiros:", err)
                        );
                } else {
                    // Outros parceiros sem tema definido
                    setTemaSelecionado("Tema não definido");
                    setModoBotoes(false);
                    setCarregando(false);
                }
            })
            .catch((err) => {
                console.error("Erro ao buscar perfil:", err);
                setCarregando(false);
            });
    }, []);

    const verificarSenha = (e) => {
        e.preventDefault();
        if (
            senhaDigitada.trim().toLowerCase() ===
            (usuario.palavra_chave || "").trim().toLowerCase()
        ) {
            window.open("/painel-partner", "_blank");
        } else {
            setErro(true);
            setTimeout(() => setErro(false), 3000);
        }
    };

    const abrirPainelParceiro = (nome) => {
        if (nome.trim().toLowerCase() === "annett studios") {
            setTemaAnnet(true);
            setTemaSelecionado("Annett Studios");
            setModoBotoes(false);
        } else {
            setTemaAnnet(false);
            setTemaSelecionado("Tema não definido");
            setModoBotoes(false);
        }
    };

    // 🌀 Enquanto verifica
    if (carregando) {
        return (
            <div className="partner-conteudo carregando">
                <p>Verificando acessos...</p>
            </div>
        );
    }

    // 🧩 Caso seja admin/coordenador/auditor → mostra botões
    if (modoBotoes) {
        return (
            <div className="partner-conteudo painel-admin">
                <h2 className="partner-titulo">
                    Bem-vindo(a), {usuario.cargo || "Administrador(a)"}
                </h2>
                <p className="partner-descricao">
                    Selecione o painel que deseja acessar:
                </p>
                <div className="partner-lista-botoes">
                    {parceirosUnicos.map((nome, i) => (
                        <button
                            key={i}
                            onClick={() => abrirPainelParceiro(nome)}
                            className="partner-botao-lista"
                        >
                            {nome}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="partner-botao-voltar voltar-admin"
                >
                    Voltar
                </button>
            </div>
        );
    }

    // 🎨 Painel personalizado da Annett Studios
    if (temaAnnet) {
        return (
            <div
                className="partner-conteudo annet-tema"

            >
                <img
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/logo.png"
                    alt="Logo Annet Studios"
                    className="annet-logo"
                />

                <h2 className="partner-titulo annet-titulo">
                    Painel de controle Annett Studios
                </h2>

                <form onSubmit={verificarSenha} className="partner-form">
                    <p className="partner-descricao annet-descricao">
                        Digite sua senha de parceira para acessar o painel:
                    </p>

                    <input
                        type="password"
                        placeholder="Digite a senha de acesso"
                        value={senhaDigitada}
                        onChange={(e) => setSenhaDigitada(e.target.value)}
                        className={erro ? "erro" : ""}
                    />

                    {erro && (
                        <p className="erro-texto">
                            Senha incorreta, tente novamente.
                        </p>
                    )}

                    <div className="partner-botoes">
                        <button type="submit" className="partner-botao-entrar annet-botao">
                            Entrar
                        </button>
                        <br />
                        <button
                            type="button"
                            onClick={onClose}
                            className="partner-botao-voltar"
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // 🚫 Tema não definido
    return (
        <div className="partner-conteudo">
            <h2 className="partner-titulo">Tema não definido</h2>
            <p className="partner-descricao">
                Este parceiro ainda não possui um painel personalizado.
            </p>
            <button onClick={onClose} className="partner-botao-voltar">
                Voltar
            </button>
        </div>
    );
}
