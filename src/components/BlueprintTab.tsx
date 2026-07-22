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
  Save
} from 'lucide-react';
import { WebsiteBlueprint, SitePage } from '../types';

interface BlueprintTabProps {
  blueprint: WebsiteBlueprint;
  onUpdateBlueprint: (updated: WebsiteBlueprint) => void;
  onOpenDesignerModal: () => void;
  onOpenFullscreen: () => void;
}

export const BlueprintTab: React.FC<BlueprintTabProps> = ({
  blueprint,
  onUpdateBlueprint,
  onOpenDesignerModal,
  onOpenFullscreen,
}) => {
  const [openPageId, setOpenPageId] = useState<string>('home');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

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
          <span className="text-xs text-[#bbcabf]">Il Tuo Sito & Pagine</span>
        </div>
        <div className="h-2.5 w-full bg-[#2a2a28] rounded-full overflow-hidden">
          <div className="h-full bg-[#10b981] w-full transition-all duration-700 ease-out" />
        </div>
      </div>

      {/* Header Section */}
      <section className="space-y-1">
        <h2 className="text-xl font-bold text-[#e5e2df]">Ecco la tua struttura ideale</h2>
        <p className="text-xs text-[#bbcabf] leading-relaxed">
          Abbiamo generato la bozza su misura per <strong>{blueprint.businessName}</strong> a {blueprint.city}.
        </p>
      </section>

      {/* Garanzia Facilissimo Badge Card */}
      <div className="bg-[#6700c9]/10 border-2 border-[#6700c9]/30 rounded-2xl p-4 text-center space-y-2 shadow-md">
        <div className="flex items-center justify-center gap-1.5 text-[#cfacff]">
          <ShieldCheck className="w-5 h-5 text-[#35dec1]" />
          <span className="text-xs font-bold uppercase tracking-wider">Garanzia Facilissimo</span>
        </div>
        <p className="text-sm font-semibold text-[#e5e2df]">
          100% Mobile Ready • Zero Complicazioni • Pronta in 48h
        </p>
      </div>

      {/* Interactive Site Outline (Page Accordions) */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-[#86948a] uppercase tracking-widest block">
          Struttura delle Pagine del Sito
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
                                className="p-2.5 rounded-lg bg-[#2a2a28] flex items-center justify-between text-xs gap-2"
                              >
                                <div className="truncate">
                                  <span className="font-semibold text-[#e5e2df] block truncate">
                                    {item.title}
                                  </span>
                                  {item.subtitle && (
                                    <span className="text-[10px] text-[#bbcabf] truncate block">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>

                                {item.price !== undefined && (
                                  <input
                                    type="text"
                                    value={item.price}
                                    onChange={(e) =>
                                      handleUpdateItemPrice(page.id, sec.id, itemIdx, e.target.value)
                                    }
                                    className="w-20 bg-[#1c1c1a] border border-[#3c4a42] rounded px-2 py-1 text-right text-xs font-bold text-[#10b981] focus:outline-none focus:border-[#10b981]"
                                  />
                                )}
                              </div>
                            ))}

                            <button
                              onClick={() => handleAddItem(page.id, sec.id)}
                              className="w-full py-2 border border-dashed border-[#3c4a42] rounded-lg text-xs text-[#35dec1] hover:bg-[#35dec1]/10 transition-colors flex items-center justify-center gap-1 font-medium mt-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Aggiungi Voce o Servizio</span>
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

      {/* Preview Hero Mockup Image */}
      <section className="pt-2">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-[#3c4a42]/40">
          <img
            src={blueprint.heroImageUrl}
            alt="Anteprima"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <div>
              <span className="bg-[#10b981] text-[#003824] font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                Stile "Paper & Glass"
              </span>
              <p className="text-white font-bold text-sm mt-1">
                Layout responsive testato su smartphone iOS ed Android
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bottom Sheet Controls */}
      <div className="bg-[#1c1c1a] rounded-2xl p-4 space-y-3 border border-[#3c4a42]/40 shadow-2xl">
        <button
          onClick={onOpenDesignerModal}
          className="w-full h-14 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-[#10b981]/20"
        >
          <Headphones className="w-5 h-5" />
          <span>Parla con il tuo Designer Dedicato</span>
        </button>

        <button
          onClick={onOpenFullscreen}
          className="w-full h-12 border-2 border-[#6700c9] text-[#cfacff] hover:bg-[#6700c9]/20 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <Eye className="w-4 h-4 text-[#35dec1]" />
          <span>Esplora il Sito Live ed Interattivo</span>
        </button>
      </div>
    </div>
  );
};
