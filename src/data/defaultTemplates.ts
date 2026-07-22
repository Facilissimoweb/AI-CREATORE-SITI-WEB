import { WebsiteBlueprint } from '../types';

export const DEFAULT_PIZZERIA: WebsiteBlueprint = {
  businessName: "Il Forno d'Oro",
  category: "ristorante",
  categoryLabel: "Ristorante / Pizzeria",
  city: "Firenze",
  tagline: "La vera pizza artigianale a lievitazione naturale a Firenze",
  description: "Farine biologiche macinate a pietra, ingredienti a KM 0 e un forno a legna tradizionale per pizze indimenticabili.",
  heroImageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  primaryGoal: "prenotazione",
  selectedTheme: "semplice",
  colors: {
    primary: "#10b981",
    secondary: "#6700c9",
    background: "#131312",
    surface: "#1c1c1a",
    text: "#e5e2df"
  },
  fontFamily: "Inter",
  phone: "+39 055 1234567",
  whatsapp: "390551234567",
  address: "Via dei Servi 42, Firenze",
  openingHours: "Mar - Dom: 19:00 - 23:30",
  pages: [
    {
      id: "home",
      title: "Home",
      slug: "/",
      icon: "home",
      subtitle: "La tua vetrina digitale",
      sections: [
        {
          id: "hero",
          title: "Benvenuti da Il Forno d'Oro",
          description: "Gusta la vera pizza fiorentina cotta al forno a legna in un'atmosfera accogliente e familiare.",
          type: "hero"
        },
        {
          id: "features",
          title: "Perché Sceglierci",
          description: "I tre pilastri della nostra qualità quotidiana.",
          type: "services",
          contentItems: [
            { title: "Lievitazione 48 Ore", subtitle: "Pizza altamente digeribile e fragrante", icon: "bolt" },
            { title: "Ingredienti DOP", subtitle: "Mozzarella di bufala e pomodoro san marzano", icon: "verified" },
            { title: "Forno a Legna", subtitle: "Cottura tradizionale a 450° C", icon: "local_fire_department" }
          ]
        },
        {
          id: "cta_reservation",
          title: "Prenota il tuo Tavolo",
          description: "Assicurati i posti migliori per stasera in soli 2 click via WhatsApp o telefono.",
          type: "cta"
        }
      ]
    },
    {
      id: "servizi",
      title: "Menu & Prezzi",
      slug: "/servizi",
      icon: "list_alt",
      subtitle: "Cosa offri ai clienti",
      sections: [
        {
          id: "menu_pizze",
          title: "Le Nostre Pizze Classiche & Speciali",
          description: "Prezzi trasparenti e ingredienti selezionati.",
          type: "services",
          contentItems: [
            { title: "Margherita Sbagliata", subtitle: "Pomodoro San Marzano, Bufala campana DOP e pesto di basilico fresco", price: "€ 8.50" },
            { title: "Pistacchiosa", subtitle: "Fiordilatte, mortadella di Bologna IGP, granella di pistacchio e burrata", price: "€ 11.00" },
            { title: "Diavola Gourmet", subtitle: "Pomodoro, fiordilatte, spianata calabra piccante e 'nduja di Spilinga", price: "€ 9.50" },
            { title: "Quattro Formaggi & Miele", subtitle: "Fiordilatte, gorgonzola dop, provola affumicata, noci e miele di acacia", price: "€ 10.50" }
          ]
        },
        {
          id: "bevande",
          title: "Birre Artigianali & Dolci",
          description: "Gli abbinamenti perfetti per la tua cena.",
          type: "services",
          contentItems: [
            { title: "Birra Bionda Artigianale 0.5L", subtitle: "Birrificio locale toscano", price: "€ 5.00" },
            { title: "Tiramisù della Casa", subtitle: "Ricetta classica al mascarpone e caffè espresso", price: "€ 4.50" }
          ]
        }
      ]
    },
    {
      id: "chi_siamo",
      title: "Chi Siamo",
      slug: "/chi-siamo",
      icon: "person",
      subtitle: "La tua storia",
      sections: [
        {
          id: "story",
          title: "Passione di Famiglia dal 1998",
          description: "Siamo nati dal sogno di Mastro Pizzaiolo Marco, che per oltre 25 anni ha perfezionato l'arte dell'impasto naturale.",
          type: "about",
          contentItems: [
            { title: "Farine Biologiche", subtitle: "Selezioniamo solo grani antichi italiani", icon: "grass" },
            { title: "Accoglienza Fiorentina", subtitle: "Sentiti come a casa dal primo momento", icon: "favorite" }
          ]
        }
      ]
    },
    {
      id: "contatti",
      title: "Contatti Rapidi",
      slug: "/contatti",
      icon: "add_call",
      subtitle: "Trovarti è un attimo",
      sections: [
        {
          id: "contact_info",
          title: "Dove Siamo e Come Raggiungerci",
          description: "Siamo nel centro storico di Firenze, a 5 minuti dal Duomo.",
          type: "contact",
          contentItems: [
            { title: "Indirizzo", subtitle: "Via dei Servi 42, Firenze", icon: "location_on" },
            { title: "Telefono", subtitle: "+39 055 1234567", icon: "call" },
            { title: "WhatsApp Diretto", subtitle: "Risposta in pochi minuti per info o asporto", icon: "chat" },
            { title: "Orari", subtitle: "Martedì - Domenica: 19:00 - 23:30", icon: "schedule" }
          ]
        }
      ]
    }
  ]
};

