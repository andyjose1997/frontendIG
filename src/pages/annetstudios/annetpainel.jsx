import MenuAnnet from "./annetrotas/menuannet";
import FormularioAnnet from "./annetrotas/formulario";
import ParceriasAnnet from "./annetrotas/parceria";
import RodapeAnnet from "./annetrotas/rodapeannet";
import "./annetpainel.css";

export default function AnnetStudios() {
    return (
        <>
            <MenuAnnet />
            <div className="annetstudios-layout">
                <div className="annetstudios-principal">
                    <FormularioAnnet />

                    <ParceriasAnnet />
                </div>
                <RodapeAnnet />
            </div>
        </>
    );
}
