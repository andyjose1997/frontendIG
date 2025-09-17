// 📂 src/pages/ironQuiz/CriarQuiz.jsx
import { useState, useEffect } from "react";
import { URL } from "../../config";
import "./criarquiz.css";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export default function CriarQuiz() {
    const [tipo, setTipo] = useState("");
    const [nome, setNome] = useState("");
    const [perguntas, setPerguntas] = useState([
        { pergunta: "", a: "", b: "", c: "", d: "", resposta_correta: "" }
    ]);
    const [editando, setEditando] = useState(false);

    const [quizzes, setQuizzes] = useState([]);
    const [funcao, setFuncao] = useState("");
    const [confirmarApagar, setConfirmarApagar] = useState(null);
    const [erros, setErros] = useState({});
    const [nomes, setNomes] = useState([]);
    const [busca, setBusca] = useState("");

    const id_criador = localStorage.getItem("usuario_id");

    useEffect(() => {
        const carregarNomes = async () => {
            try {
                const res = await fetch(`${URL}/quiz/nomes`);
                const data = await res.json();
                setNomes(data);
            } catch (err) {
                console.error("Erro ao carregar nomes:", err);
            }
        };
        carregarNomes();
    }, []);

    useEffect(() => {
        const carregarFuncao = async () => {
            try {
                const res = await fetch(`${URL}/perfil/${id_criador}`);
                const data = await res.json();
                setFuncao(data.funcao);
            } catch (err) {
                console.error("Erro ao carregar função do usuário:", err);
            }
        };
        carregarFuncao();
    }, [id_criador]);

    useEffect(() => {
        const carregarQuizzes = async () => {
            try {
                const res = await fetch(`${URL}/quiz/tipos`);
                const data = await res.json();
                setQuizzes(data);
            } catch (err) {
                console.error("Erro ao carregar quizzes:", err);
            }
        };
        carregarQuizzes();
    }, []);

    const quizzesFiltrados = quizzes.filter((q) => {
        if (["admin", "coordenador", "auditor"].includes(funcao?.trim().toLowerCase())) {
            return q.admin === 1 || q.id_criador === id_criador;
        } else {
            return q.id_criador === id_criador;
        }
    });

    const validarPerguntas = () => {
        let valido = true;
        const novosErros = {};

        if (!tipo.trim()) {
            novosErros.tipo = "⚠️ O tipo do quiz é obrigatório.";
            valido = false;
        }
        if (!nome.trim()) {
            novosErros.nome = "⚠️ O nome do quiz é obrigatório.";
            valido = false;
        }

        perguntas.forEach((p, idx) => {
            const errosPergunta = [];

            if (!p.pergunta.trim()) errosPergunta.push("A pergunta não pode estar vazia.");
            if (!p.a.trim() || !p.b.trim() || !p.c.trim() || !p.d.trim())
                errosPergunta.push("Todas as opções (A, B, C, D) precisam ser preenchidas.");
            if (!p.resposta_correta) errosPergunta.push("Selecione a opção correta.");

            const opcoes = [p.a, p.b, p.c, p.d].map((x) => x.trim().toLowerCase());
            const duplicadas = opcoes.filter((x, i) => x && opcoes.indexOf(x) !== i);
            if (duplicadas.length > 0) errosPergunta.push("As opções não podem ser iguais.");

            if (errosPergunta.length > 0) {
                novosErros[`pergunta-${idx}`] = errosPergunta;
                valido = false;
            }
        });

        setErros(novosErros);
        return valido;
    };

    const adicionarPergunta = () => {
        if (!validarPerguntas()) return;
        setPerguntas([
            ...perguntas,
            { pergunta: "", a: "", b: "", c: "", d: "", resposta_correta: "" }
        ]);
    };

    const atualizarPergunta = (index, campo, valor) => {
        const novas = [...perguntas];
        novas[index][campo] = valor;
        setPerguntas(novas);
    };

    const removerPergunta = (index) => {
        const novas = perguntas.filter((_, i) => i !== index);
        setPerguntas(novas);
    };

    const salvarQuiz = async () => {
        if (!id_criador) {
            setErros({ geral: "⚠️ Usuário não logado." });
            return;
        }

        if (!validarPerguntas()) return;

        try {
            if (editando) {
                await fetch(`${URL}/quiz/apagar/${nome}`, { method: "DELETE" });
            }

            await fetch(`${URL}/quiz/tipos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipo, nome, id_criador })
            });

            for (const p of perguntas) {
                await fetch(`${URL}/quiz/perguntas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tipo,
                        nome,
                        pergunta: p.pergunta,
                        a: p.a,
                        b: p.b,
                        c: p.c,
                        d: p.d,
                        resposta_correta: p.resposta_correta,
                        id_criador
                    })
                });
            }

            setErros({});
            Swal.fire({
                icon: "success",
                title: editando ? "✏️ Quiz atualizado com sucesso!" : "✅ Quiz salvo com sucesso!",
                showConfirmButton: false,
                timer: 2000
            });

            setTipo("");
            setNome("");
            setPerguntas([{ pergunta: "", a: "", b: "", c: "", d: "", resposta_correta: "" }]);
            setEditando(false);

            const res = await fetch(`${URL}/quiz/tipos`);
            setQuizzes(await res.json());
        } catch (err) {
            console.error("Erro ao salvar quiz:", err);
            Swal.fire({
                icon: "error",
                title: "❌ Erro ao salvar quiz.",
                text: "Tente novamente mais tarde."
            });
            setErros({ geral: "❌ Erro ao salvar quiz." });
        }
    };

    const apagarQuiz = async (nomeQuiz) => {
        if (confirmarApagar === nomeQuiz) {
            try {
                await fetch(`${URL}/quiz/apagar/${nomeQuiz}`, { method: "DELETE" });
                Swal.fire({
                    icon: "warning",
                    title: `🗑️ Quiz '${nomeQuiz}' apagado!`,
                    showConfirmButton: false,
                    timer: 2000
                });
                setQuizzes(quizzes.filter((q) => q.nome !== nomeQuiz));
                setConfirmarApagar(null);
            } catch (err) {
                console.error("Erro ao apagar quiz:", err);
                Swal.fire({
                    icon: "error",
                    title: "❌ Erro ao apagar quiz.",
                    text: "Não foi possível remover este quiz."
                });
                setErros({ geral: "❌ Erro ao apagar quiz." });
            }
        } else {
            setConfirmarApagar(nomeQuiz);
            setTimeout(() => setConfirmarApagar(null), 3000);
        }
    };

    const editarQuiz = async (nomeQuiz, tipoQuiz) => {
        try {
            const res = await fetch(`${URL}/quiz/perguntas/${nomeQuiz}`);
            let data = await res.json();

            if (!Array.isArray(data)) {
                data = [data];
            }

            const perguntasFormatadas = data.map((p) => ({
                pergunta: p.pergunta || "",
                a: p.a || "",
                b: p.b || "",
                c: p.c || "",
                d: p.d || "",
                resposta_correta: p.resposta_correta || ""
            }));

            setNome(nomeQuiz);
            setTipo(tipoQuiz);
            setPerguntas(perguntasFormatadas);
            setEditando(true);
        } catch (err) {
            console.error("Erro ao carregar quiz para edição:", err);
            Swal.fire({
                icon: "error",
                title: "❌ Erro ao carregar quiz.",
                text: "Não foi possível carregar as perguntas."
            });
            setErros({ geral: "❌ Erro ao carregar quiz para edição." });
        }
    };

    return (
        <div className="ironcriarquiz-container">
            <h2 className="ironcriarquiz-title">📝 Criar Novo Quiz</h2>

            <div className="ironcriarquiz-main">
                {/* 🔹 Formulário */}
                <div className="ironcriarquiz-formulario">
                    <div className="ironcriarquiz-info">
                        <input
                            list="ironcriarquiz-nomes-list"
                            placeholder="Tipo do quiz (ex: html)"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        />
                        <datalist id="ironcriarquiz-nomes-list">
                            {nomes.map((n, i) => (
                                <option key={i} value={n.nome} />
                            ))}
                        </datalist>

                        {erros.tipo && <p className="ironcriarquiz-erro">{erros.tipo}</p>}

                        <input
                            type="text"
                            placeholder="Nome do quiz (ex: Quiz Básico de HTML)"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        {erros.nome && <p className="ironcriarquiz-erro">{erros.nome}</p>}
                    </div>

                    <div className="ironcriarquiz-perguntas">
                        {perguntas.map((p, index) => (
                            <div key={index} className="ironcriarquiz-perguntaCard">
                                <input
                                    type="text"
                                    placeholder="Digite a pergunta"
                                    value={p.pergunta}
                                    onChange={(e) => atualizarPergunta(index, "pergunta", e.target.value)}
                                />

                                {["a", "b", "c", "d"].map((opc) => (
                                    <div key={opc} className="ironcriarquiz-opcaoLinha">
                                        <input
                                            type="text"
                                            placeholder={`Opção ${opc.toUpperCase()}`}
                                            value={p[opc]}
                                            onChange={(e) => atualizarPergunta(index, opc, e.target.value)}
                                        />
                                        <label>
                                            <input
                                                type="radio"
                                                name={`resposta-${index}`}
                                                value={opc.toUpperCase()}
                                                checked={p.resposta_correta === opc.toUpperCase()}
                                                onChange={(e) =>
                                                    atualizarPergunta(index, "resposta_correta", e.target.value)
                                                }
                                            />
                                            Correta
                                        </label>
                                    </div>
                                ))}

                                {erros[`pergunta-${index}`] && (
                                    <ul className="ironcriarquiz-erroLista">
                                        {erros[`pergunta-${index}`].map((msg, i) => (
                                            <li key={i} className="ironcriarquiz-erro">{msg}</li>
                                        ))}
                                    </ul>
                                )}

                                <button
                                    className="ironcriarquiz-btnRemover"
                                    onClick={() => removerPergunta(index)}
                                >
                                    ❌ Remover pergunta
                                </button>
                            </div>
                        ))}
                    </div>

                    {erros.geral && <p className="ironcriarquiz-erro">{erros.geral}</p>}

                    <div className="ironcriarquiz-botoes">
                        <button onClick={adicionarPergunta} className="ironcriarquiz-btnAdd">
                            ➕ Adicionar Pergunta
                        </button>
                        <button onClick={salvarQuiz} className="ironcriarquiz-btnSalvar">
                            ✅ Salvar Quiz
                        </button>
                    </div>
                </div>

                {quizzesFiltrados.length > 0 && (
                    <div className="ironcriarquiz-lista">
                        <h3 className="ironcriarquiz-subtitle">📋 Quizzes Existentes</h3>
                        <ul>
                            {quizzesFiltrados.map((q) => (
                                <li key={q.id} className="ironcriarquiz-item">
                                    <span>{q.nome}</span>
                                    <div className="ironcriarquiz-acoes">
                                        <button
                                            className={`ironcriarquiz-btnApagar ${confirmarApagar === q.nome ? "confirmar" : ""
                                                }`}
                                            onClick={() => apagarQuiz(q.nome)}
                                        >
                                            {confirmarApagar === q.nome
                                                ? "Clique novamente para apagar"
                                                : "🗑️ Apagar"}
                                        </button>

                                        <button
                                            className="ironcriarquiz-btnEditar"
                                            onClick={() => editarQuiz(q.nome, q.tipo)}
                                        >
                                            ✏️ Editar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {["admin", "coordenador", "auditor"].includes(funcao?.trim().toLowerCase()) && (
                    <div style={{ display: "none" }} className="ironcriarquiz-lista ironcriarquiz-todos">
                        <h3 className="ironcriarquiz-subtitle">📚 Todos os Quizzes</h3>

                        <input
                            type="text"
                            placeholder="🔍 Buscar quiz pelo nome..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="ironcriarquiz-busca"
                        />

                        <ul>
                            {quizzes
                                .filter((q) => q.nome.toLowerCase().includes(busca.toLowerCase()))
                                .map((q) => (
                                    <li key={q.id} className="ironcriarquiz-item">
                                        <span>{q.nome}</span>
                                        <div className="ironcriarquiz-acoes">
                                            <button
                                                className={`ironcriarquiz-btnApagar ${confirmarApagar === q.nome ? "confirmar" : ""
                                                    }`}
                                                onClick={() => apagarQuiz(q.nome)}
                                            >
                                                {confirmarApagar === q.nome
                                                    ? "Clique novamente para apagar"
                                                    : "🗑️ Apagar"}
                                            </button>

                                            <button
                                                className="ironcriarquiz-btnEditar"
                                                onClick={() => editarQuiz(q.nome, q.tipo)}
                                            >
                                                ✏️ Editar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

}