export const DEFAULT_CONSULTANT: WebsiteBlueprint = {
  businessName: "Studio Consulenza Rossi",
  category: "consulente",
  categoryLabel: "Studio / Consulente",
  city: "Milano",
  tagline: "Consulenza Fiscale e Strategica per Piccole Imprese",
  description: "Aiutiamo artigiani e professionisti a gestire la contabilità e ottimizzare la fiscalità senza stress.",
  heroImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  primaryGoal: "chiamata",
  selectedTheme: "elegante",
  colors: {
    primary: "#35dec1",
    secondary: "#6700c9",
    background: "#131312",
    surface: "#1c1c1a",
    text: "#e5e2df"
  },
  fontFamily: "Inter",
  phone: "+39 02 98765432",
  whatsapp: "390298765432",
  address: "Corso Buenos Aires 15, Milano",
  openingHours: "Lun - Ven: 09:00 - 18:00",
  pages: [
    {
      id: "home",
      title: "Home",
      slug: "/",
      icon: "home",
      subtitle: "La tua vetrina digitale",
      sections: [
        {
          id: "hero",
          title: "Semplifica la tua Gestione Fiscale",
          description: "Un unico referente dedicato per la tua Partita IVA o Azienda. Risposte chiare e zero sorprese.",
          type: "hero"
        },
        {
          id: "benefits",
          title: "Perché Scegliere il Nostro Studio",
          description: "Professionalità e vicinanza alle esigenze del cliente.",
          type: "services",
          contentItems: [
            { title: "Consulente Dedicato", subtitle: "Linea diretta telefonica e WhatsApp senza centralini", icon: "person" },
            { title: "Pianificazione Chiara", subtitle: "Scadenze sempre sotto controllo con notifiche anticipate", icon: "calendar_today" },
            { title: "Tariffe Trasparenti", subtitle: "Preventivi chiari senza costi nascosti a fine anno", icon: "sell" }
          ]
        }
      ]
    },
    {
      id: "servizi",
      title: "Servizi & Pacchetti",
      slug: "/servizi",
      icon: "list_alt",
      subtitle: "Cosa offri ai clienti",
      sections: [
        {
          id: "pacchetti",
          title: "I Nostri Servizi Principali",
          description: "Soluzioni chiavi in mano per ogni fase della tua attività.",
          type: "services",
          contentItems: [
            { title: "Gestione Partita IVA Forfettaria", subtitle: "Fatturazione elettronica, dichiarazione dei redditi e assistenza", price: "da € 40/mese" },
            { title: "Contabilità Società & Srl", subtitle: "Bilanci, adempimenti fiscali e consulenza societaria", price: "da € 120/mese" },
            { title: "Apertura Partita IVA in 24h", subtitle: "Verifica codice ATECO, iscrizione INPS e Camera di Commercio", price: "€ 150 una tantum" }
          ]
        }
      ]
    },
    {
      id: "chi_siamo",
      title: "Chi Siamo",
      slug: "/chi-siamo",
      icon: "person",
      subtitle: "La tua storia",
      sections: [
        {
          id: "about_studio",
          title: "Il Dott. Alessandro Rossi",
          description: "Iscritto all'Ordine dei Commercialisti con oltre 15 anni di esperienza nel supporto a PMI e startup.",
          type: "about"
        }
      ]
    },
    {
      id: "contatti",
      title: "Contatti Rapidi",
      slug: "/contatti",
      icon: "add_call",
      subtitle: "Trovarti è un attimo",
      sections: [
        {
          id: "contact_info",
          title: "Prenota una Prima Consulenza Gratuita",
          description: "Fissa un colloquio conoscitivo in studio o in videochiamata.",
          type: "contact",
          contentItems: [
            { title: "Indirizzo Studio", subtitle: "Corso Buenos Aires 15, Milano", icon: "location_on" },
            { title: "Telefono", subtitle: "+39 02 98765432", icon: "call" },
            { title: "WhatsApp Studio", subtitle: "Invia una foto o domanda rapida", icon: "chat" }
          ]
        }
      ]
    }
  ]
};

