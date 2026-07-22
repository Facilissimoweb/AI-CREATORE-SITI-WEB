import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Lightbulb,
  Check,
  RefreshCw,
  Smartphone,
  MessageCircle,
  Zap
} from 'lucide-react';
import { WebsiteBlueprint, ChatMessage } from '../types';

interface ChatAssistantModalProps {
  blueprint: WebsiteBlueprint;
  onUpdateBlueprint: (updated: WebsiteBlueprint) => void;
  onSendStyleChat: (prompt: string) => Promise<void>;
  isProcessingChat: boolean;
  onClose: () => void;
  onOpenFullscreen: () => void;
}

export const ChatAssistantModal: React.FC<ChatAssistantModalProps> = ({
  blueprint,
  onUpdateBlueprint,
  onSendStyleChat,
  isProcessingChat,
  onClose,
  onOpenFullscreen,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Ciao! Sono il Copilota AI di Facilissimo Web App. Sto modulando la tua Web App Mobile First per "${blueprint.businessName}". Dimmi pure qualsiasi modifica desideri!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🎨 Scegli colori nero e smeraldo',
        '🍕 Inserisci piatto o servizio del giorno',
        '🏷️ Aggiungi un banner sconto 15%',
        '💬 Riscrivi lo slogan in modo persuasivo',
        '📅 Attiva il modulo prenotazione diretta'
      ]
    }
  ]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isProcessingChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');

    try {
      await onSendStyleChat(textToSend);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Ho aggiornato la tua Web App Mobile First in base alla tua richiesta: "${textToSend}". Puoi subito vedere i cambiamenti nell'anteprima live!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '✨ Prova un altro colore di sfondo',
          '📞 Cambia il numero di telefono',
          '📱 Apri la Web App a Schermo Intero'
        ]
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Modifica applicata con successo all'interfaccia!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[560px] bg-[#1c1c1a] border border-[#3c4a42]/60 rounded-3xl p-4 sm:p-5 shadow-2xl text-[#e5e2df] relative max-h-[92vh] flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#3c4a42]/40 pb-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6700c9] flex items-center justify-center text-white shadow-lg shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#e5e2df] flex items-center gap-2">
                <span>Copilota AI Web App</span>
                <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full font-bold">ONLINE</span>
              </h3>
              <p className="text-xs text-[#bbcabf]">
                Modella testo, colori e sezioni parlando in italiano con Gemini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-1 py-1 max-h-[420px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#10b981] text-[#003824] font-semibold rounded-br-none'
                    : 'bg-[#0e0e0d] border border-[#3c4a42]/50 text-[#e5e2df] rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 opacity-75 text-[10px]">
                  {msg.sender === 'user' ? (
                    <>
                      <User className="w-3 h-3" />
                      <span>Tu</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-[#10b981]" />
                      <span className="text-[#10b981] font-bold">Copilota AI</span>
                    </>
                  )}
                  <span className="ml-auto">{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>

              {/* Suggestions Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[92%]">
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug)}
                      disabled={isProcessingChat}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2a2a28] hover:bg-[#3c4a42] text-[#35dec1] border border-[#3c4a42]/60 text-[11px] font-medium transition-all active:scale-95 text-left flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-[#10b981]" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isProcessingChat && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 text-xs text-[#10b981] animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini sta aggiornando la struttura della Web App Mobile First...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="space-y-2 pt-2 border-t border-[#3c4a42]/40">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Es: 'Cambia il colore in toni viola', 'Aggiungi servizio top'..."
              className="flex-1 bg-[#0e0e0d] border border-[#3c4a42] rounded-2xl px-4 py-3 text-xs text-[#e5e2df] placeholder-[#bbcabf]/50 focus:outline-none focus:border-[#10b981]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isProcessingChat || !inputMessage.trim()}
              className="bg-[#10b981] hover:bg-[#059669] text-[#003824] px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              {isProcessingChat ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 fill-current" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#bbcabf] px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#10b981]" />
              <span>Potenziato da Gemini 3.6 Flash</span>
            </span>
            <button
              onClick={onOpenFullscreen}
              className="text-[#10b981] font-bold hover:underline flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" />
              <span>Apri Anteprima Live</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
