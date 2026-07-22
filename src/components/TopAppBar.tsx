import React, { useState, useRef, useEffect } from 'react';
import {
  Bolt,
  Smartphone,
  Moon,
  Sun,
  Download,
  Bot,
  Sliders,
  Crown,
  Search,
  Menu,
  X,
  Sparkles,
  Rocket,
  Settings,
  FolderArchive,
  Layers,
  ChevronRight,
  Undo2,
  Save,
  Check,
  HelpCircle
} from 'lucide-react';

interface TopAppBarProps {
  onOpenFullscreen: () => void;
  onOpenExportGuide: () => void;
  onOpenChatModal?: () => void;
  onOpenModelingStudio?: () => void;
  onOpenSubscriptionPlans?: () => void;
  onOpenSeoModal?: () => void;
  onOpenProDashboard?: () => void;
  onOpenTour?: () => void;
  isProUnlocked?: boolean;
  canUndo?: boolean;
  undoCount?: number;
  onUndo?: () => void;
  onSave?: () => void;
  lastSavedTime?: string | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenFullscreen,
  onOpenExportGuide,
  onOpenChatModal,
  onOpenModelingStudio,
  onOpenSubscriptionPlans,
  onOpenSeoModal,
  onOpenProDashboard,
  onOpenTour,
  isProUnlocked = false,
  canUndo = false,
  undoCount = 0,
  onUndo,
  onSave,
  lastSavedTime,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSaveClick = () => {
    if (onSave) {
      onSave();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full max-w-[640px] mx-auto bg-[#131312]/95 backdrop-blur-md border-b border-[#3c4a42]/30 text-[#e5e2df] shadow-md transition-all">
      <div className="flex items-center justify-between px-3 h-14">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981] shadow-inner">
            <Bolt className="w-5 h-5 fill-current" />
          </div>
          <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#10b981] flex items-center gap-1.5">
            Facilissimo <span className="text-[#e5e2df] font-semibold text-xs sm:text-sm bg-[#6700c9]/30 text-[#cfacff] px-2 py-0.5 rounded-full border border-[#6700c9]/50">Web App</span>
          </h1>
        </div>

        {/* Right Desktop Quick Actions & Hamburger Trigger */}
        <div className="flex items-center gap-1.5" ref={menuRef}>
          
          {/* Quick Undo Button */}
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-full border transition-all flex items-center justify-center relative ${
                canUndo
                  ? 'bg-[#1c1c1a] text-[#35dec1] hover:bg-[#35dec1]/20 border-[#35dec1]/50 active:scale-90 shadow'
                  : 'bg-[#1c1c1a]/50 text-gray-600 border-gray-800 cursor-not-allowed opacity-50'
              }`}
              title={canUndo ? `Annulla ultima modifica AI (${undoCount}/3 disponibili)` : 'Nessuna modifica da annullare'}
            >
              <Undo2 className="w-4 h-4" />
              {canUndo && undoCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#35dec1] text-[#003824] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {undoCount}
                </span>
              )}
            </button>
          )}

          {/* Quick Save Button */}
          {onSave && (
            <button
              onClick={handleSaveClick}
              className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border shadow active:scale-95 ${
                justSaved
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/25 border-[#10b981]/40'
              }`}
              title="Salva modifiche localmente nel browser"
            >
              {justSaved ? <Check className="w-3.5 h-3.5 font-bold" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{justSaved ? 'Salvato!' : 'Salva'}</span>
            </button>
          )}

          {/* Quick Dashboard Pro Button (When Pro unlocked or available) */}
          {onOpenProDashboard && (
            <button
              onClick={onOpenProDashboard}
              className={`hidden sm:flex px-2.5 py-1 rounded-full text-xs font-black items-center gap-1 transition-all active:scale-95 shadow-md ${
                isProUnlocked
                  ? 'bg-[#6700c9] hover:bg-[#5200a3] text-white border border-[#cfacff]/40 shadow-[#6700c9]/30'
                  : 'bg-[#10b981] hover:bg-[#059669] text-[#003824]'
              }`}
              title={isProUnlocked ? 'Apri Dashboard Pro Studio' : 'Piani & Abbonamenti Pro'}
            >
              <Crown className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>{isProUnlocked ? 'Dashboard Pro' : 'Piani Pro'}</span>
            </button>
          )}

          {/* Quick SEO Button */}
          {onOpenSeoModal && (
            <button
              onClick={onOpenSeoModal}
              className="hidden sm:flex bg-[#0e0e0d] border border-[#3c4a42] text-[#35dec1] hover:text-white px-2.5 py-1 rounded-full text-xs font-bold items-center gap-1 transition-all active:scale-95 shadow"
              title="Impostazioni SEO & OpenGraph"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEO</span>
            </button>
          )}

