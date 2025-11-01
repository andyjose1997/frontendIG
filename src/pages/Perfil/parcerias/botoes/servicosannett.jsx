import { useState, useEffect, useRef } from "react";
import "./servicosannet.css";
import ImagensServicos from "./servicosannett/imagensservicos";
import { URL } from "../../../../config";

export default function ServicosAnnett() {
    const [form, setForm] = useState({
        servico: "",
        tempo_minutos: "",
        valor: "",
        retiro_minutos: "",
    });
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [servicos, setServicos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);

    const formRef = useRef(null);
    const fotosRef = useRef(null);

    const carregarServicos = async () => {
        try {
            const res = await fetch(`${URL}/annett/servicos/listar`);
            const data = await res.json();
            setServicos(data);
        } catch (err) {
            console.error("Erro ao carregar serviços:", err);
        }
    };

    useEffect(() => {
        carregarServicos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        const rota = editandoId
            ? `${URL}/annett/servicos/atualizar/${editandoId}`
            : `${URL}/annett/servicos/cadastrar`;
        const metodo = editandoId ? "PUT" : "POST";

        try {
            const res = await fetch(rota, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Erro desconhecido");

            setTipoMensagem("sucesso");
            setMensagem(editandoId ? "✅ Serviço atualizado!" : "✅ Serviço cadastrado!");
            setForm({
                servico: "",
                tempo_minutos: "",
                valor: "",
                retiro_minutos: "",
            });
            setEditandoId(null);
            carregarServicos();
        } catch (err) {
            setTipoMensagem("erro");
            setMensagem("❌ " + err.message);
        }

        setTimeout(() => setMensagem(""), 4000);
    };

    const editarServico = (servico) => {
        setForm({
            servico: servico.servico,
            tempo_minutos: servico.tempo_minutos,
            valor: servico.valor,
            retiro_minutos: servico.retiro_minutos,
        });
        setEditandoId(servico.id);

        // 🔹 Sobe até o formulário
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const apagarServico = async (id) => {
        if (!window.confirm("Tem certeza que deseja apagar este serviço?")) return;
        try {
            const res = await fetch(`${URL}/annett/servicos/deletar/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Erro ao deletar");
            setMensagem("🗑️ Serviço removido!");
            setTipoMensagem("sucesso");
            carregarServicos();
        } catch (err) {
            setMensagem("❌ " + err.message);
            setTipoMensagem("erro");
        }

        setTimeout(() => setMensagem(""), 3000);
    };

    const formatarTempo = (minutos) => {
        const horas = Math.floor(minutos / 60);
        const restoMin = minutos % 60;
        if (horas === 0) return `${restoMin} min`;
        if (restoMin === 0) return `${horas}h`;
        return `${horas}h ${restoMin}min`;
    };

    const formatarValor = (valor) => {
        const num = parseFloat(valor);
        if (isNaN(num)) return "R$ 0,00";
        return `R$ ${num.toFixed(2).replace(".", ",")}`;
    };

    return (
        <div className="servicosannet-container">
            <h2 className="servicosannet-titulo" ref={formRef}>
                {editandoId ? "Editar Serviço" : "Gerenciar Serviços"}
            </h2>

            <form className="servicosannet-formulario" onSubmit={handleSubmit}>
                <div className="form-grupo">
                    <label>Serviço</label>
                    <input
                        type="text"
                        name="servico"
                        placeholder="Ex: Alongamento em Gel"
                        value={form.servico}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-linha">
                    <div className="form-grupo">
                        <label>Tempo (minutos)</label>
                        <input
                            type="number"
                            name="tempo_minutos"
                            placeholder="Ex: 90"
                            value={form.tempo_minutos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-grupo">
                        <label>Retiro (minutos)</label>
                        <input
                            type="number"
                            name="retiro_minutos"
                            placeholder="Ex: 20"
                            value={form.retiro_minutos}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-grupo">
                        <label>Valor (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="valor"
                            placeholder="Ex: 120.00"
                            value={form.valor}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="servicosannet-botao-salvar">
                    {editandoId ? "✏️ Atualizar Serviço" : "💾 Salvar Serviço"}
                </button>
            </form>

            {mensagem && (
                <p
                    className={`servicosannet-mensagem ${tipoMensagem === "sucesso" ? "sucesso" : "erro"
                        }`}
                >
                    {mensagem}
                </p>
            )}

            <div className="servicosannet-tabela-container" ref={fotosRef}>
                <h3 className="servicosannet-subtitulo">📋 Serviços Cadastrados</h3>
                <table className="servicosannet-tabela">
                    <thead>
                        <tr>
                            <th>Serviço</th>
                            <th>Tempo</th>
                            <th>Retiro</th>
                            <th>Valor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicos.length > 0 ? (
                            servicos.map((s) => (
                                <tr key={s.id}>
                                    <td
                                        className="link-servico"
                                        onClick={() => {
                                            setServicoSelecionado(s);
                                            fotosRef.current?.scrollIntoView({ behavior: "smooth" });
                                        }}
                                    >
                                        {s.servico}
                                    </td>
                                    <td>{formatarTempo(s.tempo_minutos)}</td>
                                    <td>{formatarTempo(s.retiro_minutos)}</td>
                                    <td>{formatarValor(s.valor)}</td>
                                    <td>
                                        <button
                                            className="servicosannet-botao-acao editar"
                                            onClick={() => editarServico(s)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="servicosannet-botao-acao apagar"
                                            onClick={() => apagarServico(s.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Nenhum serviço cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {servicoSelecionado && (
                    <ImagensServicos servicoSelecionado={servicoSelecionado} />
                )}
            </div>
        </div>
    );
}
