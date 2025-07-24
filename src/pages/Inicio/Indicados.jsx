import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import './Indicados.css';
import { URL } from "../../config";

export default function Indicados() {
    const [indicados, setIndicados] = useState([]);
    const [modoBusca, setModoBusca] = useState("padrao");
    const [buscaInput, setBuscaInput] = useState("");
    const [resultadoBusca, setResultadoBusca] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState("nome");
    const [detalhe, setDetalhe] = useState(null);

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


    const buscarPessoa = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${URL}/buscar_usuario?${filtroTipo}=${buscaInput}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const erro = await res.json();
                alert(erro.erro || "Erro ao buscar pessoa.");
                return;
            }

            const data = await res.json();
            setResultadoBusca(data);
        } catch (e) {
            console.error("Erro ao buscar pessoa:", e);
            alert("Erro ao conectar com o servidor.");
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
            <h2>Indicados</h2>

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
                                                src={
                                                    pessoa?.foto
                                                        ? `http://localhost:8899/fotos/${pessoa.foto}`
                                                        : "/Logo/perfilPadrao/M.png"
                                                }
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
                    <img src={resultadoBusca.fotoURL || "/Logo/perfilPadrao/M.png"} alt="Foto de perfil" className="fotoPerfilMini" />
                    <h3>{resultadoBusca.nome}</h3>
                    <p>ID: {resultadoBusca.id}</p>
                    <button onClick={voltar}>🔙 Voltar</button>
                </div>
            )}

            {indicados.length > 0 ? (
                <div className="listaIndicados">
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
                        <button className="fecharModal" onClick={fecharDetalhe}>✖</button>
                        <img
                            src={`http://localhost:8899/fotos/${detalhe.foto || "padrao.png"}`}
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
