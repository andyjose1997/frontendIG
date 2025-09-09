import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { URL } from "../../config";

export default function HostModal({ idHost, onClose }) {
    const [dadosHost, setDadosHost] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${URL}/host/${idHost}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async res => {
                const dados = await res.json();
                setDadosHost(dados);
            })
            .catch(err => {
                console.error("❌ Erro ao buscar host:", err);
            });
    }, [idHost]);

    if (!dadosHost) return null;

    const modalContent = (
        <div className="fundo-escurecido" onClick={onClose}>
            <div className="modal-host" onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: "50px" }}>Seu Host</h2>

                {/* Foto do Host */}
                <img style={{
                    width: "150px",
                    borderRadius: "50%",
                    border: "solid 2px blue"
                }} src={dadosHost.foto || "/Logo/perfilPadrao/M.png"} />


                {/* Nome */}
                <h2>{dadosHost.nome} {dadosHost.sobrenome}</h2>

                {/* WhatsApp */}
                <p>📱 {dadosHost.whatsapp || "Não informado"}</p>
                {dadosHost.whatsapp && (
                    <a
                        href={`https://wa.me/${dadosHost.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button className="botao-whatsapp">Conversar no WhatsApp</button>
                    </a>
                )}

                {/* Categoria */}
                <p>Categoria: {dadosHost.categoria || "Não informado"}</p>

                {/* Botão fechar */}
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}
