import MenuAnnet from "./annetrotas/menuannet";
import FormularioAnnet from "./annetrotas/formulario";
import ParceriasAnnet from "./annetrotas/parceria";
import RodapeAnnet from "./annetrotas/rodapeannet";

export default function AnnetStudios() {
    return (
        <>
            <MenuAnnet />
            <div style={{ paddingTop: "4px" }}>
                <FormularioAnnet />
                <ParceriasAnnet />
                <RodapeAnnet />
            </div>
        </>
    );
}
