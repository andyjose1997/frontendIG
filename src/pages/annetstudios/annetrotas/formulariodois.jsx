// 📂 src/pages/annetstudios/annetrotas/formulariodois.jsx
import { useState } from "react";
import "./formulariodois.css";

export default function FormularioDois({ onVoltar }) {
    const [servicosSelecionados, setServicosSelecionados] = useState([]);
    const [dataHora, setDataHora] = useState("");
    const [indiceImagem, setIndiceImagem] = useState({});
    const [imagemGrande, setImagemGrande] = useState(null);

    const supabaseUrl = "https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/";

    const servicos = [
        { nome: "Unhas semi permanentes (Mãos)", preco: 50, prefixo: "um_" },
        { nome: "Unhas semi permanentes (Pés)", preco: 50, prefixo: "dois_" },
        { nome: "Alongamento Soft Gel (unhas realistas)", preco: 100, prefixo: "tres_" },
        { nome: "Alongamento de Acrílico", preco: 120, prefixo: "quatro_" },
        { nome: "Banho de Acrílico na unha natural", preco: 80, prefixo: "cinco_" },
        { nome: "Apenas limpeza", preco: 25, prefixo: "seis_" },
    ];

    const gerarImagens = (prefixo) =>
        Array.from({ length: 9 }).map((_, i) => `${supabaseUrl}${prefixo}${i + 1}.png`);

    const handleSelecionarServico = (nome) => {
        setServicosSelecionados((prev) =>
            prev.includes(nome)
                ? prev.filter((s) => s !== nome)
                : [...prev, nome]
        );
    };

    const mudarSlide = (prefixo, direcao) => {
        setIndiceImagem((prev) => {
            const atual = prev[prefixo] || 0;
            const novo =
                direcao === "proximo"
                    ? (atual + 3) % 9
                    : (atual - 3 + 9) % 9;
            return { ...prev, [prefixo]: novo };
        });
    };

    const handleConfirmar = async (e) => {
        e.preventDefault();

        if (servicosSelecionados.length === 0 || !dataHora) {
            alert("Por favor, selecione os serviços e o horário.");
            return;
        }

        // 🔹 Calcula o total baseado nos serviços
        const total = servicos
            .filter(s => servicosSelecionados.includes(s.nome))
            .reduce((sum, s) => sum + s.preco, 0);

        try {
            // 🔹 Cria uma preferência de pagamento no backend (sem login)
            const resposta = await fetch("https://backendig-2.onrender.com/pagamento/criar-preferencia-annet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    valor_total: total,
                    descricao: `Agendamento de ${servicosSelecionados.join(", ")}`,
                    dataHora: dataHora
                })
            });

            const data = await resposta.json();
            if (data.init_point) {
                // 🔹 Redireciona ao checkout MercadoPago
                window.location.href = data.init_point;
            } else {
                alert("Erro ao criar pagamento. Tente novamente.");
            }
        } catch (err) {
            console.error("Erro ao criar pagamento:", err);
            alert("Ocorreu um erro ao iniciar o pagamento.");
        }
    };


    return (
        <main className="formannet-container">
            <h1 className="formannet-titulo">Escolha seus serviços</h1>
            <p className="formannet-subtitulo">
                Selecione um ou mais serviços que deseja agendar e o horário disponível.
            </p>

            <div className="formannet-servicos-lista">
                {servicos.map((servico) => {
                    const imagens = gerarImagens(servico.prefixo);
                    const inicio = indiceImagem[servico.prefixo] || 0;
                    const visiveis = imagens.slice(inicio, inicio + 3);

                    return (
                        <div key={servico.nome} className="formannet-servico-bloco">
                            <label
                                className={`formannet-servico ${servicosSelecionados.includes(servico.nome)
                                    ? "selecionado"
                                    : ""
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={servicosSelecionados.includes(servico.nome)}
                                    onChange={() => handleSelecionarServico(servico.nome)}
                                />
                                <span>{servico.nome}</span>
                                <strong>R$ {servico.preco}</strong>
                            </label>

                            {servicosSelecionados.includes(servico.nome) && (
                                <div className="formannet-carrossel">
                                    <button
                                        type="button"
                                        className="formannet-carrossel-btn esquerda"
                                        onClick={() => mudarSlide(servico.prefixo, "anterior")}
                                    >
                                        ⬅️
                                    </button>

                                    <div className="formannet-imagens">
                                        {visiveis.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={servico.nome}
                                                className="formannet-imagem"
                                                onClick={() => setImagemGrande(img)}
                                                onError={(e) => (e.target.style.display = "none")}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="formannet-carrossel-btn direita"
                                        onClick={() => mudarSlide(servico.prefixo, "proximo")}
                                    >
                                        ➡️
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="formannet-horario">
                <h3>Selecione a data e o horário desejado:</h3>

                <div className="formannet-data">
                    <input
                        type="date"
                        value={dataHora.split("T")[0] || ""}
                        onChange={(e) =>
                            setDataHora(e.target.value ? `${e.target.value}T` : "")
                        }
                        required
                    />
                </div>

                {dataHora && (
                    <div className="formannet-horas">
                        {[
                            "09:00",
                            "10:00",
                            "11:00",
                            "13:00",
                            "14:00",
                            "15:00",
                            "16:00",
                            "17:00",
                        ].map((hora) => (
                            <button
                                key={hora}
                                type="button"
                                className={`formannet-hora-btn ${dataHora.endsWith(hora) ? "ativo" : ""
                                    }`}
                                onClick={() =>
                                    setDataHora((prev) => prev.split("T")[0] + "T" + hora)
                                }
                            >
                                {hora}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="formannet-botoes">
                <button onClick={onVoltar} className="formannet-btn-voltar">
                    ← Voltar
                </button>
                <button
                    onClick={handleConfirmar}
                    disabled={servicosSelecionados.length === 0 || !dataHora}
                    className="formannet-btn"
                >
                    Confirmar Agendamento
                </button>
            </div>

            {/* 🆕 Modal da imagem ampliada */}
            {imagemGrande && (
                <div
                    className="formannet-modal-fundo"
                    onClick={() => setImagemGrande(null)}
                >
                    <img
                        src={imagemGrande}
                        alt="Imagem ampliada"
                        className="formannet-modal-imagem"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    );
}
