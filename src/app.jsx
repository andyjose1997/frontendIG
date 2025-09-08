import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./components/layout.jsx";
import Loader from "./components/loader.jsx";

import Login from './pages/login.jsx';
import Cursos from "./pages/cursos.jsx";
import NotFound from "./pages/notfound.jsx";
import './app.css';
import Cadastrarse from "./pages/cadastrogeral/cadastrarse.jsx";
import Organizacao from "./pages/organizacao.jsx";
import Inicio from "./pages/Inicio/inicio.jsx";   // 🚨 "Inicio" com I maiúsculo
import Perfil from "./pages/Perfil/perfil.jsx";   // 🚨 "Perfil" com P maiúsculo
import Manual from './pages/manual.jsx';
import Mensagens from './pages/mensagens/mensagens.jsx';
import TelaConfig from "./pages/Perfil/telaconfig.jsx"; // 🚨 "Perfil" com P maiúsculo
import Aprendizagem from "./pages/aprendizagem/aprendizagem.jsx";
import IreneChat from "./components/irenechat.jsx";
import { AuthProvider } from "./authcontext.jsx";  // 🚨 "ironQuiz" com Q maiúsculo

import PrivateRoute from "./privateroute.jsx";
import PainelControle from './pages/ferramentas/painelcontrole.jsx';
import AdminRoute from "./adminroute.jsx";
import IronQuiz from "./pages/ironQuiz/ironquiz.jsx";
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
      <div style={{ display: "none" }} >      <FAQSection />
      </div>


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
        {/* Rotas que usam Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cadastrarse" element={<Cadastrarse />} />
          <Route
            path="/criar-conta/:idHost/:nomeCompleto"
            element={<Cadastrarse />}
          />
          <Route path="/organizacao" element={<Organizacao />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 🔹 Rotas independentes */}
        <Route
          path="/iron_quiz"
          element={<IronQuiz />}   // 👈 agora é independente
        />
        <Route
          path="/inicio"
          element={
            <PrivateRoute>
              <Inicio />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/aprendizagem"
          element={
            <PrivateRoute>
              <Aprendizagem />
            </PrivateRoute>
          }
        />
        <Route
          path="/mensagens"
          element={
            <PrivateRoute>
              <Mensagens />
            </PrivateRoute>
          }
        />
        <Route
          path="/TelaConfig"
          element={
            <PrivateRoute>
              <TelaConfig />
            </PrivateRoute>
          }
        />
        <Route path="/Manual" element={<Manual />} />
        <Route
          path="/ferramentas/painelcontrole"
          element={
            <AdminRoute>
              <PainelControle />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* 👇 Irene aparece em todas as rotas, menos no painel de controle */}
      {!location.pathname.startsWith("/ferramentas/painelcontrole") && (
        <IreneChat />
      )}
    </>


  );
}

import { FerramentasProvider } from "./ferramentascontext.jsx";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <FerramentasProvider>
          <AppRoutes />
        </FerramentasProvider>
      </AuthProvider>
    </Router>
  );
}

