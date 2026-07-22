import React from 'react';
import { Lightbulb, Palette, Globe, Eye } from 'lucide-react';

export type TabType = 'idea' | 'stile' | 'sito' | 'preview';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-3 py-2 max-w-[640px] left-1/2 -translate-x-1/2 bg-[#0e0e0d]/95 backdrop-blur-lg border-t border-[#3c4a42]/40 shadow-[0px_-4px_20px_rgba(0,0,0,0.5)] rounded-t-2xl">
      <button
        onClick={() => onSelectTab('idea')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full transition-all active:scale-95 ${
          activeTab === 'idea'
            ? 'bg-[#6700c9] text-[#cfacff] font-semibold px-4'
            : 'text-[#bbcabf] hover:text-[#e5e2df]'
        }`}
      >
        <Lightbulb className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">L'Idea</span>
      </button>

      <button
        onClick={() => onSelectTab('stile')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full transition-all active:scale-95 ${
          activeTab === 'stile'
            ? 'bg-[#6700c9] text-[#cfacff] font-semibold px-4'
            : 'text-[#bbcabf] hover:text-[#e5e2df]'
        }`}
      >
        <Palette className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Lo Stile</span>
      </button>

      <button
        onClick={() => onSelectTab('sito')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full transition-all active:scale-95 ${
          activeTab === 'sito'
            ? 'bg-[#6700c9] text-[#cfacff] font-semibold px-4'
            : 'text-[#bbcabf] hover:text-[#e5e2df]'
        }`}
      >
        <Globe className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Il Sito</span>
      </button>

      <button
        onClick={() => onSelectTab('preview')}
        className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full transition-all active:scale-95 ${
          activeTab === 'preview'
            ? 'bg-[#10b981] text-[#003824] font-semibold px-4'
            : 'text-[#bbcabf] hover:text-[#e5e2df]'
        }`}
      >
        <Eye className="w-5 h-5 mb-0.5" />
        <span className="text-[11px]">Anteprima</span>
      </button>
    </nav>
  );
};
