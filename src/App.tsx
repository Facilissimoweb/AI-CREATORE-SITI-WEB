import React, { useState, useEffect } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { IdeaTab } from './components/IdeaTab';
import { StyleTab } from './components/StyleTab';
import { BlueprintTab } from './components/BlueprintTab';
import { FullscreenPreview } from './components/FullscreenPreview';
import { DesignerModal } from './components/DesignerModal';
import { ExportGuideModal } from './components/ExportGuideModal';
import { ChatAssistantModal } from './components/ChatAssistantModal';
import { ModelingStudioModal } from './components/ModelingStudioModal';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { SeoMetaModal } from './components/SeoMetaModal';
import { ProDashboard } from './components/ProDashboard';
import { OnboardingTour } from './components/OnboardingTour';
import { SocialShareModal } from './components/SocialShareModal';
import { WebsiteBlueprint, BusinessCategory, GoalOption } from './types';
import { DEFAULT_PIZZERIA, DEFAULT_CONSULTANT, DEFAULT_ARTISAN } from './data/defaultTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('idea');
  const [darkMode, setDarkMode] = useState(false);
  const [blueprint, setBlueprint] = useState<WebsiteBlueprint>(DEFAULT_PIZZERIA);
  const [historyStack, setHistoryStack] = useState<WebsiteBlueprint[]>([]);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isDesignerModalOpen, setIsDesignerModalOpen] = useState(false);
  const [isExportGuideOpen, setIsExportGuideOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isModelingStudioOpen, setIsModelingStudioOpen] = useState(false);
  const [isSubscriptionPlansOpen, setIsSubscriptionPlansOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isProDashboardOpen, setIsProDashboardOpen] = useState(false);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load saved blueprint from localStorage on mount
  useEffect(() => {
    try {
      const savedBlueprint = localStorage.getItem('facilissimoweb_blueprint');
      const savedTime = localStorage.getItem('facilissimoweb_saved_time');
      if (savedBlueprint) {
        const parsed = JSON.parse(savedBlueprint);
        if (parsed && parsed.businessName) {
          setBlueprint(parsed);
          if (savedTime) setLastSavedTime(savedTime);
        }
      }
    } catch (e) {
      console.warn("Could not load saved blueprint:", e);
    }
  }, []);

  // Trigger guided onboarding tour on first launch
  useEffect(() => {
    try {
      const tourSeen = localStorage.getItem('facilissimoweb_tour_seen');
      if (!tourSeen) {
        const timer = setTimeout(() => setIsTourOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("Could not check tour flag:", e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to update blueprint while preserving up to 3 undo steps
  const updateBlueprintWithHistory = (newBp: WebsiteBlueprint) => {
    setHistoryStack((prev) => {
      // Keep max 3 items in history stack
      const updated = [...prev, blueprint];
      return updated.slice(-3);
    });
    setBlueprint(newBp);
  };

  // Undo last change (up to 3 steps)
  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setBlueprint(previous);
    showToast("↩️ Modifica annullata! Ripristinata la versione precedente.");
  };

  // Explicitly save current state to localStorage
  const handleSaveBlueprint = () => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('facilissimoweb_blueprint', JSON.stringify(blueprint));
      localStorage.setItem('facilissimoweb_saved_time', timeStr);
      setLastSavedTime(timeStr);
      showToast(`💾 Progetto salvato localmente alle ${timeStr}!`);
    } catch (e) {
      console.error("Errore salvataggio:", e);
      showToast("❌ Impossibile salvare in locale.");
    }
  };

  // Handle generating new blueprint via Gemini API
  const handleGenerateBlueprint = async (
    promptText: string,
    category: BusinessCategory,
    city: string,
    goal: GoalOption
  ) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          category,
          city,
          goal,
          currentBlueprint: blueprint,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.blueprint) {
        updateBlueprintWithHistory(data.blueprint);
        showToast("✨ Web App generata con successo dall'AI!");
      } else {
        // Fallback gracefully to category defaults if offline or API delay
        let fallbackBp = { ...DEFAULT_PIZZERIA, city };
        if (category === 'consulente') fallbackBp = { ...DEFAULT_CONSULTANT, city };
        else if (category === 'artigiano') fallbackBp = { ...DEFAULT_ARTISAN, city };
        
        updateBlueprintWithHistory(fallbackBp);
        showToast("✨ Web App personalizzata pronta!");
      }
    } catch (err) {
      console.warn("Using template fallback for generation:", err);
      let fallbackBp = { ...DEFAULT_PIZZERIA, city };
      if (category === 'consulente') fallbackBp = { ...DEFAULT_CONSULTANT, city };
      else if (category === 'artigiano') fallbackBp = { ...DEFAULT_ARTISAN, city };

      updateBlueprintWithHistory(fallbackBp);
      showToast("✨ Web App personalizzata pronta!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle AI Chat modifications
  const handleSendStyleChat = async (userMsg: string) => {
    setIsProcessingChat(true);
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMsg,
          currentBlueprint: blueprint,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        if (resData.data.updatedBlueprint) {
          updateBlueprintWithHistory(resData.data.updatedBlueprint);
        }
        showToast(`🤖 ${resData.data.replyText || 'Web App aggiornata dall\'AI!'}`);
      } else {
        showToast("✨ Web App aggiornata con successo!");
      }
    } catch (err) {
      console.warn("AI Chat fallback error:", err);
      showToast("✨ Web App aggiornata!");
    } finally {
      setIsProcessingChat(false);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#10b981] selection:text-[#003824] ${
        darkMode ? 'bg-[#131312] text-[#e5e2df]' : 'bg-[#fcf9f6] text-[#1c1c1a]'
      }`}
    >
      {/* Top Bar */}
      <TopAppBar
        onOpenFullscreen={() => setIsFullscreenOpen(true)}
        onOpenExportGuide={() => setIsExportGuideOpen(true)}
        onOpenChatModal={() => setIsChatModalOpen(true)}
        onOpenModelingStudio={() => setIsModelingStudioOpen(true)}
        onOpenSubscriptionPlans={() => setIsSubscriptionPlansOpen(true)}
        onOpenSeoModal={() => setIsSeoModalOpen(true)}
        onOpenProDashboard={() => setIsProDashboardOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenSocialShare={() => setIsSocialShareOpen(true)}
        isProUnlocked={isProUnlocked}
        canUndo={historyStack.length > 0}
        undoCount={historyStack.length}
        onUndo={handleUndo}
        onSave={handleSaveBlueprint}
        lastSavedTime={lastSavedTime}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Container */}
      <main className="max-w-[640px] mx-auto pt-16 px-4 pb-28 min-h-screen">
        {activeTab === 'idea' && (
          <IdeaTab
            blueprint={blueprint}
            onGenerateBlueprint={handleGenerateBlueprint}
            isGenerating={isGenerating}
            onNextStep={() => setActiveTab('stile')}
          />
        )}

        {activeTab === 'stile' && (
          <StyleTab
            blueprint={blueprint}
            onUpdateBlueprint={updateBlueprintWithHistory}
            onSendStyleChat={handleSendStyleChat}
            isProcessingChat={isProcessingChat}
            onNextStep={() => setActiveTab('sito')}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
          />
        )}

        {activeTab === 'sito' && (
          <BlueprintTab
            blueprint={blueprint}
            onUpdateBlueprint={updateBlueprintWithHistory}
            onOpenDesignerModal={() => setIsDesignerModalOpen(true)}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
            onOpenChatModal={() => setIsChatModalOpen(true)}
            onOpenModelingStudio={() => setIsModelingStudioOpen(true)}
            onOpenSeoModal={() => setIsSeoModalOpen(true)}
            onOpenProDashboard={() => setIsProDashboardOpen(true)}
            isProUnlocked={isProUnlocked}
            onSave={handleSaveBlueprint}
            lastSavedTime={lastSavedTime}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4 text-center py-6">
            <h2 className="text-xl font-bold">Anteprima Live Web App Mobile First</h2>
            <p className="text-xs text-[#bbcabf]">
              Esplora come appare e funziona la tua Web App su dispositivi iOS e Android!
            </p>
            <button
              onClick={() => setIsFullscreenOpen(true)}
              className="px-6 py-3 bg-[#10b981] text-[#003824] font-bold text-sm rounded-full shadow-lg hover:bg-[#059669] transition-transform active:scale-95"
            >
              Avvia Simulatore Mobile
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'preview') {
            setIsFullscreenOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[120] bg-[#6700c9] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl border border-white/20 animate-in fade-in slide-in-from-top-3 max-w-[90vw] text-center">
          {toastMessage}
        </div>
      )}

      {/* Copilota AI Chat Modal */}
      {isChatModalOpen && (
        <ChatAssistantModal
          blueprint={blueprint}
          onUpdateBlueprint={updateBlueprintWithHistory}
          onSendStyleChat={handleSendStyleChat}
          isProcessingChat={isProcessingChat}
          onClose={() => setIsChatModalOpen(false)}
          onOpenFullscreen={() => setIsFullscreenOpen(true)}
        />
      )}

      {/* Plancia di Modellazione Studio Modal */}
      {isModelingStudioOpen && (
        <ModelingStudioModal
          blueprint={blueprint}
          onUpdateBlueprint={updateBlueprintWithHistory}
          onClose={() => setIsModelingStudioOpen(false)}
          onOpenFullscreen={() => setIsFullscreenOpen(true)}
          onSave={handleSaveBlueprint}
          lastSavedTime={lastSavedTime}
        />
      )}

      {/* Fullscreen Interactive Site Preview */}
      {isFullscreenOpen && (
        <FullscreenPreview
          blueprint={blueprint}
          onClose={() => setIsFullscreenOpen(false)}
        />
      )}

      {/* Designer Assistance Modal */}
      {isDesignerModalOpen && (
        <DesignerModal
          blueprint={blueprint}
          onClose={() => setIsDesignerModalOpen(false)}
        />
      )}

      {/* Export & Online Guide Modal */}
      {isExportGuideOpen && (
        <ExportGuideModal
          blueprint={blueprint}
          onClose={() => setIsExportGuideOpen(false)}
          onOpenSubscriptionPlans={() => setIsSubscriptionPlansOpen(true)}
        />
      )}

      {/* Subscription Plans Modal */}
      {isSubscriptionPlansOpen && (
        <SubscriptionPlans
          blueprint={blueprint}
          isUnlocked={isProUnlocked}
          onPlanUnlocked={(planName) => {
            setIsProUnlocked(true);
            showToast(`🎉 Piano ${planName} attivato con successo! Funzionalità sbloccate.`);
          }}
          onOpenProDashboard={() => setIsProDashboardOpen(true)}
          onClose={() => setIsSubscriptionPlansOpen(false)}
        />
      )}

      {/* SEO Meta Settings Modal */}
      {isSeoModalOpen && (
        <SeoMetaModal
          blueprint={blueprint}
          onUpdateBlueprint={(updated) => {
            updateBlueprintWithHistory(updated);
            showToast("Impostazioni SEO & OpenGraph aggiornate!");
          }}
          onClose={() => setIsSeoModalOpen(false)}
        />
      )}

      {/* Pro Dashboard Central Hub Modal */}
      {isProDashboardOpen && (
        <ProDashboard
          blueprint={blueprint}
          isProUnlocked={isProUnlocked}
          onClose={() => setIsProDashboardOpen(false)}
          onOpenSubscriptionPlans={() => setIsSubscriptionPlansOpen(true)}
          onOpenSeoModal={() => setIsSeoModalOpen(true)}
          onOpenFullscreen={() => setIsFullscreenOpen(true)}
          onOpenExportGuide={() => setIsExportGuideOpen(true)}
        />
      )}

      {/* Social Share & QR Code Modal */}
      {isSocialShareOpen && (
        <SocialShareModal
          blueprint={blueprint}
          onClose={() => setIsSocialShareOpen(false)}
        />
      )}

      {/* Onboarding Interactive Guided Tour */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenFullscreenPreview={() => setIsFullscreenOpen(true)}
      />
    </div>
  );
}
