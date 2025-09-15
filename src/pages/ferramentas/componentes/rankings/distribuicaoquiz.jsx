import { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./distribuicaoQuiz.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export default function DistribuicaoQuiz() {
    const [torneios, setTorneios] = useState([]);
    const [rankings, setRankings] = useState({});
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [etapa, setEtapa] = useState(1); // 🔹 controla 1º ou 2º clique

    useEffect(() => {
        const carregarTorneios = async () => {
            const res = await fetch(`${URL}/quiz/todos`);
            const data = await res.json();

            const unicos = [];
            const vistos = new Set();
            for (const item of data) {
                if (!vistos.has(item.tipo)) {
                    vistos.add(item.tipo);
                    unicos.push(item);
                }
            }
            setTorneios(unicos);

            // 🔹 Carregar ranking de cada torneio
            for (const t of unicos) {
                try {
                    const resRank = await fetch(`${URL}/quiz/ranking/${t.tipo}`);
                    const dataRank = await resRank.json();
                    setRankings((prev) => ({ ...prev, [t.tipo]: dataRank }));
                } catch (err) {
                    console.error(`Erro ao carregar ranking de ${t.tipo}:`, err);
                }
            }
        };

        carregarTorneios();
    }, []);


    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    // 🔹 Limpar tabelas no backend
    const limparTabelas = async () => {
        try {
            const res = await fetch(`${URL}/quiz/limpar-tabelas`, { method: "DELETE" });
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Sucesso",
                    text: "Todas as tabelas foram limpas!",
                    confirmButtonColor: "#28a745"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "Não foi possível limpar as tabelas!",
                    confirmButtonColor: "#d33"
                });
            }
        } catch (err) {
            console.error("Erro ao limpar tabelas:", err);
        }
    };

    const gerarPDF = () => {
        if (!mesSelecionado) {
            Swal.fire({
                icon: "warning",
                title: "Atenção",
                text: "Escolha um mês antes de exportar o PDF!",
                confirmButtonText: "Ok",
                confirmButtonColor: "#3085d6"
            });
            return;
        }

        if (etapa === 1) {
            // 🔹 Exportar PDF normalmente
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Lista de Torneios", 14, 20);

            torneios.forEach((t, index) => {
                const startY = 30 + index * 60;
                doc.setFontSize(14);
                doc.text(`${capitalize(t.tipo)}`, 14, startY - 5);

                const dados = rankings[t.tipo]?.map(j => [
                    j.nome + " " + j.sobrenome,
                    j.pontos
                ]) || [["Sem participantes ainda", ""]];

                autoTable(doc, {
                    startY,
                    head: [["Jogador", "Pontos"]],
                    body: dados,
                    theme: "grid",
                });
            });

            doc.save(`${mesSelecionado}.pdf`);

            Swal.fire({
                icon: "info",
                title: "Quase lá",
                text: "Clique novamente para confirmar e limpar as tabelas!",
                confirmButtonColor: "#007bff"
            });

            setEtapa(2); // vai para segunda etapa
        } else if (etapa === 2) {
            // 🔹 Após 2 segundos, limpar tabelas
            setTimeout(() => {
                limparTabelas();
                setEtapa(1); // volta ao estado inicial
            }, 2000);
        }
    };

    return (
        <div className="dist-container">
            <h2 className="dist-title">Lista de Torneios</h2>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                    list="meses"
                    placeholder="Escolha um mês"
                    value={mesSelecionado}
                    onChange={(e) => setMesSelecionado(e.target.value)}
                    className="dist-input"
                />
                <datalist id="meses">
                    <option value="Janeiro" />
                    <option value="Fevereiro" />
                    <option value="Março" />
                    <option value="Abril" />
                    <option value="Maio" />
                    <option value="Junho" />
                    <option value="Julho" />
                    <option value="Agosto" />
                    <option value="Setembro" />
                    <option value="Outubro" />
                    <option value="Novembro" />
                    <option value="Dezembro" />
                </datalist>

                <button className="dist-pdf-btn" onClick={gerarPDF}>
                    {etapa === 1 ? "Exportar PDF" : "Confirmar e Limpar"}
                </button>
            </div>
            <br />
            {torneios.length === 0 ? (
                <p className="dist-info">Nenhum torneio cadastrado ainda.</p>
            ) : (
                torneios.map((t) => (
                    <div key={t.id} className="dist-box">
                        <h3 className="dist-box-title">{capitalize(t.tipo)}</h3>
                        <table className="dist-table">
                            <thead>
                                <tr>
                                    <th>Jogador</th>
                                    <th>Pontos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings[t.tipo]?.map((jogador, idx) => (
                                    <tr key={idx}>
                                        <td>{jogador.nome} {jogador.sobrenome}</td>
                                        <td>{jogador.pontos}</td>
                                    </tr>
                                )) || (
                                        <tr>
                                            <td colSpan="2">Sem participantes ainda</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
}
