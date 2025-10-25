
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}

export const generateResponse = async (
    prompt: string,
    image?: GenerativePart
): Promise<string> => {
    try {
        const contentParts: (string | GenerativePart)[] = [prompt];
        if (image) {
            contentParts.unshift(image);
        }
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: contentParts.map(part => typeof part === 'string' ? { text: part } : part) },
            config: {
                systemInstruction: "You are a friendly and knowledgeable gardening assistant called Garden Genius. Your goal is to identify plants from photos and provide comprehensive care instructions. When a user uploads a photo, identify the plant, give its common and scientific names, and provide detailed advice on watering, sunlight, soil, fertilizer, and potential pests. If the user asks a general gardening question, answer it clearly and concisely. Format your responses using markdown for readability."
            }
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};

export const fileToGenerativePart = async (file: File): Promise<GenerativePart> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                // This case should ideally not happen with readAsDataURL
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
        inlineData: {
            mimeType: file.type,
            data,
        },
    };
};
