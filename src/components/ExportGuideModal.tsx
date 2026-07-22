import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Key,
  Globe,
  X,
  FileCode,
  Share2,
  Check,
  ExternalLink,
  Code,
  Sparkles,
  HelpCircle,
  Copy,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  FolderArchive,
  Layers,
  Zap,
  Loader2,
  Crown,
  FileText
} from 'lucide-react';
import { WebsiteBlueprint } from '../types';
import { deployToVercel, VercelDeployResult } from '../services/vercelDeploymentService';

interface ExportGuideModalProps {
  blueprint: WebsiteBlueprint;
  onClose: () => void;
  onOpenSubscriptionPlans?: () => void;
}

export const ExportGuideModal: React.FC<ExportGuideModalProps> = ({
  blueprint,
  onClose,
  onOpenSubscriptionPlans,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'instructions' | 'vercel' | 'keys'>('vercel');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  
  // Vercel deployment state
  const [vercelDeploying, setVercelDeploying] = useState(false);
  const [vercelResult, setVercelResult] = useState<VercelDeployResult | null>(null);

  const clientSlug = (blueprint.businessName || 'cliente-yyy')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  const handleVercelDeploy = async () => {
    setVercelDeploying(true);
    try {
      const res = await deployToVercel(blueprint);
      setVercelResult(res);
    } catch (err) {
      console.error('Vercel deployment error:', err);
    } finally {
      setVercelDeploying(false);
    }
  };


  const handlePublishHostedSite = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/publish-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: clientSlug,
          blueprint,
          subscriptionPlan: 'abbonamento_saas'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPublishedUrl(`https://ai-creatore-siti-web.vercel.app${data.publicUrl}`);
      }
    } catch (e) {
      console.error("Errore pubblicazione:", e);
      setPublishedUrl(`https://ai-creatore-siti-web.vercel.app/site/${clientSlug}`);
    } finally {
      setPublishing(false);
    }
  };

  // Generate a standalone HTML file bundle for the website
  const generateStandaloneHtml = () => {
    return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blueprint.businessName} - Web App Ufficiale</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${blueprint.colors.background || '#131312'}; color: ${blueprint.colors.text || '#ffffff'}; }
    .nav-active { background-color: ${blueprint.colors.primary || '#10b981'} !important; color: #003824 !important; font-weight: 800 !important; }
  </style>
</head>
<body class="min-h-screen pb-24 relative selection:bg-[#10b981] selection:text-black">

  <!-- Top Navigation Header with Hamburger Menu -->
  <header class="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 p-3.5 flex justify-between items-center max-w-md mx-auto">
    <div class="flex items-center gap-2 min-w-0">
      <div class="w-3 h-3 rounded-full bg-[#10b981] shrink-0 animate-pulse"></div>
      <h1 class="text-sm font-extrabold truncate" style="color: ${blueprint.colors.primary || '#10b981'}">${blueprint.businessName}</h1>
    </div>

    <div class="flex items-center gap-2">
      <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-full text-xs font-bold text-[#003824] flex items-center gap-1 shadow-md hover:scale-105 transition-transform" style="background-color: ${blueprint.colors.primary || '#10b981'}">
        💬 WhatsApp
      </a>
      <!-- Hamburger Button Toggle -->
      <button onclick="toggleMobileMenu()" class="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10 flex items-center justify-center cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>
  </header>

  <!-- Hamburger Drawer Mobile Overlay -->
  <div id="mobileMenu" class="hidden fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6 flex flex-col justify-between transition-all animate-in fade-in duration-200">
    <div class="space-y-6">
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span class="text-[10px] font-extrabold uppercase text-[#10b981] tracking-widest block">Navigazione Web App</span>
          <h2 class="text-lg font-extrabold text-white">${blueprint.businessName}</h2>
        </div>
        <button onclick="toggleMobileMenu()" class="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="space-y-2.5">
        ${blueprint.pages.map((p, idx) => `
          <button onclick="navigateToPage('${p.id}')" class="menu-item-btn w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-[#10b981]/20 border border-white/10 font-bold flex items-center justify-between text-white transition-all">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center text-xs font-black">${idx + 1}</span>
              <span class="text-sm font-extrabold">${p.title}</span>
            </div>
            <span class="text-xs text-[#10b981]">Apri →</span>
          </button>
        `).join('')}
      </nav>
    </div>

    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
      <p class="text-white/70">📍 ${blueprint.address || blueprint.city}</p>
      <p class="text-white/70">📞 ${blueprint.phone}</p>
      <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" rel="noopener" class="w-full py-3 rounded-xl font-bold text-center block text-black shadow-lg" style="background-color: ${blueprint.colors.primary || '#10b981'}">
        Contatta Diretto via WhatsApp
      </a>
    </div>
  </div>

  <!-- Dynamic Pages Container -->
  <main class="max-w-md mx-auto p-4 space-y-6">
    ${blueprint.pages.map((page, pageIdx) => `
      <div id="page-${page.id}" class="app-page-view space-y-5 ${pageIdx === 0 ? '' : 'hidden'}">
        
        <!-- Page Cover Banners / Hero Image -->
        ${page.heroImage ? `
          <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-video border border-white/10">
            <img src="${page.heroImage}" alt="${page.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#10b981] text-[#003824] mb-1 inline-block">
                  ${page.title}
                </span>
                <h2 class="text-white text-lg font-extrabold leading-snug">${page.subtitle}</h2>
              </div>
            </div>
          </div>
        ` : pageIdx === 0 ? `
          <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-video border border-white/10">
            <img src="${blueprint.heroImageUrl}" alt="${blueprint.businessName}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#10b981] text-[#003824] mb-1 inline-block">
                  ${blueprint.category.toUpperCase()} • ${blueprint.city}
                </span>
                <h2 class="text-white text-lg font-extrabold leading-snug">${blueprint.tagline}</h2>
              </div>
            </div>
          </div>
        ` : `
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span class="text-[10px] font-extrabold uppercase text-[#10b981] tracking-widest">${page.title}</span>
            <h2 class="text-lg font-extrabold text-white">${page.subtitle}</h2>
          </div>
        `}

        <!-- Render Sections -->
        ${page.sections.map(sec => `
          <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <h3 class="font-bold text-base" style="color: ${blueprint.colors.primary}">${sec.title}</h3>
            <p class="text-xs opacity-80 leading-relaxed">${sec.description}</p>

            ${sec.contentItems && sec.contentItems.length > 0 ? `
              <div class="space-y-2.5 pt-1">
                ${sec.contentItems.map(item => `
                  <div class="p-3 rounded-2xl bg-black/40 border border-white/10 flex justify-between items-center text-xs gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20">` : ''}
                      <div class="min-w-0">
                        <span class="font-bold block text-white truncate text-xs">${item.title}</span>
                        ${item.subtitle ? `<span class="text-[10px] opacity-70 block truncate">${item.subtitle}</span>` : ''}
                      </div>
                    </div>
                    ${item.price ? `<span class="font-extrabold text-xs px-2.5 py-1 rounded-lg bg-white/10 shrink-0" style="color: ${blueprint.colors.primary}">${item.price}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}

        ${pageIdx === 0 ? `
          <!-- Chi Siamo / Informazioni -->
          <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
            <h3 class="font-bold text-sm" style="color: ${blueprint.colors.primary}">Chi Siamo</h3>
            <p class="text-xs opacity-80 leading-relaxed">${blueprint.description}</p>
          </div>

          <!-- Direct Booking Form Widget -->
          <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <h3 class="font-bold text-sm" style="color: ${blueprint.colors.primary}">📅 Prenotazione Diretta via WhatsApp</h3>
            <form onsubmit="handleDirectBooking(event)" class="space-y-2.5 text-xs">
              <input type="text" id="bkName" required placeholder="Il tuo Nome e Cognome" class="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/40 focus:outline-none">
              <div class="grid grid-cols-2 gap-2">
                <input type="date" id="bkDate" required class="bg-black/50 border border-white/20 rounded-xl px-2.5 py-2 text-white focus:outline-none">
                <input type="time" id="bkTime" required class="bg-black/50 border border-white/20 rounded-xl px-2.5 py-2 text-white focus:outline-none">
              </div>
              <button type="submit" class="w-full py-3.5 rounded-xl font-bold text-xs text-black shadow-lg transition-transform active:scale-95" style="background-color: ${blueprint.colors.primary}">
                Invia Prenotazione su WhatsApp
              </button>
            </form>
          </div>

          <!-- Contacts Section -->
          <div class="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <h3 class="font-bold text-sm" style="color: ${blueprint.colors.primary}">📍 Orari & Contatti Ufficiali</h3>
            <p class="opacity-90"><strong>Indirizzo:</strong> ${blueprint.address}</p>
            <p class="opacity-90"><strong>Telefono:</strong> ${blueprint.phone}</p>
            <p class="opacity-90"><strong>Orari:</strong> ${blueprint.openingHours}</p>
          </div>
        ` : ''}

      </div>
    `).join('')}
  </main>

  <!-- Bottom Mobile Navigation Bar -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-2.5 flex justify-around items-center max-w-md mx-auto">
    ${blueprint.pages.map((p, idx) => `
      <button id="nav-btn-${p.id}" onclick="navigateToPage('${p.id}')" class="nav-tab-btn flex-1 py-2 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${idx === 0 ? 'nav-active' : 'text-white/70 hover:text-white'}">
        <span class="truncate max-w-[80px]">${p.title}</span>
      </button>
    `).join('')}
  </nav>

  <!-- Interactive JavaScript Page Switcher -->
  <script>
    function navigateToPage(pageId) {
      document.querySelectorAll('.app-page-view').forEach(el => el.classList.add('hidden'));
      const activePage = document.getElementById('page-' + pageId);
      if (activePage) activePage.classList.remove('hidden');

      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.remove('nav-active', 'bg-[#10b981]', 'text-[#003824]', 'font-extrabold');
        btn.classList.add('text-white/70');
      });

      const activeNav = document.getElementById('nav-btn-' + pageId);
      if (activeNav) {
        activeNav.classList.add('nav-active');
        activeNav.classList.remove('text-white/70');
      }

      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.toggle('hidden');
    }

    function handleDirectBooking(e) {
      e.preventDefault();
      const name = document.getElementById('bkName').value;
      const date = document.getElementById('bkDate').value;
      const time = document.getElementById('bkTime').value;
      const msg = encodeURIComponent("Salve, vorrei prenotare per " + name + " in data " + date + " alle ore " + time);
      window.open("https://wa.me/${blueprint.whatsapp}?text=" + msg, "_blank");
    }
  </script>
</body>
</html>`;
  };

  const generateInstructionsTxt = () => {
    return `========================================================
GUIDA PER LA MESSA ONLINE IN AUTONOMIA
Sito Web: ${blueprint.businessName} (${blueprint.city})
Pagine incluse: ${blueprint.pages.map(p => p.title).join(', ')}
========================================================

Gentile Cliente,
Ecco le istruzioni semplici per pubblicare il tuo sito web!

--------------------------------------------------------
OPZIONE A: Usa un Dominio Personalizzato (es: www.tuonomedominio.it)
--------------------------------------------------------
1. Acquista un dominio su Aruba, Register.it, Namecheap o Hostinger.
2. Accedi al pannello di controllo (cPanel o Gestione File).
3. Entra nella cartella "public_html" o "httpdocs".
4. Carica il file "index.html" estratto da questo archivio ZIP.
5. Il tuo sito con menu ad hamburger e tutte le pagine sarà immediatamente visibile online con HTTPS!

--------------------------------------------------------
OPZIONE B: Hosting Gratuito e Rapido
--------------------------------------------------------
Se desideri un link gratuito e immediato senza acquistare un dominio:
1. Vai su https://tiiny.host oppure https://app.netlify.com/drop
2. Trascina semplicemente il file "index.html" estratto nella pagina.
3. Ottieni subito il tuo link del tipo: https://${blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.tiiny.site

--------------------------------------------------------
ASSISTENZA TECNICA
--------------------------------------------------------
Per qualsiasi modifica a immagini, menu o numeri WhatsApp, puoi ricontattare la nostra piattaforma Facilissimo Web.`;
  };

  const handleSimulatePayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setIsPaid(true);
    }, 1000);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const slug = (blueprint.businessName || 'sito-web')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');

    // Interactive multi-page HTML
    zip.file('index.html', generateStandaloneHtml());

    // Structured JSON data
    zip.file('blueprint.json', JSON.stringify(blueprint, null, 2));

    // Metadata
    zip.file('metadata.json', JSON.stringify({
      name: blueprint.businessName,
      category: blueprint.category,
      city: blueprint.city,
      pagesCount: blueprint.pages.length,
      updatedAt: new Date().toISOString()
    }, null, 2));

    // Instructions file
    zip.file('ISTRUZIONI_PUBBLICAZIONE_SITO.txt', generateInstructionsTxt());

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${slug}_pacchetto_web_app_completo.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `index.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTxtInstructions = () => {
    const txtContent = generateInstructionsTxt();
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ISTRUZIONI_PUBBLICAZIONE_SITO.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(blueprint, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateStandaloneHtml());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[520px] bg-[#1c1c1a] border border-[#3c4a42]/60 rounded-3xl p-5 shadow-2xl text-[#e5e2df] relative max-h-[92vh] flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a28] text-[#bbcabf] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#e5e2df] flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-[#10b981]" />
              <span>Pubblicazione & Messa Online</span>
            </h3>
            {onOpenSubscriptionPlans && (
              <button
                onClick={onOpenSubscriptionPlans}
                className="px-2.5 py-1 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-full font-bold text-[11px] flex items-center gap-1 shadow transition-transform active:scale-95"
              >
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>Piani Pro</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[#bbcabf]">
            Gestisci la pubblicazione in abbonamento SaaS oppure la vendita del codice standalone.
          </p>
        </div>
        {/* Tab Selection */}
        <div className="flex bg-[#0e0e0d] p-1 rounded-2xl border border-[#3c4a42]/40 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex-1 min-w-[120px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'bg-[#10b981] text-[#003824] shadow font-bold'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#003824]" />
            <span>Vercel 1-Click</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 min-w-[120px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'bg-[#10b981] text-[#003824] shadow font-bold'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SaaS Gestito</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 min-w-[120px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'download'
                ? 'bg-[#10b981] text-[#003824] shadow font-bold'
                : 'text-[#bbcabf] hover:text-[#e5e2df]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Codice Zip</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 text-xs text-[#e5e2df]">
          
          {/* TAB: VERCEL DEPLOYMENT UTILITY */}
          {activeTab === 'vercel' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Zap className="w-5 h-5 text-[#10b981]" />
                    <span>Integrazione Vercel API & Staging Link</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold">
                    AUTOMATICO
                  </span>
                </div>
                <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                  Genera dinamicamente un sottodominio / link di staging per consentire al tuo cliente di visualizzare la sua <strong>Web App Mobile First</strong> su qualsiasi smartphone.
                </p>
                <div className="p-2.5 bg-[#1c1c1a] rounded-xl border border-[#3c4a42]/40 text-[11px] font-mono text-[#35dec1] truncate">
                  https://ai-creatore-siti-web.vercel.app/site/{clientSlug}
                </div>
              </div>

              {!vercelResult ? (
                <button
                  onClick={handleVercelDeploy}
                  disabled={vercelDeploying}
                  className="w-full py-3.5 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg text-xs"
                >
                  {vercelDeploying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connessione a Vercel & Generazione Link in corso...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>🚀 Genera Link Pubblico Staging / Vercel per il Cliente</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-[#10b981]/15 border-2 border-[#10b981] space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-[#10b981] font-bold">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Link di Staging / Vercel Generato con Successo!</span>
                  </div>
                  <p className="text-xs text-[#bbcabf] leading-relaxed">
                    {vercelResult.message}
                  </p>
                  
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-[#10b981] break-all">
                    {vercelResult.deploymentUrl}
                  </div>

                  <a
                    href={vercelResult.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#10b981] text-[#003824] font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md hover:bg-[#059669] transition-all"
                  >
                    <span>Apri Link Web App Mobile First</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/40 space-y-1.5 text-[11px] text-[#bbcabf]">
                <span className="font-bold text-white flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Configurazione Chiave Vercel API</span>
                </span>
                <p>
                  Per pubblicare direttamente sul tuo account Vercel personale o di agenzia, inserisci <code>VERCEL_TOKEN</code> nelle variabili d'ambiente di Vercel/AI Studio.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                  <Globe className="w-5 h-5 shrink-0" />
                  <span>Sito Pubblico in Abbonamento (SaaS Managed)</span>
                </div>
                <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                  In questa modalità il cliente mantiene il sito attivo sul link <strong>ai-creatore-siti-web.vercel.app/site/{clientSlug}</strong> tramite un abbonamento mensile/annuale.
                </p>
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-[11px] font-mono text-[#10b981] flex justify-between items-center">
                  <span className="truncate">https://ai-creatore-siti-web.vercel.app/site/{clientSlug}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-sans font-bold">LINK ATTIVO</span>
                </div>
              </div>

              {!publishedUrl ? (
                <button
                  onClick={handlePublishHostedSite}
                  disabled={publishing}
                  className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
                >
                  {publishing ? (
                    <span>Generazione Link Pubblico in corso...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simula Pubblicazione On-Line (Abbonamento SaaS)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-[#10b981]/20 border-2 border-[#10b981] space-y-3">
                  <div className="flex items-center gap-2 text-[#10b981] font-bold">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Sito Pubblicato Ufficialmente On-Line!</span>
                  </div>
                  <p className="text-xs text-[#bbcabf]">
                    Il sito è attivo ed erogato dal server Facilissimo Web. Puoi provarlo subito aprirlo in una nuova scheda:
                  </p>
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#10b981] text-[#003824] font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md"
                  >
                    <span>Apri Link Pubblico Real-time</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/40 space-y-2">
                <h4 className="font-bold text-[#35dec1] text-xs">🔒 Protezione Codice & Modifiche a Pagamento</h4>
                <ul className="list-disc list-inside text-[11px] text-[#bbcabf] space-y-1.5 leading-relaxed">
                  <li><strong>Nessun Accesso al Codice Sorgente:</strong> Il cliente naviga solo sul link finale e non possiede il file <code>.html</code>.</li>
                  <li><strong>Richieste Modifiche:</strong> Per aggiornare i prezzi o il menu, il cliente paga una quota aggiuntiva per intervento oppure utilizza le sue credenziali cliente.</li>
                  <li><strong>Disattivazione Automatica:</strong> Se l'abbonamento mensile scade o viene annullato, il link <code>/site/{clientSlug}</code> viene sospeso dal tuo server.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-3">
              {/* Payment Unlock Box for Client Autonomy */}
              {!isPaid ? (
                <div className="p-4 rounded-2xl bg-[#6700c9]/10 border-2 border-[#6700c9]/40 space-y-3">
                  <div className="flex items-center gap-2 text-[#cfacff] font-bold">
                    <CreditCard className="w-5 h-5 text-[#35dec1]" />
                    <span>Sblocco Codice Standalone (Una Tantum)</span>
                  </div>
                  <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                    Il cliente paga una cifra una tantum (es: € 149,00) per acquistare la licenza del codice HTML e caricarlo sul suo hosting personale (Aruba, Register, ecc.).
                  </p>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={paymentLoading}
                    className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                  >
                    {paymentLoading ? (
                      <span>Elaborazione Pagamento Sicuro...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sblocca e Scarica Codice Sorgente (€ 149.00)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#10b981]/15 border border-[#10b981] flex items-center gap-2 text-[#10b981] font-bold">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Acquisto Codice Confermato! File pronto per il download.</span>
                </div>
              )}

              {/* Download Actions */}
              <div className="p-3.5 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/40 space-y-2.5">
                <div className="flex items-center gap-2 text-[#10b981] font-bold">
                  <FolderArchive className="w-5 h-5" />
                  <span>1. Pacchetto Completo Web App (.zip) - CONSIGLIATO</span>
                </div>
                <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                  Scarica l'archivio ZIP contenente il file <strong>index.html</strong> completo con menu ad hamburger e tutte le pagine, la configurazione <strong>blueprint.json</strong>, il file <strong>metadata.json</strong> e la guida in <strong>.txt</strong> per Aruba/Hostinger.
                </p>
                <button
                  onClick={handleDownloadZip}
                  className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-[#003824] font-extrabold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Scarica Pacchetto Completo ZIP (.zip)</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#35dec1] font-bold">
                  <FileCode className="w-4 h-4" />
                  <span>2. Singolo File Web App (index.html)</span>
                </div>
                <p className="text-[#bbcabf] text-[11px] leading-relaxed">
                  Scarica unicamente il file <code>index.html</code> autonomo e pronto con navigazione ad hamburger, menu interattivo e form WhatsApp.
                </p>
                <button
                  onClick={handleDownloadHtml}
                  className="w-full py-2.5 bg-[#2a2a28] hover:bg-[#3c4a42] text-[#e5e2df] font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-[#35dec1]" />
                  <span>Scarica Solo index.html</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="py-2.5 bg-[#0e0e0d] border border-[#3c4a42]/40 hover:bg-[#2a2a28] text-[#bbcabf] font-bold rounded-xl flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <Code className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Blueprint JSON</span>
                </button>
                <button
                  onClick={handleDownloadTxtInstructions}
                  className="py-2.5 bg-[#0e0e0d] border border-[#3c4a42]/40 hover:bg-[#2a2a28] text-[#bbcabf] font-bold rounded-xl flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#35dec1]" />
                  <span>Istruzioni TXT</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#0e0e0d] border border-[#3c4a42]/40 space-y-2">
                <h4 className="font-bold text-[#10b981] text-xs">Confronto Modelli di Business per Facilissimo Web</h4>
                <div className="space-y-2 text-[11px] text-[#bbcabf]">
                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <strong className="text-[#10b981] block">1. Modello Abbonamento (SaaS Managed)</strong>
                    <p>• Il cliente paga es. €9,90/mese per mantenere il sito attivo sul link FacilissimoWeb.</p>
                    <p>• Il cliente <strong>NON riceve il codice</strong> e non può scaricarlo.</p>
                    <p>• Ogni modifica futura al menu/orari viene pagata a consumo o gestita dal tuo pannello AI.</p>
                  </div>

                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 space-y-1">
                    <strong className="text-[#cfacff] block">2. Modello Vendita Codice Standalone</strong>
                    <p>• Il cliente paga es. €149 una tantum per il pacchetto completo HTML/CSS.</p>
                    <p>• Il cliente è proprietario del file e lo carica su Aruba/Register.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#10b981] text-[#003824] font-bold text-xs rounded-xl"
        >
          Chiudi Guida
        </button>
      </div>
    </div>
  );
};
