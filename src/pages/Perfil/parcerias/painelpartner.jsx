import "./painelpartner.css";
import { useEffect, useState } from "react";
import { URL } from "../../../config";

export default function PainelPartner() {
    const [usuario, setUsuario] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [autorizado, setAutorizado] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCarregando(false);
            return;
        }

        fetch(`${URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsuario(data);
                const funcao = data.funcao?.toLowerCase() || "";
                const permitido = ["admin", "auditor", "coordenador", "partner"].includes(funcao);
                setAutorizado(permitido);
                setCarregando(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar perfil:", err);
                setCarregando(false);
            });
    }, []);

    if (carregando) {
        return <div className="painelpartner-loading">Carregando...</div>;
    }

    if (!autorizado) {
        return (
            <div className="painelpartner-erro">
                🚫 <strong>Sem autorização</strong> para acessar esta área.
            </div>
        );
    }

    const temaAnnet =
        usuario.parceiro && usuario.parceiro.trim().toLowerCase() === "annet studios";

    return (
        <main
            className={`painelpartner-pagina ${temaAnnet ? "annet-tema" : ""}`}
            style={
                temaAnnet
                    ? {
                        backgroundImage:
                            "url('https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/ChatGPT%20Image%2028%20de%20out.%20de%202025,%2015_26_11.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }
                    : {}
            }
        >
            {temaAnnet && (
                <img
                    src="https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/annet/ChatGPT%20Image%2028%20de%20out%20(1).%20de%202025,%2015_28_46"
                    alt="Logo Annet Studios"
                    className="annet-logo"
                />
            )}

            <section className="painelpartner-conteudo">
                <h2 className={temaAnnet ? "annet-titulo" : ""}>
                    {temaAnnet ? "Painel Annet Studios" : "Painel Partner"}
                </h2>

                <div className="painelpartner-botoes-teste">
                    <button className="painelpartner-botao">Teste 1</button>
                    <button className="painelpartner-botao">Teste 2</button>
                    <button className="painelpartner-botao">Teste 3</button>
                </div>
            </section>
        </main>
    );
}
