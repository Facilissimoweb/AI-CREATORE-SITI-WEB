import React, { useState } from 'react';
import { Headphones, X, Check, MessageCircle, Phone, User, Sparkles } from 'lucide-react';
import { WebsiteBlueprint } from '../types';

interface DesignerModalProps {
  blueprint: WebsiteBlueprint;
  onClose: () => void;
}

export const DesignerModal: React.FC<DesignerModalProps> = ({ blueprint, onClose }) => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim()) return;
    setSubmitted(true);
  };

  const projectCode = `FAC-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-[#1c1c1a] border border-[#3c4a42]/50 rounded-3xl p-5 shadow-2xl space-y-4 text-[#e5e2df] relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#e5e2df]">Designer Dedicato</h3>
            <p className="text-xs text-[#bbcabf]">Assistenza umana gratuita e personalizzata</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-[#10b981]/15 border border-[#10b981] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#10b981] text-[#003824] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#10b981]">Richiesta Inviata con Successo!</h4>
              <p className="text-xs text-[#bbcabf] mt-1 leading-relaxed">
                Il tuo codice progetto è <strong>{projectCode}</strong>. Un web designer ti ricontatterà al <strong>{userPhone}</strong> su WhatsApp entro 2 ore lavorative!
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#10b981] text-[#003824] font-bold text-xs"
            >
              Torna al Progetto
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0e0e0d] border border-[#3c4a42]/30 text-xs space-y-1">
              <span className="text-[#86948a] block text-[10px] uppercase font-bold">Codice Bozza Progetto</span>
              <span className="font-mono font-bold text-[#10b981] text-sm">{projectCode}</span>
              <span className="text-[#bbcabf] block text-[11px]">Progetto: {blueprint.businessName}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[#bbcabf] block mb-1">Nome e Cognome</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es: Maria Rossi"
                  className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-[#e5e2df] placeholder-[#bbcabf]/40 focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="text-[#bbcabf] block mb-1">Numero di Telefono o WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Es: +39 333 1234567"
                  className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-[#e5e2df] placeholder-[#bbcabf]/40 focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="text-[#bbcabf] block mb-1">Note o Richieste Speciali (Opzionale)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Es: 'Vorrei aggiungere il logo aziendale e il booking di Google'..."
                  className="w-full bg-[#0e0e0d] border border-[#3c4a42] rounded-xl px-3 py-2.5 text-[#e5e2df] placeholder-[#bbcabf]/40 focus:outline-none focus:border-[#10b981] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Invia e Ricevi Chiamata / WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
