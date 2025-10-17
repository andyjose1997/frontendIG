import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./logincadastro.css";

export default function LoginCadastroTopo() {
    const location = useLocation();
    const [mostrar, setMostrar] = useState(false);
    const [usuarioId, setUsuarioId] = useState("");
    const [usuarioNome, setUsuarioNome] = useState("");
    const [scrolling, setScrolling] = useState(false);
    const [textoAtivo, setTextoAtivo] = useState(false);
    const [textoEntrar, setTextoEntrar] = useState("");
    const [textoCriar, setTextoCriar] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

    // Atualiza se for mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 700);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");

        if (location.pathname.includes("portfolio-publico") && id) {
            setMostrar(true);
            setUsuarioId(id);

            setTimeout(() => {
                const nomeElement = document.querySelector(".nome-usuario, h1, h2, h3");
                if (nomeElement && nomeElement.textContent) {
                    const nomeFormatado = nomeElement.textContent
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "");
                    setUsuarioNome(nomeFormatado);
                }
            }, 800);
        } else {
            setMostrar(false);
        }
    }, [location]);

    // 🔹 Efeito do scroll
    useEffect(() => {
        let timer;
        const handleScroll = () => {
            setScrolling(true);
            clearTimeout(timer);
            timer = setTimeout(() => setScrolling(false), 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔹 Animação letra por letra (typewriter)
    useEffect(() => {
        if (!isMobile) return;
        let mostrar = true;
        const intervalo = setInterval(() => {
            mostrar = !mostrar;
            setTextoAtivo(mostrar);
        }, 5000);
        return () => clearInterval(intervalo);
    }, [isMobile]);

    // 🔹 Controla escrita e apagamento das palavras
    useEffect(() => {
        if (!isMobile) return;
        const palavra1 = "Entrar";
        const palavra2 = "Criar conta";

        if (textoAtivo) {
            // Digita letra por letra
            let i = 0;
            const escrever = setInterval(() => {
                setTextoEntrar(palavra1.slice(0, i + 1));
                setTextoCriar(palavra2.slice(0, i + 1));
                i++;
                if (i >= Math.max(palavra1.length, palavra2.length)) clearInterval(escrever);
            }, 100);
        } else {
            // Apaga letra por letra
            let i = Math.max(textoEntrar.length, textoCriar.length);
            const apagar = setInterval(() => {
                setTextoEntrar(p => p.slice(0, -1));
                setTextoCriar(p => p.slice(0, -1));
                i--;
                if (i <= 0) clearInterval(apagar);
            }, 80);
        }
    }, [textoAtivo, isMobile]);

    const token = localStorage.getItem("token");
    const estaLogado = !!token;
    if (!mostrar || estaLogado) return null;

    const dominio = "https://www.irongoals.com";
    const linkCriarConta =
        usuarioId && usuarioNome
            ? `${dominio}/criar-conta/${usuarioId}/${usuarioNome}`
            : `${dominio}/criar-conta`;

    const conteudo = (
        <div
            className={`login-cadastro-topo ${scrolling ? "oculto-scroll" : "visivel-scroll"}`}
        >
            <div className="botoes-topo">
                <a
                    href={`${dominio}/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {isMobile ? (textoEntrar || "💬") : "Entrar"}
                </a><br /><br />
                <a
                    href={linkCriarConta}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {isMobile ? (textoCriar || "✨") : "Criar conta"}
                </a>
            </div>
        </div>
    );

    return createPortal(conteudo, document.body);
}
