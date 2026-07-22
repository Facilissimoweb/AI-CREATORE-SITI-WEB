import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Smartphone,
  Eye,
  Check,
  RotateCcw,
  MessageSquare,
  ArrowRight,
  Layers,
  Type,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { StyleTheme, WebsiteBlueprint } from '../types';

interface StyleTabProps {
  blueprint: WebsiteBlueprint;
  onUpdateBlueprint: (updated: WebsiteBlueprint) => void;
  onSendStyleChat: (prompt: string) => Promise<void>;
  isProcessingChat: boolean;
  onNextStep: () => void;
  onOpenFullscreen: () => void;
}

export const StyleTab: React.FC<StyleTabProps> = ({
  blueprint,
  onUpdateBlueprint,
  onSendStyleChat,
  isProcessingChat,
  onNextStep,
  onOpenFullscreen,
}) => {
  const [chatInput, setChatInput] = useState('');

  const themes: Array<{ id: StyleTheme; label: string; desc: string; color: string; bg: string }> = [
    {
      id: 'semplice',
      label: 'Semplice & Diretto',
      desc: 'Chiaro, pulito, ideale per pizzerie e negozi',
      color: '#10b981',
      bg: '#131312',
    },
    {
      id: 'elegante',
      label: 'Elegante & Premium',
      desc: 'Toni sofisticati per studi professionali e consulenti',
      color: '#35dec1',
      bg: '#0e0e0d',
    },
    {
      id: 'colorato',
      label: 'Colorato & Moderno',
      desc: 'Vivace con accenti viola per fitness e attività giovani',
      color: '#d7baff',
      bg: '#1a0033',
    },
    {
      id: 'rustico',
      label: 'Caldo Legno & Artigiano',
      desc: 'Toni caldi per artigiani, falegnami e ristrutturazioni',
      color: '#f59e0b',
      bg: '#1c1917',
    },
    {
      id: 'minimal',
      label: 'Minimal Chic',
      desc: 'Design moderno essenziale ad alto contrasto',
      color: '#38bdf8',
      bg: '#0f172a',
    },
  ];

  const colorPalettes = [
    { name: 'Smeraldo', primary: '#10b981', secondary: '#6700c9' },
    { name: 'Acquamarina', primary: '#35dec1', secondary: '#006c49' },
    { name: 'Viola Reale', primary: '#d7baff', secondary: '#6700c9' },
    { name: 'Ambra Calda', primary: '#f59e0b', secondary: '#b45309' },
    { name: 'Blu Oceano', primary: '#38bdf8', secondary: '#1e40af' },
  ];

  const fonts = ['Inter', 'Playfair Display', 'Outfit', 'Space Grotesk'];

  const handleSelectTheme = (themeId: StyleTheme) => {
    const matched = themes.find((t) => t.id === themeId);
    if (matched) {
      onUpdateBlueprint({
        ...blueprint,
        selectedTheme: themeId,
        colors: {
          ...blueprint.colors,
          primary: matched.color,
          background: matched.bg,
        },
      });
    }
  };

  const handleSelectPalette = (p: { primary: string; secondary: string }) => {
    onUpdateBlueprint({
      ...blueprint,
      colors: {
        ...blueprint.colors,
        primary: p.primary,
        secondary: p.secondary,
      },
    });
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    await onSendStyleChat(msg);
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-500">
      {/* Step Progress Chip */}
      <div className="bg-[#1c1c1a] p-3 rounded-2xl border border-[#3c4a42]/30 space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-semibold text-[#10b981]">Passo 2 di 3</span>
          <span className="text-xs text-[#bbcabf]">Lo Stile & Personalizzazione</span>
        </div>
        <div className="h-2.5 w-full bg-[#2a2a28] rounded-full overflow-hidden">
          <div className="h-full bg-[#10b981] w-2/3 transition-all duration-700 ease-out" />
        </div>
      </div>

      {/* Intro AI prompt statement */}
      <div className="bg-[#0e0e0d] p-4 rounded-2xl border border-[#3c4a42]/40 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-[#e5e2df] leading-relaxed">
            "Ottima scelta per <strong>{blueprint.businessName}</strong>! Ora personalizziamo lo stile visivo. Che atmosfera desideri trasmettere ai tuoi clienti?"
          </p>
        </div>
      </div>

      {/* Visual Theme Selection Grid */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-[#86948a] uppercase tracking-wider block">
          1. Seleziona il Tema Visivo
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {themes.map((t) => {
            const isSelected = blueprint.selectedTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between active:scale-98 ${
                  isSelected
                    ? 'bg-[#1c1c1a] border-2 border-[#10b981] shadow-lg'
                    : 'bg-[#1c1c1a]/60 border-[#3c4a42]/40 hover:border-[#86948a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                    style={{ backgroundColor: t.bg }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#e5e2df]">{t.label}</h4>
                    <p className="text-[11px] text-[#bbcabf] mt-0.5">{t.desc}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#10b981] text-[#003824] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Color Swatches */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-semibold text-[#86948a] uppercase tracking-wider block">
          2. Cambia Colore Principale
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {colorPalettes.map((cp, idx) => {
            const isSelected = blueprint.colors.primary === cp.primary;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPalette(cp)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#1c1c1a] border-[#10b981] text-[#e5e2df]'
                    : 'bg-[#1c1c1a]/50 border-[#3c4a42]/40 text-[#bbcabf]'
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: cp.primary }} />
                <span>{cp.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Phone Preview Card */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#86948a] uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#10b981]" />
            <span>Anteprima in Tempo Reale</span>
          </h3>
          <button
            onClick={onOpenFullscreen}
            className="text-[11px] text-[#10b981] hover:underline flex items-center gap-1 font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Apri Schermo Intero</span>
          </button>
        </div>

        {/* Smartphone Container */}
        <div className="relative w-full max-w-[290px] mx-auto aspect-[9/16] bg-[#0e0e0d] rounded-[2.5rem] p-3 shadow-2xl border-4 border-[#2a2a28] overflow-hidden">
          {/* Inner Screen */}
          <div
            className="w-full h-full rounded-[1.8rem] overflow-y-auto custom-scrollbar flex flex-col relative"
            style={{ backgroundColor: blueprint.colors.background, color: blueprint.colors.text }}
          >
            {/* Phone Top Notch */}
            <div className="h-6 bg-black/40 backdrop-blur-md flex items-center justify-between px-5 sticky top-0 z-20">
              <div className="w-12 h-2.5 bg-white/20 rounded-full" />
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>

            {/* Simulated Live Mobile Site Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/20">
              <span className="font-bold text-xs truncate max-w-[140px]" style={{ color: blueprint.colors.primary }}>
                {blueprint.businessName}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
                {blueprint.city}
              </span>
            </div>

            {/* Simulated Hero */}
            <div className="p-3 space-y-2">
              <div className="h-28 w-full rounded-xl overflow-hidden relative bg-neutral-800">
                <img
                  src={blueprint.heroImageUrl}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] font-bold text-white leading-tight drop-shadow">
                    {blueprint.tagline}
                  </p>
                </div>
              </div>

              {/* Call to action button */}
              <div
                className="py-2 px-3 rounded-full text-center text-[10px] font-bold shadow-md cursor-pointer flex items-center justify-center gap-1"
                style={{ backgroundColor: blueprint.colors.primary, color: '#003824' }}
              >
                <span>Contatta su WhatsApp</span>
                <MessageCircle className="w-3 h-3 fill-current" />
              </div>

              {/* Simulated Services Section */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">I Nostri Servizi</span>
                <div className="space-y-1">
                  {blueprint.pages[1]?.sections[0]?.contentItems?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center text-[10px]">
                      <span className="font-medium truncate max-w-[120px]">{item.title}</span>
                      <span className="font-bold opacity-90">{item.price || "Info"}</span>
                    </div>
                  )) || (
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[10px]">
                      Servizio Top Quality
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="absolute bottom-2 right-2 bg-[#6700c9] text-[#cfacff] p-2 rounded-xl shadow-lg border border-white/20 text-[9px] font-bold animate-pulse">
              Bozza Live ✨
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Chat for Style Customization */}
      <section className="space-y-2.5 pt-2">
        <label className="text-xs font-semibold text-[#86948a] uppercase tracking-wider block">
          Chiedi all'AI qualsiasi modifica grafica o di testo
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder="Es: 'Usa colori oro e nero', 'Sito più elegante'..."
            className="flex-1 bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-3.5 py-2.5 text-xs text-[#e5e2df] placeholder-[#bbcabf]/50 focus:outline-none focus:border-[#10b981]"
          />
          <button
            onClick={handleSendChat}
            disabled={isProcessingChat}
            className="bg-[#6700c9] hover:bg-[#5800ac] text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessingChat ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Invia</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Next Step Button */}
      <section className="pt-2">
        <button
          onClick={onNextStep}
          className="w-full h-14 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-[#10b981]/20"
        >
          <span>Vedi la Struttura Completa del Sito</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