          {/* Quick App Live Button */}
          <button
            onClick={onOpenFullscreen}
            className="hidden sm:flex bg-[#1c1c1a] hover:bg-[#2a2a28] border border-[#3c4a42]/50 text-[#e5e2df] px-2.5 py-1 rounded-full text-xs font-medium items-center gap-1 transition-all active:scale-95"
            title="Anteprima Fullscreen Web App Live"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#10b981]" />
            <span>App Live</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full bg-[#1c1c1a] text-[#bbcabf] hover:text-[#e5e2df] transition-colors border border-[#3c4a42]/30"
            title="Cambia Tema"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center gap-1 ${
              isMenuOpen
                ? 'bg-[#10b981] text-[#003824] border-[#10b981]'
                : 'bg-[#1c1c1a] text-[#e5e2df] border-[#3c4a42]/50 hover:bg-[#2a2a28]'
            }`}
            title="Menù Opzioni e Strumenti"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 font-bold" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Hamburger Dropdown Menu Modal */}
          {isMenuOpen && (
            <div className="absolute top-14 right-3 w-64 bg-[#1c1c1a]/98 backdrop-blur-xl border border-[#3c4a42]/80 rounded-2xl p-2 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 text-xs">
              
              <div className="px-3 py-2 border-b border-[#3c4a42]/40 mb-1 flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#bbcabf] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Menù Navigazione</span>
                </span>
                <span className="text-[9px] bg-[#10b981]/20 text-[#10b981] px-1.5 py-0.5 rounded font-bold">
                  v2.5
                </span>
              </div>

              {/* Menu Item: Tour Guidato */}
              {onOpenTour && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenTour();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#10b981]/15 text-[#e5e2df] hover:text-[#10b981] font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Tour Guidato</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Spiegazione passaggi app</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item: Salva Modifiche */}
              {onSave && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSaveClick();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#10b981]/15 text-[#e5e2df] hover:text-[#10b981] font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
                      <Save className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Salva Progetto</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">
                        {lastSavedTime ? `Ultimo salvataggio: ${lastSavedTime}` : 'Salva stato nel browser'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item: Annulla Modifica AI */}
              {onUndo && (
                <button
                  onClick={() => {
                    if (canUndo) {
                      setIsMenuOpen(false);
                      onUndo();
                    }
                  }}
                  disabled={!canUndo}
                  className={`w-full p-2.5 rounded-xl font-semibold flex items-center justify-between transition-colors group ${
                    canUndo
                      ? 'hover:bg-[#35dec1]/15 text-[#e5e2df] hover:text-[#35dec1]'
                      : 'opacity-40 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#35dec1]/20 text-[#35dec1] flex items-center justify-center shrink-0">
                      <Undo2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Annulla Modifica ({undoCount}/3)</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Ripristina versione precedente</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
              {onOpenProDashboard && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProDashboard();
                  }}
                  className={`w-full p-2.5 rounded-xl font-semibold flex items-center justify-between transition-colors group ${
                    isProUnlocked
                      ? 'bg-[#6700c9]/25 hover:bg-[#6700c9]/40 text-white border border-[#6700c9]/50'
                      : 'hover:bg-[#10b981]/15 text-[#e5e2df] hover:text-[#10b981]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#6700c9]/40 text-[#cfacff] flex items-center justify-center shrink-0">
                      <Crown className="w-4 h-4 fill-current text-amber-300" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="block font-bold">Dashboard Pro Studio</span>
                        {isProUnlocked && (
                          <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.2 rounded">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Analytics, App e Fatturazione</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item 1: Piani Pro */}
              {onOpenSubscriptionPlans && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSubscriptionPlans();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#10b981]/15 text-[#e5e2df] hover:text-[#10b981] font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
                      <Crown className="w-4 h-4 fill-current" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Piani & Abbonamenti Pro</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Sblocca funzioni SaaS avanzate</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item 2: SEO Settings */}
              {onOpenSeoModal && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSeoModal();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#35dec1]/15 text-[#e5e2df] hover:text-[#35dec1] font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#35dec1]/20 text-[#35dec1] flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Impostazioni SEO & Meta</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Google Search & OpenGraph</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item 3: Copilota Chat */}
              {onOpenChatModal && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenChatModal();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#6700c9]/20 text-[#e5e2df] hover:text-[#cfacff] font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#6700c9]/30 text-[#cfacff] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Copilota AI Chat</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Modifica sito con assistente</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item 4: Plancia Modellazione */}
              {onOpenModelingStudio && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenModelingStudio();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#10b981]/15 text-[#e5e2df] hover:text-[#10b981] font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Studio Modellazione</span>
                      <span className="text-[10px] text-[#bbcabf] font-normal">Personalizza layout & dati</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Menu Item 5: Anteprima App Live */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenFullscreen();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/10 text-[#e5e2df] hover:text-white font-semibold flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 text-[#10b981] flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Anteprima Web App Live</span>
                    <span className="text-[10px] text-[#bbcabf] font-normal">Simulatore smartphone reale</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Menu Item 6: Pubblica & Messa Online */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenExportGuide();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/10 text-[#e5e2df] hover:text-white font-semibold flex items-center justify-between transition-colors group border-t border-[#3c4a42]/40 pt-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Pubblica & Messa Online</span>
                    <span className="text-[10px] text-[#bbcabf] font-normal">Vercel 1-Click e codice ZIP</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#bbcabf] group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Menu Item 7: Switch Tema */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onToggleDarkMode();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/10 text-[#e5e2df] font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Tema {darkMode ? 'Chiaro' : 'Scuro'}</span>
                    <span className="text-[10px] text-[#bbcabf] font-normal">Passa a modalità {darkMode ? 'Light' : 'Dark'}</span>
                  </div>
                </div>
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};
