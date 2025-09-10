import './rodape.css';
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
                        <a href={Facebook} target="_blank" rel="https://www.facebook.com/profile.php?id=61580492555279">Facebook</a>
                        <a href={Instagram} target="_blank" rel="instagram.com/irongoals3/">Instagram</a>
                        <a href={LinkedIn} target="_blank" rel="https://www.tiktok.com/@irongoals3">TikTok</a>
                        <a href={YouTube} target="_blank" rel="https://www.youtube.com/@Andy-y7b6z/featured">YouTube</a>
                    </div>
                </div>
                <p className="RodapeCopy">© 2025 IronGoals. Todos os direitos reservados.</p>
            </footer>

        </>
    );
}