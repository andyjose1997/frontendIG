import { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./gruposvendas.css";

export default function GruposVendas() {
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await fetch(`${URL}/distribuicao/ranking`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setGrupos(data);
                } else {
                    setGrupos([]);
                    console.warn("Resposta inesperada:", data);
                }
            } catch (err) {
                console.error("Erro ao carregar grupos de vendas:", err);
            }
        };
        carregar();
    }, []);

    return (
        <div className="rgpc-container">
            <h2 className="rgpc-titulo">Ranking de Grupos</h2>
            {grupos.length === 0 ? (
                <p className="rgpc-msg">Nenhum grupo encontrado.</p>
            ) : (
                <div className="rgpc-lista">
                    {grupos.map((g, i) => (
                        <div key={i} className="rgpc-card">
                            <h3 className="rgpc-card-titulo">
                                {g.grupo} - {g.total_pontos} pontos
                            </h3>
                            {g.participantes && g.participantes.length > 0 ? (
                                <ul className="rgpc-participantes">
                                    {g.participantes.map((p, j) => (
                                        <li key={j} className="rgpc-participante">
                                            <span className="rgpc-nome">
                                                {p.nome} {p.sobrenome}
                                            </span>
                                            <span className="rgpc-pontos">{p.pontos} pts</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rgpc-msg">Nenhum participante com pontos.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
