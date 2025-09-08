import './TelaConfig.css'
import Up from './up'
import Botoes from './Botoes'
import Config from './Config'

export default function TelaConfig() {
    return (
        <div>
            <div id="GeralConfig">
                <div id="Up">
                    <Up />
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