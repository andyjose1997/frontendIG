import { useEffect, useState } from "react";
import { URL } from "../../../config";
import "./premiosform.css";

export default function PremiosForm() {
    const [vendas, setVendas] = useState("");
    const [ranking, setRanking] = useState("");
    const [mesAno, setMesAno] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [confirmarApagar, setConfirmarApagar] = useState(false);

    // 🔹 Carregar valores atuais do banco ao montar
    useEffect(() => {
        const carregarPremio = async () => {
            try {
                const resVendas = await fetch(`${URL}/premios/vendas`);
                const dataVendas = await resVendas.json();

                const resRanking = await fetch(`${URL}/premios/ranking`);
                const dataRanking = await resRanking.json();

                if (dataVendas.vendas && dataVendas.vendas.length > 0) {
                    setVendas(dataVendas.vendas[0]);
                }
                if (dataRanking.ranking && dataRanking.ranking.length > 0) {
                    setRanking(dataRanking.ranking[0].ranking);
                    setMesAno(dataRanking.ranking[0].mes_ano);
                }
            } catch (err) {
                console.error("Erro ao carregar prêmio atual:", err);
            }
        };

        carregarPremio();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("vendas", vendas);
            formData.append("ranking", ranking);
            formData.append("mes_ano", mesAno);

            const res = await fetch(`${URL}/premios/atualizar`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            setMensagem(data.mensagem);
        } catch (err) {
            console.error("Erro ao salvar prêmio:", err);
            setMensagem("❌ Erro ao salvar prêmio!");
        }
    };

    const handleDelete = async () => {
        if (!confirmarApagar) {
            setMensagem("⚠️ Clique novamente em 'Apagar Prêmio' para confirmar.");
            setConfirmarApagar(true);
            return;
        }

        try {
            const res = await fetch(`${URL}/premios/apagar`, {
                method: "DELETE"
            });

            const data = await res.json();
            setMensagem(data.mensagem);

            // limpa os inputs após apagar
            setVendas("");
            setRanking("");
            setMesAno("");
            setConfirmarApagar(false);
        } catch (err) {
            console.error("Erro ao apagar prêmio:", err);
            setMensagem("❌ Erro ao apagar prêmio!");
            setConfirmarApagar(false);
        }
    };

    return (
        <div className="premios-form">
            <h2>⚡ Atualizar Prêmio</h2>
            <form onSubmit={handleSubmit}>
                <label>Vendas:</label>
                <input
                    type="text"
                    value={vendas}
                    onChange={(e) => setVendas(e.target.value)}
                    required
                />

                <label>Ranking:</label>
                <input
                    type="text"
                    value={ranking}
                    onChange={(e) => setRanking(e.target.value)}
                    required
                />

                <label>Mês/Ano:</label>
                <input
                    type="text"
                    value={mesAno}
                    onChange={(e) => setMesAno(e.target.value)}
                    placeholder="2025-10"
                    required
                />

                <div className="premios-botoes">
                    <button type="submit">Salvar</button>
                    <button
                        type="button"
                        className={`apagar ${confirmarApagar ? "confirmar" : ""}`}
                        onClick={handleDelete}
                    >
                        {confirmarApagar ? "Clique novamente para confirmar" : "Apagar Prêmio"}
                    </button>
                </div>
            </form>
            {mensagem && <p className="premios-msg">{mensagem}</p>}
        </div>
    );
}
