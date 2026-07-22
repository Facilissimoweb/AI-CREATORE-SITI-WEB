import React, { useState } from 'react';
import { Save, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface SaveReminderBarProps {
  onSave: () => void;
  lastSavedTime?: string | null;
  isAutoSave?: boolean;
}

export const SaveReminderBar: React.FC<SaveReminderBarProps> = ({
  onSave,
  lastSavedTime,
  isAutoSave = true,
}) => {
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className="w-full bg-[#1c1c1a] border border-[#10b981]/40 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
          {justSaved ? <Check className="w-4 h-4 font-black" /> : <ShieldCheck className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <span className="font-bold text-white flex items-center gap-1.5 truncate">
            <span>{justSaved ? 'Modifiche Salvate!' : 'Salvataggio Progetto'}</span>
            <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
              Auto-Save
            </span>
          </span>
          <p className="text-[10px] text-[#bbcabf] truncate">
            {lastSavedTime
              ? `Ultimo salvataggio locale: ore ${lastSavedTime}`
              : 'I tuoi dati vengono salvati localmente nel browser'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow ${
          justSaved
            ? 'bg-emerald-500 text-black font-extrabold'
            : 'bg-[#10b981] hover:bg-[#059669] text-[#003824]'
        }`}
      >
        <Save className="w-3.5 h-3.5" />
        <span>{justSaved ? 'Salvato!' : 'Salva Ora'}</span>
      </button>
    </div>
  );
};
