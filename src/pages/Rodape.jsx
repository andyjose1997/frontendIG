import './Rodape.css';
const Facebook = "https://www.facebook.com/";
const YouTube = "https://www.youtube.com/";
const LinkedIn = "https://www.linkedin.com/";
const Instagram = "https://www.instagram.com/";



export default function Rodape() {
    return (
        <><br />
            <footer className="Rodape">
                <div className="RodapeContent">


                    <div className="RodapeLinks">
                        <a href="#">Suporte</a>
                        <a href="#">Comentários</a>
                        <a href="/Manual">Ler os Termos de uso</a>

                    </div>
                    <div className="RodapeEmpresa">
                        <a href="/Login"
                            style={
                                {
                                    textDecoration: "none",
                                    color: "black",
                                }
                            }
                        ><h2>IronGoals</h2></a>
                        <p>Where Learning Happens</p>
                        <a href="/">
                            <img
                                src="/Logo/I_round.png" alt="logo" /></a>
                    </div>

                    <div className="RodapeRedes">
                        <a href={Facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href={Instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href={LinkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href={YouTube} target="_blank" rel="noopener noreferrer">YouTube</a>
                    </div>
                </div>
                <p className="RodapeCopy">© 2025 IronGoals. Todos os direitos reservados.</p>
            </footer>

        </>
    );
}