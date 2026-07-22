import React, { useState } from 'react';
import {
  X,
  Sliders,
  Palette,
  FileText,
  Layout,
  Globe,
  Plus,
  Trash2,
  Check,
  Smartphone,
  Sparkles,
  Layers,
  MessageCircle,
  Calendar,
  Key,
  ShieldCheck,
  Type,
  Square,
  Circle,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { WebsiteBlueprint, SitePage } from '../types';

interface ModelingStudioModalProps {
  blueprint: WebsiteBlueprint;
  onUpdateBlueprint: (updated: WebsiteBlueprint) => void;
  onClose: () => void;
  onOpenFullscreen: () => void;
}

export const ModelingStudioModal: React.FC<ModelingStudioModalProps> = ({
  blueprint,
  onUpdateBlueprint,
  onClose,
  onOpenFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'widgets' | 'domain'>('content');
  const [selectedPageId, setSelectedPageId] = useState<string>('home');

  const selectedPage = blueprint.pages.find((p) => p.id === selectedPageId) || blueprint.pages[0];

  // Colors & Themes
  const predefinedPalettes = [
    { name: 'Smeraldo Moderno', primary: '#10b981', secondary: '#003824', bg: '#131312' },
    { name: 'Viola Tech', primary: '#6700c9', secondary: '#35dec1', bg: '#0e0e0d' },
    { name: 'Ambra Warm', primary: '#f59e0b', secondary: '#b45309', bg: '#1c1917' },
    { name: 'Blu Oceano', primary: '#38bdf8', secondary: '#1e40af', bg: '#0f172a' },
    { name: 'Rosso Fuoco', primary: '#ef4444', secondary: '#991b1b', bg: '#18181b' },
  ];

  const fonts = ['Plus Jakarta Sans', 'Playfair Display', 'Outfit', 'Space Grotesk', 'Inter'];

  // Handle adding a new page
  const handleAddPage = () => {
    const newId = `page_${Date.now()}`;
    const newPage: SitePage = {
      id: newId,
      title: 'Nuova Pagina',
      slug: `/${newId}`,
      icon: 'globe',
      subtitle: 'Descrizione della pagina',
      sections: [
        {
          id: `sec_${Date.now()}`,
          title: 'Sezione Principale',
          description: 'Inserisci qui i tuoi contenuti',
          type: 'services',
          contentItems: [
            { title: 'Voce 1', subtitle: 'Dettaglio', price: '€ 10.00' }
          ]
        }
      ]
    };
    onUpdateBlueprint({ ...blueprint, pages: [...blueprint.pages, newPage] });
    setSelectedPageId(newId);
  };

  // Handle deleting a page
  const handleDeletePage = (pageId: string) => {
    if (blueprint.pages.length <= 1) return;
    const filtered = blueprint.pages.filter((p) => p.id !== pageId);
    onUpdateBlueprint({ ...blueprint, pages: filtered });
    setSelectedPageId(filtered[0].id);
  };

  // Handle adding a section to active page
  const handleAddSection = () => {
    const updatedPages = blueprint.pages.map((p) => {
      if (p.id !== selectedPageId) return p;
      return {
        ...p,
        sections: [
          ...p.sections,
          {
            id: `sec_${Date.now()}`,
            title: 'Nuovo Blocco Servizi / Menu',
            description: 'Lista aggiornata delle tue offerte',
            type: 'services' as const,
            contentItems: [
              { title: 'Prodotto o Servizio A', subtitle: 'Descrizione breve', price: '€ 12.00' },
              { title: 'Prodotto o Servizio B', subtitle: 'Descrizione breve', price: '€ 24.00' }
            ]
          }
        ]
      };
    });
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  // Handle editing page title
  const handleUpdatePageTitle = (title: string) => {
    const updatedPages = blueprint.pages.map((p) =>
      p.id === selectedPageId ? { ...p, title } : p
    );
    onUpdateBlueprint({ ...blueprint, pages: updatedPages });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[620px] bg-[#1c1c1a] border border-[#3c4a42]/60 rounded-3xl p-4 sm:p-5 shadow-2xl text-[#e5e2df] relative max-h-[92vh] flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#3c4a42]/40 pb-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10b981] flex items-center justify-center text-[#003824] shadow-lg shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#e5e2df] flex items-center gap-2">
                <span>Plancia di Modellazione Web App</span>
                <span className="text-[10px] bg-[#6700c9]/30 text-[#cfacff] border border-[#6700c9] px-2 py-0.5 rounded-full font-bold">STUDIO</span>
              </h3>
              <p className="text-xs text-[#bbcabf]">
                Modella pagine, colori, widget e regole di business per <strong>{blueprint.businessName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#0e0e0d] p-1 rounded-2xl border border-[#3c4a42]/40 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 min-w-[110px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'content'
                ? 'bg-[#10b981] text-[#003824] shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pagine & Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 min-w-[110px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'design'
                ? 'bg-[#10b981] text-[#003824] shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Design System</span>
          </button>

          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 min-w-[110px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'widgets'
                ? 'bg-[#10b981] text-[#003824] shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Widget App</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`flex-1 min-w-[110px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'domain'
                ? 'bg-[#10b981] text-[#003824] shadow'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SaaS & API</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 text-xs text-[#e5e2df]">
          
          {/* TAB 1: CONTENT & PAGES */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              
              {/* Page List Pill Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                    Struttura Pagine Web App ({blueprint.pages.length})
                  </span>
                  <button
                    onClick={handleAddPage}
                    className="px-2.5 py-1 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-[#10b981] border border-[#10b981]/40 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aggiungi Pagina</span>
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {blueprint.pages.map((p) => {
                    const isSelected = p.id === selectedPageId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPageId(p.id)}
                        className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[#10b981] text-[#003824] border-[#10b981]'
                            : 'bg-[#0e0e0d] text-[#bbcabf] border-[#3c4a42]/50 hover:text-white'
                        }`}
                      >
                        <span>{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Page Editor Box */}
              {selectedPage && (
                <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => handleUpdatePageTitle(e.target.value)}
                      className="bg-[#1c1c1a] border border-[#3c4a42] text-[#e5e2df] font-bold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#10b981] flex-1"
                      placeholder="Titolo Pagina"
                    />

                    {blueprint.pages.length > 1 && (
                      <button
                        onClick={() => handleDeletePage(selectedPage.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors shrink-0"
                        title="Elimina pagina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sections list inside selected page */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-[#bbcabf]">
                        Sezioni in questa pagina:
                      </span>
                      <button
                        onClick={handleAddSection}
                        className="text-[11px] text-[#35dec1] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Nuovo Blocco Contenuto</span>
                      </button>
                    </div>

                    {selectedPage.sections.map((sec, secIdx) => (
                      <div key={sec.id} className="p-3 rounded-xl bg-[#1c1c1a] border border-[#3c4a42]/40 space-y-2">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            const updatedPages = blueprint.pages.map((p) => {
                              if (p.id !== selectedPageId) return p;
                              const secs = p.sections.map((s) => s.id === sec.id ? { ...s, title: newTitle } : s);
                              return { ...p, sections: secs };
                            });
                            onUpdateBlueprint({ ...blueprint, pages: updatedPages });
                          }}
                          className="w-full bg-[#0e0e0d] border border-[#3c4a42] text-xs font-bold text-[#10b981] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />

                        <textarea
                          rows={2}
                          value={sec.description}
                          onChange={(e) => {
                            const newDesc = e.target.value;
                            const updatedPages = blueprint.pages.map((p) => {
                              if (p.id !== selectedPageId) return p;
                              const secs = p.sections.map((s) => s.id === sec.id ? { ...s, description: newDesc } : s);
                              return { ...p, sections: secs };
                            });
                            onUpdateBlueprint({ ...blueprint, pages: updatedPages });
                          }}
                          className="w-full bg-[#0e0e0d] border border-[#3c4a42] text-[11px] text-[#e5e2df] rounded-lg p-2 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DESIGN SYSTEM */}
          {activeTab === 'design' && (
            <div className="space-y-4">
              
              {/* Palette Selector */}
              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 space-y-2">
                <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider block">
                  1. Palette Cromatiche Predefinite
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {predefinedPalettes.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        onUpdateBlueprint({
                          ...blueprint,
                          colors: {
                            ...blueprint.colors,
                            primary: p.primary,
                            secondary: p.secondary,
                            background: p.bg,
                          },
                        })
                      }
                      className="p-2.5 rounded-xl bg-[#1c1c1a] border border-[#3c4a42]/50 flex items-center justify-between text-left hover:border-[#10b981] transition-all"
                    >
                      <span className="font-bold text-xs">{p.name}</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.secondary }} />
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: p.bg }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Inputs */}
              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 space-y-3">
                <span className="text-xs font-bold text-[#35dec1] uppercase tracking-wider block">
                  2. Personalizzazione Colore Principale
                </span>
                <div className="flex items-center justify-between bg-[#1c1c1a] p-3 rounded-xl border border-[#3c4a42]/40">
                  <span className="font-semibold text-xs">Colore Accento (Brand):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={blueprint.colors.primary}
                      onChange={(e) =>
                        onUpdateBlueprint({
                          ...blueprint,
                          colors: { ...blueprint.colors, primary: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-xs text-[#10b981] uppercase">{blueprint.colors.primary}</span>
                  </div>
                </div>
              </div>

              {/* Typography Selector */}
              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 space-y-2">
                <span className="text-xs font-bold text-[#cfacff] uppercase tracking-wider block">
                  3. Carattere Tipografico (Font)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f}
                      onClick={() => onUpdateBlueprint({ ...blueprint, fontFamily: f })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        blueprint.fontFamily === f
                          ? 'bg-[#6700c9] text-white border-[#6700c9]'
                          : 'bg-[#1c1c1a] text-[#bbcabf] border-[#3c4a42]/40 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: APP WIDGETS */}
          {activeTab === 'widgets' && (
            <div className="space-y-3">
              
              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Barra WhatsApp Fluttuante Sticky</h4>
                    <p className="text-[10px] text-[#bbcabf]">Permette ai clienti di contattarti in un click con il numero {blueprint.whatsapp}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold text-[10px]">
                  ATTIVO
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Modulo Prenotazione Tavoli / Appuntamento</h4>
                    <p className="text-[10px] text-[#bbcabf]">Invia automaticamente la richiesta dettagliata di data/ora su WhatsApp</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold text-[10px]">
                  ATTIVO
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6700c9]/20 text-[#cfacff] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Scheda Orari & Posizione GPS</h4>
                    <p className="text-[10px] text-[#bbcabf]">Mappa e orari di apertura sempre in evidenza nel footer</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold text-[10px]">
                  ATTIVO
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SAAS & API */}
          {activeTab === 'domain' && (
            <div className="space-y-3">
              
              <div className="p-4 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#10b981] font-bold text-xs">
                  <Globe className="w-4 h-4" />
                  <span>Link SaaS Pubblico Gestito</span>
                </div>
                <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                  In modalità abbonamento SaaS, la Web App resta ospitata sui server Facilissimo Web all'indirizzo:
                </p>
                <div className="p-2.5 bg-black/50 rounded-xl border border-white/10 font-mono text-[11px] text-[#10b981]">
                  facilissimoweb.it/site/{blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 space-y-2">
                <div className="flex items-center gap-2 text-[#35dec1] font-bold text-xs">
                  <Key className="w-4 h-4" />
                  <span>Stato Collegamento API Gemini AI</span>
                </div>
                <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                  Per modulare e generare Web App con l'intelligenza artificiale, la chiave <code>GEMINI_API_KEY</code> o <code>VITE_GEMINI_API_KEY</code> è configurata nel server (Vercel / AI Studio) tramite le variabili d'ambiente.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#10b981] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Connessione API Gemini Server-Side Attiva</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#3c4a42]/40 flex gap-2">
          <button
            onClick={onOpenFullscreen}
            className="flex-1 py-3 bg-[#10b981] text-[#003824] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:bg-[#059669] transition-transform active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Testa Web App su Simulatore Mobile</span>
          </button>
        </div>

      </div>
    </div>
  );
};
