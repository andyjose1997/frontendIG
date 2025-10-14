import { useEffect, useState } from "react";
import "./organizacao.css";
import { URL } from "../config";
export default function Organizacao() {
    const [admins, setAdmins] = useState([]);
    const [coordenadores, setCoordenadores] = useState([]);
    const [auditores, setAuditores] = useState([]);
    const [expandirIds, setExpandirIds] = useState({}); // 🔹 controla expandir por id

    // 🔠 Função para deixar texto capitalizado (primeira maiúscula)
    const capitalize = (text) => {
        if (!text) return "";
        return text
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
    };

    useEffect(() => {
        fetch(`${URL}/organizacao/`)
            .then(res => res.json())
            .then(data => {
                // Separar por função
                setAdmins(data.filter(u => u.funcao === "admin"));
                setCoordenadores(data.filter(u => u.funcao === "coordenador"));
                setAuditores(data.filter(u => u.funcao === "auditor"));
            })
            .catch(err => console.error("Erro ao carregar organização:", err));
    }, []);

    // 🔹 Alternar expandir/recolher
    const toggleExpandir = (id) => {
        setExpandirIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // 🔹 Função para renderizar lista de usuários
    const renderUsuarios = (usuarios) => (
        <div className="responsaveis">
            {usuarios
                .filter((u) => u.id !== "a00002") // 🔹 remove usuário específico
                .map((u) => {
                    const expandir = expandirIds[u.id] || false;
                    return (
                        <div key={u.id} className={`responsavel ${u.funcao}`}>
                            <img
                                className="foto-perfil"
                                src={
                                    u.foto
                                        ? (u.foto.startsWith("http") ? u.foto : `${URL}${u.foto}`)
                                        : "/public/Logo/perfilPadrao/M.png"
                                }
                                alt={u.nome}
                            />

                            <h2>{capitalize(u.nome)} {capitalize(u.sobrenome)}</h2>
                            <h4 className="cargo">{capitalize(u.cargo)}</h4>

                            <p className={`descricao ${expandir ? "aberta" : "fechada"}`}>
                                {capitalize(u.responsabilidade)}
                            </p>

                            {u.responsabilidade?.length > 150 && (
                                <button
                                    className="btn-vermais"
                                    onClick={() => toggleExpandir(u.id)}
                                >
                                    {expandir ? "Ver menos ▲" : "Ver mais ▼"}
                                </button>
                            )}
                        </div>
                    );
                })}

        </div>
    );

    return (
        <div className="organizacao">
            <h2>Quem organiza a IronGoals?</h2>
            <p>
                Nossa equipe é formada por diretores visionários e profissionais estratégicos, comprometidos em assegurar que a IronGoals opere com excelência, inovação e sustentabilidade. Atuamos na definição de políticas institucionais, no fortalecimento da governança e na criação de soluções que preservem os princípios de confiança, qualidade e apoio mútuo entre todos os usuários.
            </p>

            {admins.length > 0 && (
                <>
                    <h3 className="secao">Administradores</h3>
                    {renderUsuarios(admins)}
                </>
            )}

            {coordenadores.length > 0 && (
                <>
                    <h3 className="secao">Coordenadores</h3>
                    {renderUsuarios(coordenadores)}
                </>
            )}

            {auditores.length > 0 && (
                <>
                    <h3 className="secao">Auditores</h3>
                    {renderUsuarios(auditores)}
                </>
            )}
        </div>
    );
}
