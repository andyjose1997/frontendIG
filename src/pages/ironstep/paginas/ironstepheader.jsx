import React from "react";
import logoIronStep from "../logos/logoironstep.png";
import "./ironstepheader.css";

export default function IronStepHeader({ usuarios }) {
    if (!usuarios) return null;

    return (
        <header className="ironstep-header">
            {/* Logo central */}
            <div className="ironstep-logo-container">
                <img src={logoIronStep} alt="IronStep" className="ironstep-logo" />
            </div>

            {/* Foto + Nome */}
            <div className="ironstep-userinfo">
                <img
                    src={usuarios.foto}
                    alt="Foto de perfil"
                    className="ironstep-foto"
                />
                <h2>
                    <a
                        href="https://irongoals.com/perfil"
                        className="ironstep-link"
                    >
                        {usuarios.nome} {usuarios.sobrenome}
                    </a>
                </h2>
            </div>

            {/* Infos agora ficam abaixo do nome */}
            <div className="ironstep-infos">
                <h3 className="info-left">Informação 2</h3>
                <h3 className="info-right">Informação 1</h3>
            </div>
        </header>
    );
}
