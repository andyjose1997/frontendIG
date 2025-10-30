// 📂 src/pages/annetstudios/modais/ModalPerfil.jsx
import ReactDOM from "react-dom";
import "./modalperfil.css";
import { useState, useEffect } from "react";
import { URL } from "../../../../config";

export default function ModalPerfil({ onFechar }) {
    const [usuario, setUsuario] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setErro("É necessário fazer login para visualizar o perfil.");
            return;
        }

        fetch(`${URL}/perfil`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const erroData = await res.json();
                    throw new Error(erroData.erro || "Erro ao buscar perfil");
                }
                return res.json();
            })
            .then((data) => setUsuario(data))
            .catch((err) => setErro(err.message));
    }, []);

    return ReactDOM.createPortal(
        <div className="annetperfil-overlay" onClick={onFechar}>
            <div
                className="annetperfil-conteudo"
                onClick={(e) => e.stopPropagation()}
            >
                {erro ? (
                    <>
                        <h2 className="annetperfil-erro">⚠️ {erro}</h2>
                    </>
                ) : usuario ? (
                    <>
                        <h2 className="annetperfil-titulo">
                            <span className="annetperfil-icone">👤</span> Perfil
                        </h2>
                        <hr className="annetperfil-linha" />

                        <div className="annetperfil-area-foto-nome">
                            <img
                                src={
                                    usuario.foto ||
                                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                }
                                alt="Foto de perfil"
                                className="annetperfil-foto"
                            />
                            <h3 className="annetperfil-nome">
                                {usuario.nome} {usuario.sobrenome}
                            </h3>
                            <p className="annetperfil-boas-vindas">
                                Bem-vindo(a) ao seu perfil!
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="annetperfil-carregando">Carregando...</p>
                )}

                <button className="annetperfil-fechar" onClick={onFechar}>
                    Fechar
                </button>
            </div>
        </div>,
        document.body
    );
}
