import React from 'react';

export default function MenuOpcoesPostagem({
    post,
    userId,
    menuAberto,
    setMenuAberto,
    setModoEdicao,
    setNovoTitulo,
    removerPostagem
}) {
    if (String(post.id_usuario) !== String(userId)) return null;

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() =>
                    setMenuAberto((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id]
                    }))
                }
                style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer"
                }}
            >
                ⋮
            </button>

            {menuAberto[post.id] && (
                <div
                    className={`menu-opcoes ${menuAberto[post.id] ? "show" : ""}`}
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                        zIndex: 1
                    }}
                >
                    <button
                        onClick={() => {
                            setModoEdicao((prev) => ({ ...prev, [post.id]: true }));
                            setNovoTitulo((prev) => ({ ...prev, [post.id]: post.titulo }));
                            setMenuAberto((prev) => ({ ...prev, [post.id]: false }));
                        }}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "1rem 1.2rem",
                            backgroundColor: "transparent",
                            border: "none",
                            textAlign: "left",
                            fontSize: "1.2rem",
                            fontWeight: "500",
                            color: "#1e293b",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease, color 0.2s ease"
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#e0e7ff";
                            e.target.style.color = "#1e3a8a";
                            e.target.style.fontWeight = "bold";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#1e293b";
                            e.target.style.fontWeight = "500";
                        }}
                    >
                        Editar
                    </button>

                    <button
                        className="remover"
                        onClick={() => removerPostagem(post.id)}
                    >
                        Remover
                    </button>
                </div>
            )}
        </div>
    );
}
