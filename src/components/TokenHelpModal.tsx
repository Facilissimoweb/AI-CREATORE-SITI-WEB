import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Save,
  MessageCircle
} from 'lucide-react';

interface TokenHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavedTokens?: () => void;
}

export const TokenHelpModal: React.FC<TokenHelpModalProps> = ({
  isOpen,
  onClose,
  onSavedTokens,
}) => {
  const [vercelToken, setVercelToken] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const storedVercel = localStorage.getItem('facilissimoweb_vercel_token') || '';
      const storedGemini = localStorage.getItem('facilissimoweb_gemini_key') || '';
      setVercelToken(storedVercel);
      setGeminiKey(storedGemini);
    } catch (e) {
      console.warn("Could not load tokens from localStorage:", e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem('facilissimoweb_vercel_token', vercelToken.trim());
      localStorage.setItem('facilissimoweb_gemini_key', geminiKey.trim());
      setSavedSuccess(true);
      if (onSavedTokens) onSavedTokens();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Error saving tokens:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#181816] border border-[#3c4a42] w-full max-w-xl rounded-3xl p-5 sm:p-6 text-[#e5e2df] shadow-2xl space-y-5 relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3c4a42]/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6700c9]/20 text-[#cfacff] flex items-center justify-center border border-[#6700c9]/40 shrink-0">
              <Key className="w-5 h-5 text-[#35dec1]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Spiegazione Token Vercel & Chiave AI</span>
                <span className="bg-[#10b981]/20 text-[#10b981] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#10b981]/40 uppercase">
                  Guida Completa
                </span>
              </h2>
              <p className="text-xs text-[#bbcabf]">
                Scopri dove inserire il tuo Token Vercel e la chiave Gemini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Question Answer Block */}
        <div className="bg-[#10b981]/10 border border-[#10b981]/40 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#10b981] font-bold">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Perché il tuo Token Vercel non funzionava per la Generazione IA?</span>
          </div>
          <p className="text-[#e5e2df] leading-relaxed">
            Il token che hai creato (<strong className="text-white">Tokens Vercel-AI-Integration</strong>) è un <strong className="text-[#35dec1]">Vercel Personal Access Token (PAT)</strong>.
            Questo token serve per <strong className="text-white">pubblicare il sito web direttamente sul tuo account Vercel</strong> con 1 Click.
          </p>
          <p className="text-[#bbcabf] leading-relaxed">
            Per l'Intelligenza Artificiale (generazione testi, idee e copywriting), la Web App utilizza l'API <strong className="text-white">Google Gemini</strong> (gratuita su Google AI Studio).
          </p>
        </div>

        {/* Token Inputs Form */}
        <div className="space-y-4">
          
          {/* Input 1: Vercel Token */}
          <div className="bg-[#242422] border border-[#3c4a42] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#35dec1]" />
                <span>1. Token Vercel (Per Pubblicazione 1-Click)</span>
              </label>
              <span className="text-[10px] text-[#bbcabf] font-mono">Inizia con 'ver_' o stringa</span>
            </div>
            <p className="text-[11px] text-[#bbcabf]">
              Incolla qui il tuo token <code className="text-[#35dec1] bg-black/40 px-1.5 py-0.5 rounded">Tokens Vercel-AI-Integration</code> creato su Vercel.
            </p>
            <input
              type="password"
              value={vercelToken}
              onChange={(e) => setVercelToken(e.target.value)}
              placeholder="Incolla il token Vercel (es. ver_123456...)"
              className="w-full bg-[#181816] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
            />
          </div>

          {/* Input 2: Gemini API Key */}
          <div className="bg-[#242422] border border-[#3c4a42] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#cfacff]" />
                <span>2. Google Gemini API Key (Opzionale per IA)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#35dec1] hover:underline flex items-center gap-1"
              >
                <span>Ottieni Gratis</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#bbcabf]">
              Se hai una tua chiave API Google Gemini, incollala qui (inizia con <code className="text-white bg-black/40 px-1 py-0.5 rounded">AIzaSy...</code>).
            </p>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Incolla la tua Gemini API Key (es. AIzaSy...)"
              className="w-full bg-[#181816] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6700c9]"
            />
          </div>
        </div>

        {/* Save Button & Status */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3c4a42]/50">
          <div className="flex items-center gap-2 text-xs text-[#10b981]">
            <ShieldCheck className="w-4 h-4" />
            <span>I token vengono salvati in modo sicuro nel tuo browser.</span>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#10b981]/20"
          >
            <Save className="w-4 h-4" />
            <span>Salva Token e Chiavi</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Token e Chiavi salvati con successo! Saranno usati per le tue richieste.</span>
          </div>
        )}

      </div>
    </div>
  );
};
