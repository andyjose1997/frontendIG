import './Perfil.css'
import Up from './Up';
import BotaoUm from './botaoUm';
import BotaoDois from './botaoDois';
import BotaoTres from './botaoTres';
import Botoes from './botoes';
import { useEffect, useState } from "react";
/*fgbfgf */

export default function Perfil() {
    const [modoMobileBotoes, setModoMobileBotoes] = useState(false);
    const [modoMobileBotaoUm, setModoMobileBotaoUm] = useState(false);
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

            {larguraTela <= 1000 ? (
                <>
                    {!modoMobileBotoes && (
                        <button
                            className="abrir-botoes"
                            onClick={() => setModoMobileBotoes(true)}
                        >
                            📋 Menu
                        </button>
                    )}

                    {modoMobileBotoes && (
                        <div className="fullscreen-botoes">
                            <button className="voltar" onClick={() => setModoMobileBotoes(false)}>
                                🔙 Voltar
                            </button>
                            <Botoes />
                        </div>
                    )}

                    {!modoMobileBotaoUm && (
                        <button
                            className="abrir-botaoUm"
                            onClick={() => setModoMobileBotaoUm(true)}
                        >
                            Informações
                        </button>
                    )}

                    {modoMobileBotaoUm && (
                        <div className="fullscreen-botaoUm">
                            <button className="voltar" onClick={() => setModoMobileBotaoUm(false)}>
                                🔙 Voltar
                            </button>
                            <BotaoUm />
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
                </>
            )}


            <div id="BotaoDois">
                <BotaoDois />
            </div>

            <div id="BotaoTres">
                <BotaoTres />
            </div>



        </main>
    );
}
