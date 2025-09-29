import { useState, useEffect, useRef } from 'react';
import './botaodois.css';
import { URL } from '../../config';
import Swal from 'sweetalert2';

export default function BotaoDois() {
    const [experiencias, setExperiencias] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [novaExperiencia, setNovaExperiencia] = useState({ nome: '', origem: '' });
    const [indiceSelecionado, setIndiceSelecionado] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [experienciaEditada, setExperienciaEditada] = useState({ nome: '', origem: '' });
    const [temCertificado, setTemCertificado] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const idUsuario = user?.id || "";

    const containerRef = useRef(null);
    useEffect(() => {
        const verificarCertificados = async () => {
            try {
                const token = localStorage.getItem("token");
                const resposta = await fetch(`${URL}/certificados/usuario`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await resposta.json();
                if (resposta.ok) {
                    setTemCertificado(data.tem_certificado);
                }
            } catch (erro) {
                console.error("Erro ao verificar certificados:", erro);
            }
        };

        if (idUsuario) {
            verificarCertificados();
        }
    }, [idUsuario]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIndiceSelecionado(null);
                setModoEdicao(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const carregarExperiencias = async () => {
            try {
                const resposta = await fetch(`${URL}/listar_experiencias/${idUsuario}`);
                const data = await resposta.json();

                if (resposta.ok) {
                    setExperiencias(data.map(item => ({
                        nome: item.titulo,
                        origem: item.descricao
                    })));
                }
            } catch (erro) {
                console.error("Erro ao carregar experiências:", erro);
            }
        };

        if (idUsuario) carregarExperiencias();
    }, [idUsuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovaExperiencia({ ...novaExperiencia, [name]: value });
    };

    const adicionarExperiencia = async () => {
        const formData = new FormData();
        formData.append("id_usuario", idUsuario);
        formData.append("titulo", novaExperiencia.nome);
        formData.append("descricao", novaExperiencia.origem);

        try {
            const resposta = await fetch(`${URL}/adicionar_experiencia`, {
                method: "POST",
                body: formData
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                setExperiencias([...experiencias, novaExperiencia]);
                setNovaExperiencia({ nome: '', origem: '' });
                setMostrarFormulario(false);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao adicionar experiência",
                    text: resultado.erro || "Tente novamente.",
                });
            }
        } catch (erro) {
            Swal.fire({
                icon: "error",
                title: "Erro ao conectar",
                text: "Não foi possível adicionar a experiência.",
            });
        }
    };

    const removerExperiencia = async (index) => {
        const experiencia = experiencias[index];

        try {
            const resposta = await fetch(`${URL}/remover_experiencia/${idUsuario}/${encodeURIComponent(experiencia.nome)}`, {
                method: "DELETE"
            });

            if (resposta.ok) {
                const novaLista = [...experiencias];
                novaLista.splice(index, 1);
                setExperiencias(novaLista);
                setIndiceSelecionado(null);
            } else {
                const erro = await resposta.json();
                Swal.fire({
                    icon: "error",
                    title: "Erro ao remover",
                    text: erro.mensagem || "Tente novamente.",
                });
            }
        } catch (erro) {
            Swal.fire({
                icon: "error",
                title: "Erro ao remover",
                text: "Não foi possível remover a experiência.",
            });
        }
    };

    const editarExperiencia = (index) => {
        setModoEdicao(true);
        setIndiceSelecionado(index);
        setExperienciaEditada({ ...experiencias[index] });
    };

    const salvarEdicao = async () => {
        try {
            const formData = new FormData();
            formData.append("id_usuario", idUsuario);
            formData.append("titulo_antigo", experiencias[indiceSelecionado].nome);
            formData.append("novo_titulo", experienciaEditada.nome);
            formData.append("nova_descricao", experienciaEditada.origem);

            const resposta = await fetch(`${URL}/editar_experiencia`, {
                method: "POST",
                body: formData
            });

            if (resposta.ok) {
                const respostaAtualizada = await fetch(`${URL}/listar_experiencias/${idUsuario}`);
                const dataAtualizada = await respostaAtualizada.json();

                if (respostaAtualizada.ok) {
                    setExperiencias(dataAtualizada.map(item => ({
                        nome: item.titulo,
                        origem: item.descricao
                    })));
                }

                setModoEdicao(false);
                setIndiceSelecionado(null);
            }
            else {
                const erro = await resposta.json();
                Swal.fire({
                    icon: "error",
                    title: "Erro ao salvar edição",
                    text: erro.mensagem || "Tente novamente.",
                });
            }
        } catch (erro) {
            Swal.fire({
                icon: "error",
                title: "Erro ao salvar edição",
                text: "Não foi possível salvar as alterações.",
            });
        }
    };

    function formatarTexto(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    return (
        <section className="experiencias-section">
            <h2 className="titulo-exp">Experiências</h2><br />
            <div className="container-exp" ref={containerRef}>
                {experiencias.length === 0 && (
                    <p style={{ color: '#888' }}>Nenhuma experiência cadastrada ainda.</p>
                )}
                {experiencias.map((item, index) => (
                    <div className="box-exp" key={index}>
                        {indiceSelecionado === index && modoEdicao ? (
                            <div className="form-edit-exp">
                                <input
                                    type="text"
                                    value={experienciaEditada.nome}
                                    onChange={(e) => setExperienciaEditada({ ...experienciaEditada, nome: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={experienciaEditada.origem}
                                    onChange={(e) => setExperienciaEditada({ ...experienciaEditada, origem: e.target.value })}
                                />
                                <button onClick={salvarEdicao}>Salvar</button>
                            </div>
                        ) : indiceSelecionado === index ? (
                            <div className="botoes-exp">
                                <button onClick={() => removerExperiencia(index)}>🗑️ Apagar</button>
                                <button onClick={() => editarExperiencia(index)}>✏️ Editar</button>
                            </div>
                        ) : (
                            <div onClick={() => setIndiceSelecionado(index)} className="item-exp-click">
                                <strong>{formatarTexto(item.nome)}</strong><br />
                                <small>Aprendido em: {formatarTexto(item.origem)}</small>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <br />
            {!mostrarFormulario && (
                <button onClick={() => setMostrarFormulario(true)} className="botao-adicionar-exp">
                    ➕ Adicionar nova experiência
                </button>
            )}

            {mostrarFormulario && (
                <div className="form-exp">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome da Experiência"
                        value={novaExperiencia.nome}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="origem"
                        placeholder="Onde foi aprendido"
                        value={novaExperiencia.origem}
                        onChange={handleChange}
                    />
                    <button onClick={adicionarExperiencia}>Salvar experiência</button>
                </div>
            )}
        </section>
    );
}
