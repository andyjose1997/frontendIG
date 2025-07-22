import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";

import Login from './pages/Login.jsx';
import Cursos from "./pages/Cursos.jsx";
import NotFound from "./pages/NotFound.jsx";
import './App.css';
import Cadastrarse from "./pages/Cadastrarse.jsx";
import Organizacao from "./pages/Organização.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import Perfil from "./pages/Perfil/Perfil.jsx";
import Manual from './pages/Manual.jsx';
import Mensagens from './pages/Perfil/Mensagens.jsx';
import TelaConfig from "./pages/Perfil/TelaConfig.jsx";

import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

import { Link } from "react-router-dom";
import { URL } from "./config.jsx";

function Home() {
  return (
    <main className="HomeMain">
      <section className="Hero">
        <h1>Bem-vindo ao IronGoals!!!!</h1>
        <p>A plataforma que conecta aprendizado, prática, evolução profissional e autossuficiência financeira.</p>
        <Link to="/cadastrarse" className="btnPrincipal">Comece Agora</Link>
      </section>

      <section className="AnfitriaoInfo">
        <h3>Por que preciso de um anfitrião?</h3>
        <p>
          Para garantir suporte e acompanhamento personalizado, todos os usuários devem se cadastrar usando o ID de um anfitrião.
          Assim, você recebe orientação, dicas de como usar a plataforma e suporte durante sua jornada.
        </p>
      </section>

      <section className="Beneficios">
        <h2>O que você encontra aqui:</h2>
        <div className="Cards">
          <div className="Card">📚 Cursos Estruturados</div>
          <div className="Card">🏆 Ranking de Desempenho</div>
          <div className="Card">💼 Gerador de Currículo</div>
        </div>
      </section>

      <section className="ContatoRapido">
        <h3>Precisa de ajuda?</h3>
        <p>Fale diretamente com um consultor pelo WhatsApp:</p>
        <a
          href="https://wa.me/5511918547818"
          target="_blank"
          rel="noopener noreferrer"
          className="btnWhatsApp"
        >
          📞 Falar no WhatsApp
        </a>
      </section>

      <section className="FAQminii">
        <h2>Perguntas Frequentes</h2>
        <h4> Preciso pagar algo?</h4>
        <p>Não, o cadastro é gratuito. Você só paga pelos pacotes ou serviços extras que desejar usar.</p>

        <h4> Posso trocar de anfitrião?</h4>
        <p>Sim, é possível solicitar a troca mediante análise da plataforma.</p>

        <h4> O que ganho usando a plataforma?</h4>
        <p>Você conquista certificados, currículo gerado, participa de rankings e pode oferecer ou contratar serviços.</p>

        <h4> Como recebo suporte?</h4>
        <p>Seu anfitrião é seu primeiro ponto de apoio. Além disso, nosso time está disponível via WhatsApp e email.</p>

        <h4> Posso vender meus serviços aqui?</h4>
        <p>Sim! Usuários qualificados podem oferecer serviços ou cursos seguindo as diretrizes da plataforma.</p>

        <h4> É possível cancelar minha conta?</h4>
        <p>Sim. Você pode solicitar o cancelamento a qualquer momento através do suporte.</p>
      </section>

      <section className="CTAfinal">
        <h2>Pronto para evoluir?</h2>
        <p>Junte-se agora mesmo ao IronGoals e comece a transformar sua forma de aprender e crescer profissionalmente!</p>
        <Link to="/cadastrarse" className="btnPrincipal">Comece Agora</Link>
      </section>
    </main>
  );
}

function AppRoutes() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location]);

  // 👇 Verificar conexão com backend automaticamente
  useEffect(() => {
    const verificarBackend = async () => {
      try {
        const resposta = await fetch({ URL } + "/ping");
        setBackendOnline(resposta.ok);
      } catch (erro) {
        setBackendOnline(false);
      }
    };

    verificarBackend(); // chama assim que carrega

    const intervalo = setInterval(verificarBackend, 5000); // a cada 5s

    return () => clearInterval(intervalo);
  }, []);

  if (!backendOnline) {
    return (
      <div style={{
        backgroundColor: "#ffdddd",
        color: "#900",
        padding: "2rem",
        textAlign: "center",
        fontSize: "1.2rem"
      }}>
        ⚠️ Não foi possível conectar ao servidor.<br />
        Tentando reconectar automaticamente...
      </div>
    );
  }

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cadastrarse" element={<Cadastrarse />} />
          <Route path="/organizacao" element={<Organizacao />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/mensagens" element={<PrivateRoute><Mensagens /></PrivateRoute>} />
        <Route path="/TelaConfig" element={<PrivateRoute><TelaConfig /></PrivateRoute>} />
        <Route path="/Manual" element={<Manual />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
