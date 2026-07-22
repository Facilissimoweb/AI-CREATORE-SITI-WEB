import React, { useState } from 'react';
import {
  X,
  Smartphone,
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
  Globe
} from 'lucide-react';
import { WebsiteBlueprint } from '../types';

interface FullscreenPreviewProps {
  blueprint: WebsiteBlueprint;
  onClose: () => void;
}

export const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  blueprint,
  onClose,
}) => {
  const [activePageSlug, setActivePageSlug] = useState<string>('/');
  const [bookingName, setBookingName] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-07-22');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingPersons, setBookingPersons] = useState('2');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  const currentPage =
    blueprint.pages.find((p) => p.slug === activePageSlug) || blueprint.pages[0];

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

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Header Bar for Fullscreen Controls */}
      <div className="w-full max-w-[420px] flex items-center justify-between pb-3 text-white px-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#10b981]" />
          <span className="font-bold text-sm">Sito Live: {blueprint.businessName}</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Chiudi Anteprima"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Simulated Smartphone Shell */}
      <div className="w-full max-w-[400px] h-[85vh] max-h-[820px] bg-[#0e0e0d] rounded-[2.5rem] border-[6px] border-[#2a2a28] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Phone Notch & Status Bar */}
        <div className="h-7 bg-black flex items-center justify-between px-6 text-white text-[10px] shrink-0 font-mono">
          <span>09:41</span>
          <div className="w-16 h-3 bg-white/20 rounded-full" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          </div>
        </div>

        {/* Address Bar */}
        <div className="bg-[#1c1c1a] px-3 py-2 border-b border-[#3c4a42]/30 flex items-center gap-2 shrink-0">
          <div className="flex-1 bg-[#0e0e0d] rounded-full px-3 py-1 flex items-center gap-1.5 text-[11px] text-[#bbcabf] truncate border border-[#3c4a42]/30">
            <Lock className="w-3 h-3 text-[#10b981] shrink-0" />
            <span className="truncate">https://{blueprint.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.facilissimoweb.it</span>
          </div>
        </div>

        {/* Client Site Sticky Top Header & Nav Bar */}
        <div className="sticky top-0 z-30 bg-[#131312]/95 backdrop-blur-md border-b border-white/10 px-3 py-2 flex items-center justify-between shrink-0 relative">
          {/* Brand Name */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-extrabold text-xs text-white truncate max-w-[170px]">
              {blueprint.businessName}
            </span>
          </div>

          {/* Quick Tabs & Hamburger Dropdown Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
              className="px-2.5 py-1 bg-[#2a2a28] hover:bg-[#3c4a42] text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/10 active:scale-95 transition-all"
            >
              {isAppMenuOpen ? <X className="w-3.5 h-3.5 text-[#10b981]" /> : <Menu className="w-3.5 h-3.5 text-[#10b981]" />}
              <span>Menù</span>
            </button>
          </div>

          {/* Hamburger Dropdown Menu with Icons */}
          {isAppMenuOpen && (
            <div className="absolute top-11 right-2 w-56 bg-[#1a1a18]/98 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 border-b border-white/10 mb-1">
                <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider">
                  Navigazione Pagine & Servizi
                </span>
              </div>

              {blueprint.pages.map((p, idx) => {
                const isActive = activePageSlug === p.slug;
                const pageIcons = [<Home className="w-3.5 h-3.5" />, <Layers className="w-3.5 h-3.5" />, <Utensils className="w-3.5 h-3.5" />, <Globe className="w-3.5 h-3.5" />];
                const IconComponent = pageIcons[idx % pageIcons.length];

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
                    <div className="flex items-center gap-2">
                      {IconComponent}
                      <span>{p.title}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}

              <div className="border-t border-white/10 pt-1 mt-1 space-y-1">
                <button
                  onClick={() => {
                    setIsAppMenuOpen(false);
                    const el = document.getElementById('booking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full px-2.5 py-2 rounded-xl text-xs font-bold text-[#35dec1] hover:bg-white/10 flex items-center gap-2 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Prenota Ora Online</span>
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-2.5 py-2 rounded-xl text-xs font-bold text-[#25D366] hover:bg-white/10 flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Apri Chat WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Main Client Site Body */}
        <div
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6"
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

          {/* Special Interactive Booking Widget for Home or Servizi */}
          {(activePageSlug === '/' || activePageSlug === '/servizi') && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: blueprint.colors.primary }}>
                <Calendar className="w-4 h-4" />
                <span>Prenota Subito Online</span>
              </h3>

              {bookingConfirmed ? (
                <div className="p-3 rounded-xl bg-[#10b981]/20 border border-[#10b981] text-center space-y-1">
                  <Check className="w-6 h-6 text-[#10b981] mx-auto" />
                  <h4 className="font-bold text-xs text-[#10b981]">Prenotazione Ricevuta!</h4>
                  <p className="text-[11px] opacity-80">
                    Grazie {bookingName}! Ti abbiamo inviato la conferma per il {bookingDate} alle {bookingTime}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-2 text-xs">
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Il tuo nome e cognome"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-black/40 border border-white/20 rounded-xl px-2 py-2 text-white focus:outline-none"
                    />
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="bg-black/40 border border-white/20 rounded-xl px-2 py-2 text-white focus:outline-none"
                    />
                  </div>
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

          {/* Quick Contact Footer Bar */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#10b981]" />
              <span>{blueprint.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#10b981]" />
              <span>{blueprint.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#10b981]" />
              <span>{blueprint.openingHours}</span>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Floating WhatsApp Bar */}
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
    </div>
  );
};
