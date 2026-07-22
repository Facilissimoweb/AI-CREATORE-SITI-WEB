import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  Crown,
  Download,
  Globe,
  Sparkles,
  CreditCard,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Star,
  Layers,
  Bot,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { WebsiteBlueprint } from '../types';

interface SubscriptionPlansProps {
  blueprint: WebsiteBlueprint;
  onClose?: () => void;
  onPlanUnlocked?: (planName: string) => void;
  onOpenProDashboard?: () => void;
  isUnlocked?: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  blueprint,
  onClose,
  onPlanUnlocked,
  onOpenProDashboard,
  isUnlocked = false
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'agency'>('pro');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(isUnlocked);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(blueprint.businessName || 'Mario Rossi');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Free',
      tagline: 'Per testare la Web App Mobile First',
      priceMonthly: '€ 0',
      priceAnnual: '€ 0',
      period: 'per sempre',
      popular: false,
      badge: 'PROVA',
      color: 'border-[#3c4a42]',
      badgeColor: 'bg-[#2a2a28] text-[#bbcabf]',
      features: [
        { text: 'Anteprima interattiva Mobile First', included: true },
        { text: 'Generazione AI con Gemini 3.6 Flash', included: true },
        { text: 'Modifica testi e colori base', included: true },
        { text: 'Dominio personalizzato (es: miobrand.it)', included: false },
        { text: 'Download codice sorgente completo (.zip)', included: false },
        { text: 'Integrazione Vercel 1-Click', included: false },
        { text: 'Modulo prenotazione WhatsApp diretto', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Pro Web App',
      tagline: 'Ideale per attività locali, ristoranti e professionisti',
      priceMonthly: '€ 19',
      priceAnnual: '€ 15',
      period: billingCycle === 'annual' ? '/mese (fatturato annualmente)' : '/mese',
      popular: true,
      badge: 'PIÙ POPOLARE',
      color: 'border-[#10b981]',
      badgeColor: 'bg-[#10b981] text-[#003824] font-bold',
      features: [
        { text: 'Tutto ciò che include Starter', included: true },
        { text: 'Dominio Personalizzato Unico (.it / .com)', included: true },
        { text: 'Download Codice Sorgente Completo (.zip)', included: true },
        { text: 'Pubblicazione Vercel / Netlify 1-Click', included: true },
        { text: 'Copilota AI Illimitato per modifiche', included: true },
        { text: 'Modulo Prenotazione WhatsApp e Chiamata', included: true },
        { text: 'Certificato SSL HTTPS e hosting ultra-veloce', included: true },
      ]
    },
    {
      id: 'agency',
      name: 'Agency & Reseller',
      tagline: 'Per agenzie web che rivendono siti ai clienti',
      priceMonthly: '€ 49',
      priceAnnual: '€ 39',
      period: billingCycle === 'annual' ? '/mese (fatturato annualmente)' : '/mese',
      popular: false,
      badge: 'AGENCY',
      color: 'border-[#6700c9]',
      badgeColor: 'bg-[#6700c9] text-white font-bold',
      features: [
        { text: 'Tutto ciò che include il piano Pro', included: true },
        { text: 'Web App Illimitate per i tuoi clienti', included: true },
        { text: 'White-Label (senza marchio Facilissimo)', included: true },
        { text: 'Export React + Vite + Tailwind repository', included: true },
        { text: 'API Key Vercel & AI personale integrata', included: true },
        { text: 'Supporto prioritario WhatsApp 7/7', included: true },
      ]
    }
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[1];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onPlanUnlocked) {
        onPlanUnlocked(currentPlan.name);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[840px] bg-[#1c1c1a] border border-[#3c4a42]/60 rounded-3xl p-4 sm:p-6 shadow-2xl text-[#e5e2df] relative max-h-[94vh] flex flex-col space-y-5 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#3c4a42]/40 pb-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#10b981] flex items-center justify-center text-[#003824] shadow-lg shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#e5e2df] flex items-center gap-2">
                <span>Piani & Abbonamenti Facilissimo Web App</span>
                <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 px-2.5 py-0.5 rounded-full font-bold">
                  PRO FEATURES
                </span>
              </h3>
              <p className="text-xs text-[#bbcabf]">
                Sblocca il dominio personalizzato, il codice sorgente completo e la pubblicazione 1-Click
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!showCheckout && !isSuccess ? (
          <>
            {/* Billing Switcher */}
            <div className="flex justify-center items-center">
              <div className="bg-[#0e0e0d] p-1 rounded-2xl border border-[#3c4a42]/60 flex items-center gap-1 text-xs font-bold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-[#2a2a28] text-white shadow'
                      : 'text-[#bbcabf] hover:text-white'
                  }`}
                >
                  Fatturazione Mensile
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    billingCycle === 'annual'
                      ? 'bg-[#10b981] text-[#003824] font-bold shadow'
                      : 'text-[#bbcabf] hover:text-white'
                  }`}
                >
                  <span>Fatturazione Annuale</span>
                  <span className="bg-[#003824] text-[#10b981] text-[10px] px-2 py-0.5 rounded-full font-black">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-1 max-h-[50vh]">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`rounded-2xl p-4 bg-[#0e0e0d] border-2 flex flex-col justify-between transition-all cursor-pointer relative ${
                      plan.color
                    } ${
                      isSelected ? 'ring-2 ring-emerald-400/50 scale-[1.01] bg-[#141412]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#10b981] text-[#003824] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-base text-white">{plan.name}</h4>
                      <p className="text-[11px] text-[#bbcabf] leading-snug">{plan.tagline}</p>

                      <div className="pt-2 pb-1 border-b border-[#3c4a42]/40">
                        <span className="text-2xl font-black text-white">{displayPrice}</span>
                        <span className="text-[10px] text-[#bbcabf] ml-1">{plan.period}</span>
                      </div>

                      <ul className="space-y-2 pt-2 text-[11px]">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            {feat.included ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-[#bbcabf]/40 shrink-0 mt-0.5" />
                            )}
                            <span className={feat.included ? 'text-[#e5e2df]' : 'text-[#bbcabf]/40 line-through'}>
                              {feat.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id as any);
                        if (plan.id === 'starter') {
                          if (onClose) onClose();
                        } else {
                          setShowCheckout(true);
                        }
                      }}
                      className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${
                        plan.popular
                          ? 'bg-[#10b981] hover:bg-[#059669] text-[#003824] shadow-md'
                          : 'bg-[#2a2a28] hover:bg-[#3c4a42] text-white'
                      }`}
                    >
                      <span>{plan.id === 'starter' ? 'Usa Piano Prova' : 'Sblocca Funzionalità Pro'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Info Banner */}
            <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/40 flex items-center justify-between text-xs text-[#bbcabf]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                <span>
                  Garanzia Soddisfatti o Rimborsati 14 giorni. Nessun vincolo, disdici quando vuoi.
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-white shrink-0">
                <Lock className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Pagamento Sicuro SSL</span>
              </div>
            </div>
          </>
        ) : showCheckout && !isSuccess ? (
          /* Mock Payment Checkout Drawer */
          <div className="space-y-4 animate-in fade-in duration-200 max-w-lg mx-auto w-full">
            <button
              onClick={() => setShowCheckout(false)}
              className="text-xs text-[#10b981] font-bold hover:underline flex items-center gap-1"
            >
              ← Torna alla selezione piani
            </button>

            <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#10b981]/50 space-y-3">
              <div className="flex justify-between items-center border-b border-[#3c4a42]/40 pb-2">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Riepilogo Ordine: {currentPlan.name}</h4>
                  <p className="text-[11px] text-[#bbcabf]">
                    Sblocco Immediato Dominio Personalizzato & Codice Sorgente
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-lg text-[#10b981]">
                    {billingCycle === 'annual' ? currentPlan.priceAnnual : currentPlan.priceMonthly}
                  </span>
                  <p className="text-[10px] text-[#bbcabf]">{currentPlan.period}</p>
                </div>
              </div>

              {/* Mock Credit Card Form */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#bbcabf]">Intestatario Carta / Azienda</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#bbcabf]">Numero Carta di Credito (Simulazione)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#10b981]"
                    />
                    <CreditCard className="w-4 h-4 text-[#10b981] absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#bbcabf]">Scadenza</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#bbcabf]">CVV / CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg mt-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Elaborazione pagamento Stripe in corso...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Conferma e Sblocca Piano {currentPlan.name}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success Confirmation */
          <div className="space-y-4 text-center py-6 animate-in zoom-in-95 duration-300 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] text-[#10b981] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">Abbonamento Pro Attivato!</h4>
              <p className="text-xs text-[#bbcabf]">
                Hai sbloccato con successo tutte le funzionalità avanzate per <strong>{blueprint.businessName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#10b981]/40 text-left space-y-2 text-xs">
              <span className="font-bold text-[#10b981] uppercase tracking-wider text-[10px] block">
                Funzionalità Sbloccate Ora Disponibili:
              </span>
              <div className="space-y-1.5 text-[#e5e2df]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10b981]" />
                  <span>Dominio Personalizzato Collegabile (`{blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.it`)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10b981]" />
                  <span>Download file di codice sorgente .ZIP pulito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10b981]" />
                  <span>Integrazione Vercel 1-Click con sottodominio automatico</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {onOpenProDashboard && (
                <button
                  onClick={() => {
                    if (onClose) onClose();
                    onOpenProDashboard();
                  }}
                  className="w-full py-3.5 bg-[#6700c9] text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-[#5200a3] transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-4 h-4 fill-current text-amber-300" />
                  <span>Apri Dashboard Pro Studio</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (onClose) onClose();
                }}
                className="w-full py-3.5 bg-[#10b981] text-[#003824] font-extrabold text-xs rounded-xl shadow-lg hover:bg-[#059669] transition-transform active:scale-95"
              >
                Vai alla tua Web App sbloccata
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
