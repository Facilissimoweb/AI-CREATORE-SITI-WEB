import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Mic,
  MicOff,
  Utensils,
  Briefcase,
  Store,
  Home as HomeIcon,
  Activity,
  Stethoscope,
  CheckCircle,
  Zap,
  Lock,
  PhoneCall,
  Tag,
  Calendar,
  MessageCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { BusinessCategory, GoalOption, WebsiteBlueprint } from '../types';

interface IdeaTabProps {
  blueprint: WebsiteBlueprint;
  onGenerateBlueprint: (
    promptText: string,
    category: BusinessCategory,
    city: string,
    goal: GoalOption
  ) => Promise<void>;
  isGenerating: boolean;
  onNextStep: () => void;
}

export const IdeaTab: React.FC<IdeaTabProps> = ({
  blueprint,
  onGenerateBlueprint,
  isGenerating,
  onNextStep,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>(blueprint.category || 'ristorante');
  const [selectedGoal, setSelectedGoal] = useState<GoalOption>(blueprint.primaryGoal || 'prenotazione');
  const [cityInput, setCityInput] = useState(blueprint.city || 'Firenze');
  const [isRecording, setIsRecording] = useState(false);

  const categories: Array<{ id: BusinessCategory; label: string; icon: React.ReactNode }> = [
    { id: 'ristorante', label: 'Ristorante / Pizzeria', icon: <Utensils className="w-4 h-4" /> },
    { id: 'consulente', label: 'Studio / Consulente', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'artigiano', label: 'Artigiano / Negozio', icon: <Store className="w-4 h-4" /> },
    { id: 'servizi_casa', label: 'Servizi Casa / Idraulico', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'fitness', label: 'Personal Trainer / Fitness', icon: <Activity className="w-4 h-4" /> },
    { id: 'salute', label: 'Studio Medico / Beauty', icon: <Stethoscope className="w-4 h-4" /> },
  ];

  const goals: Array<{ id: GoalOption; label: string; icon: React.ReactNode }> = [
    { id: 'chiamata', label: 'Chiamare subito', icon: <PhoneCall className="w-4 h-4 text-[#35dec1]" /> },
    { id: 'prezzi', label: 'Vedere i prezzi', icon: <Tag className="w-4 h-4 text-[#35dec1]" /> },
    { id: 'prenotazione', label: 'Prenotare un appuntamento', icon: <Calendar className="w-4 h-4 text-[#35dec1]" /> },
    { id: 'whatsapp', label: 'Inviare WhatsApp rapido', icon: <MessageCircle className="w-4 h-4 text-[#35dec1]" /> },
  ];

  const quickPrompts = [
    "Sito per pizzeria con menu pizze speciali, prezzi ed asporto a Firenze",
    "Studio commercialista a Milano per consulenza fiscale Partita IVA e Srl",
    "Falegnameria artigianale a Bologna per armadi su misura e restauro legno",
    "Centro estetico e massaggi con listino trattamenti e prenotazione online",
  ];

  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsRecording(!isRecording);
      if (!isRecording) {
        setPromptInput((prev) => prev + (prev ? " " : "") + "Vorrei un sito web per la mia attività...");
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'it-IT';
      recognition.continuous = false;

      if (!isRecording) {
        setIsRecording(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setPromptInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
      } else {
        setIsRecording(false);
      }
    } catch {
      setIsRecording(!isRecording);
    }
  };

  const handleGenerate = async () => {
    const finalPrompt = promptInput.trim() || `Vorrei un sito web per un ${categories.find(c => c.id === selectedCategory)?.label} a ${cityInput}`;
    await onGenerateBlueprint(finalPrompt, selectedCategory, cityInput, selectedGoal);
    onNextStep();
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-500">
      {/* Step Progress Chip */}
      <div className="bg-[#1c1c1a] p-3 rounded-2xl border border-[#3c4a42]/30 space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-semibold text-[#10b981]">Passo 1 di 3</span>
          <span className="text-xs text-[#bbcabf]">L'Idea & Obiettivi</span>
        </div>
        <div className="h-2.5 w-full bg-[#2a2a28] rounded-full overflow-hidden">
          <div className="h-full bg-[#10b981] w-1/3 transition-all duration-700 ease-out" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#0e0e0d] rounded-2xl p-5 border border-[#3c4a42]/30 shadow-lg space-y-4">
        <div className="w-full h-44 rounded-xl overflow-hidden relative bg-[#2a2a28]">
          <img
            src={blueprint.heroImageUrl || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80"}
            alt="Attività commerciale italiana"
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0d] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 bg-[#6700c9]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[#cfacff] flex items-center gap-1.5 border border-[#6700c9]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio Smart Engine</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#e5e2df] leading-snug">
            Il tuo sito web perfetto, creato senza complicazioni.
          </h2>
          <p className="text-sm text-[#bbcabf] mt-1.5 leading-relaxed">
            Nessuna conoscenza tecnica richiesta. Pensiamo a tutto noi con l'AI, dall'idea alla pubblicazione.
          </p>
        </div>
      </section>

      {/* Categoria Attività */}
      <section className="space-y-3">
        <label className="text-xs font-semibold text-[#86948a] uppercase tracking-wider block">
          1. Seleziona la Categoria della tua Attività
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 text-xs font-medium active:scale-98 ${
                  isSelected
                    ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] shadow-sm'
                    : 'bg-[#1c1c1a] border-[#3c4a42]/40 text-[#e5e2df] hover:border-[#86948a]'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#10b981] text-[#003824]' : 'bg-[#2a2a28] text-[#bbcabf]'}`}>
                  {cat.icon}
                </div>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Città dell'Attività */}
      <section className="space-y-2">
        <label className="text-xs font-semibold text-[#86948a] uppercase tracking-wider block">
          2. Dove si trova la tua attività?
        </label>
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Es. Firenze, Milano, Roma, Bologna..."
          className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-4 py-3 text-sm text-[#e5e2df] placeholder-[#bbcabf]/50 focus:outline-none focus:border-[#10b981] transition-colors"
        />
      </section>

      {/* Obiettivo Principale */}
      <section className="space-y-2.5">
        <label className="text-xs font-semibold text-[#86948a] uppercase tracking-wider block">
          3. Cosa vuoi che facciano i clienti sul sito?
        </label>
        <div className="space-y-2">
          {goals.map((g) => {
            const isSelected = selectedGoal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between active:scale-98 ${
                  isSelected
                    ? 'bg-[#6700c9]/20 border-[#6700c9] text-[#cfacff]'
                    : 'bg-[#1c1c1a] border-[#3c4a42]/40 text-[#e5e2df] hover:border-[#86948a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#2a2a28]">
                    {g.icon}
                  </div>
                  <span className="text-xs font-medium">{g.label}</span>
                </div>
                {isSelected && <CheckCircle className="w-4 h-4 text-[#10b981]" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Text Prompt Interaction Area */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e5e2df] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#35dec1]" />
            <span>Descrivi la tua idea in parole tue</span>
          </h3>
          <span className="text-[10px] text-[#35dec1] bg-[#35dec1]/10 border border-[#35dec1]/30 px-2 py-0.5 rounded-md font-medium">
            AI Live Input
          </span>
        </div>

        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            rows={4}
            placeholder="Esempio: Vorrei un sito per la mia nuova pizzeria 'Il Forno d'Oro' a Firenze con menu completo e prenotazioni WhatsApp..."
            className="w-full bg-[#1c1c1a] border-2 border-[#3c4a42] focus:border-[#10b981] rounded-2xl p-4 text-sm text-[#e5e2df] placeholder-[#bbcabf]/40 focus:outline-none transition-colors resize-none"
          />
          <button
            onClick={handleMicToggle}
            type="button"
            className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all active:scale-90 ${
              isRecording
                ? 'bg-red-500/20 text-red-400 border border-red-500 animate-pulse'
                : 'bg-[#2a2a28] text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
            title="Ditta o usa la voce"
          >
            {isRecording ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Esempi Suggeriti (Pills) */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-[#86948a]">Oppure scegli uno spunto rapido:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setPromptInput(qp)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-[#1c1c1a] border border-[#3c4a42]/50 text-[#bbcabf] hover:text-[#e5e2df] hover:border-[#10b981]/50 transition-all text-left truncate max-w-full"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA */}
      <section className="pt-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-14 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-full font-bold text-base transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#10b981]/20 active:scale-98 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generazione con Gemini AI...</span>
            </>
          ) : (
            <>
              <span>Crea Anteprima in 30 secondi</span>
              <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="mt-2.5 text-center text-xs text-[#86948a] flex items-center justify-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Nessuna carta di credito richiesta • Prova Gratuita</span>
        </p>
      </section>

      {/* Trust Grid */}
      <section className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 bg-[#1c1c1a] rounded-xl border border-[#3c4a42]/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#e5e2df]">Ultra Veloce</h4>
            <p className="text-[11px] text-[#bbcabf] mt-0.5">Pronto in pochissimi click.</p>
          </div>
        </div>

        <div className="p-3.5 bg-[#1c1c1a] rounded-xl border border-[#3c4a42]/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#6700c9]/20 text-[#cfacff]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#e5e2df]">Sicuro al 100%</h4>
            <p className="text-[11px] text-[#bbcabf] mt-0.5">SSL e HTTPS inclusi.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
