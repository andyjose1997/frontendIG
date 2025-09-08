import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { URL } from "../../../config";
import "./modalqrcode.css";
import { FRONT_URL } from "../../../config";

export default function ModalQrCode({ onClose }) {
    const [dados, setDados] = useState({});
    const cardRef = useRef();
    const [linkIndicacao, setLinkIndicacao] = useState("");
    const [alerta, setAlerta] = useState("");

    useEffect(() => {
        const carregar = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${URL}/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setDados(data);

            // 🔹 Monta o link correto com ID do usuário

            if (data.id) {
                const nomeFormatado = (data.nome + data.sobrenome).replace(/\s+/g, '').toLowerCase();
                setLinkIndicacao(`${window.location.origin}/criar-conta/${data.id}/${nomeFormatado}`);

            }
        };
        carregar();
    }, []);

    const copiarLink = () => {
        navigator.clipboard.writeText(linkIndicacao);
        mostrarAlerta("🔗 Link copiado!");
    };

    const mostrarAlerta = (texto) => {
        setAlerta(texto);
        setTimeout(() => setAlerta(""), 2000);
    };

    return (
        <div className="modalB-overlay">
            <div className="modalB-qrcode">
                <button className="fechar" onClick={onClose}>✖</button>

                <div className="qrcode-card" ref={cardRef}>
                    <img
                        src={dados.foto ? `${URL}/fotos/${dados.foto}` : "/perfilPadrao.png"}
                        alt="Foto de perfil"
                        className="foto-perfil"
                    />
                    <h2>{dados.nome} {dados.sobrenome}</h2>
                    <p className="comentario">{dados.comentario_perfil || "Qual é a sua próxima meta?"}</p>

                    {linkIndicacao && (
                        <>
                            <QRCodeCanvas value={linkIndicacao} size={180} />
                            <p className="link-indicacao">{linkIndicacao}</p>
                            <button className="btn-copiar" onClick={copiarLink}>
                                📋 Copiar Link
                            </button>
                        </>
                    )}
                </div>

                {alerta && <div className="alerta-temporario">{alerta}</div>}
            </div>
        </div>
    );
}
