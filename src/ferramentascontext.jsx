import { createContext, useContext, useState } from 'react';

const FerramentasContext = createContext();

export function FerramentasProvider({ children }) {
    const [acessoLiberado, setAcessoLiberado] = useState(() => {
        return localStorage.getItem("acessoFerramentas") === "true";
    });

    return (
        <FerramentasContext.Provider value={{ acessoLiberado, setAcessoLiberado }}>
            {children}
        </FerramentasContext.Provider>
    );
}

export function useFerramentas() {
    return useContext(FerramentasContext);
}