export const DEFAULT_ARTISAN: WebsiteBlueprint = {
  businessName: "Falegnameria Artigiana Belli",
  category: "artigiano",
  categoryLabel: "Artigiano / Negozio",
  city: "Bologna",
  tagline: "Mobili su Misura e Restauro Arredi Legno",
  description: "Realizziamo arredi unici in legno massello, armadi su misura e cucine artigianali personalizzate a Bologna.",
  heroImageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
  primaryGoal: "whatsapp",
  selectedTheme: "rustico",
  colors: {
    primary: "#10b981",
    secondary: "#d7baff",
    background: "#131312",
    surface: "#1c1c1a",
    text: "#e5e2df"
  },
  fontFamily: "Inter",
  phone: "+39 051 5544332",
  whatsapp: "390515544332",
  address: "Via della Manna 8, Bologna",
  openingHours: "Lun - Sab: 08:00 - 18:30",
  pages: [
    {
      id: "home",
      title: "Home",
      slug: "/",
      icon: "home",
      subtitle: "La tua vetrina digitale",
      sections: [
        {
          id: "hero",
          title: "Arreda la tua Casa con il Calore del Legno",
          description: "Progetti personalizzati su misura con legni pregiati certificati e finiture naturali ecologiche.",
          type: "hero"
        }
      ]
    },
    {
      id: "servizi",
      title: "Lavorazioni",
      slug: "/servizi",
      icon: "list_alt",
      subtitle: "Cosa offri ai clienti",
      sections: [
        {
          id: "works",
          title: "I Nostri Servizi Artigianali",
          description: "Preventivo e sopralluogo gratuiti direttamente a casa tua.",
          type: "services",
          contentItems: [
            { title: "Armadi & Cabine Armadio Su Misura", subtitle: "Sfrutta ogni centimetro della tua stanza", price: "Preventivo Gratuito" },
            { title: "Tavoli in Legno Massello", subtitle: "Pezzi unici realizzati a mano con bordi naturali", price: "da € 650" },
            { title: "Restauro Mobili d'Epoca", subtitle: "Trattamento antitarlo, lucidatura a tampone e cera", price: "Su Misura" }
          ]
        }
      ]
    },
    {
      id: "chi_siamo",
      title: "Chi Siamo",
      slug: "/chi-siamo",
      icon: "person",
      subtitle: "La tua storia",
      sections: [
        {
          id: "artisan_story",
          title: "Tre Generazioni di Falegnami",
          description: "Dal 1965 tramandiamo i segreti del legno dal padre al figlio, unendo la tradizione con il design moderno.",
          type: "about"
        }
      ]
    },
    {
      id: "contatti",
      title: "Contatti Rapidi",
      slug: "/contatti",
      icon: "add_call",
      subtitle: "Trovarti è un attimo",
      sections: [
        {
          id: "contact_info",
          title: "Richiedi un Sopralluogo Gratuito",
          description: "Manda le foto del tuo spazio o del mobile da restaurare via WhatsApp!",
          type: "contact",
          contentItems: [
            { title: "Laboratorio", subtitle: "Via della Manna 8, Bologna", icon: "location_on" },
            { title: "WhatsApp Diretto", subtitle: "Invia foto e misure per un preventivo indicativo in 1 ora", icon: "chat" }
          ]
        }
      ]
    }
  ]
};
