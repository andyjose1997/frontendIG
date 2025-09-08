import './botaotres.css'

export default function BotaoTres() {
    const participantes = [
        { nome: "Flayra De Oliveira", pontos: 982 },
        { nome: "João Carlos", pontos: 875 },
        { nome: "Maria Fernanda", pontos: 843 },
        { nome: "Lucas Lima", pontos: 812 },
        { nome: "Aline Souza", pontos: 790 },
        { nome: "Ricardo Alves", pontos: 765 },
        { nome: "Sofia Martins", pontos: 754 },
        { nome: "Tiago Mendes", pontos: 730 },
        { nome: "Juliana Rocha", pontos: 712 },
        { nome: "Bruno Silva", pontos: 699 },
        { nome: "Fernanda Costa", pontos: 688 },
        { nome: "André Santos", pontos: 677 },
        { nome: "Patrícia Dias", pontos: 660 },
        { nome: "Marcos Ribeiro", pontos: 650 },
        { nome: "Larissa Gomes", pontos: 638 },
        { nome: "Pedro Henrique", pontos: 627 },
        { nome: "Camila Ferreira", pontos: 610 },
        { nome: "Vinícius Moura", pontos: 599 },
        { nome: "Rafaela Nunes", pontos: 584 },
        { nome: "Diego Rocha", pontos: 570 },
        { nome: "Tainá Lima", pontos: 565 },
        { nome: "Fábio Assis", pontos: 558 },
        { nome: "Daniele Viana", pontos: 549 },
        { nome: "Henrique Costa", pontos: 530 },
        { nome: "Luciana Alves", pontos: 525 },
        { nome: "Roberta Lima", pontos: 510 },
        { nome: "Wellington Luz", pontos: 498 },
        { nome: "Cláudio Martins", pontos: 485 },
        { nome: "Cíntia Souza", pontos: 472 },
        { nome: "Edson Ferreira", pontos: 460 },
        { nome: "Isabela Duarte", pontos: 450 },
    ];

    // Ordenar do maior para o menor
    const rankingOrdenado = participantes.sort((a, b) => b.pontos - a.pontos);

    return (
        <section className="experiencias-section">
            <h2 className="titulo-exp">🏆 Ranking — Divisão 1</h2>
            <div className="container-exp">
                {rankingOrdenado.map((pessoa, index) => (
                    <div className="box-exp" key={index}>
                        <strong>#{index + 1} — {pessoa.nome}</strong><br />
                        <small>{pessoa.pontos} pontos</small>
                    </div>
                ))}
            </div>
        </section>
    );
}
