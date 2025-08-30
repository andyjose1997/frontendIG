const local = "local"; /* PODE MUDAR AQUI APENAS UMA LETRA  */
const Local = "local";




export const URL = (local === Local)
    ? "http://localhost:8899"
    : "https://www.render.com";

export const FRONT_URL = (local === Local)
    ? "http://localhost:5173"
    : "https://www.vercel.com";
