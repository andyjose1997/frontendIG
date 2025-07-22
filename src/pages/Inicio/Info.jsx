import './Info.css'

const Facebook = "https://www.facebook.com/";
const YouTube = "https://www.youtube.com/";
const LinkedIn = "https://www.linkedin.com/";
const Instagram = "https://www.instagram.com/";


export default function Info() {
    return (
        <div id='InfoGeral'>
            <div className="InfoEmpresa">
                <a href="/Login"
                    style={
                        {
                            textDecoration: "none",
                            color: "black",
                        }
                    }
                ><h2>IronSources</h2></a>
                <p>Where Learning Happens</p>

            </div>
            <div className="Info">


                <div className="InfoLinks">
                    <a href="#">Suporte</a><br />
                    <a href="#">Comentários</a><br />
                    <a href="/Manual">Ler os Termos de uso</a><br />

                </div>


                <ul className="InfoRedes">
                    <li> <a href={Facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li> <a href={Instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li>  <a href={LinkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    <li>  <a href={YouTube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
                </ul>
                <p className="InfoCopy">© 2025 IronSources. Todos os direitos reservados.</p>
            </div>
            <br /><br />
        </div>
    );
}