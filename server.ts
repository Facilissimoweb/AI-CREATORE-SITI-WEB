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
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";
  if (!apiKey) {
    console.warn(
      "GEMINI_API_KEY / VITE_GEMINI_API_KEY is missing from environment variables."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build-facilissimo-webapp",
      },
    },
  });
};

// Health & Environment API Check
app.get("/api/health", (req, res) => {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  res.json({
    status: "ok",
    platform: "Facilissimo Web App Studio",
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? `${apiKey.substring(0, 6)}...` : "not_configured"
  });
});

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

    let blueprintData: any = null;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      blueprintData = JSON.parse(text);
    } catch (aiErr: any) {
      console.warn("Gemini API call failed, using intelligent category blueprint fallback:", aiErr?.message);
      blueprintData = {
        businessName: prompt ? (prompt.length > 30 ? prompt.substring(0, 30) : prompt) : "La Mia Attività",
        category: category || "ristorante",
        categoryLabel: category === "consulente" ? "Consulenza e Servizi" : category === "artigiano" ? "Artigiano e Casa" : "Ristorante e Bar",
        city: city || "Italia",
        tagline: "Eccellenza, qualità e passione al servizio del cliente",
        description: "Offriamo servizi di altissima qualità pensati per soddisfare ogni esigenza della nostra clientela.",
        heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        primaryGoal: goal || "prenotazione",
        selectedTheme: "semplice",
        colors: {
          primary: "#10b981",
          secondary: "#6700c9",
          background: "#ffffff",
          surface: "#f8fafc",
          text: "#0f172a"
        },
        fontFamily: "Inter",
        phone: "+39 012 3456789",
        whatsapp: "+39 340 1234567",
        address: `Via Roma 10, ${city || 'Italia'}`,
        openingHours: "Lun - Sab: 08:30 - 19:30",
        pages: [
          {
            id: "home",
            title: "Home Page",
            slug: "/",
            icon: "home",
            subtitle: "Benvenuti nella nostra Web App Mobile First",
            sections: [
              {
                id: "hero",
                title: "Benvenuti da Noi",
                description: "Scopri le nostre ultime offerte e prenota direttamente dal tuo smartphone.",
                type: "hero"
              },
              {
                id: "services",
                title: "I Nostri Servizi Principali",
                description: "Qualità superiore e massima trasparenza nei prezzi",
                type: "services",
                contentItems: [
                  { title: "Servizio Base", subtitle: "Assistenza e consulenza", price: "€ 35.00" },
                  { title: "Servizio Premium", subtitle: "Pacchetto completo su misura", price: "€ 75.00" }
                ]
              }
            ]
          },
          {
            id: "servizi",
            title: "Servizi & Listino",
            slug: "/servizi",
            icon: "list_alt",
            subtitle: "Consultazione rapida del listino",
            sections: [
              {
                id: "listino",
                title: "Listino Completo",
                description: "Tutti i prezzi aggiornati in tempo reale",
                type: "services",
                contentItems: [
                  { title: "Offerta Speciale", subtitle: "Include garanzia completa", price: "€ 49.00" }
                ]
              }
            ]
          },
          {
            id: "chi_siamo",
            title: "Chi Siamo",
            slug: "/chi-siamo",
            icon: "person",
            subtitle: "La nostra storia e passione",
            sections: [
              {
                id: "story",
                title: "Tradizione e Innovazione",
                description: "Lavoriamo con dedizione per offrire ogni giorno il miglior servizio ai nostri clienti.",
                type: "about"
              }
            ]
          },
          {
            id: "contatti",
            title: "Contatti e Dove Siamo",
            slug: "/contatti",
            icon: "add_call",
            subtitle: "Raggiungici in un click",
            sections: [
              {
                id: "contact_info",
                title: "Contatti Rapidi e Chat WhatsApp",
                description: "Siamo sempre reperibili via telefono o WhatsApp",
                type: "contact"
              }
            ]
          }
        ]
      };
    }

    return res.json({ success: true, blueprint: blueprintData });
  } catch (error: any) {
    console.error("Error generating blueprint:", error);
    return res.json({
      success: true,
      blueprint: {
        businessName: "La Mia Web App",
        category: "ristorante",
        city: "Italia",
        tagline: "Sito pronto in pochi secondi",
        description: "Web App pronta per la tua attività",
        heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        primaryGoal: "prenotazione",
        selectedTheme: "semplice",
        colors: { primary: "#10b981", secondary: "#6700c9", background: "#ffffff", surface: "#f8fafc", text: "#0f172a" },
        fontFamily: "Inter",
        phone: "+39 012 3456789",
        whatsapp: "+39 340 1234567",
        address: "Via Roma 1, Italia",
        openingHours: "Lun - Sab: 09:00 - 19:00",
        pages: []
      }
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

// API Endpoint 3: AI Image Generator for Professional Business Placeholders
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, businessType, category, aspectRatio = "16:9" } = req.body;
    const ai = getGeminiClient();

    const cleanPrompt = prompt || `Professional high resolution interior/exterior photo of a ${businessType || category || 'business'}, warm atmospheric lighting, elegant composition, photorealistic 8k detail`;

    try {
      // Attempt Imagen 3 Generation via Gemini SDK
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: cleanPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: (aspectRatio as any) || "16:9",
          outputMimeType: "image/jpeg",
        },
      });

      if (response.generatedImages && response.generatedImages[0]?.image?.imageBytes) {
        const base64Data = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64Data}`;
        return res.json({
          success: true,
          imageUrl,
          prompt: cleanPrompt,
          source: "imagen-3"
        });
      }
    } catch (imagenErr: any) {
      console.warn("Imagen generation fallback triggered:", imagenErr?.message || imagenErr);
    }

    // High quality curated photographic fallback library by category
    const categoryImagesMap: Record<string, string[]> = {
      artigiano: [
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80"
      ],
      consulente: [
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
      ],
      ristorante: [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
      ],
      pizzeria: [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80"
      ],
      fitness: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
      ],
      salute: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
      ],
      default: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
      ]
    };

    const targetKey = (category || businessType || '').toLowerCase();
    let foundKey = 'default';
    for (const k of Object.keys(categoryImagesMap)) {
      if (targetKey.includes(k)) {
        foundKey = k;
        break;
      }
    }

    const list = categoryImagesMap[foundKey];
    const fallbackUrl = list[Math.floor(Math.random() * list.length)];

    return res.json({
      success: true,
      imageUrl: fallbackUrl,
      prompt: cleanPrompt,
      source: "curated-library"
    });
  } catch (err: any) {
    console.error("Error generating image:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Impossibile generare l'immagine al momento"
    });
  }
});

// API Endpoint 4: AI Copywriter for About Us & Services Sections
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { businessName, category, city, tagline } = req.body;
    const ai = getGeminiClient();

    const name = businessName || "La Nostra Attività";
    const cat = category || "Attività Locale";
    const location = city || "Italia";

    const systemInstruction = `
