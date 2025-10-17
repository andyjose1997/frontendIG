import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./logincadastro.css";

export default function LoginCadastroTopo() {
    const location = useLocation();
    const [mostrar, setMostrar] = useState(false);
    const [usuarioId, setUsuarioId] = useState("");
    const [usuarioNome, setUsuarioNome] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");

        if (location.pathname.includes("portfolio-publico") && id) {
            setMostrar(true);
            setUsuarioId(id);

            // 🔹 Captura o nome do usuário exibido no portfólio (que já está no DOM)
            setTimeout(() => {
                // tenta achar qualquer título com o nome da pessoa
                const nomeElement = document.querySelector(
                    ".nome-usuario, h1, h2, h3"
                );

                if (nomeElement && nomeElement.textContent) {
                    const nomeFormatado = nomeElement.textContent
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "") // remove acentos
                        .replace(/\s+/g, ""); // remove espaços

                    setUsuarioNome(nomeFormatado);
                }
            }, 1000);
        } else {
            setMostrar(false);
        }
    }, [location]);

    const token = localStorage.getItem("token");
    const estaLogado = !!token;

    if (!mostrar || estaLogado) return null;

    // 🔹 Gera o link oficial com domínio fixo (SEM localhost)
    const dominio = "https://www.irongoals.com";

    const linkCriarConta =
        usuarioId && usuarioNome
            ? `${dominio}/criar-conta/${usuarioId}/${usuarioNome}`
            : `${dominio}/criar-conta`;

    return (
        <div className="login-cadastro-topo">
            <span className="mensagem-convite">
                Gostou deste portfólio? Crie o seu ou entre para ver o seu perfil!
            </span>

            <div className="botoes-topo">
                <a
                    href={`${dominio}/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Entrar
                </a>
                <a
                    href={linkCriarConta}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Criar conta
                </a>
            </div>
        </div>
    );
}
