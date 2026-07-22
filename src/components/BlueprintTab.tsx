import React, { useState } from 'react';
import {
  Globe,
  ChevronDown,
  Home as HomeIcon,
  ClipboardList,
  User,
  PhoneCall,
  ShieldCheck,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Headphones,
  Eye,
  ExternalLink,
  MessageCircle,
  Clock,
  MapPin,
  Save,
  Download,
  Key,
  FileCode,
  Bot,
  Sliders,
  Search,
  Image as ImageIcon,
  Wand2,
  RefreshCw,
  Check,
  Copy,
  Ratio,
  Layers,
  ArrowRight,
  Camera,
  HelpCircle,
  X,
  Lightbulb,
  CheckCircle2,
  Building2,
  Phone,
  FileText,
  Upload
} from 'lucide-react';
import { WebsiteBlueprint, SitePage } from '../types';
import { ExportGuideModal } from './ExportGuideModal';

export interface SeoHelpItem {
  fieldTitle: string;
  googleImpact: 'Critico' | 'Molto Alto' | 'Alto';
  explanation: string;
  bestPractices: string[];
  example: string;
}

export const seoHelpDictionary: Record<string, SeoHelpItem> = {
  businessName: {
    fieldTitle: 'Nome Attività & Brand Keyword',
    googleImpact: 'Critico',
    explanation: 'Il nome della tua attività viene inserito nel tag <title> HTML principale e rappresenta il fattore di ranking n.1 per la scheda Google Maps.',
    bestPractices: [
      'Includi il settore o servizio chiave se naturale (es: "Pizzeria Cavour" o "Studio Legale Rossi")',
      'Mantieni il brand facilmente memorizzabile dagli utenti',
      'Usa la stessa dicitura della tua insegna fisica su strada per evitare difformità NAP'
    ],
    example: 'Pizzeria Al Taglio Cavour Milano'
  },
  city: {
    fieldTitle: 'Città / Località Target SEO',
    googleImpact: 'Critico',
    explanation: 'Definisce il centro geografico per le ricerche "vicino a me" (Local Pack di Google Maps) effettuate da smartphone nelle vicinanze.',
    bestPractices: [
      'Scegli il comune principale e, se rilevante, il quartiere di riferimento',
      'Fondamentale per apparire nei primi 3 risultati di Google Maps',
      'Genera i dati strutturati Schema.org LocalBusiness per i crawler Google'
    ],
    example: 'Milano (Zona Brera / Centro)'
  },
  tagline: {
    fieldTitle: 'Slogan & Descrizione Hero SEO',
    googleImpact: 'Molto Alto',
    explanation: 'Definisce la tua proposta di valore e viene impiegata da Google come Meta Description di anteprima nei risultati di ricerca.',
    bestPractices: [
      'Scrivi tra 60 e 120 caratteri spiegando i vantaggi principali del tuo locale/studio',
      'Includi le parole chiave dei tuoi prodotti di punta',
      'Incentiva il click grazie a chiamate all\'azione chiare (aumenta il CTR del 25%)'
    ],
    example: 'Pizza al taglio lievitata 48h con ingredienti bio. Asporto e consegne a domicilio a Milano.'
  },
  whatsapp: {
    fieldTitle: 'Telefono & WhatsApp Direct',
    googleImpact: 'Alto',
    explanation: 'Google misura la facilità di contatto per valutare l\'affidabilità (E-E-A-T) del sito e premia le Web App che azzerano la frequenza di rimbalzo.',
    bestPractices: [
      'Inserisci il prefisso internazionale (es: +39 340 1234567)',
      'Il pulsante WhatsApp in evidenza aumenta le conversioni immediate del 40%',
      'Permette ai clienti di prenotare in un tap da mobile'
    ],
    example: '+39 340 1234567'
  },
  address: {
    fieldTitle: 'Indirizzo Sede Fisico (NAP)',
    googleImpact: 'Critico',
    explanation: 'La perfetta corrispondenza NAP (Name, Address, Phone) tra sito web e scheda Google Business evita penalizzazioni e aumenta la fiducia.',
    bestPractices: [
      'Scrivi indirizzo completo: Via/Piazza, Numero Civico, CAP e Città',
      'Consente agli utenti di avviare il navigatore Google Maps al volo',
      'Rafforza la geolocalizzazione nel raggio di 5-10 km dalla tua sede'
    ],
    example: 'Via Camillo Cavour 14, 20121 Milano'
  },
  pageTitle: {
    fieldTitle: 'Titoli Pagine (Tag H1 HTML)',
    googleImpact: 'Molto Alto',
    explanation: 'I titoli delle pagine diventano i tag H1 letti dai motori di ricerca per indicizzare la struttura e i servizi del tuo sito.',
    bestPractices: [
      'Usa nomi descrittivi ed espliciti (es: "Menù & Listino" al posto di "Cose")',
      'Includi le parole chiave cercate dai clienti su Google',
      'Assicura una navigazione chiara e immediata per chi sfoglia lo smartphone'
    ],
    example: 'Menù Pizze & Birre Artigianali'
  },
  imagePrompt: {
    fieldTitle: 'Immagini Originali Generate con IA',
    googleImpact: 'Alto',
    explanation: 'Fotografie uniche ad alta risoluzione aumentano il tempo di permanenza sul sito (Dwell Time), segnale chiave dell\'algoritmo Google Helpful Content.',
    bestPractices: [
      'Evita immagini di stock generiche usate da concorrenti',
      'Descrivi un ambiente accogliente, la luce e i dettagli dei prodotti',
      'Immagini d\'impatto riducono la frequenza di abbandono del sito'
    ],
    example: 'Interno di calda pizzeria artigianale italiana, forno a legna di mattoni, pizza fumante appena sfornata'
  }
};

