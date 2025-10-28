// 📂 src/pages/annetstudios/annetrotas/formannet.jsx
import { useEffect, useState } from "react";
import "./formulario.css";
import FormularioDois from "./formulariodois";

export default function Formannet() {
    const [maiorIdade, setMaiorIdade] = useState(null);
    const [temPermissao, setTemPermissao] = useState(false);
    const [etapa, setEtapa] = useState("formulario");

    useEffect(() => {
        document.body.style.backgroundImage =
            "url('https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/ChatGPT%20Image%2028%20de%20out.%20de%202025,%2015_26_11.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundRepeat = "no-repeat";

        return () => {
            document.body.style.backgroundImage = "";
            document.body.style.backgroundColor = "";
        };
    }, []);

    if (etapa === "servicos") {
        return <FormularioDois onVoltar={() => setEtapa("formulario")} />;
    }

    return (
        <main className="formannet-container">
            <h1 className="formannet-titulo">Agendamento — Annet Studios</h1>
            <p className="formannet-subtitulo">
                Preencha o formulário abaixo para agendar seu serviço.
                Todas as informações são confidenciais e usadas apenas para garantir sua segurança.
            </p>

            <form
                className="formannet-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    setEtapa("servicos");
                }}
            >
                <label>
                    Nome completo:
                    <input type="text" required />
                </label>

                <label>
                    É maior de idade?
                    <div className="formannet-radio-grupo">
                        <label>
                            <input
                                type="radio"
                                name="idade"
                                onChange={() => setMaiorIdade(true)}
                            />{" "}
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="idade"
                                onChange={() => setMaiorIdade(false)}
                            />{" "}
                            Não
                        </label>
                    </div>
                </label>

                {!maiorIdade && maiorIdade !== null && (
                    <div className="formannet-menor-area">
                        <label>
                            Nome completo do responsável:
                            <input type="text" required={!maiorIdade} />
                        </label>

                        <label>
                            Tenho permissão do meu responsável para realizar o serviço:
                            <select
                                onChange={(e) =>
                                    setTemPermissao(e.target.value === "sim")
                                }
                            >
                                <option value="">Selecione</option>
                                <option value="sim">Sim</option>
                                <option value="nao">Não</option>
                            </select>
                        </label>

                        {!temPermissao && (
                            <p className="formannet-aviso">
                                ⚠️ É necessário autorização do responsável para continuar.
                            </p>
                        )}
                    </div>
                )}

                <label>
                    WhatsApp:
                    <input
                        type="text"
                        placeholder="(DDD) 99999-9999"
                        required
                    />
                </label>

                <label>
                    Possui alguma condição médica ou alergia que possa interferir no serviço?
                    <textarea
                        placeholder="Esta informação é confidencial e não será compartilhada."
                    ></textarea>
                </label>

                <button
                    type="submit"
                    disabled={!maiorIdade && !temPermissao}
                    className="formannet-btn"
                >
                    Enviar Agendamento
                </button>
            </form>
        </main>
    );
}
