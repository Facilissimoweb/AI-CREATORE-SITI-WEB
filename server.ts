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
  <header class="p-4 border-b border-white/10 bg-black/60 sticky top-0 backdrop-blur-md z-40 flex justify-between items-center max-w-md mx-auto">
    <div class="font-bold text-base flex items-center gap-2" style="color: ${blueprint.colors?.primary || '#10b981'}">
      <span>${blueprint.businessName}</span>
    </div>
    <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" class="px-3 py-1 rounded-full font-bold text-xs bg-[#25D366] text-white">
      WhatsApp
    </a>
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
            <div class="p-3 rounded-2xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold">${item.title}</span>
                <p class="text-[10px] opacity-60">${item.subtitle || ''}</p>
              </div>
              <span class="font-bold text-emerald-400">${item.price || ''}</span>
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
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || `localhost:${PORT}`;
    const localStagingUrl = `${protocol}://${host}/site/${cleanSlug}`;

    return res.json({
      success: true,
      isRealVercel: false,
      deploymentUrl: localStagingUrl,
      projectName: projectName,
      message: `Web App Mobile First pronta sul link pubblico di staging: ${localStagingUrl}. (Configura VERCEL_TOKEN in Vercel/AI Studio per la pubblicazione automatica in 1-Click sul tuo account Vercel).`
    });
  } catch (error: any) {
    console.error("Vercel deployment error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Deployment failed" });
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
