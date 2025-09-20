// src/pages/Historico/buscardetalhescodigo.jsx
import { URL } from "../config";

export async function buscarDetalhesCodigo(codigo) {
    try {
        // 🔹 Faz a busca no backend
        const res = await fetch(`${URL}/certificados/detalhes-codigo/${codigo}`);
        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        // 🔹 Garante consistência: sempre devolve o link do Supabase
        const url = `https://sbeotetrpndvnvjgddyv.supabase.co/storage/v1/object/public/certificados/gerados/certificado_${codigo}.png`;

        return {
            ...data,
            link_publico: url,
            canal_autor: "https://www.irongoals.com", // 🔹 fixo agora
            status: "Certificado válido e emitido pela IronGoals"
        };
    } catch {
        return null;
    }
}
