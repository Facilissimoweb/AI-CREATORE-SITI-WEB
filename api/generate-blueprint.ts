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
    const { prompt, category, city, goal } = req.body || {};

    const ai = getGeminiClient();

    const systemInstruction = `
Sei l'Assistente AI di 'Facilissimo Web', la piattaforma mobile-first italiana ideata per permettere a piccole attività (ristoranti, pizzerie, studios, consulenti, artigiani, negozi) di creare un sito web multi-pagina straordinario, semplice e pronto in pochi secondi.

Il tuo compito è analizzare la richiesta dell'utente e generare o aggiornare una struttura JSON completa e coerente in italiano per un sito web multi-pagina.

Regole fondamentali:
1. I testi devono essere persuasive, cordiali e in italiano perfetto, orientati al cliente finale della piccola attività.
2. Organizza sempre almeno 4 pagine: Home (/), Servizi o Menu (/servizi), Chi Siamo (/chi-siamo), Contatti (/contatti).
3. Aggiungi dettagli realistici per i prezzi, i servizi, gli orari, l'indirizzo e l'offerta della città indicata.
4. Mantieni i colori e il tema in perfetta armonia con la categoria dell'attività.
`;

    const promptText = `
Crea un progetto di sito web per la seguente attività:
- Descrizione / Prompt utente: "${prompt || 'Nuova attività'}"
- Categoria: "${category || 'ristorante'}"
- Città: "${city || 'Italia'}"
- Obiettivo principale: "${goal || 'prenotazione'}"

Restituisci SOLO un oggetto JSON valido rispettando questo schema:
{
  "businessName": "Nome Attività",
  "category": "${category || 'ristorante'}",
  "categoryLabel": "Etichetta Categoria Leggibile",
  "city": "${city || 'Italia'}",
  "tagline": "Slogan principale chiaro e d'impatto",
  "description": "Breve descrizione dell'attività",
  "heroImageUrl": "Un URL Unsplash valido ad alta risoluzione a tema",
  "primaryGoal": "${goal || 'prenotazione'}",
  "selectedTheme": "semplice",
  "colors": {
    "primary": "#10b981",
    "secondary": "#6700c9",
    "background": "#131312",
    "surface": "#1c1c1a",
    "text": "#e5e2df"
  },
  "fontFamily": "Inter",
  "phone": "+39 012 3456789",
  "whatsapp": "390123456789",
  "address": "Via Roma 1, ${city || 'Città'}",
  "openingHours": "Lun - Sab: 09:00 - 20:00",
  "pages": [
    {
      "id": "home",
      "title": "Home",
      "slug": "/",
      "subtitle": "La tua vetrina digitale",
      "sections": [
        {
          "id": "hero",
          "title": "Benvenuti da ${prompt || 'Noi'}",
          "description": "I migliori servizi e prodotti selezionati per te.",
          "type": "hero"
        }
      ]
    }
  ]
}
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
    const blueprintData = JSON.parse(text);
    return res.status(200).json({ success: true, blueprint: blueprintData });
  } catch (error: any) {
    console.error("Error generating blueprint:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate blueprint with Gemini AI",
    });
  }
}
