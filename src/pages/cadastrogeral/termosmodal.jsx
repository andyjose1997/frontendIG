// 📂 src/componentes/TermosModal.jsx
import { useEffect, useState } from "react";
import "./termosmodal.css";
import { URL } from "../../config";

export default function TermosModal({ onClose, onAceitar, onFinalizar }) {
    const [termos, setTermos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await fetch(`${URL}/termos`);
                if (!res.ok) throw new Error("Erro ao carregar termos");
                const data = await res.json();
                setTermos(data);
            } catch (err) {
                setErro("⚠️ Não foi possível carregar os Termos de Uso.");
            } finally {
                setCarregando(false);
            }
        };
        carregar();
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-termos">
                <h2>Termos de Uso da IronGoals</h2>

                {carregando && <p>⏳ Carregando termos...</p>}
                {erro && <p style={{ color: "red" }}>{erro}</p>}

                {!carregando && !erro && (
                    <ol>
                        {termos
                            .filter((t) => t.cadastro && t.cadastro.trim() !== "")
                            .map((t) => (
                                <li key={t.id}>{t.cadastro}</li>
                            ))}
                    </ol>
                )}

                <div className="acoes">
                    <button
                        className="btnTermos-verde"
                        onClick={() => {
                            onAceitar();   // marca termos aceitos
                            onClose();     // fecha modal termos
                            if (onFinalizar) onFinalizar(); // 🔹 abre modal de foto
                        }}
                    >
                        ✅ Li e aceito os Termos de Uso
                    </button>
                    <button className="btnTermos-vermelho" onClick={onClose}>
                        ❌ Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}