interface BlueprintTabProps {
  blueprint: WebsiteBlueprint;
  onUpdateBlueprint: (updated: WebsiteBlueprint) => void;
  onOpenDesignerModal: () => void;
  onOpenFullscreen: () => void;
  onOpenChatModal?: () => void;
  onOpenModelingStudio?: () => void;
  onOpenSeoModal?: () => void;
  onOpenProDashboard?: () => void;
  isProUnlocked?: boolean;
}

export const BlueprintTab: React.FC<BlueprintTabProps> = ({
  blueprint,
  onUpdateBlueprint,
  onOpenDesignerModal,
  onOpenFullscreen,
  onOpenChatModal,
  onOpenModelingStudio,
  onOpenSeoModal,
  onOpenProDashboard,
  isProUnlocked = false,
}) => {
  const [openPageId, setOpenPageId] = useState<string>('home');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeSeoHelp, setActiveSeoHelp] = useState<SeoHelpItem | null>(null);

  // AI Copywriter State
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copyAppliedNotice, setCopyAppliedNotice] = useState<string | null>(null);

  // AI Image Studio State
  const defaultPrompt = `Interno elegante di ${blueprint.businessName || 'attività'}, arredo professionale, luce naturale e atmosfera calda e accogliente, fotorealistico 8k`;
  const [imagePrompt, setImagePrompt] = useState<string>(defaultPrompt);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentGeneratedImage, setCurrentGeneratedImage] = useState<string | null>(null);
  const [imageSourceLabel, setImageSourceLabel] = useState<string | null>(null);
  const [imageAppliedNotice, setImageAppliedNotice] = useState<string | null>(null);
  const [generatedHistory, setGeneratedHistory] = useState<string[]>([]);

  // User Product Photos Upload State
  const [userUploadedPhotos, setUserUploadedPhotos] = useState<string[]>([]);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Category Preset Prompts
  const presetPrompts = [
    {
      label: '🎨 Bottega / Artigiano',
      prompt: 'Laboratorio artigianale di falegnameria e design, tavolo da lavoro in legno con utensili tradizionali, luce calda e atmosfera autentica'
    },
    {
      label: '👔 Studio / Consulente',
      prompt: 'Ufficio direzionale moderno ed elegante, tavolo da riunione in vetro, grande vetrata luminosa con vista città, arredo minimal'
    },
    {
      label: '🍕 Pizzeria / Ristorante',
      prompt: 'Pizzeria artigianale italiana con grande forno a legna in mattoni, pizze fragranti appena sfornate e ambiente conviviale'
    },
    {
      label: '🛍️ Boutique / Negozio',
      prompt: 'Boutique di abbigliamento e articoli regalo elegante, scaffali in legno chiaro ben illuminati, esposizione curata'
    },
    {
      label: '💆 Estetica & Wellness',
      prompt: 'Centro estetico e SPA di lusso con candele, essenze profumate, asciugamani morbidi e atmosfera di totale relax'
    },
    {
      label: '🏠 Ristrutturazioni & Casa',
      prompt: 'Interno di appartamento moderno appena ristrutturato con soggiorno open space, cucina di design e rifiniture di pregio'
    }
  ];

  const handleGenerateImage = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || imagePrompt;
    setIsGeneratingImage(true);
    setImageAppliedNotice(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          businessType: blueprint.businessName,
          category: blueprint.category,
          aspectRatio: selectedAspectRatio,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCurrentGeneratedImage(data.imageUrl);
        setImageSourceLabel(data.source === 'imagen-3' ? 'Imagen 3 AI' : 'Libreria Professionale HD');
        setGeneratedHistory((prev) => [data.imageUrl, ...prev.filter((img) => img !== data.imageUrl)].slice(0, 6));
      }
    } catch (e) {
      console.error('Error generating image:', e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    setCopyAppliedNotice(null);

    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: blueprint.businessName,
          category: blueprint.category,
          city: blueprint.city,
          tagline: blueprint.tagline,
        }),
      });

      const data = await res.json();
      if (data.success && data.copy) {
        const { aboutTitle, aboutDescription, servicesTitle, servicesDescription, servicesItems, tagline } = data.copy;

        const updatedPages = blueprint.pages.map((page) => {
          const updatedSections = page.sections.map((sec) => {
            const secTitleLower = sec.title.toLowerCase();
            const isAboutSection = sec.type === 'about' || secTitleLower.includes('chi siamo') || secTitleLower.includes('about') || secTitleLower.includes('chi ');
            const isServicesSection = sec.type === 'services' || secTitleLower.includes('serviz') || secTitleLower.includes('cosa facciamo') || secTitleLower.includes('prodott');

            if (isAboutSection) {
              return {
                ...sec,
                title: aboutTitle || sec.title,
                description: aboutDescription || sec.description,
              };
            }

            if (isServicesSection) {
              return {
                ...sec,
                title: servicesTitle || sec.title,
                description: servicesDescription || sec.description,
                contentItems: (servicesItems && servicesItems.length > 0) ? servicesItems : sec.contentItems,
              };
            }

            return sec;
          });

          return { ...page, sections: updatedSections };
        });

        onUpdateBlueprint({
          ...blueprint,
          tagline: tagline || blueprint.tagline,
          pages: updatedPages,
        });

        setCopyAppliedNotice(`Testi persuasivi per 'Chi Siamo' e 'Servizi' generati con successo per '${blueprint.category || 'attività'}'!`);
        setTimeout(() => setCopyAppliedNotice(null), 5000);
      }
    } catch (e) {
      console.error('Error generating copy:', e);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleApplyToHero = (imgUrl: string) => {
    onUpdateBlueprint({
      ...blueprint,
      heroImageUrl: imgUrl,
    });
    setImageAppliedNotice('Immagine applicata con successo alla copertina Hero della tua Web App!');
    setTimeout(() => setImageAppliedNotice(null), 4000);
  };

  const toggleAccordion = (pageId: string) => {
    setOpenPageId(openPageId === pageId ? '' : pageId);
  };

  const handleUpdatePageTitle = (pageId: string, newTitle: string) => {
    const updatedPages = blueprint.pages.map((p) =>
      p.id === pageId ? { ...p, title: newTitle } : p
    );
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  const handleUpdateItemPrice = (
    pageId: string,
    sectionId: string,
    itemIdx: number,
    newPrice: string
  ) => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== pageId) return p;
      const updatedSections = p.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.contentItems) return sec;
        const updatedItems = [...sec.contentItems];
        updatedItems[itemIdx] = { ...updatedItems[itemIdx], price: newPrice };
        return { ...sec, contentItems: updatedItems };
      });
      return { ...p, sections: updatedSections };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  const handleAddItem = (pageId: string, sectionId: string) => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== pageId) return p;
      const updatedSections = p.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const items = sec.contentItems || [];
        return {
          ...sec,
          contentItems: [
            ...items,
            { title: "Nuovo Servizio / Prodotto", subtitle: "Descrizione dettagliata", price: "€ 15.00" },
          ],
        };
      });
      return { ...p, sections: updatedSections };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  const handleUpdateItemImage = (
    pageId: string,
    sectionId: string,
    itemIdx: number,
    imageUrl: string
  ) => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== pageId) return p;
      const updatedSections = p.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.contentItems) return sec;
        const updatedItems = [...sec.contentItems];
        updatedItems[itemIdx] = { ...updatedItems[itemIdx], image: imageUrl };
        return { ...sec, contentItems: updatedItems };
      });
      return { ...p, sections: updatedSections };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  const handleUpdateItemTitle = (
    pageId: string,
    sectionId: string,
    itemIdx: number,
    newTitle: string
  ) => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== pageId) return p;
      const updatedSections = p.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.contentItems) return sec;
        const updatedItems = [...sec.contentItems];
        updatedItems[itemIdx] = { ...updatedItems[itemIdx], title: newTitle };
        return { ...sec, contentItems: updatedItems };
      });
      return { ...p, sections: updatedSections };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  const handleUpdateItemSubtitle = (
    pageId: string,
    sectionId: string,
    itemIdx: number,
    newSubtitle: string
  ) => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== pageId) return p;
      const updatedSections = p.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.contentItems) return sec;
        const updatedItems = [...sec.contentItems];
        updatedItems[itemIdx] = { ...updatedItems[itemIdx], subtitle: newSubtitle };
        return { ...sec, contentItems: updatedItems };
      });
      return { ...p, sections: updatedSections };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  const handleDeleteItem = (
    pageId: string,
    sectionId: string,
    itemIdx: number
  ) => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== pageId) return p;
      const updatedSections = p.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.contentItems) return sec;
        const updatedItems = sec.contentItems.filter((_, idx) => idx !== itemIdx);
        return { ...sec, contentItems: updatedItems };
      });
      return { ...p, sections: updatedSections };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  // Multiple File Upload Handler (JPG, JPEG, PNG, WEBP)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );

    if (validFiles.length === 0) {
      setUploadNotice('Per favore seleziona file immagine in formato JPG, JPEG, PNG o WEBP.');
      setTimeout(() => setUploadNotice(null), 4000);
      return;
    }

    let loadedCount = 0;
    const newPhotos: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          newPhotos.push(resultUrl);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setUserUploadedPhotos((prev) => [...newPhotos, ...prev]);
          setGeneratedHistory((prev) => [...newPhotos, ...prev].slice(0, 12));
          setUploadNotice(`Caricate con successo ${newPhotos.length} foto in formato JPG!`);
          setTimeout(() => setUploadNotice(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Direct Product Item Photo Upload
  const handleUploadItemPhotoDirect = (
    pageId: string,
    sectionId: string,
    itemIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      alert('Formato non supportato. Carica un file immagine in formato .jpg, .jpeg, .png o .webp.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const resultUrl = event.target.result as string;
        handleUpdateItemImage(pageId, sectionId, itemIdx, resultUrl);
        setUserUploadedPhotos((prev) => [resultUrl, ...prev.filter(p => p !== resultUrl)]);
        setGeneratedHistory((prev) => [resultUrl, ...prev.filter(p => p !== resultUrl)]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAssignPhotoToProduct = (photoUrl: string, targetValue: string) => {
    if (!targetValue) return;
    const [pageId, sectionId, itemIdxStr] = targetValue.split('|');
    const itemIdx = parseInt(itemIdxStr, 10);
    if (!isNaN(itemIdx)) {
      handleUpdateItemImage(pageId, sectionId, itemIdx, photoUrl);
      setUploadNotice('Foto JPG assegnata con successo al prodotto selezionato!');
      setTimeout(() => setUploadNotice(null), 3000);
    }
  };

  const handleDeleteUserPhoto = (photoUrl: string) => {
    setUserUploadedPhotos((prev) => prev.filter(p => p !== photoUrl));
    setGeneratedHistory((prev) => prev.filter(p => p !== photoUrl));
  };

  const getIconForPage = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <HomeIcon className="w-5 h-5 text-[#10b981]" />;
      case 'list_alt':
        return <ClipboardList className="w-5 h-5 text-[#10b981]" />;
      case 'person':
        return <User className="w-5 h-5 text-[#10b981]" />;
      case 'add_call':
      case 'contact':
        return <PhoneCall className="w-5 h-5 text-[#10b981]" />;
      default:
        return <Globe className="w-5 h-5 text-[#10b981]" />;
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      {/* Step Progress Chip */}
      <div className="bg-[#1c1c1a] p-3 rounded-2xl border border-[#3c4a42]/30 space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-semibold text-[#10b981]">Passo 3 di 3</span>
          <span className="text-xs text-[#bbcabf]">La Tua Web App Mobile First</span>
        </div>
        <div className="h-2.5 w-full bg-[#2a2a28] rounded-full overflow-hidden">
          <div className="h-full bg-[#10b981] w-full transition-all duration-700 ease-out" />
        </div>
      </div>

      {/* Header Section */}
      <section className="space-y-1">
        <h2 className="text-xl font-bold text-[#e5e2df]">Struttura della tua Web App Mobile First</h2>
        <p className="text-xs text-[#bbcabf] leading-relaxed">
          Abbiamo generato la bozza su misura per <strong>{blueprint.businessName}</strong> a {blueprint.city}.
        </p>
      </section>

      {/* Quick Launch Copilota, Studio & SEO Action Bar */}
      <div className="grid grid-cols-3 gap-2">
        {onOpenChatModal && (
          <button
            onClick={onOpenChatModal}
            className="p-3 bg-[#6700c9] hover:bg-[#5800ac] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <Bot className="w-4 h-4 text-[#cfacff]" />
            <span>Copilota</span>
          </button>
        )}

        {onOpenModelingStudio && (
          <button
            onClick={onOpenModelingStudio}
            className="p-3 bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/60 text-[#10b981] rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <Sliders className="w-4 h-4" />
            <span>Studio</span>
          </button>
        )}

        {onOpenSeoModal && (
          <button
            onClick={onOpenSeoModal}
            className="p-3 bg-[#0e0e0d] hover:bg-[#1c1c1a] border border-[#3c4a42] text-[#35dec1] rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>SEO Meta</span>
          </button>
        )}
      </div>

      {/* Garanzia Facilissimo Badge Card */}
      <div className="bg-[#6700c9]/10 border-2 border-[#6700c9]/30 rounded-2xl p-4 text-center space-y-2 shadow-md">
        <div className="flex items-center justify-center gap-1.5 text-[#cfacff]">
          <ShieldCheck className="w-5 h-5 text-[#35dec1]" />
          <span className="text-xs font-bold uppercase tracking-wider">Garanzia Facilissimo Web App</span>
        </div>
        <p className="text-sm font-semibold text-[#e5e2df]">
          100% Mobile First • WhatsApp e Prenotazioni • Pronta in 48h
        </p>
      </div>

      {/* Informazioni Attività & Indicizzazione SEO Card */}
      <section className="bg-[#1c1c1a] border border-[#3c4a42]/60 rounded-2xl p-4 space-y-4 shadow-md text-left">
        <div className="flex items-center justify-between border-b border-[#3c4a42]/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Campi Blueprint & Ranking Google</span>
                <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#10b981]/40">
                  Guida SEO
                </span>
              </h3>
              <p className="text-[11px] text-[#bbcabf]">
                Clicca sugli indicatori <span className="text-[#10b981] font-bold">SEO Help (?)</span> per scoprire le regole d'oro per scalare le ricerche Google.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Business Name Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#e5e2df] flex items-center gap-1">
                <span>Nome Attività / Brand</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveSeoHelp(seoHelpDictionary.businessName)}
                className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
                title="Consigli SEO Google per il Nome Attività"
              >
                <HelpCircle className="w-3 h-3 text-[#10b981]" />
                <span>SEO Help</span>
              </button>
            </div>
            <input
              type="text"
              value={blueprint.businessName}
              onChange={(e) => onUpdateBlueprint({ ...blueprint, businessName: e.target.value })}
              className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#10b981] transition-all"
              placeholder="Es: Pizzeria Cavour"
            />
          </div>

          {/* City Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#e5e2df] flex items-center gap-1">
                <span>Città / Località Target SEO</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveSeoHelp(seoHelpDictionary.city)}
                className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
                title="Consigli SEO Google per la Localizzazione"
              >
                <HelpCircle className="w-3 h-3 text-[#10b981]" />
                <span>SEO Help</span>
              </button>
            </div>
            <input
              type="text"
              value={blueprint.city}
              onChange={(e) => onUpdateBlueprint({ ...blueprint, city: e.target.value })}
              className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#10b981] transition-all"
              placeholder="Es: Milano"
            />
          </div>

          {/* Tagline Input */}
          <div className="space-y-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#e5e2df] flex items-center gap-1">
                <span>Slogan & Descrizione Hero (Meta Tag)</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveSeoHelp(seoHelpDictionary.tagline)}
                className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
                title="Consigli SEO Google per lo Slogan"
              >
                <HelpCircle className="w-3 h-3 text-[#10b981]" />
                <span>SEO Help</span>
              </button>
            </div>
            <input
              type="text"
              value={blueprint.tagline}
              onChange={(e) => onUpdateBlueprint({ ...blueprint, tagline: e.target.value })}
              className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#10b981] transition-all"
              placeholder="Es: Pizza al taglio lievitata 48h con ingredienti bio..."
            />
          </div>

          {/* WhatsApp / Phone Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#e5e2df] flex items-center gap-1">
                <span>Telefono & WhatsApp Direct</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveSeoHelp(seoHelpDictionary.whatsapp)}
                className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
                title="Consigli SEO Google per il Contatto WhatsApp"
              >
                <HelpCircle className="w-3 h-3 text-[#10b981]" />
                <span>SEO Help</span>
              </button>
            </div>
            <input
              type="text"
              value={blueprint.whatsapp}
              onChange={(e) => onUpdateBlueprint({ ...blueprint, whatsapp: e.target.value })}
              className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#10b981] transition-all"
              placeholder="Es: +39 340 1234567"
            />
          </div>

          {/* Address Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#e5e2df] flex items-center gap-1">
                <span>Indirizzo Sede Fisico (NAP)</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveSeoHelp(seoHelpDictionary.address)}
                className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
                title="Consigli SEO Google per l'Indirizzo"
              >
                <HelpCircle className="w-3 h-3 text-[#10b981]" />
                <span>SEO Help</span>
              </button>
            </div>
            <input
              type="text"
              value={blueprint.address}
              onChange={(e) => onUpdateBlueprint({ ...blueprint, address: e.target.value })}
              className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#10b981] transition-all"
              placeholder="Es: Via Camillo Cavour 14, Milano"
            />
          </div>
        </div>
      </section>

      {/* AI Text Copywriter Banner & Action */}
      <section className="bg-[#1c1c1a] border-2 border-[#6700c9]/50 rounded-2xl p-4 space-y-3 shadow-xl relative overflow-hidden text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6700c9]/20 text-[#a855f7] flex items-center justify-center shrink-0 border border-[#6700c9]/40">
              <Sparkles className="w-5 h-5 animate-pulse text-[#35dec1]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Generatore Testi IA per Chi Siamo & Servizi</span>
                <span className="bg-[#6700c9]/30 text-[#35dec1] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#6700c9]/50">
                  Scrittura IA
                </span>
              </h3>
              <p className="text-[11px] text-[#bbcabf]">
                Scrivi automaticamente i contenuti per 'Chi Siamo' e 'Servizi' su misura per <span className="text-white font-bold">{blueprint.businessName || 'la tua attività'}</span> (Categoria: <span className="text-[#35dec1] font-bold">{blueprint.category || 'Generale'}</span>).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateCopy}
            disabled={isGeneratingCopy}
            className="px-4 py-2.5 bg-gradient-to-r from-[#6700c9] to-[#8b5cf6] hover:from-[#5800ac] hover:to-[#7c3aed] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#6700c9]/30 shrink-0 disabled:opacity-60"
          >
            {isGeneratingCopy ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generazione Testi in corso...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-[#35dec1]" />
                <span>Genera Testi con IA</span>
              </>
            )}
          </button>
        </div>

        {copyAppliedNotice && (
          <div className="p-2.5 rounded-xl bg-[#6700c9]/20 border border-[#6700c9]/50 text-[#35dec1] text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle className="w-4 h-4 text-[#35dec1] shrink-0" />
            <span>{copyAppliedNotice}</span>
          </div>
        )}
      </section>

      {/* Interactive Site Outline (Page Accordions) */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-[#86948a] uppercase tracking-widest block">
          Pagine della Web App ({blueprint.pages.length})
        </h3>

        <div className="space-y-3">
          {blueprint.pages.map((page) => {
            const isOpen = openPageId === page.id;
            return (
              <div
                key={page.id}
                className="bg-[#1c1c1a] rounded-2xl border border-[#3c4a42]/40 overflow-hidden shadow-sm transition-all"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(page.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#2a2a28]/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2a2a28] flex items-center justify-center shrink-0">
                      {getIconForPage(page.icon)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#e5e2df] block">{page.title}</span>
                      <span className="text-xs text-[#bbcabf]">{page.subtitle}</span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#86948a] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#10b981]' : ''
                    }`}
                  />
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="bg-[#0e0e0d] p-4 border-t border-[#3c4a42]/30 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    {/* Editable Page Title with SEO Help */}
                    <div className="p-3 bg-[#1c1c1a] rounded-xl border border-[#3c4a42]/40 space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#10b981] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#10b981]" />
                          <span>Titolo Pagina (Tag H1 HTML):</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveSeoHelp(seoHelpDictionary.pageTitle)}
                          className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
                          title="Consigli SEO Google per i Titoli Pagina"
                        >
                          <HelpCircle className="w-3 h-3 text-[#10b981]" />
                          <span>SEO Help</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => handleUpdatePageTitle(page.id, e.target.value)}
                        className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#10b981]"
                        placeholder="Es: Menù & Listino Prezzi"
                      />
                    </div>

                    {page.sections.map((sec) => (
                      <div key={sec.id} className="space-y-3 bg-[#1c1c1a]/80 p-3.5 rounded-xl border border-[#3c4a42]/20">
                        <div>
                          <h4 className="text-xs font-bold text-[#10b981] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{sec.title}</span>
                          </h4>
                          <p className="text-[11px] text-[#bbcabf] mt-0.5">{sec.description}</p>
                        </div>

                        {/* Content items if present */}
                        {sec.contentItems && sec.contentItems.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {sec.contentItems.map((item, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="p-3 rounded-xl bg-[#2a2a28] space-y-2 text-xs border border-[#3c4a42]/40 shadow-sm"
                              >
                                <div className="flex items-start gap-2.5">
                                  {/* Product JPG Photo Thumbnail / Upload Trigger */}
                                  <div className="shrink-0">
                                    {item.image ? (
                                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#10b981]/60 relative group">
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateItemImage(page.id, sec.id, itemIdx, '')}
                                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-rose-400"
                                          title="Rimuovi Foto Prodotto"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <label
                                        className="w-12 h-12 rounded-lg border border-dashed border-[#10b981]/50 hover:border-[#10b981] bg-[#1c1c1a] hover:bg-[#10b981]/10 flex flex-col items-center justify-center text-[#10b981] cursor-pointer transition-all p-1 text-center"
                                        title="Carica Foto JPG per questo Prodotto"
                                      >
                                        <Camera className="w-4 h-4 mb-0.5" />
                                        <span className="text-[8px] font-extrabold uppercase">Foto JPG</span>
                                        <input
                                          type="file"
                                          accept="image/jpeg,image/jpg,image/png,image/webp"
                                          onChange={(e) => handleUploadItemPhotoDirect(page.id, sec.id, itemIdx, e)}
                                          className="hidden"
                                        />
                                      </label>
                                    )}
                                  </div>

                                  {/* Title & Subtitle Inputs */}
                                  <div className="flex-1 space-y-1 min-w-0">
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => handleUpdateItemTitle(page.id, sec.id, itemIdx, e.target.value)}
                                      className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-[#10b981]"
                                      placeholder="Nome Prodotto / Servizio"
                                    />
                                    <input
                                      type="text"
                                      value={item.subtitle || ''}
                                      onChange={(e) => handleUpdateItemSubtitle(page.id, sec.id, itemIdx, e.target.value)}
                                      className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-lg px-2 py-1 text-[11px] text-[#bbcabf] focus:outline-none focus:border-[#10b981]"
                                      placeholder="Descrizione o ingredienti..."
                                    />
                                  </div>

                                  {/* Price & Delete Button */}
                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                    {item.price !== undefined && (
                                      <input
                                        type="text"
                                        value={item.price}
                                        onChange={(e) => handleUpdateItemPrice(page.id, sec.id, itemIdx, e.target.value)}
                                        className="w-20 bg-[#1c1c1a] border border-[#3c4a42] rounded-lg px-2 py-1 text-right text-xs font-bold text-[#10b981] focus:outline-none focus:border-[#10b981]"
                                        placeholder="€ 0.00"
                                      />
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteItem(page.id, sec.id, itemIdx)}
                                      className="p-1 rounded text-gray-500 hover:text-rose-400 transition-colors"
                                      title="Elimina Prodotto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Pick from uploaded gallery photos */}
                                {userUploadedPhotos.length > 0 && !item.image && (
                                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5 text-[10px]">
                                    <span className="text-[#bbcabf] font-semibold">Scegli da foto caricate:</span>
                                    <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5">
                                      {userUploadedPhotos.map((photo, pIdx) => (
                                        <button
                                          key={pIdx}
                                          type="button"
                                          onClick={() => handleUpdateItemImage(page.id, sec.id, itemIdx, photo)}
                                          className="w-6 h-6 rounded overflow-hidden border border-white/20 hover:border-[#10b981] shrink-0 active:scale-95 transition-all"
                                          title="Assegna questa foto JPG"
                                        >
                                          <img src={photo} alt="Foto JPG" className="w-full h-full object-cover" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => handleAddItem(page.id, sec.id)}
                              className="w-full py-2 border border-dashed border-[#3c4a42] rounded-lg text-xs text-[#35dec1] hover:bg-[#35dec1]/10 transition-colors flex items-center justify-center gap-1 font-medium mt-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Aggiungi Voce o Prodotto</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Caricamento Foto Prodotti Utente (JPG / PNG) */}
      <section className="bg-[#1c1c1a] border border-[#3c4a42] rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#35dec1]/20 text-[#35dec1] flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Caricamento Foto Prodotti (JPG / PNG)</span>
                <span className="bg-[#35dec1]/20 text-[#35dec1] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#35dec1]/40">
                  Importazione Foto
                </span>
              </h3>
              <p className="text-[11px] text-[#bbcabf]">
                Carica le tue foto reali in formato JPG/PNG per il menù, il listino o la copertina
              </p>
            </div>
          </div>
        </div>

        {uploadNotice && (
          <div className="p-3 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadNotice}</span>
          </div>
        )}

        {/* Dropzone & File Input */}
        <label className="border-2 border-dashed border-[#3c4a42] hover:border-[#35dec1] bg-[#131312] hover:bg-[#35dec1]/5 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
          <div className="w-12 h-12 rounded-full bg-[#2a2a28] group-hover:bg-[#35dec1]/20 group-hover:scale-110 transition-all flex items-center justify-center text-[#35dec1] mb-2">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white mb-1">
            Trascina qui le tue foto prodotto o <span className="text-[#35dec1] underline">Sfoglia File</span>
          </span>
          <span className="text-[10px] text-[#86948a]">
            Supporta file in formato .jpg, .jpeg, .png e .webp (caricamento multiplo)
          </span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Gallery of Uploaded Photos with Product Assignment */}
        {userUploadedPhotos.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#3c4a42]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#86948a] uppercase tracking-wider block">
                Le tue Foto Caricate ({userUploadedPhotos.length}):
              </span>
              <span className="text-[10px] text-[#bbcabf]">Assegna subito alle voci del listino</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userUploadedPhotos.map((photo, idx) => (
                <div key={idx} className="bg-[#2a2a28] rounded-xl p-2 border border-[#3c4a42]/50 space-y-2 group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40">
                    <img src={photo} alt={`Foto Utente ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteUserPhoto(photo)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Elimina Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-emerald-400 text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                      JPG Utente
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleApplyToHero(photo)}
                      className="w-full py-1 rounded-lg bg-[#3c4a42] hover:bg-[#10b981] text-white font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Applica a Copertina</span>
                    </button>

                    {/* Dropdown to assign photo to product */}
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        handleAssignPhotoToProduct(photo, e.target.value);
                        e.target.value = '';
                      }}
                      className="w-full bg-[#1c1c1a] border border-[#3c4a42] text-[#bbcabf] hover:text-white rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-[#10b981]"
                    >
                      <option value="" disabled>➡️ Assegna a Prodotto...</option>
                      {blueprint.pages.flatMap((page) =>
                        page.sections.flatMap((sec) =>
                          (sec.contentItems || []).map((item, itemIdx) => (
                            <option key={`${page.id}|${sec.id}|${itemIdx}`} value={`${page.id}|${sec.id}|${itemIdx}`}>
                              [{page.title}] {item.title} ({item.price || 'Senza prezzo'})
                            </option>
                          ))
                        )
                      )}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* AI Image Studio & Professional Placeholder Generator */}
      <section className="bg-[#1c1c1a] border-2 border-[#10b981]/50 rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Studio Generazione Foto AI</span>
                <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#10b981]/40">
                  IA Generativa
                </span>
              </h3>
              <p className="text-[11px] text-[#bbcabf]">
                Crea foto professionali su misura per {blueprint.businessName || 'la tua attività'} e scambiale nel design
              </p>
            </div>
          </div>
        </div>

        {/* Category Preset Prompt Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#86948a] uppercase tracking-wider block">
            Ispirazioni & Prompt Pronti per la Categoria:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {presetPrompts.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setImagePrompt(preset.prompt);
                  handleGenerateImage(preset.prompt);
                }}
                className="px-2.5 py-1 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-[11px] text-[#e5e2df] font-semibold whitespace-nowrap transition-all border border-white/5 active:scale-95"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input & Controls */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#e5e2df] flex items-center gap-1">
              <span>Descrizione Immagine IA Desiderata:</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveSeoHelp(seoHelpDictionary.imagePrompt)}
              className="px-2 py-0.5 rounded-full bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981]/40 text-[#10b981] font-extrabold text-[10px] flex items-center gap-1 transition-all active:scale-95"
              title="Consigli SEO Google per l'impatto visivo"
            >
              <HelpCircle className="w-3 h-3 text-[#10b981]" />
              <span>SEO Help</span>
            </button>
          </div>
          <div className="relative">
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={2}
              placeholder="Descrivi l'immagine che desideri generare..."
              className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl p-2.5 text-xs text-[#e5e2df] focus:outline-none focus:border-[#10b981] transition-all resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-1 bg-[#0e0e0d] p-1 rounded-xl border border-[#3c4a42]/40 text-[11px]">
              <Ratio className="w-3.5 h-3.5 text-[#10b981] ml-1.5" />
              {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setSelectedAspectRatio(ratio)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    selectedAspectRatio === ratio
                      ? 'bg-[#10b981] text-[#003824]'
                      : 'text-[#bbcabf] hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Generate Action Button */}
            <button
              onClick={() => handleGenerateImage()}
              disabled={isGeneratingImage || !imagePrompt.trim()}
              className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-[#003824] rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-[#10b981]/20"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generazione in corso...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Genera Foto con IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Image Result Card */}
        {currentGeneratedImage && (
          <div className="space-y-2 pt-2 border-t border-[#3c4a42]/40 animate-in fade-in duration-300">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#10b981]/40 shadow-lg group">
              <img
                src={currentGeneratedImage}
                alt="Immagine Generata"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-[#10b981] flex items-center gap-1 border border-[#10b981]/30">
                <Sparkles className="w-3 h-3 text-[#35dec1]" />
                <span>{imageSourceLabel || 'Generato con IA'}</span>
              </div>

              {/* Quick Swap Overlay Button */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <button
                  onClick={() => handleApplyToHero(currentGeneratedImage)}
                  className="px-4 py-2.5 rounded-full bg-[#10b981] text-[#003824] font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Sostituisci subito in Copertina Hero</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handleApplyToHero(currentGeneratedImage)}
                className="flex-1 py-2 rounded-xl bg-[#10b981]/20 border border-[#10b981]/60 text-[#10b981] hover:bg-[#10b981]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-3 h-3" />
                <span>Applica a Copertina (Hero)</span>
              </button>

              <button
                onClick={() => handleGenerateImage()}
                disabled={isGeneratingImage}
                className="px-3 py-2 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-[#bbcabf] hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                <span>Rigenera</span>
              </button>
            </div>
          </div>
        )}

        {/* Notice Banner when Image is Applied */}
        {imageAppliedNotice && (
          <div className="p-2.5 rounded-xl bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle className="w-4 h-4 text-[#35dec1] shrink-0" />
            <span>{imageAppliedNotice}</span>
          </div>
        )}

        {/* History Gallery of Generated Images */}
        {generatedHistory.length > 0 && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold text-[#86948a] uppercase tracking-wider block">
              Galleria Immagini Create ({generatedHistory.length}):
            </span>
            <div className="grid grid-cols-4 gap-2">
              {generatedHistory.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentGeneratedImage(imgUrl);
                    handleApplyToHero(imgUrl);
                  }}
                  className={`relative aspect-video rounded-lg overflow-hidden border transition-all ${
                    blueprint.heroImageUrl === imgUrl
                      ? 'border-[#10b981] ring-2 ring-[#10b981]/40 scale-105'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Variante ${i + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {blueprint.heroImageUrl === imgUrl && (
                    <div className="absolute inset-0 bg-[#10b981]/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Preview Hero Mockup Image */}
      <section className="pt-2">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#3c4a42]/40">
          <img
            src={blueprint.heroImageUrl}
            alt="Anteprima"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <div>
              <span className="bg-[#10b981] text-[#003824] font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                Web App Mobile First
              </span>
              <p className="text-white font-bold text-sm mt-1">
                Layout responsive ottimizzato per smartphone iOS e Android
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bottom Sheet Controls */}
      <div className="bg-[#1c1c1a] rounded-2xl p-4 space-y-3 border border-[#3c4a42]/40 shadow-2xl">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="w-full h-14 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-[#10b981]/20"
        >
          <Download className="w-5 h-5" />
          <span>Scarica Prodotto Finale & Guida Messa On-Line</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenDesignerModal}
            className="h-12 bg-[#2a2a28] hover:bg-[#3c4a42] text-[#e5e2df] rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <Headphones className="w-4 h-4 text-[#10b981]" />
            <span>Designer Dedicato</span>
          </button>

          <button
            onClick={onOpenFullscreen}
            className="h-12 border border-[#6700c9] text-[#cfacff] hover:bg-[#6700c9]/20 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98"
          >
            <Eye className="w-4 h-4 text-[#35dec1]" />
            <span>Web App Live</span>
          </button>
        </div>
      </div>

      {/* SEO Help Mini-Dialog Modal */}
      {activeSeoHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1c1c1a] border border-[#10b981]/60 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative overflow-hidden text-left">
            {/* Top Background Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#10b981]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] flex items-center justify-center shrink-0 shadow-inner">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#10b981] tracking-wider">Algoritmo Google</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                        activeSeoHelp.googleImpact === 'Critico'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      Impatto {activeSeoHelp.googleImpact}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">{activeSeoHelp.fieldTitle}</h4>
                </div>
              </div>

              <button
                onClick={() => setActiveSeoHelp(null)}
                className="p-1.5 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-[#bbcabf] hover:text-white transition-all shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation Card */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1 text-xs leading-relaxed text-[#e5e2df]">
              <span className="font-bold text-[#10b981] block flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#35dec1]" />
                <span>Come funziona l'indicizzazione:</span>
              </span>
              <p className="text-[#bbcabf] text-[11px] leading-relaxed">{activeSeoHelp.explanation}</p>
            </div>

            {/* Best Practices */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                Regole d'Oro di Ottimizzazione:
              </span>
              <ul className="space-y-1.5">
                {activeSeoHelp.bestPractices.map((practice, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#bbcabf] text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Example */}
            {activeSeoHelp.example && (
              <div className="p-2.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-[#10b981] uppercase block">Esempio Ottimizzato:</span>
                <span className="text-white font-mono text-[11px] font-bold block">{activeSeoHelp.example}</span>
              </div>
            )}

            {/* Action Close Button */}
            <button
              onClick={() => setActiveSeoHelp(null)}
              className="w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-xl font-bold text-xs transition-all active:scale-98 shadow-md"
            >
              Ho Capito, Ottimizza Ora
            </button>
          </div>
        </div>
      )}

      {/* Export & Online Guide Modal */}
      {isExportModalOpen && (
        <ExportGuideModal
          blueprint={blueprint}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};
