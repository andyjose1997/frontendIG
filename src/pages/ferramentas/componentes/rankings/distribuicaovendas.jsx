import { useEffect, useState } from "react";
import { URL } from "../../../../config";
import './distribuicaovendas.css';

export default function DistribuicaoVendas() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [porGrupo, setPorGrupo] = useState("");
    const [resultado, setResultado] = useState({ grupos: 0, maior: 0 });
    const [mensagem, setMensagem] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const res = await fetch(`${URL}/distribuicao/lista`);
                const data = await res.json();
                setUsuarios(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao carregar usuários:", err);
            } finally {
                setLoading(false);
            }
        };
        carregarUsuarios();
    }, []);

    const calcularDistribuicao = (valor) => {
        setPorGrupo(valor);
        const qtd = parseInt(valor, 10);
        if (qtd > 0 && usuarios.length > 0) {
            const grupos = Math.ceil(usuarios.length / qtd);
            const resto = usuarios.length % qtd;
            const maior = resto === 0 ? qtd : resto + qtd;
            setResultado({ grupos, maior });
        } else {
            setResultado({ grupos: 0, maior: 0 });
        }
    };

    const confirmarDistribuicao = async () => {
        if (!porGrupo || parseInt(porGrupo, 10) <= 0) {
            setMensagem("⚠️ Defina o número de usuários por grupo antes de confirmar!");
            setTipoMensagem("erro");
            setMostrarModal(true);
            return;
        }

        try {
            const res = await fetch(`${URL}/distribuicao/distribuir/${porGrupo}`, {
                method: "POST"
            });
            const data = await res.json();
            setMensagem(data.mensagem || "✅ Distribuição realizada!");
            setTipoMensagem(res.ok ? "sucesso" : "erro");
        } catch (err) {
            console.error("Erro ao confirmar distribuição:", err);
            setMensagem("❌ Erro ao confirmar distribuição");
            setTipoMensagem("erro");
        } finally {
            setMostrarModal(true);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="distvendas-container">
            <h2 className="distvendas-title">Usuários no Torneio</h2>
            <p className="distvendas-total">
                Total de usuários: <strong>{usuarios.length}</strong>
            </p>

            <div className="distvendas-form">
                <label>
                    Usuários por grupo:{" "}
                    <input
                        type="number"
                        value={porGrupo}
                        onChange={(e) => calcularDistribuicao(e.target.value)}
                    />
                </label>
                {resultado.grupos > 0 && (
                    <span className="distvendas-preview">
                        Grupos: <strong>{resultado.grupos}</strong> |
                        Maior grupo: <strong>{resultado.maior}</strong>
                    </span>
                )}
                <button onClick={confirmarDistribuicao}>Confirmar</button>
            </div>

            {mostrarModal && (
                <div className="distvendas-modal-overlay">
                    <div className={`distvendas-modal-box ${tipoMensagem}`}>
                        <p>{mensagem}</p>
                        <button
                            className="distvendas-modal-btn"
                            onClick={() => setMostrarModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <ul className="distvendas-lista">
                {usuarios.length > 0 ? (
                    usuarios.map((u) => (
                        <li key={u.id}>
                            <span className="distvendas-id">#{u.id}</span>
                            <span className="distvendas-usuario">
                                {u.nome ?? "-"} {u.sobrenome ?? "-"}
                            </span>
                            <span className="distvendas-grupo">
                                Grupo: {u.grupo ?? "-"}
                            </span>
                        </li>
                    ))
                ) : (
                    <li>Nenhum usuário encontrado</li>
                )}
            </ul>
        </div>
    );
}
