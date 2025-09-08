import './telaConfig.css';
import Acima from "./up.jsx";
import Botoes from "./botoes.jsx";




export default function TelaConfig() {
    return (
        <div>
            <div id="GeralConfig">
                <div id="Up">
                    <Acima />
                </div>

                <div id="Botoes">
                    <Botoes />
                </div>

                <div id="Config">
                    <Config />
                </div>
            </div>
        </div>
    )
}