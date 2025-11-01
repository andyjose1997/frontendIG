import "./painelpartner.css";
import { useState } from "react";
import ServicosAnnett from "./botoes/servicosannett";
import AgendamentosAnnett from "./botoes/agendamentosannett";
import FuncionariosAnnett from "./botoes/funcionariosannett";

export default function PainelPartner() {
    // 🔹 Define "agendamentos" como aba inicial
    const [abaAtiva, setAbaAtiva] = useState("agendamentos");

    return (
        <main className="painelpartner-pagina">
            {/* 🔹 Barra superior com botões */}
            <nav className="painelpartner-menu">
                <button
                    className={`painelpartner-botao-menu ${abaAtiva === "cursos" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("cursos")}
                >
                    Serviços
                </button>

                <button
                    className={`painelpartner-botao-menu ${abaAtiva === "agendamentos" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("agendamentos")}
                >
                    Agendamentos
                </button>

                <button
                    className={`painelpartner-botao-menu ${abaAtiva === "funcionarios" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("funcionarios")}
                >
                    Funcionários
                </button>
            </nav>

            {/* 🔹 Área dinâmica abaixo dos botões */}
            <section className="painelpartner-conteudo">
                {abaAtiva === "cursos" && <ServicosAnnett />}
                {abaAtiva === "agendamentos" && <AgendamentosAnnett />}
                {abaAtiva === "funcionarios" && <FuncionariosAnnett />}
            </section>
        </main>
    );
}
