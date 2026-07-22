import React, { useState, useMemo } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  Sliders,
  ZoomIn,
  ZoomOut,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  Calendar,
  Sparkles,
  Utensils,
  Star,
  Send,
  Lock,
  ArrowLeft,
  Menu,
  Home,
  Layers,
  Globe,
  Settings,
  RefreshCw,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { WebsiteBlueprint } from '../types';

interface FullscreenPreviewProps {
  blueprint: WebsiteBlueprint;
  onClose: () => void;
}

type DeviceType = 'iphone' | 'android' | 'tablet' | 'desktop' | 'custom';
type PreviewRenderMode = 'component' | 'iframe';

interface DevicePreset {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  frameType: 'iphone' | 'android' | 'tablet' | 'desktop';
  description: string;
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'iphone',
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    frameType: 'iphone',
    description: '393 × 852 px (iOS Notch)',
  },
  {
    id: 'android',
    name: 'Galaxy S24',
    width: 412,
    height: 915,
    frameType: 'android',
    description: '412 × 915 px (Camera Punch-hole)',
  },
  {
    id: 'tablet',
    name: 'iPad Air / Tablet',
    width: 768,
    height: 1024,
    frameType: 'tablet',
    description: '768 × 1024 px (Formato Tablet)',
  },
  {
    id: 'desktop',
    name: 'MacBook / Desktop',
    width: 1024,
    height: 680,
    frameType: 'desktop',
    description: '1024 × 680 px (Finestra Browser)',
  },
];

