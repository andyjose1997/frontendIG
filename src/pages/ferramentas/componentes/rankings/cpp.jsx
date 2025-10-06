import { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./cpp.css";

export default function CPP() {
    const [lista, setLista] = useState([]);
    const [aprovados, setAprovados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [mostrarAmanha, setMostrarAmanha] = useState(false);

    // 🔹 Armazena quem já clicou uma vez
    const [confirmar, setConfirmar] = useState(null);

    // 🔹 Carregar pendentes e aprovados (inicialmente HOJE)
    useEffect(() => {
        carregarLista(false);
        carregarAprovados();
    }, []);

    const carregarLista = async (amanha = false) => {
        try {
            const rota = amanha ? "amanha" : "pagamentos";
            const res = await fetch(`${URL}/cpp/${rota}`);
            const data = await res.json();
            setLista(Array.isArray(data) ? data : []);
            setMostrarAmanha(amanha);
        } catch (err) {
            console.error("Erro ao carregar lista:", err);
        } finally {
            setLoading(false);
        }
    };

    const carregarAprovados = async () => {
        try {
            const res = await fetch(`${URL}/cpp/aprovados`);
            const data = await res.json();
            setAprovados(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar aprovados:", err);
        }
    };

    const aprovarPagamento = async (id) => {
        try {
            const res = await fetch(`${URL}/cpp/aprovar/${id}`, {
                method: "POST",
            });
            const data = await res.json();
            setMensagem(data.mensagem);

            carregarLista(mostrarAmanha);
            carregarAprovados();
            setConfirmar(null); // 🔹 Reseta confirmação
        } catch (err) {
            console.error("Erro ao aprovar pagamento:", err);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="cpp-container">
            <h2>
                {mostrarAmanha ? "Pagamentos de amanhã" : "Pagamentos do dia"}
            </h2>

            <button
                className="cpp-botao"
                onClick={() => carregarLista(!mostrarAmanha)}
            >
                {mostrarAmanha ? "Ver pagamentos de hoje" : "Ver pagamentos de amanhã"}
            </button>

            {mensagem && <p className="cpp-mensagem">{mensagem}</p>}

            {/* Tabela de HOJE/AMANHÃ */}
            {lista.length === 0 ? (
                <p className="cpp-vazio">
                    Nenhum pagamento {mostrarAmanha ? "previsto para amanhã" : "pendente hoje"}.
                </p>
            ) : (
                <table className="cpp-tabela">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Sobrenome</th>
                            <th>Email</th>
                            <th>Pix</th>
                            {!mostrarAmanha && (
                                <>
                                    <th>Saldo Host</th>
                                    <th>Saldo HosHost</th>
                                    <th>Total</th>
                                    <th>Ação</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((p) => (
                            <tr
                                key={p.id}
                                className={!p.pix && !mostrarAmanha ? "linha-sem-pix" : ""}
                            >
                                <td>{p.nome}</td>
                                <td>{p.sobrenome}</td>
                                <td>{p.email}</td>
                                <td>{p.pix ? p.pix : "Sem chave Pix"}</td>

                                {!mostrarAmanha && (
                                    <>
                                        <td>R$ {p.saldo_host.toFixed(2)}</td>
                                        <td>R$ {p.saldo_hoshost.toFixed(2)}</td>
                                        <td>
                                            <strong>R$ {p.total.toFixed(2)}</strong>
                                        </td>
                                        <td>
                                            <button
                                                className="cpp-botao"
                                                onClick={() =>
                                                    confirmar === p.id
                                                        ? aprovarPagamento(p.id) // 🔹 segundo clique
                                                        : setConfirmar(p.id) // 🔹 primeiro clique
                                                }
                                            >
                                                {confirmar === p.id
                                                    ? "Clique para confirmar"
                                                    : "Aprovar pagamento"}
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Tabela de aprovados */}
            {aprovados.length > 0 && !mostrarAmanha && (
                <>
                    <h2>Pagamentos aprovados</h2>
                    <table className="cpp-tabela">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Sobrenome</th>
                                <th>Email</th>
                                <th>Pix</th>

                            </tr>
                        </thead>
                        <tbody>
                            {aprovados.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.nome}</td>
                                    <td>{p.sobrenome}</td>
                                    <td>{p.email}</td>
                                    <td>{p.pix ? p.pix : "Sem chave Pix"}</td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
