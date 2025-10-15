import React, { useEffect, useState } from "react";
import { URL } from "../../../../config";
import "./rankings.css";

export default function Rankings({ onVoltar }) {
    const [niveis, setNiveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [nivelSelecionado, setNivelSelecionado] = useState(null);
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);

    // 🔹 Buscar lista de níveis
    useEffect(() => {
        async function carregarNiveis() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${URL}/ironstep/status/niveis`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setNiveis(data.niveis || []);
                }
            } catch (err) {
                console.error("Erro ao carregar níveis:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarNiveis();
    }, []);

    // 🔹 Buscar usuários de um nível específico
    const carregarUsuarios = async (nivel) => {
        setNivelSelecionado(nivel);
        setCarregandoUsuarios(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/ironstep/status/ranking/${nivel}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data.usuarios || []);
            }
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
        } finally {
            setCarregandoUsuarios(false);
        }
    };

    if (loading) return <p>Carregando níveis...</p>;

    return (
        <div className="rankings-teste">
            <h2>🏆 Rankings por Nível</h2>

            {/* 🔹 Lista de níveis */}
            {!nivelSelecionado && (
                <div className="niveis-container">
                    {niveis.length > 0 ? (
                        niveis.map((nivel, index) => (
                            <button
                                key={index}
                                className="btn-nivel"
                                onClick={() => carregarUsuarios(nivel)}
                            >
                                {nivel}
                            </button>
                        ))
                    ) : (
                        <p>Nenhum nível encontrado.</p>
                    )}
                </div>
            )}

            {/* 🔹 Lista de usuários do nível selecionado */}
            {nivelSelecionado && (
                <div className="usuarios-container">
                    <h3>📋 Nível: {nivelSelecionado}</h3>
                    {carregandoUsuarios ? (
                        <p>Carregando usuários...</p>
                    ) : usuarios.length > 0 ? (
                        <table className="tabela-ranking">
                            <thead>
                                <tr>
                                    <th>ID do Usuário</th>
                                    <th>Vidas</th>
                                    <th>Pontos do Mês</th>
                                    <th>Premium até</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u, i) => (
                                    <tr key={i}>
                                        <td>{u.nome} {u.sobrenome} </td>
                                        <td>{u.vidas === 4 ? "Premium" : u.vidas}</td>
                                        <td>{u.pontos_mes}</td>
                                        <td>{u.ate || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum usuário encontrado neste nível.</p>
                    )}

                    <button className="btn-voltar" onClick={() => {
                        setNivelSelecionado(null);
                        setUsuarios([]);
                    }}>
                        🔙 Voltar aos Níveis
                    </button>
                </div>
            )}

            {/* 🔹 Botão voltar geral */}
            {!nivelSelecionado && (
                <button className="btn-voltar" onClick={onVoltar}>
                    🔙 Voltar
                </button>
            )}
        </div>
    );
}
