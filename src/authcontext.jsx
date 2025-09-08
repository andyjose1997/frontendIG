import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "./config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // 👈 Adicionado
    const navigate = useNavigate();



    useEffect(() => {
        const verificarToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoadingUser(false);
                return;
            }

            try {
                const resposta = await fetch(`${URL}/perfil`, {

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    setUser(dados); // ✅ usuário permanece logado
                } else {
                    logout();
                }
            } catch (erro) {
                console.error("Erro ao verificar token:", erro);
                logout();
            } finally {
                setIsLoadingUser(false);
            }
        };

        verificarToken();
    }, []);





    // ✅ Função de login com redirecionamento inteligente
    const login = (usuario, token) => {
        setUser(usuario);
        localStorage.setItem("user", JSON.stringify(usuario));
        localStorage.setItem("token", token); // <-- precisa disso

        if (window.location.pathname === "/login") {
            navigate("/inicio");
        }
    };


    // ✅ Função de logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoadingUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
