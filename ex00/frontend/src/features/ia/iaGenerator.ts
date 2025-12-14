import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY: string = process.env.REACT_APP_GEMINI_API_KEY || 'FALLBACK_KEY_INVALID';
const genAI = new GoogleGenerativeAI(API_KEY);
const GEMINI_MODEL = "gemini-2.5-flash";

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

export const analyzeImage = async (imageFile: File): Promise<string> => {
    if (API_KEY === 'FALLBACK_KEY_INVALID') {
        console.warn("Advertencia: No se encontró REACT_APP_GEMINI_API_KEY.");
        return `Problema con la API Key. Por favor, introduce una descripción manualmente.`;
    }
    try {
        const prompt = `
            Actúa como un consultor de reformas de oficinas.
            **INSTRUCCIÓN CLAVE DE FORMATO:** Devuelve tu análisis usando únicamente
            texto plano y listas numeradas o con viñetas. Evita usar negritas,
            saltos de línea excesivos o títulos en mayúsculas y negritas.

            Tu tarea es realizar un análisis dual de la imagen:

            1.  **DESCRIPCIÓN DE INSTALACIONES Y PROBLEMAS:** Describe detalladamente el entorno de oficina que observas,
                su estado actual y cualquier problema de mantenimiento visible
                (mobiliario, puertas, iluminación...).

            2.  **RECOMENDACIONES DE REFORMA (maximo 5):**
                Propón un máximo de cinco mejoras concretas para estas instalaciones,
                como si fuéramos a hacer una reforma (e.g.,
                cambiar acabados, optimizar el espacio, mejorar la accesibilidad,
                instalar nueva tecnología, eficiencia energética).

            `;

        const imagePart = await fileToGenerativePart(imageFile);

        const result = await genAI.getGenerativeModel({ model: GEMINI_MODEL }).generateContent([
            imagePart,
            prompt
        ]);
        
        const descriptionAI = result.response.text().trim();
        if (!descriptionAI) {
            return 'Análisis exitoso, pero la IA no devolvió texto. Intenta con otra imagen.';
        }
        return descriptionAI;

    } catch (error) {
        console.error("Error analizando imagen con Gemini:", error);
        throw new Error("La IA falló al procesar la imagen. Revisa tu conexión y API Key.");
    }
};

const iaService = {
    analyzeImage,
};

export default iaService;