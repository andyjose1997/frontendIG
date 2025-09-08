import Bandeja from './bandeja';
import Up from '../Perfil/up';
import Botoes from '../Perfil/botoes';
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