export const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  blueprint,
  onClose,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('iphone');
  const [customWidth, setCustomWidth] = useState<number>(375);
  const [customHeight, setCustomHeight] = useState<number>(812);
  const [isLandscape, setIsLandscape] = useState(false);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [renderMode, setRenderMode] = useState<PreviewRenderMode>('component');
  const [showCustomConfig, setShowCustomConfig] = useState(false);

  // Interactive Client App State
  const [activePageSlug, setActivePageSlug] = useState<string>('/');
  const [bookingName, setBookingName] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-07-22');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  const currentPage =
    blueprint.pages.find((p) => p.slug === activePageSlug) || blueprint.pages[0];

  // Calculate effective width & height based on device preset, landscape toggle, and custom inputs
  const currentPreset = DEVICE_PRESETS.find((d) => d.id === selectedDevice);
  
  let baseWidth = currentPreset ? currentPreset.width : customWidth;
  let baseHeight = currentPreset ? currentPreset.height : customHeight;

  if (isLandscape) {
    const temp = baseWidth;
    baseWidth = baseHeight;
    baseHeight = temp;
  }

  const effectiveWidth = baseWidth;
  const effectiveHeight = baseHeight;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim()) return;
    setBookingConfirmed(true);
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Ciao! Vorrei informazioni per ${blueprint.businessName} (trovato su Facilissimo Web).`
    );
    return `https://wa.me/${blueprint.whatsapp}?text=${text}`;
  };

  // Generate HTML for iframe srcDoc mode
  const iframeSrcDoc = useMemo(() => {
    const page = currentPage;
    return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blueprint.businessName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background-color: ${blueprint.colors.background};
      color: ${blueprint.colors.text};
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between">
  <div>
    <!-- Sticky Nav -->
    <header class="sticky top-0 z-50 bg-[#131312]/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between text-white">
      <div class="font-extrabold text-sm flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block animate-pulse"></span>
        ${blueprint.businessName}
      </div>
      <div class="text-xs font-bold text-[#10b981]">
        ${page.title}
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4 space-y-6">
      <div class="space-y-1">
        <span class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white/10 text-[#10b981]">
          ${page.title}
        </span>
        <h1 class="text-2xl font-extrabold text-white">${page.subtitle}</h1>
      </div>

      <!-- Hero image -->
      <div class="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
        <img src="${blueprint.heroImageUrl}" alt="Hero" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
          <p class="text-white text-xs font-bold drop-shadow">${blueprint.tagline}</p>
        </div>
      </div>

      <!-- Sections -->
      ${page.sections.map((sec) => `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <h2 class="text-base font-bold text-[#10b981]">${sec.title}</h2>
          <p class="text-xs opacity-80 leading-relaxed">${sec.description}</p>

          ${sec.contentItems && sec.contentItems.length > 0 ? `
            <div class="space-y-2 pt-2">
              ${sec.contentItems.map((item) => `
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-bold block text-white">${item.title}</span>
                    ${item.subtitle ? `<span class="text-[10px] opacity-70 block text-gray-300">${item.subtitle}</span>` : ''}
                  </div>
                  ${item.price ? `<span class="font-bold text-xs px-2 py-1 rounded bg-black/40 text-[#10b981]">${item.price}</span>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <!-- Contact Info -->
      <div class="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-gray-300">
        <div>📍 ${blueprint.address}</div>
        <div>📞 ${blueprint.phone}</div>
        <div>🕒 ${blueprint.openingHours}</div>
      </div>
    </main>
  </div>

  <!-- WhatsApp Sticky Footer -->
  <footer class="p-3 bg-[#131312] border-t border-white/10 sticky bottom-0">
    <a href="https://wa.me/${blueprint.whatsapp}" target="_blank" class="w-full py-3 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg">
      💬 Contatta via WhatsApp (${blueprint.phone})
    </a>
  </footer>
</body>
</html>
    `;
  }, [blueprint, currentPage]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-4 overflow-y-auto">
      
      {/* Top Device Control & Toggle Toolbar */}
      <div className="w-full max-w-[1100px] bg-[#1a1a18] border border-[#3c4a42]/50 rounded-2xl p-2.5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-3 text-white mb-2 shrink-0">
        
        {/* Device Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs">
          {DEVICE_PRESETS.map((preset) => {
            const isActive = selectedDevice === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedDevice(preset.id);
                  setShowCustomConfig(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#10b981] text-[#003824] border-[#10b981] shadow-md'
                    : 'bg-[#2a2a28] text-[#bbcabf] hover:text-white border-white/10'
                }`}
                title={preset.description}
              >
                {preset.id === 'iphone' && <Smartphone className="w-4 h-4" />}
                {preset.id === 'android' && <Smartphone className="w-4 h-4 text-emerald-400" />}
                {preset.id === 'tablet' && <Tablet className="w-4 h-4" />}
                {preset.id === 'desktop' && <Monitor className="w-4 h-4" />}
                <span>{preset.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setSelectedDevice('custom');
              setShowCustomConfig(!showCustomConfig);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
              selectedDevice === 'custom'
                ? 'bg-[#6700c9] text-white border-[#cfacff]/50 shadow-md'
                : 'bg-[#2a2a28] text-[#bbcabf] hover:text-white border-white/10'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Personalizzato</span>
          </button>
        </div>

        {/* Center Quick Actions: Landscape Swap, Scale, Render Engine Mode */}
        <div className="flex items-center gap-2 text-xs">
          {/* Orientation Toggle */}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`px-2.5 py-1.5 rounded-xl border font-bold flex items-center gap-1 transition-all ${
              isLandscape
                ? 'bg-[#35dec1] text-[#003824] border-[#35dec1]'
                : 'bg-[#2a2a28] text-[#bbcabf] hover:text-white border-white/10'
            }`}
            title="Ruota Schermo (Orizzontale / Verticale)"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Scale Zoom Selector */}
          <div className="flex items-center bg-[#2a2a28] rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setScaleFactor(Math.max(0.5, scaleFactor - 0.1))}
              className="p-1 hover:text-[#10b981] transition-colors"
              title="Riduci Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-[11px] text-emerald-400">
              {Math.round(scaleFactor * 100)}%
            </span>
            <button
              onClick={() => setScaleFactor(Math.min(1.2, scaleFactor + 0.1))}
              className="p-1 hover:text-[#10b981] transition-colors"
              title="Aumenta Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Render Mode Switcher (Component vs Isolated Iframe) */}
          <div className="flex bg-[#2a2a28] rounded-xl border border-white/10 p-0.5">
            <button
              onClick={() => setRenderMode('component')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                renderMode === 'component' ? 'bg-[#10b981] text-[#003824]' : 'text-[#bbcabf]'
              }`}
            >
              Interactive Shell
            </button>
            <button
              onClick={() => setRenderMode('iframe')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                renderMode === 'iframe' ? 'bg-[#10b981] text-[#003824]' : 'text-[#bbcabf]'
              }`}
            >
              Iframe engine
            </button>
          </div>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
            title="Chiudi Simulatore"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Dimensions Configuration Drawer */}
      {(selectedDevice === 'custom' || showCustomConfig) && (
        <div className="w-full max-w-[1100px] bg-[#131312] border border-[#6700c9]/50 rounded-2xl p-3 mb-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#e5e2df] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#cfacff]" />
            <span className="font-bold">Imposta Dimensioni Iframe Personalizzate:</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5">
              <span className="text-[#bbcabf]">Larghezza:</span>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(280, parseInt(e.target.value) || 320))}
                className="w-20 bg-[#1c1c1a] border border-[#3c4a42] rounded-lg px-2 py-1 text-center font-bold text-white focus:border-[#10b981] focus:outline-none"
              />
              <span className="text-[#bbcabf]">px</span>
            </label>

            <span className="text-gray-500">×</span>

            <label className="flex items-center gap-1.5">
              <span className="text-[#bbcabf]">Altezza:</span>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(400, parseInt(e.target.value) || 600))}
                className="w-20 bg-[#1c1c1a] border border-[#3c4a42] rounded-lg px-2 py-1 text-center font-bold text-white focus:border-[#10b981] focus:outline-none"
              />
              <span className="text-[#bbcabf]">px</span>
            </label>
          </div>

          <div className="flex gap-2">
            {[
              { label: '375×812 (iPhone X)', w: 375, h: 812 },
              { label: '412×915 (Android)', w: 412, h: 915 },
              { label: '800×1200 (Tablet)', w: 800, h: 1200 },
              { label: '1280×800 (Laptop)', w: 1280, h: 800 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setCustomWidth(p.w);
                  setCustomHeight(p.h);
                }}
                className="px-2 py-1 rounded bg-[#2a2a28] hover:bg-[#3c4a42] text-[10px] font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Preview Container with Dynamic Dimensions & Scaling */}
      <div className="flex-1 w-full flex items-center justify-center overflow-auto p-2 my-auto">
        
        {/* Outer Scaled Viewport Container */}
        <div
          style={{
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out, width 0.3s ease, height 0.3s ease',
          }}
          className="flex flex-col items-center justify-center my-auto"
        >
          {/* Frame Label & Badge */}
          <div className="mb-2 text-center">
            <span className="text-[11px] font-mono text-[#bbcabf] bg-[#1a1a18] px-3 py-1 rounded-full border border-white/10 shadow">
              {effectiveWidth}px × {effectiveHeight}px • {isLandscape ? 'Landscape' : 'Portrait'}
            </span>
          </div>

          {/* RENDER MODE A: Isolated HTML IFrame */}
          {renderMode === 'iframe' ? (
            <div
              className="bg-[#0e0e0d] rounded-2xl border-[4px] border-[#2a2a28] shadow-2xl overflow-hidden relative"
              style={{
                width: `${effectiveWidth}px`,
                height: `${effectiveHeight}px`,
              }}
            >
              <iframe
                srcDoc={iframeSrcDoc}
                title="Web App Preview Iframe"
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* RENDER MODE B: Interactive Component Device Shell */
            <div
              className={`bg-[#0e0e0d] shadow-2xl flex flex-col overflow-hidden relative border-[#2a2a28] transition-all ${
                selectedDevice === 'iphone'
                  ? 'rounded-[2.5rem] border-[6px]'
                  : selectedDevice === 'android'
                  ? 'rounded-[2rem] border-[6px]'
                  : selectedDevice === 'tablet'
                  ? 'rounded-[1.8rem] border-[8px]'
                  : 'rounded-xl border-[4px]'
              }`}
              style={{
                width: `${effectiveWidth}px`,
                height: `${effectiveHeight}px`,
              }}
            >
              {/* Device Notch & Status Bar */}
              {selectedDevice === 'iphone' && !isLandscape && (
                <div className="h-7 bg-black flex items-center justify-between px-6 text-white text-[10px] shrink-0 font-mono">
                  <span>09:41</span>
                  <div className="w-16 h-3.5 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  </div>
                </div>
              )}

              {selectedDevice === 'android' && !isLandscape && (
                <div className="h-6 bg-black flex items-center justify-between px-4 text-white text-[10px] shrink-0 font-mono">
                  <span>10:00</span>
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="flex items-center gap-1">
                    <span>LTE</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              )}

              {/* Browser Address Bar */}
              <div className="bg-[#1c1c1a] px-3 py-1.5 border-b border-[#3c4a42]/30 flex items-center gap-2 shrink-0">
                <div className="flex-1 bg-[#0e0e0d] rounded-full px-3 py-1 flex items-center gap-1.5 text-[11px] text-[#bbcabf] truncate border border-[#3c4a42]/30">
                  <Lock className="w-3 h-3 text-[#10b981] shrink-0" />
                  <span className="truncate">
                    https://ai-creatore-siti-web.vercel.app/site/{blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}
                  </span>
                </div>
              </div>

              {/* Client Site Sticky Top Header */}
              <div className="sticky top-0 z-30 bg-[#131312]/95 backdrop-blur-md border-b border-white/10 px-3 py-2 flex items-center justify-between shrink-0 relative">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="font-extrabold text-xs text-white truncate max-w-[180px]">
                    {blueprint.businessName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
                    className="px-2.5 py-1 bg-[#2a2a28] hover:bg-[#3c4a42] text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/10 active:scale-95 transition-all"
                  >
                    {isAppMenuOpen ? <X className="w-3.5 h-3.5 text-[#10b981]" /> : <Menu className="w-3.5 h-3.5 text-[#10b981]" />}
                    <span>Menù</span>
                  </button>
                </div>

                {/* Hamburger Dropdown Menu */}
                {isAppMenuOpen && (
                  <div className="absolute top-11 right-2 w-56 bg-[#1a1a18]/98 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1 border-b border-white/10 mb-1">
                      <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider">
                        Pagine Web App
                      </span>
                    </div>

                    {blueprint.pages.map((p, idx) => {
                      const isActive = activePageSlug === p.slug;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActivePageSlug(p.slug);
                            setBookingConfirmed(false);
                            setIsAppMenuOpen(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-[#10b981] text-[#003824] shadow'
                              : 'text-[#e5e2df] hover:bg-white/10'
                          }`}
                        >
                          <span>{p.title}</span>
                          {isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}

                    <div className="border-t border-white/10 pt-1 mt-1 space-y-1">
                      <a
                        href={generateWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-2.5 py-2 rounded-xl text-xs font-bold text-[#25D366] hover:bg-white/10 flex items-center gap-2 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Client Site Body */}
              <div
                className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5"
                style={{ backgroundColor: blueprint.colors.background, color: blueprint.colors.text }}
              >
                {/* Page Title */}
                <div className="space-y-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10"
                    style={{ color: blueprint.colors.primary }}
                  >
                    {currentPage.title}
                  </span>
                  <h2 className="text-xl font-extrabold">{currentPage.subtitle}</h2>
                </div>

                {/* Render Sections */}
                {currentPage.sections.map((sec) => (
                  <div key={sec.id} className="space-y-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <h3 className="text-base font-bold" style={{ color: blueprint.colors.primary }}>
                        {sec.title}
                      </h3>
                      <p className="text-xs opacity-80 leading-relaxed">{sec.description}</p>

                      {/* Hero Specific */}
                      {sec.type === 'hero' && (
                        <div className="pt-2 space-y-3">
                          <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                            <img
                              src={blueprint.heroImageUrl}
                              alt="Hero"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2 text-white font-bold text-xs drop-shadow">
                              {blueprint.tagline}
                            </div>
                          </div>

                          <a
                            href={generateWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                            style={{ backgroundColor: blueprint.colors.primary, color: '#003824' }}
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>Richiedi Informazioni su WhatsApp</span>
                          </a>
                        </div>
                      )}

                      {/* Content Items / Services */}
                      {sec.contentItems && sec.contentItems.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {sec.contentItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs gap-2"
                            >
                              <div>
                                <span className="font-bold block">{item.title}</span>
                                {item.subtitle && (
                                  <span className="text-[10px] opacity-70 block">{item.subtitle}</span>
                                )}
                              </div>
                              {item.price && (
                                <span
                                  className="font-bold text-xs px-2 py-1 rounded bg-black/30 shrink-0"
                                  style={{ color: blueprint.colors.primary }}
                                >
                                  {item.price}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Booking Widget */}
                {(activePageSlug === '/' || activePageSlug === '/servizi') && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: blueprint.colors.primary }}>
                      <Calendar className="w-4 h-4" />
                      <span>Prenota Online</span>
                    </h3>

                    {bookingConfirmed ? (
                      <div className="p-3 rounded-xl bg-[#10b981]/20 border border-[#10b981] text-center space-y-1">
                        <Check className="w-6 h-6 text-[#10b981] mx-auto" />
                        <h4 className="font-bold text-xs text-[#10b981]">Prenotazione Ricevuta!</h4>
                        <p className="text-[11px] opacity-80">
                          Grazie {bookingName}! Ti abbiamo inviato la conferma per il {bookingDate}.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-2 text-xs">
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Il tuo nome"
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl font-bold text-xs transition-transform active:scale-95"
                          style={{ backgroundColor: blueprint.colors.primary, color: '#003824' }}
                        >
                          Conferma Prenotazione
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Footer Info */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#10b981]" />
                    <span>{blueprint.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#10b981]" />
                    <span>{blueprint.phone}</span>
                  </div>
                </div>
              </div>

              {/* Floating WhatsApp Sticky Bar */}
              <div className="p-3 bg-[#131312] border-t border-white/10 shrink-0">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Contatta via WhatsApp ({blueprint.phone})</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