Sei un Copywriter professionista specializzato in Marketing Locale e Web App Mobile-First per piccole e medie imprese italiane.
Genera testi persuasivi, eleganti e ottimizzati SEO per le sezioni 'Chi Siamo' e 'Servizi'.

Restituisci ESCLUSIVAMENTE un JSON valido con questa esatta struttura:
{
  "aboutTitle": "Titolo d'impatto per la sezione Chi Siamo",
  "aboutDescription": "Un testo avvincente di 3-4 frasi che racconta la passione, l'esperienza e l'impegno verso la qualità e la soddisfazione del cliente.",
  "servicesTitle": "Titolo chiaro per la sezione Servizi",
  "servicesDescription": "Una breve introduzione che invita a scoprire l'offerta completa.",
  "servicesItems": [
    { "title": "Nome del Servizio 1", "subtitle": "Descrizione accurata dei vantaggi ed esperienza offerta." },
    { "title": "Nome del Servizio 2", "subtitle": "Descrizione accurata dei vantaggi ed esperienza offerta." },
    { "title": "Nome del Servizio 3", "subtitle": "Descrizione accurata dei vantaggi ed esperienza offerta." }
  ],
  "tagline": "Un nuovo slogan memorabile di 1 frase"
}
`;

    const promptText = `
Attività: "${name}"
Categoria/Settore: "${cat}"
Città/Località: "${location}"
Slogan attuale: "${tagline || ''}"
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const copyData = JSON.parse(text);
      if (copyData.aboutDescription && copyData.servicesItems) {
        return res.json({ success: true, copy: copyData, source: "gemini-3.6-flash" });
      }
    } catch (aiErr: any) {
      console.warn("Gemini copy generator fallback triggered:", aiErr?.message || aiErr);
    }

    // High quality Category Fallback Copy Dictionary
    const categoryCopyFallback: Record<string, any> = {
      ristorante: {
        aboutTitle: `La Passione per la Buona Cucina a ${location}`,
        aboutDescription: `Fondata sulla tradizione gastronomica locale, ${name} seleziona ogni giorno ingredienti freschissimi a chilometro zero. Offriamo un'atmosfera calda e accogliente dove riscoprire i veri sapori della tavola.`,
        servicesTitle: "I Nostri Servizi Gastronomici",
        servicesDescription: "Esperienze deliziose pensate per ogni occasione speciale.",
        servicesItems: [
          { title: "Pranzi e Cene Gourmet", subtitle: "Menù stagionale curato dai nostri chef con abbinamenti di vini selezionati." },
          { title: "Asporto & Consegna Veloci", subtitle: "Ordina comodamente online per gustare i nostri piatti direttamente a casa tua." },
          { title: "Eventi & Cerimonie", subtitle: "Sale riservate e menù personalizzati per feste, compleanni e incontri aziendali." }
        ],
        tagline: "Tradizione, ingredienti scelti e passione in ogni piatto."
      },
      consulente: {
        aboutTitle: `Eccellenza e Strategia per la Tua Crescita`,
        aboutDescription: `${name} è lo studio di consulenza professionale di riferimento a ${location}. Aiutiamo privati e aziende a raggiungere i propri obiettivi con strategie trasparenti, competenze consolidate e soluzioni su misura.`,
        servicesTitle: "Ambiti di Consulenza",
        servicesDescription: "Supporto strategico ed operativo ad alto valore aggiunto.",
        servicesItems: [
          { title: "Consulenza Strategica Su Misura", subtitle: "Analisi approfondita delle esigenze per piani d'azione chiari ed efficaci." },
          { title: "Pianificazione & Gestione", subtitle: "Ottimizzazione dei processi e supporto continuo per ridurre rischi e tempi." },
          { title: "Assistenza Diretta & Tutorato", subtitle: "Un consulente dedicato sempre al tuo fianco per ogni decisione chiave." }
        ],
        tagline: "Competenza, visione e soluzioni concrete al tuo servizio."
      },
      artigiano: {
        aboutTitle: `Maestria Artigiana e Cura dei Dettagli`,
        aboutDescription: `Da anni ${name} unisce sapienza artigianale e tecniche innovative a ${location}. Realizziamo opere su misura uniche, lavorate con materiali di prima qualità per garantire bellezza e durata nel tempo.`,
        servicesTitle: "Lavorazioni & Progetti Su Misura",
        servicesDescription: "Progettazione dettagliata e realizzazione a regola d'arte.",
        servicesItems: [
          { title: "Progettazione Personalizzata", subtitle: "Ideazione e rilievo misure gratuito per soluzioni perfettamente integrate." },
          { title: "Realizzazione Artigianale", subtitle: "Lavorazione scrupolosa e finiture di pregio realizzate a mano nel nostro laboratorio." },
          { title: "Installazione & Manutenzione", subtitle: "Posa in opera a regola d'arte e assistenza post-vendita garantita." }
        ],
        tagline: "Qualità fatta a mano e cura sartoriale per ogni progetto."
      },
      fitness: {
        aboutTitle: `Il Tuo Benessere Fisico al Centro`,
        aboutDescription: `${name} è il punto di riferimento a ${location} per chi desidera ritrovare energia, forma fisica e salute. Allenatori qualificati ti guidano con programmi personalizzati e un approccio motivante.`,
        servicesTitle: "Corsi & Programmi di Allenamento",
        servicesDescription: "Percorsi adatti a ogni livello per raggiungere i tuoi traguardi.",
        servicesItems: [
          { title: "Personal Training Unico", subtitle: "Scheda di allenamento su misura con monitoraggio costante dei progressi." },
          { title: "Corsi di Gruppo Motivanti", subtitle: "Lavori funzionali, stretching e corsi ad alta energia in ambiente dinamico." },
          { title: "Consulenza Nutrizionale", subtitle: "Piani alimentari bilanciati per affiancare l'attività fisica e massimizzare i risultati." }
        ],
        tagline: "Raggiungi la versione migliore di te con i nostri esperti."
      },
      default: {
        aboutTitle: `Chi Siamo - La Qualità che Fa la Differenza`,
        aboutDescription: `${name} nasce a ${location} con la missione di offrire servizi eccellenti e un'attenzione totale alle esigenze dei clienti. Grazie a un team esperto, garantiamo affidabilità, tempi certi e la massima soddisfazione.`,
        servicesTitle: "I Nostri Servizi Principali",
        servicesDescription: "Soluzioni complete pensate per garantirti serenità e risultati.",
        servicesItems: [
          { title: "Consulenza & Preventivo Gratuito", subtitle: "Ascoltiamo le tue esigenze e ti proponiamo la soluzione ideale senza impegno." },
          { title: "Esecuzione Professionale", subtitle: "Servizio rapido e curato in ogni dettaglio con standard di qualità elevati." },
          { title: "Assistenza Dedicata", subtitle: "Supporto costante prima, durante e dopo per una soddisfazione garantita." }
        ],
        tagline: "Servizio professionale, trasparenza e massima cura del cliente."
      }
    };

    const targetKey = (cat || "").toLowerCase();
    let selectedCopy = categoryCopyFallback.default;
    for (const key of Object.keys(categoryCopyFallback)) {
      if (targetKey.includes(key)) {
        selectedCopy = categoryCopyFallback[key];
        break;
      }
    }

    return res.json({ success: true, copy: selectedCopy, source: "category-template" });
  } catch (err: any) {
    console.error("Error generating copy:", err);
    return res.status(500).json({ success: false, error: err?.message || "Errore generazione testi" });
  }
});

