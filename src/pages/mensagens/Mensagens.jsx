import Bandeja from './Bandeja';
import Up from '../Perfil/Up';
import Botoes from '../Perfil/Botoes';
import './Mensagens.css'

export default function LayoutMensagens() {
    return (
        <main id="Mensagens">
            <div id="Up">
                <Up />
            </div>

            <div id="Botoes">
                <Botoes />
            </div>

            <div id="Bandeja">
                <Bandeja />
            </div>
        </main>
    );
}
