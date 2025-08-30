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
            });
    }, [idHost]);

    if (!dadosHost) return null;

    const modalContent = (
        <div className="fundo-escurecido" onClick={onClose}>
            <div className="modal-host" onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: "50px" }}>Seu Host</h2>
                <img
                    src={`${URL}/fotos/${dadosHost.foto || 'perfilPadrao.jpg'}`}
                    alt="Foto do Host"
                    className="foto-host"
                />
                <h2>{dadosHost.nome} {dadosHost.sobrenome}</h2>
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

                <p>Categoria: {dadosHost.categoria || "Não informado"}</p>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.body
    );
}
