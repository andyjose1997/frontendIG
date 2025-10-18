import React, { useEffect, useState } from "react";
import PacoteDeCursosUm from "./pacotes/pacotedecursosum";
import { URL } from "../../../config";
import "./cursos.css";
import ModalSuporte from "../../areaafastada/modalsuporte";

export const Cursos = () => {
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarSuporte, setMostrarSuporte] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [proximoCurso, setProximoCurso] = useState(null);

    // Buscar categoria do usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${URL}/pagamento/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategoria(data.categoria);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar categoria:", err);
                setLoading(false);
            });
    }, []);

    // 🔹 Buscar cursos (para explorers e members)
    useEffect(() => {
        fetch(`${URL}/cursos`)
            .then(res => res.json())
            .then(data => {
                setCursos(data.cursos || []);
                setProximoCurso(data.proximo_curso || null);
            })
            .catch(err => console.error("Erro ao carregar cursos:", err));
    }, []);

    if (loading) {
        return <p className="pagar-loading">Carregando...</p>;
    }

    // ✅ Se for MEMBER, MENTOR ou FOUNDER → acesso completo
    if (categoria === "member" || categoria === "mentor" || categoria === "founder") {
        return <PacoteDeCursosUm />;
    }

    // 👀 Se for EXPLORER → apenas visualizar os cursos
    return (
        <div className="explorer-container">
            <h1 className="explorer-titulo">📘 Cursos IronGoals</h1>
            <p className="explorer-descricao">
                Explore os cursos disponíveis e descubra tudo o que você poderá acessar ao se tornar um{" "}
                <strong>Member</strong> IronGoals.
            </p>

            {/* 💳 Área de pagamento primeiro */}
            <div className="explorer-aviso">
                <p>
                    🔒 Esses cursos estão disponíveis para membros IronGoals.
                    <br />
                    Torne-se <strong>Member</strong> agora e tenha acesso completo!
                </p>
                <button
                    className="pagar-botao"
                    onClick={async () => {
                        try {
                            const token = localStorage.getItem("token");
                            const response = await fetch(`${URL}/pagamento/criar-preferencia`, {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }
                            });

                            const data = await response.json();

                            if (data.init_point) {
                                window.open(data.init_point, "_blank");
                            } else {
                                alert("Erro ao iniciar pagamento.");
                            }
                        } catch (error) {
                            console.error("Erro:", error);
                            alert("Erro ao conectar com pagamento.");
                        }
                    }}
                >
                    💳 Tornar-se Member (R$60)
                </button>
            </div>
            <h2 className="cursosexp" >Cursos disponiveis</h2>

            {/* 📚 Cursos disponíveis */}
            <div className="grid-cursos">
                {cursos.map((curso, index) => (
                    <div key={index} className="curso-card explorer-card">
                        <h3>{curso.titulo}</h3>
                        <p>{curso.descricao}</p>
                        <span className="autor">Instrutor: {curso.autor}</span>
                    </div>
                ))}
            </div>

            {/* 📅 Próximo curso */}
            {proximoCurso && (
                <section className="proximo-curso">
                    <h2>Próximo Curso</h2>

                    <p>Novos cursos estão sempre a caminho! <br />
                        Torne-se Member e garanta acesso completo aos cursos disponíveis e a todos os que estão por vir.</p>
                    <div className="proximo-card">
                        <h3>{proximoCurso.curso}</h3>
                        <p className="descricao">{proximoCurso.descricao}</p>
                        <p className="data">
                            <strong>Data:</strong>{" "}
                            {new Date(proximoCurso.quando).toLocaleDateString("pt-BR")}
                        </p>
                    </div>
                </section>
            )}

            {/* 💬 Suporte por último */}
            <p
                className="pagar-suporte"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setMostrarSuporte(true)}
            >
                Em caso de dúvidas, clique aqui para falar com o suporte.
            </p>

            {mostrarSuporte && <ModalSuporte onClose={() => setMostrarSuporte(false)} />}
        </div>
    );
};
