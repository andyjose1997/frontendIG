import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import './indicados.css';
import { URL } from "../../config";
import Swal from "sweetalert2";

export default function Indicados() {
    const [indicados, setIndicados] = useState([]);
    const [modoBusca, setModoBusca] = useState("padrao");
    const [buscaInput, setBuscaInput] = useState("");
    const [resultadoBusca, setResultadoBusca] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState("nome");
    const [detalhe, setDetalhe] = useState(null);
    const [mostrarModalInfo, setMostrarModalInfo] = useState(false); // ✅ adicionado

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        buscarIndicadosDoUsuario();
    }, []);

    const buscarIndicadosDoUsuario = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(`${URL}/indicados`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("🔍 Dados recebidos do backend:", data);

        setIndicados(data);
    };

    const supabaseBase =
        "https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/fotosdeperfis/";

    const getFotoUrl = (foto) => {
        if (!foto) return "/Logo/perfilPadrao/M.png";
        return foto.startsWith("http") ? foto : supabaseBase + foto;
    };

    const buscarPessoa = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${URL}/buscar_usuario?${filtroTipo}=${buscaInput}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const erro = await res.json();
                Swal.fire({
                    icon: "error",
                    title: "Erro ao buscar pessoa",
                    text: erro.erro || "Tente novamente.",
                });
                return;
            }

            const data = await res.json();
            setResultadoBusca(data);
        } catch (e) {
            console.error("Erro ao buscar pessoa:", e);
            Swal.fire({
                icon: "error",
                title: "Erro de conexão",
                text: "Não foi possível conectar ao servidor.",
            });
        }
    };

    const voltar = () => {
        setModoBusca("padrao");
        setBuscaInput("");
        setResultadoBusca(null);
    };

    const ordenados = [...indicados];

    const abrirDetalhe = (pessoa) => setDetalhe(pessoa);
    const fecharDetalhe = () => setDetalhe(null);

    const formatarNome = (nomeCompleto) => {
        return nomeCompleto
            .toLowerCase()
            .split(" ")
            .map(p => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    };

    return (
        <div className="indicadosContainer">
            <h2
                className="tituloIndicados"
                onClick={() => setMostrarModalInfo(true)}
            >
                Indicados
            </h2>

            {mostrarModalInfo && (
                <div className="modalFundo">
                    <div className="modalDetalhe">
                        <button
                            className="fecharModalIndicado"
                            onClick={() => setMostrarModalInfo(false)}
                        >
                            ✖
                        </button> <br />
                        <h2>Sobre os Indicados</h2>
                        <p>
                            Os <strong>indicados</strong> são as pessoas que se cadastraram utilizando o seu link de Host.
                            <br /><br />
                            Eles podem comprar serviços e pacotes na plataforma, e sempre que realizarem uma compra,
                            você ganha dinheiro como Host.<br /> Para mais informação vá perfil e clica em seu ID
                            <br /><br />
                            Por enquanto, temos disponível apenas o <strong>pacote de R$60</strong>, mas em breve
                            teremos mais opções de serviços e produtos dentro da IronGoals.
                        </p>
                    </div>
                </div>
            )}

            {modoBusca === "padrao" && (
                <div className="botoesBusca">
                    <button onClick={() => setModoBusca("pessoa")}>🔍 Buscar Indicados</button>
                </div>
            )}

            {modoBusca === "pessoa" && (
                <div className="buscaPessoa">
                    <input
                        type="text"
                        placeholder="Digite o nome"
                        value={buscaInput}
                        onChange={e => setBuscaInput(e.target.value)}
                    /> <br /><br />

                    {buscaInput.trim() !== "" && (
                        <ul className="sugestoesLista">
                            {(() => {
                                const normalizar = texto => texto
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase();

                                const filtrados = indicados.filter(pessoa =>
                                    normalizar(`${pessoa.nome} ${pessoa.sobrenome}`).includes(normalizar(buscaInput))
                                );

                                return filtrados.length > 0 ? (
                                    filtrados.map(pessoa => (
                                        <li
                                            key={pessoa.id}
                                            onClick={() => {
                                                setDetalhe(pessoa);
                                                setBuscaInput("");
                                            }}
                                        >
                                            <img
                                                src={getFotoUrl(pessoa.foto)}
                                                alt="foto"
                                                className="miniFotoSugestao"
                                            />
                                            <span>{formatarNome(`${pessoa.nome} ${pessoa.sobrenome}`)}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="nenhumResultado">🔍 Nenhum resultado encontrado</li>
                                );
                            })()}
                        </ul>
                    )}
                </div>
            )}

            {resultadoBusca && resultadoBusca.id && (
                <div className="resultadoPessoa">
                    <img
                        src={getFotoUrl(resultadoBusca.foto)}
                        alt="Foto de perfil"
                        className="fotoPerfilMini"
                    />
                    <h3>{resultadoBusca.nome}</h3>
                    <p>ID: {resultadoBusca.id}</p>
                    <button onClick={voltar}>🔙 Voltar</button>
                </div>
            )}

            {indicados.length > 0 ? (
                <div className="listaIndicados">
                    <br />
                    <h3>Lista de Indicados:</h3>
                    <ul>
                        {indicados.map((indicado, index) => (
                            <li key={index} onClick={() => abrirDetalhe(indicado)}>
                                {formatarNome(`${indicado.nome} ${indicado.sobrenome}`)}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Nenhum indicado encontrado.</p>
            )}

            {detalhe && (
                <div className="modalFundo">
                    <div className="modalDetalhe">
                        <button className="fecharModalIndicado" onClick={fecharDetalhe}>✖</button>
                        <img
                            src={getFotoUrl(detalhe.foto)}
                            alt="Foto"
                        />
                        <h2>{formatarNome(`${detalhe.nome} ${detalhe.sobrenome}`)}</h2>
                        <a
                            href={`https://wa.me/${detalhe.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="botaoZap"
                        >
                            📱 Abrir WhatsApp
                        </a>
                        <br />
                        {/* 🔹 Novo botão Ver Portfólio */}
                        <a
                            href={`https://www.irongoals.com/portfolio-publico?id=${detalhe.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="botaoPortfolio"
                        >
                            🎓 Ver Portfólio
                        </a>

                        <p className="comentarioPerfil">
                            <strong>Próxima Meta:</strong><br />
                            {detalhe.comentario_perfil && detalhe.comentario_perfil.trim() !== ""
                                ? detalhe.comentario_perfil
                                : "Nenhuma meta definida."}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}
