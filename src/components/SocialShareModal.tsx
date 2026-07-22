import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Send,
  QrCode,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { WebsiteBlueprint } from '../types';

interface SocialShareModalProps {
  blueprint: WebsiteBlueprint;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  blueprint,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Construct sharing link & text
  const shareUrl = window.location.href;
  const shareTitle = `Scopri ${blueprint.businessName} - ${blueprint.tagline || 'La nostra Web App'}`;
  const whatsappMsg = encodeURIComponent(
    `👋 Ciao! Guarda la nostra Web App "${blueprint.businessName}": ${shareUrl}`
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1c1a] border border-[#3c4a42] rounded-3xl p-5 shadow-2xl text-[#e5e2df] space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3c4a42]/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Condividi la tua Web App</h2>
              <p className="text-[11px] text-[#bbcabf]">
                Diffondi il tuo sito sui social network e invialo ai tuoi clienti
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Preview Badge */}
        <div className="p-3 bg-[#2a2a28] rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] font-black text-lg shrink-0">
            {blueprint.businessName?.charAt(0) || 'W'}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate">{blueprint.businessName}</h3>
            <p className="text-xs text-[#10b981] font-medium truncate">{blueprint.city || 'Italia'} • {blueprint.categoryLabel || 'Attività'}</p>
          </div>
        </div>

        {/* Social Share Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 rounded-2xl flex items-center gap-2.5 text-[#25D366] font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#25D366] text-black flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left leading-tight">
              <span className="block font-black">WhatsApp</span>
              <span className="text-[10px] opacity-80">Invia in chat</span>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/50 rounded-2xl flex items-center gap-2.5 text-[#1877F2] font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0">
              <Facebook className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left leading-tight">
              <span className="block font-black">Facebook</span>
              <span className="text-[10px] opacity-80">Pubblica post</span>
            </div>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/50 rounded-2xl flex items-center gap-2.5 text-[#229ED9] font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#229ED9] text-white flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <span className="block font-black">Telegram</span>
              <span className="text-[10px] opacity-80">Invia canale</span>
            </div>
          </a>

          {/* QR Code Scan Toggle */}
          <button
            onClick={() => setShowQr(!showQr)}
            className="p-3 bg-[#6700c9]/20 hover:bg-[#6700c9]/30 border border-[#6700c9]/50 rounded-2xl flex items-center gap-2.5 text-[#cfacff] font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#6700c9] text-white flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <span className="block font-black">Codice QR</span>
              <span className="text-[10px] opacity-80">Scansiona da smartphone</span>
            </div>
          </button>
        </div>

        {/* QR Code Display Modal View */}
        {showQr && (
          <div className="p-4 bg-white text-black rounded-2xl flex flex-col items-center justify-center space-y-2 animate-in zoom-in-95 duration-150">
            <Smartphone className="w-6 h-6 text-[#10b981]" />
            <span className="text-xs font-black text-gray-900 text-center">
              Scansiona con la fotocamera per aprire la Web App su cellulare
            </span>
            <div className="p-3 bg-gray-100 rounded-xl border border-gray-300">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
                alt="QR Code Web App"
                className="w-40 h-40 object-contain rounded"
              />
            </div>
          </div>
        )}

        {/* Copy Direct Link Section */}
        <div className="space-y-1.5 pt-2 border-t border-[#3c4a42]/50">
          <label className="text-[11px] font-bold text-[#bbcabf] block">
            Link Diretto della tua Web App:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#131312] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs text-white focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#10b981] hover:bg-[#059669] text-[#003824]'
              }`}
            >
              {copied ? <Check className="w-4 h-4 font-extrabold" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiato!' : 'Copia'}</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-white font-bold text-xs transition-colors text-center"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};
