import React, { useState } from 'react';
import {
  Lightbulb,
  Palette,
  Layers,
  Rocket,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Eye,
  HelpCircle
} from 'lucide-react';
import { TabType } from './BottomNavBar';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onOpenFullscreenPreview?: () => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  badge: string;
  tabTarget?: TabType;
  icon: React.ReactNode;
  accentColor: string;
  description: string;
  features: string[];
  tip: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenFullscreenPreview,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      title: 'Benvenuto in Facilissimo Web! 👋',
      subtitle: 'La tua piattaforma AI per creare Web App professionali in meno di 2 minuti.',
      badge: 'Introduzione',
      icon: <Sparkles className="w-6 h-6 text-[#10b981]" />,
      accentColor: '#10b981',
      description:
        'Trasforma le tue idee di business in una Web App completa di menù, sistema di prenotazione online, galleria e pulsante WhatsApp, senza scrivere una riga di codice.',
      features: [
        'Generazione istantanea con AI Gemini',
        'Simulatore responsive per iPhone, Android e Tablet',
        'Personalizzazione completa di testo, colori e pagine',
        'Pronto per l\'online su Vercel e domini custom'
      ],
      tip: 'Puoi riaprire questa guida in qualsiasi momento dal menù in alto!'
    },
    {
      title: 'Passo 1: Ideazione 💡',
      subtitle: 'Definisci la tua attività e fai generare la struttura all\'Intelligenza Artificiale.',
      badge: 'Fase 1 di 3',
      tabTarget: 'idea',
      icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
      accentColor: '#fbbf24',
      description:
        'Descrivi la tua attività (es. "Pizzeria gourmet con forno a legna a Napoli") oppure seleziona uno dei modelli pronti per Pizzerie, Consulenti e Artigiani.',
      features: [
        'Input prompt intelligente in lingua italiana',
        'Preset di settore pronti all\'uso',
        'Scelta dell\'obiettivo aziendale (Prenotazioni, Contatti, Vendite)',
        'Generazione architettura completa in pochi secondi'
      ],
      tip: 'Clicca su "Genera con AI" per creare subito una nuova versione della tua Web App!'
    },
    {
      title: 'Passo 2: Stile & Visual 🎨',
      subtitle: 'Personalizza l\'aspetto visivo, le combinazioni cromatiche e la tipografia.',
      badge: 'Fase 2 di 3',
      tabTarget: 'stile',
      icon: <Palette className="w-6 h-6 text-[#35dec1]" />,
      accentColor: '#35dec1',
      description:
        'Scegli tra palette cromatiche studiate per il massimo tasso di conversione, cambia lo stile grafico con un click o usa la chat AI per apportare modifiche visive.',
      features: [
        'Palette colori ad alto contrasto accessibile',
        'Abbinamenti font eleganti e leggibili',
        'Modalità scura/chiara integrata',
        'Assistente AI per rigenerare palette e immagini hero'
      ],
      tip: 'Prova la chat visiva per dire all\'AI ad esempio: "Usa un tema verde smeraldo e oro"!'
    },
    {
      title: 'Passo 3: Blueprint & Pagine 🛠️',
      subtitle: 'Gestisci la struttura delle pagine, i contenuti e prova il simulatore multi-device.',
      badge: 'Fase 3 di 3',
      tabTarget: 'sito',
      icon: <Layers className="w-6 h-6 text-[#cfacff]" />,
      accentColor: '#cfacff',
      description:
        'Esplora l\'albero delle pagine, modifica sezioni e prodotti, aggiungi nuovi blocchi e testa l\'app su schermi di varie dimensioni (iPhone, Android, Tablet).',
      features: [
        'Editor modulare per sezioni, menù e form',
        'Simulatore responsive avanzato con rotazione landscape',
        'Annullamento modifiche AI (fino a 3 passaggi indietro)',
        'Salvataggio locale automatico e istantaneo'
      ],
      tip: 'Usa il tasto "Anteprima Fullscreen" per testare la Web App a schermo intero come la vedrà il tuo cliente!'
    },
    {
      title: 'Pubblicazione & Export 🚀',
      subtitle: 'Sei pronto per portare la tua attività online e scalare!',
      badge: 'Traguardo',
      tabTarget: 'sito',
      icon: <Rocket className="w-6 h-6 text-[#10b981]" />,
      accentColor: '#10b981',
      description:
        'Export del codice sorgente in React/Tailwind, guida al deploy automatico su Vercel, personalizzazione metadati SEO e registrazione dominio personalizzato.',
      features: [
        'Codice sorgente TypeScript + Vite + Tailwind pulito',
        'Mappa guidata step-by-step per pubblicazione Vercel',
        'Metadati OpenGraph e SEO integrati per Google e Social',
        'Sotto-link facilissimoweb ed espansione Pro'
      ],
      tip: 'Clicca su "Inizia a Creare" per chiudere il tour ed esplorare l\'applicazione!'
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (steps[nextIdx].tabTarget) {
        onSelectTab(steps[nextIdx].tabTarget!);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (steps[prevIdx].tabTarget) {
        onSelectTab(steps[prevIdx].tabTarget!);
      }
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('facilissimoweb_tour_seen', 'true');
    } catch (e) {
      console.warn('Could not set localStorage tour flag', e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#131312] border border-[#3c4a42]/60 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-white relative border-t-2 border-t-[#10b981]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1a1a18]">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border"
              style={{
                borderColor: currentStep.accentColor,
                color: currentStep.accentColor,
                backgroundColor: `${currentStep.accentColor}15`,
              }}
            >
              {currentStep.badge}
            </span>
            <span className="text-xs text-[#bbcabf] font-mono">
              Passaggio {currentStepIndex + 1} di {steps.length}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
            title="Salta Tour Guidato"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[70vh]">
          
          {/* Title & Icon Header */}
          <div className="flex items-start gap-4">
            <div
              className="p-3.5 rounded-2xl shrink-0 border shadow-lg"
              style={{
                backgroundColor: `${currentStep.accentColor}15`,
                borderColor: `${currentStep.accentColor}40`,
              }}
            >
              {currentStep.icon}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#bbcabf] font-medium mt-1">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Description Card */}
          <div className="p-4 rounded-2xl bg-[#1c1c1a] border border-white/10 text-xs sm:text-sm text-[#e5e2df] leading-relaxed">
            {currentStep.description}
          </div>

          {/* Bullet Point Highlights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider">
              Caratteristiche Chiave:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStep.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-medium text-white"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center gap-2.5 text-xs text-[#10b981]">
            <Sparkles className="w-4 h-4 shrink-0 font-bold" />
            <span className="font-semibold">{currentStep.tip}</span>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#1a1a18] flex items-center justify-between gap-3">
          
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentStepIndex(i);
                  if (steps[i].tabTarget) onSelectTab(steps[i].tabTarget!);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-6 bg-[#10b981]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Vai al passaggio ${i + 1}`}
              />
            ))}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-white text-xs font-bold flex items-center gap-1 transition-all border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Indietro</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0ea572] text-[#003824] text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <span>
                {currentStepIndex === steps.length - 1 ? 'Inizia a Creare Ora!' : 'Avanti'}
              </span>
              <ChevronRight className="w-4 h-4 font-extrabold" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
