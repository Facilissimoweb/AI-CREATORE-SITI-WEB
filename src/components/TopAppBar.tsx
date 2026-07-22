import React from 'react';
import { Bolt, Sparkles, Smartphone, Moon, Sun, Download } from 'lucide-react';

interface TopAppBarProps {
  onOpenFullscreen: () => void;
  onOpenExportGuide: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenFullscreen,
  onOpenExportGuide,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-3 h-14 max-w-[640px] left-1/2 -translate-x-1/2 bg-[#131312]/95 backdrop-blur-md border-b border-[#3c4a42]/30 text-[#e5e2df]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
          <Bolt className="w-5 h-5 fill-current" />
        </div>
        <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#10b981] flex items-center gap-1">
          Facilissimo <span className="text-[#e5e2df] font-normal text-xs sm:text-sm">Web</span>
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenExportGuide}
          className="bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/50 text-[#10b981] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
          title="Scarica Sito e Messa Online"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Scarica</span>
        </button>

        <button
          onClick={onOpenFullscreen}
          className="bg-[#1c1c1a] hover:bg-[#2a2a28] border border-[#3c4a42]/50 text-[#e5e2df] px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
          title="Anteprima Fullscreen Sito Live"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="hidden sm:inline">Sito Live</span>
        </button>

        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-full bg-[#1c1c1a] text-[#bbcabf] hover:text-[#e5e2df] transition-colors"
          title="Cambia tema"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