// In-Memory Database for Client Published Sites
const publishedSitesStore: Record<string, any> = {};

// Default demo client site hosted on FacilissimoWeb
publishedSitesStore["cliente-yyy"] = {
  businessName: "Ristorante Cliente YYY",
  category: "ristorante",
  city: "Milano",
  tagline: "Cucina Tipica Milanese e Pizza Artigianale",
  description: "Ingredienti freschi a km zero, forno a legna e ambiente accogliente nel cuore di Milano.",
  heroImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  primaryGoal: "prenotazione",
  colors: {
    primary: "#10b981",
    secondary: "#6700c9",
    background: "#131312",
    surface: "#1c1c1a",
    text: "#e5e2df"
  },
  phone: "+39 02 9876543",
  whatsapp: "39029876543",
  address: "Corso Buenos Aires 45, Milano",
  openingHours: "Mar - Dom: 12:00 - 23:00",
  pages: [
    {
      id: "home",
      title: "Home",
      slug: "/",
      subtitle: "Benvenuti da Cliente YYY",
      sections: [
        {
          id: "hero",
          title: "Gusto Autentico Ogni Giorno",
          description: "Prenota il tuo tavolo direttamente online o contattaci su WhatsApp.",
          type: "hero"
        }
      ]
    },
    {
      id: "servizi",
      title: "Menu & Specialità",
      slug: "/servizi",
      subtitle: "I Nostri Piatti Forti",
      sections: [
        {
          id: "menu",
          title: "Primi e Pizze",
          description: "Preparati al momento dai nostri chef",
          type: "services",
          contentItems: [
            { title: "Risotto alla Milanese DOP", subtitle: "Zafferano puro in pistilli", price: "€ 14.00" },
            { "title": "Pizza Margherita Speciale", subtitle: "Mozzarella di bufala e basilico", price: "€ 9.50" }
          ]
        }
      ]
    }
  ]
};

