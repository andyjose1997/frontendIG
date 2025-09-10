import './perfil.css'
import Up from './up';
import BotaoUm from './botaoum';
import BotaoDois from './botaodois';
import BotaoTres from './botaotres';
import Botoes from './botoes';
import { useEffect, useState } from "react";

export default function Perfil() {
    const [modoMobileBotoes, setModoMobileBotoes] = useState(false);
    const [modoMobileBotaoUm, setModoMobileBotaoUm] = useState(false);
    const [modoMobileBotaoDois, setModoMobileBotaoDois] = useState(false);
    const [modoMobileBotaoTres, setModoMobileBotaoTres] = useState(false);
    const [larguraTela, setLarguraTela] = useState(window.innerWidth);

    useEffect(() => {
        function atualizarLargura() {
            setLarguraTela(window.innerWidth);
        }
        window.addEventListener("resize", atualizarLargura);
        return () => window.removeEventListener("resize", atualizarLargura);
    }, []);

    return (
        <main id='Perfil'>
            <div id="Up">
                <Up />
            </div>

            {larguraTela <= 1300 ? (
                <>
                    {/* Botão Menu */}
                    {!modoMobileBotoes && (
                        <button className="abrir-botoes" onClick={() => setModoMobileBotoes(true)}>
                            Menu
                        </button>
                    )}
                    {modoMobileBotoes && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotoes(false)}>
                                    🔙
                                </button>
                                <Botoes />
                            </div>
                        </div>
                    )}

                    {/* Botão Informações */}
                    {!modoMobileBotaoUm && (
                        <button className="abrir-botaoUm" onClick={() => setModoMobileBotaoUm(true)}>
                            Informações
                        </button>
                    )}
                    {modoMobileBotaoUm && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotaoUm(false)}>
                                    🔙
                                </button>
                                <BotaoUm />
                            </div>
                        </div>
                    )}

                    {/* Botão Dois */}
                    {!modoMobileBotaoDois && (
                        <button className="abrir-botaoDois" onClick={() => setModoMobileBotaoDois(true)}>
                            Experiências
                        </button>
                    )}
                    {modoMobileBotaoDois && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotaoDois(false)}>
                                    🔙
                                </button>
                                <BotaoDois />
                            </div>
                        </div>
                    )}

                    {/* Botão Três */}
                    {!modoMobileBotaoTres && (
                        <button className="abrir-botaoTres" onClick={() => setModoMobileBotaoTres(true)}>
                            Ranking                        </button>
                    )}
                    {modoMobileBotaoTres && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotaoTres(false)}>
                                    🔙
                                </button>
                                <BotaoTres />

                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div id="Botoes">
                        <Botoes />
                    </div>
                    <div id="BotaoUm">
                        <BotaoUm />
                    </div>
                    <div id="BotaoDois">
                        <BotaoDois />
                    </div>
                    <div id="BotaoTres">
                        <BotaoTres />
                    </div>
                </>
            )}
        </main>
    );
}
