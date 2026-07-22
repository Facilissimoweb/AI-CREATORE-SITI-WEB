import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build-facilissimo-webapp",
      },
    },
  });
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { userMessage, currentBlueprint } = req.body || {};

    const ai = getGeminiClient();

    const systemInstruction = `
Sei l'assistente virtuale di 'Facilissimo Web'. L'utente sta personalizzando il sito web della sua attività.
Rispondi in modo cordiale, sintetico (massimo 2-3 frasi) e propositivo in lingua italiana.
Se la richiesta comporta una modifica del sito (es. cambiare colore, aggiungere una pagina, modificare un testo), proponi la modifica e restituisci l'oggetto "updatedBlueprint" aggiornato nell'output JSON.

Restituisci sempre JSON con la seguente struttura:
{
  "replyText": "Messaggio di risposta cordiale ed entusiasta per l'utente",
  "suggestions": ["Modifica 1 suggerita", "Modifica 2 suggerita"],
  "updatedBlueprint": null
}
`;

    const promptText = `
Richiesta utente: "${userMessage}"
Blueprint attuale del sito:
${JSON.stringify(currentBlueprint || {})}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const resultData = JSON.parse(text);
    return res.status(200).json({ success: true, data: resultData });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to process AI chat request",
    });
  }
}
