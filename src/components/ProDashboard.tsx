import React, { useState } from 'react';
import {
  Crown,
  Globe,
  Smartphone,
  TrendingUp,
  Users,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Download,
  RefreshCw,
  Settings,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Activity,
  Eye,
  MousePointerClick,
  Share2,
  Lock,
  X,
  ChevronRight,
  Filter,
  CheckCircle,
  FileText,
  QrCode,
  BellRing,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { WebsiteBlueprint } from '../types';

interface ProDashboardProps {
  blueprint: WebsiteBlueprint;
  isProUnlocked: boolean;
  onClose?: () => void;
  onOpenSubscriptionPlans?: () => void;
  onOpenSeoModal?: () => void;
  onOpenFullscreen?: () => void;
  onOpenExportGuide?: () => void;
}

export const ProDashboard: React.FC<ProDashboardProps> = ({
  blueprint,
  isProUnlocked,
  onClose,
  onOpenSubscriptionPlans,
  onOpenSeoModal,
  onOpenFullscreen,
  onOpenExportGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'apps' | 'subscription' | 'tools'>('analytics');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRebuilding, setIsRebuilding] = useState<string | null>(null);
  const [pushMessage, setPushMessage] = useState('');
  const [pushSent, setPushSent] = useState(false);

  // Live Traffic Simulation State
  const [liveVisitors, setLiveVisitors] = useState<number>(14);
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [reportExported, setReportExported] = useState(false);
  const [liveLogs, setLiveLogs] = useState<Array<{ id: string; time: string; action: string; location: string; device: string; icon: string }>>([
    { id: '1', time: 'Proprio ora', action: 'Prenotazione Tavolo inviata', location: 'Milano', device: 'iPhone 15', icon: '📅' },
    { id: '2', time: '1 min fa', action: 'Aperta chat WhatsApp', location: 'Roma', device: 'Android', icon: '💬' },
    { id: '3', time: '3 min fa', action: 'Visualizzato Menù / Servizi', location: 'Napoli', device: 'iPhone 14', icon: '👁️' },
    { id: '4', time: '5 min fa', action: 'Scansionato QR Code Tavolo', location: 'Torino', device: 'Android', icon: '📱' },
  ]);

  // Simulate periodic live traffic fluctuations
  React.useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(28, prev + delta));
      });

      // Randomly push new live activity event
      const possibleEvents = [
        { action: 'Consultato Menù Online', location: 'Milano', device: 'iOS App', icon: '🍕' },
        { action: 'Richiesta Info WhatsApp', location: 'Bologna', device: 'Mobile', icon: '💬' },
        { action: 'Nuovo click indicazioni Mappa', location: 'Firenze', device: 'Android', icon: '📍' },
        { action: 'Prenotazione ricevuta', location: 'Verona', device: 'Chrome Desktop', icon: '✅' },
      ];

      if (Math.random() > 0.4) {
        const randomEv = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        const newLog = {
          id: Date.now().toString(),
          time: 'Proprio ora',
          ...randomEv,
        };
        setLiveLogs((prev) => [newLog, ...prev.slice(0, 4)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Clean slug for URLs
  const cleanSlug = (blueprint.businessName || 'webapp')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  // Published Apps list with real working site routes
  const [publishedApps, setPublishedApps] = useState([
    {
      id: 'app-current',
      name: blueprint.businessName || 'La Tua Web App',
      category: blueprint.categoryLabel || 'Attività Locale',
      status: 'online',
      url: `https://ai-creatore-siti-web.vercel.app/site/${cleanSlug}`,
      customDomain: `www.${cleanSlug}.it`,
      visitsMonth: '14,820',
      conversions: '1,240',
      lastDeployed: 'Oggi, 04:12',
      isCurrent: true,
    },
    {
      id: 'app-2',
      name: 'Pizzeria Bella Napoli',
      category: 'Ristorazione',
      status: 'online',
      url: 'https://ai-creatore-siti-web.vercel.app/site/pizzeria-bella-napoli',
      customDomain: 'www.pizzeriabellanapoli.it',
      visitsMonth: '6,410',
      conversions: '512',
      lastDeployed: 'Ieri, 18:30',
      isCurrent: false,
    },
    {
      id: 'app-3',
      name: 'Studio Legale De Luca',
      category: 'Consulenza',
      status: 'online',
      url: 'https://ai-creatore-siti-web.vercel.app/site/studio-legale-deluca',
      customDomain: 'www.studiolegaledeluca.com',
      visitsMonth: '3,890',
      conversions: '210',
      lastDeployed: '3 giorni fa',
      isCurrent: false,
    },
    {
      id: 'app-4',
      name: 'Ceramiche Artigianali Trequanda',
      category: 'Artigianato',
      status: 'dns_pending',
      url: 'https://ai-creatore-siti-web.vercel.app/site/ceramiche-trequanda',
      customDomain: 'www.ceramichetrequanda.it',
      visitsMonth: '1,120',
      conversions: '88',
      lastDeployed: 'In attesa DNS',
      isCurrent: false,
    },
  ]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Re-deploy simulation
  const handleRebuild = (id: string) => {
    setIsRebuilding(id);
    setTimeout(() => {
      setIsRebuilding(null);
      setPublishedApps((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, lastDeployed: 'Proprio ora', status: 'online' } : app
        )
      );
    }, 2500);
  };

  // Simulated Analytics Chart Data based on timeframe
  const trafficData = [
    { date: '01 Lug', visite: 340, conversioni: 28 },
    { date: '05 Lug', visite: 480, conversioni: 42 },
    { date: '10 Lug', visite: 620, conversioni: 58 },
    { date: '15 Lug', visite: 890, conversioni: 74 },
    { date: '20 Lug', visite: 1240, conversioni: 112 },
    { date: '25 Lug', visite: 1580, conversioni: 145 },
    { date: '30 Lug', visite: 1820, conversioni: 168 },
  ];

  const sourceData = [
    { name: 'WhatsApp Diretto', value: 45, color: '#25D366' },
    { name: 'Google Search / SEO', value: 30, color: '#10b981' },
    { name: 'Instagram & Social', value: 15, color: '#6700c9' },
    { name: 'QR Code Tavoli', value: 10, color: '#35dec1' },
  ];

  const deviceData = [
    { name: 'Mobile iOS (iPhone)', value: 58, color: '#10b981' },
    { name: 'Mobile Android', value: 36, color: '#35dec1' },
    { name: 'Desktop & Tablet', value: 6, color: '#6700c9' },
  ];

  const invoices = [
    { id: 'INV-2026-003', date: '01 Lug 2026', amount: '€ 39,00', status: 'Pagato', plan: 'Piano Agency Pro' },
    { id: 'INV-2026-002', date: '01 Giu 2026', amount: '€ 39,00', status: 'Pagato', plan: 'Piano Agency Pro' },
    { id: 'INV-2026-001', date: '01 Mag 2026', amount: '€ 39,00', status: 'Pagato', plan: 'Piano Agency Pro' },
  ];

  // If Pro is NOT unlocked, show sleek lock screen
  if (!isProUnlocked) {
    return (
      <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md bg-[#1c1c1a] border border-[#6700c9]/60 rounded-3xl p-6 shadow-2xl text-[#e5e2df] relative text-center space-y-6 animate-in zoom-in-95 duration-200">
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-16 h-16 rounded-2xl bg-[#6700c9]/20 border border-[#6700c9]/50 text-[#cfacff] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#6700c9]/30 text-[#cfacff] border border-[#6700c9]/50 px-3 py-1 rounded-full text-xs font-bold">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>RISERVATO PRO & AGENCY</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Sblocca la Plancia Dashboard Pro
            </h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Gestisci tutte le tue Web App pubblicate, monitora i dati delle visite con grafici interattivi e gestisci il tuo abbonamento da un unico hub professionale.
            </p>
          </div>

          <div className="bg-[#131312] p-4 rounded-2xl border border-white/10 text-left space-y-2 text-xs">
            <div className="font-bold text-white mb-2">Cosa trovi nella Dashboard Pro:</div>
            <div className="flex items-center gap-2 text-[#bbcabf]">
              <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>Grafici analitici su traffico e conversioni WhatsApp</span>
            </div>
            <div className="flex items-center gap-2 text-[#bbcabf]">
              <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>Gestione multi-sito per i tuoi clienti locali</span>
            </div>
            <div className="flex items-center gap-2 text-[#bbcabf]">
              <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>Fatture, domini custom e contatori API Gemini</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onClose) onClose();
              if (onOpenSubscriptionPlans) onOpenSubscriptionPlans();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#003824] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/20 transition-all active:scale-95"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>Sblocca Piano Pro Ora</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[920px] bg-[#1c1c1a] border border-[#3c4a42]/70 rounded-3xl p-4 sm:p-6 shadow-2xl text-[#e5e2df] relative max-h-[96vh] flex flex-col space-y-5 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#3c4a42]/40 pb-4 gap-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#10b981] flex items-center justify-center text-[#003824] shadow-lg shrink-0">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg sm:text-xl text-white">
                  Dashboard Pro Studio
                </h2>
                <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  AGENCY PRO ATTIVO
                </span>
              </div>
              <p className="text-xs text-[#bbcabf]">
                Centro di controllo per app pubblicate, statistiche e fatturazione
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

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#131312] border border-[#3c4a42]/50 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-[#bbcabf] text-[11px] font-medium">
              <span>Visite Uniche</span>
              <Eye className="w-3.5 h-3.5 text-[#10b981]" />
            </div>
            <div className="text-lg font-black text-white">18.420</div>
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +24.5% questo mese
            </div>
          </div>

          <div className="bg-[#131312] border border-[#3c4a42]/50 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-[#bbcabf] text-[11px] font-medium">
              <span>Conversioni / Prenot.</span>
              <MousePointerClick className="w-3.5 h-3.5 text-[#35dec1]" />
            </div>
            <div className="text-lg font-black text-white">1.380</div>
            <div className="text-[10px] text-[#35dec1] font-bold">Tasso Conv. 7,5%</div>
          </div>

          <div className="bg-[#131312] border border-[#3c4a42]/50 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-[#bbcabf] text-[11px] font-medium">
              <span>App Mobile PWA</span>
              <Smartphone className="w-3.5 h-3.5 text-[#cfacff]" />
            </div>
            <div className="text-lg font-black text-white">520</div>
            <div className="text-[10px] text-[#cfacff] font-bold">Installate su Tel</div>
          </div>

          <div className="bg-[#131312] border border-[#3c4a42]/50 p-3 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-[#bbcabf] text-[11px] font-medium">
              <span>Stato Abbonamento</span>
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-white">Pro Agency</div>
            <div className="text-[10px] text-amber-300 font-bold">Rinnovo: 22 Ago</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#3c4a42]/40 pb-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#10b981] text-[#003824] shadow-md'
                : 'bg-[#131312] text-[#bbcabf] hover:text-white border border-[#3c4a42]/30'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Traffico</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'apps'
                ? 'bg-[#10b981] text-[#003824] shadow-md'
                : 'bg-[#131312] text-[#bbcabf] hover:text-white border border-[#3c4a42]/30'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web App Pubblicate ({publishedApps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'subscription'
                ? 'bg-[#10b981] text-[#003824] shadow-md'
                : 'bg-[#131312] text-[#bbcabf] hover:text-white border border-[#3c4a42]/30'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Abbonamento & Fatture</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'tools'
                ? 'bg-[#10b981] text-[#003824] shadow-md'
                : 'bg-[#131312] text-[#bbcabf] hover:text-white border border-[#3c4a42]/30'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Strumenti Pro</span>
          </button>
        </div>

        {/* Tab 1: Analytics & Performance */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 overflow-y-auto pr-1 max-h-[60vh]">
            
            {/* Top Bar: Live Traffic Radar + Timeframe & Export */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Live Traffic Radar Widget */}
              <div className="md:col-span-2 bg-[#131312] border border-[#10b981]/40 p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#10b981]/20 text-[#10b981]">
                      <Activity className="w-4 h-4 animate-pulse" />
                      {isLiveActive && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-sm">Radar Traffico Live</span>
                        <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] font-bold px-2 py-0.5 rounded-full border border-[#10b981]/40">
                          {isLiveActive ? 'IN TEMPO REALE' : 'PAUSA'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#bbcabf] block">
                        Attività utenti attivi sulla Web App in questo istante
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLiveActive(!isLiveActive)}
                    className="px-2.5 py-1 rounded-lg bg-[#2a2a28] hover:bg-[#3c4a42] text-[#bbcabf] hover:text-white text-[11px] font-bold transition-all shrink-0"
                  >
                    {isLiveActive ? 'Pausa Radar' : 'Riprendi Radar'}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#10b981]">{liveVisitors}</span>
                    <span className="text-xs font-bold text-white">utenti connessi ora</span>
                  </div>
                  <div className="text-right text-[10px] text-[#bbcabf]">
                    <span className="text-emerald-400 font-bold block">94% da Smartphone</span>
                    <span>Latenza server: 18ms</span>
                  </div>
                </div>
              </div>

              {/* Timeframe Filter & Report Export */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-3.5 rounded-2xl flex flex-col justify-between text-xs space-y-2">
                <div>
                  <span className="font-bold text-white block mb-1 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>Filtro Temporale Grafici</span>
                  </span>
                  <div className="grid grid-cols-4 gap-1 mt-1.5">
                    {(['7d', '30d', '90d', '1y'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`py-1 rounded-lg font-bold text-[10px] text-center transition-all ${
                          timeframe === t
                            ? 'bg-[#10b981] text-[#003824] shadow-sm'
                            : 'bg-[#2a2a28] text-[#bbcabf] hover:text-white'
                        }`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setReportExported(true);
                    setTimeout(() => setReportExported(false), 3000);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#35dec1] hover:bg-[#20bca3] text-[#003824] font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{reportExported ? 'Report PDF Generato!' : 'Esporta Report Analytics'}</span>
                </button>
              </div>

            </div>

            {/* Main Area Chart */}
            <div className="bg-[#131312] border border-[#3c4a42]/40 p-4 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Andamento Visite Uniche e Conversioni</span>
                  </h3>
                  <p className="text-[11px] text-[#bbcabf]">
                    Sincronizzato dai log Vercel Analytics in tempo reale
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1 text-[#10b981]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Visite
                  </span>
                  <span className="flex items-center gap-1 text-[#6700c9]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6700c9]" /> Conversioni
                  </span>
                </div>
              </div>

              <div className="h-52 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6700c9" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#6700c9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
                    <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1c1c1a',
                        borderColor: '#3c4a42',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visite"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorVisite)"
                    />
                    <Area
                      type="monotone"
                      dataKey="conversioni"
                      stroke="#6700c9"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorConv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Event Stream Feed & Top Pages Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Real-time Activity Stream Feed */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>Feed Eventi in Tempo Reale</span>
                  </h4>
                  <span className="text-[10px] text-[#bbcabf]">Ultimi 5 minuti</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {liveLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{log.icon}</span>
                        <div>
                          <span className="font-bold text-white block">{log.action}</span>
                          <span className="text-[10px] text-[#bbcabf]">
                            Città: {log.location} • Dispositivo: {log.device}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full shrink-0">
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Pages Performance & Estimated Value */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#35dec1]" />
                    <span>Pagine Più Visitate & Valore Generato</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">Stima Valore: € 3.420</span>
                </div>

                <div className="space-y-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>/ (Home Page Principale)</span>
                      <span className="text-[#10b981]">9.580 visite (52%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2a2a28] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full w-[52%]" />
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>/menu (Menù Digitale / Listino)</span>
                      <span className="text-[#35dec1]">5.160 visite (28%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2a2a28] rounded-full overflow-hidden">
                      <div className="h-full bg-[#35dec1] rounded-full w-[28%]" />
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>/prenota (Prenotazioni Online)</span>
                      <span className="text-[#cfacff]">2.580 visite (14%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2a2a28] rounded-full overflow-hidden">
                      <div className="h-full bg-[#cfacff] rounded-full w-[14%]" />
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>/contatti (Contatto Diretto WhatsApp)</span>
                      <span className="text-[#6700c9]">1.100 visite (6%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2a2a28] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6700c9] rounded-full w-[6%]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Secondary Charts: Source & Devices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Traffic Sources */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-3.5 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#35dec1]" />
                  <span>Origine Traffico Principale</span>
                </h4>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} tickLine={false} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1c1c1a',
                          borderColor: '#3c4a42',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Devices Donut Chart */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-3.5 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Dispositivi Utenti</span>
                </h4>
                <div className="h-36 w-full flex items-center justify-between">
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-1.5 text-[11px]">
                    {deviceData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#bbcabf]">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name.split(' ')[0]}
                        </span>
                        <span className="font-bold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Managed Web Apps */}
        {activeTab === 'apps' && (
          <div className="space-y-3 overflow-y-auto pr-1 max-h-[60vh]">
            <div className="flex justify-between items-center bg-[#131312] p-3 rounded-2xl border border-[#3c4a42]/40 text-xs">
              <div>
                <span className="font-bold text-white block">Web App Gestite sotto Licenza Agency</span>
                <span className="text-[11px] text-[#bbcabf]">Puoi pubblicare fino a 10 Web App indipendenti per i tuoi clienti</span>
              </div>
              <button
                onClick={() => {
                  if (onOpenExportGuide) onOpenExportGuide();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#003824] font-bold flex items-center gap-1 text-xs shrink-0 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuova Web App</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {publishedApps.map((app) => (
                <div
                  key={app.id}
                  className={`p-3.5 rounded-2xl border transition-all space-y-3 ${
                    app.isCurrent
                      ? 'bg-[#10b981]/10 border-[#10b981]/60 shadow-lg'
                      : 'bg-[#131312] border-[#3c4a42]/40 hover:border-[#3c4a42]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#2a2a28] flex items-center justify-center text-[#10b981] font-bold text-sm shrink-0">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{app.name}</h4>
                          {app.isCurrent && (
                            <span className="bg-[#10b981] text-[#003824] text-[9px] font-black px-2 py-0.5 rounded-full">
                              ATTUALE IN EDITOR
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#bbcabf] flex items-center gap-2">
                          <span>{app.category}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">{app.customDomain}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#2a2a28] hover:bg-[#3c4a42] text-white text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <ExternalLink className="w-3 h-3 text-[#10b981]" />
                        <span>Apri Live</span>
                      </a>

                      <button
                        onClick={() => handleRebuild(app.id)}
                        disabled={isRebuilding === app.id}
                        className="px-2.5 py-1 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/40 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRebuilding === app.id ? 'animate-spin' : ''}`} />
                        <span>{isRebuilding === app.id ? 'Ricompilazione...' : 'Re-Deploy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2 rounded-xl text-[11px]">
                    <div>
                      <span className="text-[#bbcabf] block">Visite / mese:</span>
                      <span className="font-bold text-white">{app.visitsMonth}</span>
                    </div>
                    <div>
                      <span className="text-[#bbcabf] block">Conversioni:</span>
                      <span className="font-bold text-[#35dec1]">{app.conversions}</span>
                    </div>
                    <div>
                      <span className="text-[#bbcabf] block">Ultimo Deploy:</span>
                      <span className="font-bold text-emerald-400">{app.lastDeployed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Subscription & Billing */}
        {activeTab === 'subscription' && (
          <div className="space-y-4 overflow-y-auto pr-1 max-h-[60vh]">
            
            {/* Subscription Detail Card */}
            <div className="bg-[#131312] border border-[#6700c9]/50 p-4 rounded-3xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6700c9]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#cfacff] fill-current" />
                    <h3 className="font-extrabold text-base text-white">Piano Agency & Reseller Pro</h3>
                  </div>
                  <p className="text-xs text-[#bbcabf]">
                    Licenza annuale attiva con supporto prioritario e domini illimitati
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#cfacff]">€ 39,00 <span className="text-xs font-normal text-[#bbcabf]">/mese</span></div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Rinnovo Aut. 22/08/2026
                  </span>
                </div>
              </div>

              {/* Usage Progress Meters */}
              <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[#bbcabf] mb-1">
                    <span>Richieste AI Gemini 3.6 Flash:</span>
                    <span className="text-white">8.420 / 50.000 (16%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#2a2a28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] rounded-full w-[16%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#bbcabf] mb-1">
                    <span>Slot Web App Pubblicate:</span>
                    <span className="text-white">4 / 10 Slot</span>
                  </div>
                  <div className="w-full h-2 bg-[#2a2a28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#35dec1] rounded-full w-[40%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method & Invoices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Payment Card Info */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Metodo di Pagamento Salvato</span>
                </h4>
                <div className="p-3 bg-black/50 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-8 h-5 bg-indigo-600 rounded text-[9px] font-black text-white flex items-center justify-center">
                      VISA
                    </div>
                    <div>
                      <div className="font-bold text-white">•••• •••• •••• 4242</div>
                      <div className="text-[10px] text-[#bbcabf]">Scadenza 12/28</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                    ATTIVA
                  </span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#10b981]" />
                  <span>Fatture & Ricevute PDF</span>
                </h4>
                <div className="space-y-1.5">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-2 rounded-xl bg-black/40 text-[11px]">
                      <div>
                        <span className="font-bold text-white block">{inv.id}</span>
                        <span className="text-[10px] text-[#bbcabf]">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{inv.amount}</span>
                        <button
                          onClick={() => handleCopy(`Fattura ${inv.id}`, inv.id)}
                          className="p-1 rounded bg-[#2a2a28] hover:bg-[#3c4a42] text-white"
                          title="Scarica Fattura PDF"
                        >
                          <Download className="w-3 h-3 text-[#10b981]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 4: Pro Tools */}
        {activeTab === 'tools' && (
          <div className="space-y-3 overflow-y-auto pr-1 max-h-[60vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Tool 1: QR Code Generator */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <QrCode className="w-4 h-4 text-[#10b981]" />
                  <span>Generatore QR Code per Tavoli & Volantini</span>
                </div>
                <p className="text-[11px] text-[#bbcabf]">
                  Crea un codice QR ad alta risoluzione pronto da stampare sui tavoli del locale per far aprire la Web App all'istante.
                </p>
                <button
                  onClick={() => handleCopy(`https://ai-creatore-siti-web.vercel.app/site/${cleanSlug}`, 'qr-code')}
                  className="w-full py-2 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  {copiedId === 'qr-code' ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'qr-code' ? 'Copiato Link QR!' : 'Scarica QR Code Vettoriale'}</span>
                </button>
              </div>

              {/* Tool 2: Push Notifications AI */}
              <div className="bg-[#131312] border border-[#3c4a42]/40 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <BellRing className="w-4 h-4 text-[#35dec1]" />
                  <span>Invia Notifica Push AI ai Clienti</span>
                </div>
                <p className="text-[11px] text-[#bbcabf]">
                  Invia una notifica promozione WhatsApp o PWA a tutti i clienti registrati.
                </p>
                <input
                  type="text"
                  placeholder="Es: Sconto 20% sulla pizza stasera!"
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  className="w-full bg-[#1c1c1a] border border-[#3c4a42] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#35dec1]"
                />
                <button
                  onClick={() => {
                    setPushSent(true);
                    setTimeout(() => setPushSent(false), 3000);
                  }}
                  className="w-full py-2 bg-[#35dec1] hover:bg-[#20bca3] text-[#003824] font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{pushSent ? 'Notifica Inviata a 520 Dispositivi!' : 'Invia Notifica Ora'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
