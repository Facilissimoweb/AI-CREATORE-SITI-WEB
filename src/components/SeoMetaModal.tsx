import React, { useState } from 'react';
import {
  X,
  Search,
  Globe,
  Share2,
  Sparkles,
  Check,
  Save,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Code,
  Image as ImageIcon,
  Tag,
  Eye,
  SlidersHorizontal,
  Bot,
  Info
} from 'lucide-react';
import { WebsiteBlueprint, SeoMetadata } from '../types';

interface SeoMetaModalProps {
  blueprint: WebsiteBlueprint;
  onUpdateBlueprint: (updated: WebsiteBlueprint) => void;
  onClose: () => void;
}

export const SeoMetaModal: React.FC<SeoMetaModalProps> = ({
  blueprint,
  onUpdateBlueprint,
  onClose
}) => {
  const defaultMetaTitle = blueprint.seo?.metaTitle || `${blueprint.businessName} | ${blueprint.tagline || 'Sito Ufficiale e Prenotazioni'}`;
  const defaultMetaDesc = blueprint.seo?.metaDescription || `${blueprint.businessName} a ${blueprint.city}. ${blueprint.description || 'Scopri i nostri servizi, menù e prenota direttamente su WhatsApp.'}`;
  const defaultKeywords = blueprint.seo?.keywords || `${blueprint.businessName.toLowerCase()}, ${blueprint.categoryLabel.toLowerCase()}, ${blueprint.city.toLowerCase()}, whatsapp, prenotazioni, orari`;
  const defaultOgTitle = blueprint.seo?.ogTitle || defaultMetaTitle;
  const defaultOgDesc = blueprint.seo?.ogDescription || defaultMetaDesc;
  const defaultOgImage = blueprint.seo?.ogImage || blueprint.heroImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop';
  const defaultCanonical = blueprint.seo?.canonicalUrl || (typeof window !== 'undefined' ? `${window.location.origin}/site/${blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : `/site/${blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
  const defaultRobots = blueprint.seo?.robots || 'index, follow';
  const defaultFavicon = blueprint.seo?.faviconUrl || 'https://fav.farm/🚀';

  const [metaTitle, setMetaTitle] = useState(defaultMetaTitle);
  const [metaDescription, setMetaDescription] = useState(defaultMetaDesc);
  const [keywords, setKeywords] = useState(defaultKeywords);
  const [ogTitle, setOgTitle] = useState(defaultOgTitle);
  const [ogDescription, setOgDescription] = useState(defaultOgDesc);
  const [ogImage, setOgImage] = useState(defaultOgImage);
  const [canonicalUrl, setCanonicalUrl] = useState(defaultCanonical);
  const [robots, setRobots] = useState(defaultRobots);
  const [faviconUrl, setFaviconUrl] = useState(defaultFavicon);

  const [activeTab, setActiveTab] = useState<'meta' | 'og' | 'schema'>('meta');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Generate Structured Data (JSON-LD) for Search Engines
  const schemaJson = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': blueprint.category === 'ristorante' ? 'Restaurant' : 'LocalBusiness',
      name: blueprint.businessName,
      description: metaDescription,
      image: ogImage,
      telephone: blueprint.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: blueprint.city,
        streetAddress: blueprint.address || 'Via Principale'
      },
      url: canonicalUrl,
      openingHours: blueprint.openingHours || 'Mo-Su 09:00-20:00'
    },
    null,
    2
  );

  const handleAutoGenerateAiSeo = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const generatedTitle = `${blueprint.businessName} ${blueprint.city} • ${blueprint.categoryLabel} Ufficiale`;
      const generatedDesc = `Cerchi ${blueprint.categoryLabel.toLowerCase()} a ${blueprint.city}? ${blueprint.businessName}: ${blueprint.tagline}. Prenota ora ed invia un messaggio diretto su WhatsApp!`;
      const generatedKw = `${blueprint.businessName.toLowerCase()}, ${blueprint.categoryLabel.toLowerCase()} ${blueprint.city.toLowerCase()}, migliore ${blueprint.categoryLabel.toLowerCase()} ${blueprint.city.toLowerCase()}, contatti ${blueprint.businessName.toLowerCase()}, orari ${blueprint.businessName.toLowerCase()}`;

      setMetaTitle(generatedTitle);
      setMetaDescription(generatedDesc);
      setKeywords(generatedKw);
      setOgTitle(generatedTitle);
      setOgDescription(generatedDesc);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleSaveSeo = () => {
    const updatedSeo: SeoMetadata = {
      metaTitle,
      metaDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      canonicalUrl,
      robots,
      faviconUrl
    };

    onUpdateBlueprint({
      ...blueprint,
      seo: updatedSeo
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(schemaJson);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[800px] bg-[#1c1c1a] border border-[#3c4a42]/60 rounded-3xl p-4 sm:p-6 shadow-2xl text-[#e5e2df] relative max-h-[94vh] flex flex-col space-y-4 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#3c4a42]/40 pb-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center text-[#10b981] shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#e5e2df] flex items-center gap-2">
                <span>Impostazioni SEO & OpenGraph Meta Tags</span>
                <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full font-bold uppercase">
                  Google & Social Ready
                </span>
              </h3>
              <p className="text-xs text-[#bbcabf]">
                Ottimizza il posizionamento su Google e l'anteprima quando la tua Web App viene condivisa su WhatsApp e Social
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Generator Bar */}
        <div className="p-3 bg-[#6700c9]/15 border border-[#6700c9]/40 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#cfacff] shrink-0 animate-pulse" />
            <span className="text-xs font-semibold text-[#cfacff]">
              Generatore SEO Automatico AI per {blueprint.businessName}
            </span>
          </div>
          <button
            onClick={handleAutoGenerateAiSeo}
            disabled={isAiGenerating}
            className="px-3 py-1.5 bg-[#6700c9] hover:bg-[#5800ac] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isAiGenerating ? 'Generazione...' : 'Ottimizza con AI'}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#0e0e0d] p-1 rounded-2xl border border-[#3c4a42]/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'meta'
                ? 'bg-[#10b981] text-[#003824] font-bold shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search Meta</span>
          </button>

          <button
            onClick={() => setActiveTab('og')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'og'
                ? 'bg-[#10b981] text-[#003824] font-bold shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>OpenGraph & Social</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-[#10b981] text-[#003824] font-bold shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schema JSON-LD</span>
          </button>
        </div>

        {/* Main Form & Preview Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          
          {/* TAB 1: GOOGLE META TAGS */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              
              {/* Google Live Search Preview Box */}
              <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/60 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#bbcabf] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Anteprima Risultato Google Search (SERP)</span>
                </span>

                <div className="p-3 bg-white text-black rounded-xl space-y-1 font-sans text-xs shadow-inner">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[9px]">
                      {blueprint.businessName.charAt(0)}
                    </span>
                    <span className="text-[#202124] font-medium">{canonicalUrl}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                    {metaTitle || 'Titolo SEO del Sito Web'}
                  </h4>
                  <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                    {metaDescription || 'Descrizione per i motori di ricerca...'}
                  </p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3 text-xs">
                {/* Meta Title */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[#bbcabf]">
                    <label className="font-bold">Titolo Meta Page (&lt;title&gt;)</label>
                    <span className={`text-[10px] font-mono ${metaTitle.length > 60 ? 'text-amber-400 font-bold' : 'text-[#86948a]'}`}>
                      {metaTitle.length} / 60 caratteri consigliati
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Esempio: Pizzeria Bella Napoli Roma | Pizza a Domicilio"
                    className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[#bbcabf]">
                    <label className="font-bold">Descrizione Meta (&lt;meta name="description"&gt;)</label>
                    <span className={`text-[10px] font-mono ${metaDescription.length > 160 ? 'text-amber-400 font-bold' : 'text-[#86948a]'}`}>
                      {metaDescription.length} / 160 caratteri consigliati
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Descrivi brevemente la tua attività per invogliare i clienti a cliccare..."
                    className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-1">
                  <label className="font-bold text-[#bbcabf]">Parole Chiave Target (&lt;meta name="keywords"&gt;)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="pizzeria roma, pizza artigianale, menu pizza, whatsapp"
                    className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                {/* Canonical URL & Robots Directives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-bold text-[#bbcabf]">Canonical URL</label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#bbcabf]">Direttiva Robots</label>
                    <select
                      value={robots}
                      onChange={(e) => setRobots(e.target.value)}
                      className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981]"
                    >
                      <option value="index, follow">index, follow (Indicizza & Segui link)</option>
                      <option value="noindex, follow">noindex, follow (Nascosto da Google)</option>
                      <option value="index, nofollow">index, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPENGRAPH & SOCIAL SHARING */}
          {activeTab === 'og' && (
            <div className="space-y-4">
              
              {/* WhatsApp & Social Live Preview Box */}
              <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/60 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#bbcabf] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Anteprima Scheda WhatsApp / Facebook / LinkedIn</span>
                </span>

                <div className="max-w-sm mx-auto bg-[#1c1c1a] border border-white/10 rounded-2xl overflow-hidden shadow-lg space-y-0">
                  <div className="h-36 bg-cover bg-center relative" style={{ backgroundImage: `url(${ogImage})` }}>
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="p-3 bg-[#2a2a28] space-y-1">
                    <span className="text-[10px] text-[#bbcabf] uppercase font-mono block">
                      {canonicalUrl.replace('https://', '')}
                    </span>
                    <h5 className="font-bold text-xs text-white truncate">{ogTitle}</h5>
                    <p className="text-[11px] text-[#bbcabf] line-clamp-2 leading-tight">
                      {ogDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#bbcabf]">Titolo OpenGraph (og:title)</label>
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#bbcabf]">Descrizione OpenGraph (og:description)</label>
                  <textarea
                    rows={2}
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#bbcabf]">URL Immagine Anteprima Social (og:image)</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#10b981] font-bold">
                  <Code className="w-4 h-4" />
                  <span>Dati Strutturati Schema.org (LocalBusiness)</span>
                </div>
                <button
                  onClick={copySchemaToClipboard}
                  className="px-3 py-1 bg-[#10b981] text-[#003824] font-bold rounded-xl flex items-center gap-1 active:scale-95"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copiato!' : 'Copia JSON-LD'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#0e0e0d] rounded-2xl border border-[#3c4a42] font-mono text-[11px] text-[#35dec1] overflow-x-auto max-h-56">
                <pre>{schemaJson}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-[#3c4a42]/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-[#2a2a28] hover:bg-[#3c4a42] text-white font-semibold text-xs transition-colors"
          >
            Annulla
          </button>

          <button
            onClick={handleSaveSeo}
            className="px-5 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#003824] font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvato con successo!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salva Tag SEO e OpenGraph</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