// API Endpoint 3: Register or Update a Published Site under FacilissimoWeb Subdomain/Slug
app.post("/api/publish-site", (req, res) => {
  try {
    const { slug, blueprint, subscriptionPlan } = req.body;
    const cleanSlug = (slug || blueprint.businessName || "cliente-yyy")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    publishedSitesStore[cleanSlug] = {
      ...blueprint,
      publishedAt: new Date().toISOString(),
      subscriptionPlan: subscriptionPlan || "abbonamento_mensile",
      status: "active"
    };

    return res.json({
      success: true,
      slug: cleanSlug,
      publicUrl: `/site/${cleanSlug}`,
      message: `Sito pubblicato con successo su FacilissimoWeb!`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API Endpoint 4: List all published client sites under subscription
app.get("/api/published-sites", (req, res) => {
  const list = Object.entries(publishedSitesStore).map(([slug, data]) => ({
    slug,
    businessName: data.businessName,
    city: data.city,
    publishedAt: data.publishedAt || new Date().toISOString(),
    publicUrl: `/site/${slug}`
  }));
  return res.json({ success: true, count: list.length, sites: list });
});

// API Endpoint 5: Vercel Dynamic Subdomain & Staging Deployment Service
app.post("/api/deploy-vercel", async (req, res) => {
  try {
    const { blueprint } = req.body;
    if (!blueprint || !blueprint.businessName) {
      return res.status(400).json({ success: false, error: "Blueprint non valido" });
    }

    const cleanSlug = (blueprint.businessName || "webapp")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const projectName = `facilissimo-webapp-${cleanSlug}`;

    // Store in internal memory store for fallback or staging preview
    publishedSitesStore[cleanSlug] = {
      ...blueprint,
      publishedAt: new Date().toISOString(),
      status: "active"
    };

    const seoTitle = blueprint.seo?.metaTitle || `${blueprint.businessName} - Web App Mobile First`;
    const seoDesc = blueprint.seo?.metaDescription || blueprint.tagline || blueprint.description || `Web App per ${blueprint.businessName} a ${blueprint.city}.`;
    const seoKeywords = blueprint.seo?.keywords || `${blueprint.businessName}, ${blueprint.city}, whatsapp`;
    const ogTitle = blueprint.seo?.ogTitle || seoTitle;
    const ogDesc = blueprint.seo?.ogDescription || seoDesc;
    const ogImage = blueprint.seo?.ogImage || blueprint.heroImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop';
    const canonical = blueprint.seo?.canonicalUrl || '';
    const robots = blueprint.seo?.robots || 'index, follow';

    // Generate standalone Web App Mobile First HTML
    const htmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDesc}">
  <meta name="keywords" content="${seoKeywords}">
  <meta name="robots" content="${robots}">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  <!-- OpenGraph Meta Tags -->
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:type" content="website">
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">
  <meta name="twitter:image" content="${ogImage}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${blueprint.colors?.background || '#131312'}; color: ${blueprint.colors?.text || '#e5e2df'}; }
  </style>
</head>
<body class="min-h-screen pb-28">
  <header class="p-3 border-b border-white/10 bg-black/80 sticky top-0 backdrop-blur-md z-50 max-w-md mx-auto relative flex justify-between items-center">
    <div class="font-bold text-base flex items-center gap-2" style="color: ${blueprint.colors?.primary || '#10b981'}">
      <span class="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block"></span>
      <span>${blueprint.businessName}</span>
    </div>
    <div class="flex items-center gap-2">
      <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" class="px-2.5 py-1 rounded-full font-bold text-xs bg-[#25D366] text-white flex items-center gap-1">
        <span>💬</span> <span>WhatsApp</span>
      </a>
      <button onclick="document.getElementById('mobileMenu').classList.toggle('hidden')" class="p-1.5 rounded-lg bg-white/10 text-white font-bold text-xs flex items-center gap-1 border border-white/10">
        <span>🍔</span> <span>Menù</span>
      </button>
    </div>
    <!-- Hamburger Dropdown Menu -->
    <div id="mobileMenu" class="hidden absolute top-12 right-3 w-56 bg-[#1a1a18]/98 border border-white/20 rounded-2xl p-3 shadow-2xl z-50 space-y-2 text-xs backdrop-blur-xl">
      <div class="font-bold text-[10px] text-gray-400 uppercase tracking-wider pb-1 border-b border-white/10">
        Navigazione Rapida
      </div>
      <a href="#" onclick="document.getElementById('mobileMenu').classList.add('hidden')" class="block p-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold flex items-center gap-2 text-white">
        <span>🏠</span> <span>Home Page</span>
      </a>
      <a href="#services" onclick="document.getElementById('mobileMenu').classList.add('hidden')" class="block p-2 rounded-xl hover:bg-white/10 font-bold flex items-center gap-2 text-white">
        <span>📋</span> <span>Servizi e Menù</span>
      </a>
      <a href="#booking" onclick="document.getElementById('mobileMenu').classList.add('hidden')" class="block p-2 rounded-xl hover:bg-white/10 font-bold flex items-center gap-2 text-emerald-400">
        <span>📅</span> <span>Prenota Online</span>
      </a>
      <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" class="block p-2 rounded-xl hover:bg-white/10 font-bold flex items-center gap-2 text-[#25D366]">
        <span>💬</span> <span>Chat WhatsApp</span>
      </a>
    </div>
  </header>
  <main class="max-w-md mx-auto p-4 space-y-6">
    <div class="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 text-center">
      <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-emerald-400">
        ${blueprint.city || 'Italia'}
      </span>
      <h1 class="text-2xl font-black">${blueprint.businessName}</h1>
      <p class="text-sm opacity-80">${blueprint.tagline || blueprint.description || ''}</p>
    </div>
    ${(blueprint.pages?.[0]?.sections || []).map((sec: any) => `
      <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <h2 class="font-bold text-base" style="color: ${blueprint.colors?.primary || '#10b981'}">${sec.title}</h2>
        <p class="text-xs opacity-75">${sec.description}</p>
        <div class="space-y-2">
          ${(sec.contentItems || []).map((item: any) => `
            <div class="p-3 rounded-2xl bg-black/30 border border-white/5 flex justify-between items-center text-xs gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20">` : ''}
                <div class="min-w-0">
                  <span class="font-bold block truncate">${item.title}</span>
                  <p class="text-[10px] opacity-60 truncate">${item.subtitle || ''}</p>
                </div>
              </div>
              <span class="font-bold text-emerald-400 shrink-0">${item.price || ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </main>
  <footer class="fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-1.5 z-50">
    <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" class="w-full max-w-md py-3 rounded-full text-center font-bold text-xs text-white bg-[#25D366]">
      💬 WhatsApp Direct (${blueprint.phone || ''})
    </a>
  </footer>
</body>
</html>`;

    const vercelToken = process.env.VERCEL_TOKEN || process.env.VERCEL_API_KEY;

    if (vercelToken) {
      // Call Vercel REST API v13 Deployments Endpoint
      const vercelRes = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          public: true,
          files: [
            {
              file: "index.html",
              data: htmlContent
            }
          ],
          projectSettings: {
            framework: null
          }
        })
      });

      const vercelData = await vercelRes.json();
      if (vercelRes.ok && vercelData.url) {
        const fullVercelUrl = `https://${vercelData.url}`;
        return res.json({
          success: true,
          isRealVercel: true,
          deploymentUrl: fullVercelUrl,
          projectId: vercelData.projectId,
          projectName: projectName,
          message: `Web App Mobile First pubblicata direttamente su Vercel: ${fullVercelUrl}`
        });
      } else {
        console.warn("Vercel API returned non-OK or error:", vercelData);
      }
    }

    // Fallback if VERCEL_TOKEN is not configured: serve via Facilissimo Web App staging route
    const localStagingUrl = `https://ai-creatore-siti-web.vercel.app/site/${cleanSlug}`;

    return res.json({
      success: true,
      isRealVercel: false,
      deploymentUrl: localStagingUrl,
      projectName: projectName,
      message: `Web App Mobile First pronta sul link pubblico di staging: ${localStagingUrl}. (Configura VERCEL_TOKEN in Vercel/AI Studio per la pubblicazione automatica in 1-Click sul tuo account Vercel).`
    });
  } catch (error: any) {
    console.error("Vercel deployment error (falling back to staging URL):", error?.message);
    const fallbackSlug = (req.body?.businessName || 'mia-app').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const localStagingUrl = `https://ai-creatore-siti-web.vercel.app/site/${fallbackSlug}`;
    return res.json({
      success: true,
      isRealVercel: false,
      deploymentUrl: localStagingUrl,
      projectName: req.body?.businessName || 'Web App',
      message: `Web App Mobile First pubblicata sul link pubblico di anteprima: ${localStagingUrl}`
    });
  }
});


// Route: Serve Standalone Client Web App at /site/:clientSlug
app.get("/site/:clientSlug", (req, res) => {
  const { clientSlug } = req.params;
  const siteData = publishedSitesStore[clientSlug] || publishedSitesStore["cliente-yyy"];

  if (!siteData) {
    return res.status(404).send("<h1>Sito non trovato su Facilissimo Web</h1>");
  }

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteData.businessName} - Sito Ufficiale (Facilissimo Web)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${siteData.colors?.background || '#131312'}; color: ${siteData.colors?.text || '#e5e2df'}; }
  </style>
</head>
<body class="min-h-screen pb-28">
  <!-- Top Hosted Site Banner -->
  <div class="bg-[#10b981] text-[#003824] text-center text-xs py-1.5 px-4 font-bold flex items-center justify-center gap-2">
    <span>🌐 Sito Ufficiale Ospitato su FacilissimoWeb.it • Abbonamento Attivo</span>
  </div>

  <!-- Header -->
  <header class="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center max-w-lg mx-auto">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-[#10b981]"></div>
      <h1 class="text-base font-bold" style="color: ${siteData.colors?.primary || '#10b981'}">${siteData.businessName}</h1>
    </div>
    <a href="https://wa.me/${siteData.whatsapp}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-full text-xs font-bold text-black flex items-center gap-1" style="background-color: ${siteData.colors?.primary || '#10b981'}">
      💬 WhatsApp
    </a>
  </header>

  <!-- Main Web App Content -->
  <main class="max-w-md mx-auto p-4 space-y-6">
    <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-video border border-white/10">
      <img src="${siteData.heroImageUrl}" alt="${siteData.businessName}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-5">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#10b981] text-[#003824] mb-1 inline-block">
            ${siteData.category?.toUpperCase() || 'ATTIVITÀ'} • ${siteData.city || 'ITALIA'}
          </span>
          <h2 class="text-white text-lg font-extrabold leading-snug">${siteData.tagline}</h2>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
      <h3 class="font-bold text-sm" style="color: ${siteData.colors?.primary || '#10b981'}">Chi Siamo</h3>
      <p class="text-xs opacity-80 leading-relaxed">${siteData.description}</p>
    </div>

    <!-- Pages / Sections -->
    ${(siteData.pages || []).map((page: any) => `
      <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <h3 class="font-bold text-sm" style="color: ${siteData.colors?.primary || '#10b981'}">${page.title}</h3>
        <p class="text-xs opacity-70">${page.subtitle || ''}</p>
        <div class="space-y-2 pt-1">
          ${(page.sections || []).flatMap((sec: any) => sec.contentItems || []).map((item: any) => `
            <div class="p-3 rounded-2xl bg-black/30 border border-white/10 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold block text-white">${item.title}</span>
                <span class="text-[10px] opacity-70 block">${item.subtitle || ''}</span>
              </div>
              <span class="font-bold text-xs px-2.5 py-1 rounded-lg bg-white/10" style="color: ${siteData.colors?.primary || '#10b981'}">${item.price || ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}

    <!-- Booking Form -->
    <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
      <h3 class="font-bold text-sm" style="color: ${siteData.colors?.primary || '#10b981'}">📅 Prenotazione Diretta</h3>
      <form onsubmit="event.preventDefault(); alert('Grazie! Richiesta inviata via WhatsApp.'); window.open('https://wa.me/${siteData.whatsapp}?text=Vorrei%20prenotare%20per%20' + encodeURIComponent(document.getElementById('bkName').value), '_blank');" class="space-y-2 text-xs">
        <input type="text" id="bkName" required placeholder="Nome e Cognome" class="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/40 focus:outline-none">
        <div class="grid grid-cols-2 gap-2">
          <input type="date" required class="bg-black/40 border border-white/20 rounded-xl px-2 py-2 text-white focus:outline-none">
          <input type="time" required class="bg-black/40 border border-white/20 rounded-xl px-2 py-2 text-white focus:outline-none">
        </div>
        <button type="submit" class="w-full py-3 rounded-xl font-bold text-xs text-black transition-transform active:scale-95" style="background-color: ${siteData.colors?.primary || '#10b981'}">
          Invia Richiesta
        </button>
      </form>
    </div>

    <!-- Contact Info -->
    <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2 text-xs">
      <h3 class="font-bold text-sm" style="color: ${siteData.colors?.primary || '#10b981'}">📍 Info e Contatti</h3>
      <p class="opacity-90"><strong>Indirizzo:</strong> ${siteData.address || 'Via Roma'}</p>
      <p class="opacity-90"><strong>Telefono:</strong> ${siteData.phone || ''}</p>
      <p class="opacity-90"><strong>Orari:</strong> ${siteData.openingHours || '09:00 - 20:00'}</p>
    </div>
  </main>

  <!-- Sticky Bottom Footer -->
  <footer class="fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-1.5 z-50">
    <a href="https://wa.me/${siteData.whatsapp}" target="_blank" rel="noopener" class="w-full max-w-md py-3 rounded-full text-center font-bold text-xs text-white bg-[#25D366] shadow-xl hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2">
      💬 WhatsApp (${siteData.phone || ''})
    </a>
    <span class="text-[10px] text-gray-400">Piattaforma © Facilissimo Web • Servizio Gestito SaaS</span>
  </footer>
</body>
</html>`;

  return res.send(html);
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
