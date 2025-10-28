import './perfil.css';
import Up from './up';
import BotaoUm from './botaoum';
import BotaoDois from './botaodois';
import BotaoTres from './botaotres';
import Botoes from './botoes';
import { useEffect, useState } from "react";
import { Cursos } from '../aprendizagem/cursos/cursos';

export default function Perfil() {
    const [modoMobileBotoes, setModoMobileBotoes] = useState(false);
    const [modoMobileBotaoUm, setModoMobileBotaoUm] = useState(false);
    const [modoMobileBotaoDois, setModoMobileBotaoDois] = useState(false);
    const [modoMobileBotaoTres, setModoMobileBotaoTres] = useState(false);
    const [larguraTela, setLarguraTela] = useState(window.innerWidth);

    // 🔹 Estado de carregamento
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        function atualizarLargura() {
            setLarguraTela(window.innerWidth);
        }
        window.addEventListener("resize", atualizarLargura);

        // 🔹 Remove o carregamento após renderização inicial
        const timer = setTimeout(() => setCarregando(false), 800);

        return () => {
            window.removeEventListener("resize", atualizarLargura);
            clearTimeout(timer);
        };
    }, []);

    // 🔹 Enquanto carrega
    if (carregando) {
        return (
            <div className="overlay-carregando">
                <div className="spinner"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <main id='Perfil'>
            <div id="Up">
                <Up />
            </div>

            {/* 🔹 Cursos só aparecem se a tela for menor que 1300px */}
            {larguraTela <= 1300 && (
                <div className="perfil-cursos-area">
                    <Cursos />
                </div>
            )}

            {larguraTela <= 1300 ? (
                <>
                    {/* 🔹 Barra fixa inferior com os 4 botões */}
                    <div className="barra-inferior">
                        <button onClick={() => setModoMobileBotoes(true)}>
                            <span className="emoji">📋</span>
                            Menu
                        </button>
                        <button onClick={() => setModoMobileBotaoUm(true)}>
                            <span className="emoji">ℹ️</span>
                            Info
                        </button>
                        <button onClick={() => setModoMobileBotaoDois(true)}>
                            <span className="emoji">💪</span>
                            IronStep
                        </button>
                        <button onClick={() => setModoMobileBotaoTres(true)}>
                            <span className="emoji">🏆</span>
                            Ranking
                        </button>
                    </div>

                    {/* 🔹 Modais (mesmo funcionamento anterior) */}
                    {modoMobileBotoes && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotoes(false)}>🔙</button>
                                <Botoes />
                            </div>
                        </div>
                    )}

                    {modoMobileBotaoUm && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotaoUm(false)}>🔙</button>
                                <BotaoUm />
                            </div>
                        </div>
                    )}

                    {modoMobileBotaoDois && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotaoDois(false)}>🔙</button>
                                <BotaoDois />
                            </div>
                        </div>
                    )}

                    {modoMobileBotaoTres && (
                        <div className="perfil-modal-overlay">
                            <div className="perfil-modal-conteudo">
                                <button className="voltar" onClick={() => setModoMobileBotaoTres(false)}>🔙</button>
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
