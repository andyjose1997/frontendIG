import { useState } from "react";
import "./painelyoutube.css";
import ListaCursos from "./listarcursos";
import FormularioCurso from "./formulariocurso";
import FormularioVideo from "./formulariovideo";
import FormularioPergunta from "./formulariopergunta";

export default function PainelYouTube() {
    const [subPainel, setSubPainel] = useState("cursos");
    const [alerta, setAlerta] = useState({ mensagem: "", tipo: "" });
    const [confirmacao, setConfirmacao] = useState({
        mostrar: false,
        mensagem: "",
        onConfirm: null,
    });

    const mostrarAlerta = (mensagem, tipo = "sucesso") => {
        setAlerta({ mensagem, tipo });
        setTimeout(() => setAlerta({ mensagem: "", tipo: "" }), 3000);
    };

    const atualizarLista = () => {
        window.dispatchEvent(new Event("atualizarCursos"));
    };

    return (
        <div className="painel-youtube">
            <h2>Gerenciamento do YouTube</h2>

            {alerta.mensagem && (
                <div className={`alerta alerta-${alerta.tipo}`}>
                    {alerta.mensagem}
                </div>
            )}

            {confirmacao.mostrar && (
                <div className="youtubemodal-overlay">
                    <div className="youtubemodal-confirmacao">
                        <p>{confirmacao.mensagem}</p>
                        <div className="botoes">
                            <button
                                className="btn-confirmar"
                                onClick={() => {
                                    confirmacao.onConfirm();
                                    setConfirmacao({ mostrar: false });
                                }}
                            >
                                Confirmar
                            </button>
                            <button
                                className="btn-cancelar"
                                onClick={() => setConfirmacao({ mostrar: false })}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botões de navegação */}
            <div className="youtube-botoes">
                <button
                    className={subPainel === "cursos" ? "ativo" : ""}
                    onClick={() => setSubPainel("cursos")}
                >
                    Cursos
                </button>
                <button
                    className={subPainel === "videos" ? "ativo" : ""}
                    onClick={() => setSubPainel("videos")}
                >
                    Vídeos
                </button>
                <button
                    className={subPainel === "perguntas" ? "ativo" : ""}
                    onClick={() => setSubPainel("perguntas")}
                >
                    Perguntas
                </button>
            </div>

            {/* Área dividida */}
            <div className="youtube-layout">
                <div className="youtube-conteudo">
                    {subPainel === "cursos" && (
                        <FormularioCurso
                            mostrarAlerta={mostrarAlerta}
                            atualizarLista={atualizarLista}
                        />
                    )}
                    {subPainel === "videos" && (
                        <FormularioVideo
                            mostrarAlerta={mostrarAlerta}
                            atualizarLista={atualizarLista}
                        />
                    )}
                    {subPainel === "perguntas" && (
                        <FormularioPergunta
                            mostrarAlerta={mostrarAlerta}
                            atualizarLista={atualizarLista}
                        />
                    )}
                </div>

                <ListaCursos
                    mostrarAlerta={mostrarAlerta}
                    setConfirmacao={setConfirmacao}
                />
            </div>
        </div>
    );
}
