import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint 1: Generate Full Multi-page Website Blueprint
app.post("/api/generate-blueprint", async (req, res) => {
  try {
    const { prompt, category, city, goal, currentBlueprint } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `
Sei l'Assistente AI di 'Facilissimo Web', la piattaforma mobile-first italiana ideata per permettere a piccole attività (ristoranti, pizzerie, studios, consulenti, artigiani, negozi) di creare un sito web multi-pagina straordinario, semplice e pronto in pochi secondi.

Il tuo compito è analizzare la richiesta dell'utente e generare o aggiornare una struttura JSON completa e coerente in italiano per un sito web multi-pagina.

Regole fondamentali:
1. I testi devono essere persuasive, cordiali e in italiano perfetto, orientati al cliente finale della piccola attività.
2. Organizza sempre almeno 4 pagine: Home (/), Servizi o Menu (/servizi), Chi Siamo (/chi-siamo), Contatti (/contatti).
3. Aggiungi dettagli realistici per i prezzi, i servizi, gli orari, l'indirizzo e l'offerta della città indicata.
4. Mantieni i colori e il tema in perfetta armonia con la categoria dell'attività (es. verde per sostenibilità/ristorazione, viola/blu per consulenza, arancione/legno per artigiani).
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
  "category": "ristorante | consulente | artigiano | servizi_casa | fitness | salute | altro",
  "categoryLabel": "Etichetta Categoria Leggibile",
  "city": "Città",
  "tagline": "Slogan principale chiaro e d'impatto",
  "description": "Breve descrizione in 2 frasi dell'attività",
  "heroImageUrl": "Un URL Unsplash valido ad alta risoluzione a tema",
  "primaryGoal": "chiamata | prezzi | prenotazione | whatsapp",
  "selectedTheme": "semplice | elegante | colorato | minimal | rustico",
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
  "address": "Via Roma 1, Città",
  "openingHours": "Lun - Sab: 09:00 - 20:00",
  "pages": [
    {
      "id": "home",
      "title": "Home",
      "slug": "/",
      "icon": "home",
      "subtitle": "La tua vetrina digitale",
      "sections": [
        {
          "id": "hero",
          "title": "Titolo Hero",
          "description": "Descrizione Hero",
          "type": "hero"
        },
        {
          "id": "features",
          "title": "I Nostri Punti di Forza",
          "description": "Perché i clienti ci scelgono",
          "type": "services",
          "contentItems": [
            { "title": "Punto 1", "subtitle": "Descrizione", "icon": "bolt" },
            { "title": "Punto 2", "subtitle": "Descrizione", "icon": "verified" }
          ]
        }
      ]
    },
    {
      "id": "servizi",
      "title": "Servizi & Prezzi",
      "slug": "/servizi",
      "icon": "list_alt",
      "subtitle": "Cosa offri ai clienti",
      "sections": [
        {
          "id": "listino",
          "title": "Listino Servizi",
          "description": "Prezzi chiari e trasparenti",
          "type": "services",
          "contentItems": [
            { "title": "Servizio 1", "subtitle": "Dettaglio", "price": "€ 25.00" },
            { "title": "Servizio 2", "subtitle": "Dettaglio", "price": "€ 50.00" }
          ]
        }
      ]
    },
    {
      "id": "chi_siamo",
      "title": "Chi Siamo",
      "slug": "/chi-siamo",
      "icon": "person",
      "subtitle": "La tua storia",
      "sections": [
        {
          "id": "story",
          "title": "La Nostra Storia",
          "description": "Esperienza e passione al tuo servizio",
          "type": "about"
        }
      ]
    },
    {
      "id": "contatti",
      "title": "Contatti Rapidi",
      "slug": "/contatti",
      "icon": "add_call",
      "subtitle": "Trovarti è un attimo",
      "sections": [
        {
          "id": "contact_info",
          "title": "Vienici a Trovare o Contattaci",
          "description": "Siamo pronti a rispondere a ogni tua domanda",
          "type": "contact",
          "contentItems": [
            { "title": "Indirizzo", "subtitle": "Via Roma 1, Città", "icon": "location_on" },
            { "title": "Telefono", "subtitle": "+39 012 3456789", "icon": "call" },
            { "title": "WhatsApp", "subtitle": "Invia un messaggio per info", "icon": "chat" }
          ]
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
    return res.json({ success: true, blueprint: blueprintData });
  } catch (error: any) {
    console.error("Error generating blueprint:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate blueprint with Gemini AI",
    });
  }
});

// API Endpoint 2: AI Assistant Interactive Chat & Customization
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { userMessage, currentBlueprint } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `
Sei l'assistente virtuale di 'Facilissimo Web'. L'utente sta personalizzando il sito web della sua attività.
Rispondi in modo cordiale, sintetico (massimo 2-3 frasi) e propositivo in lingua italiana.
Se la richiesta comporta una modifica del sito (es. cambiare colore, aggiungere una pagina, modificare un testo), proponi la modifica e restituisci l'oggetto "updatedBlueprint" aggiornato nell'output JSON.

Restituisci sempre JSON con la seguente struttura:
{
  "replyText": "Messaggio di risposta cordiale ed entusiasta per l'utente",
  "suggestions": ["Modifica 1 suggerita", "Modifica 2 suggerita"],
  "updatedBlueprint": <L'oggetto blueprint aggiornato se applicabile, altrimenti null>
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
    return res.json({ success: true, data: resultData });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to process AI chat request",
    });
  }
});

async function startServer() {
  // API routes setup above

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Facilissimo Web server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
