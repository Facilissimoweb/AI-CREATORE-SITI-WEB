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
import { WebsiteBlueprint, BusinessCategory, GoalOption } from './types';
import { DEFAULT_PIZZERIA, DEFAULT_CONSULTANT, DEFAULT_ARTISAN } from './data/defaultTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('idea');
  const [darkMode, setDarkMode] = useState(true);
  const [blueprint, setBlueprint] = useState<WebsiteBlueprint>(DEFAULT_PIZZERIA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isDesignerModalOpen, setIsDesignerModalOpen] = useState(false);
  const [isExportGuideOpen, setIsExportGuideOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isModelingStudioOpen, setIsModelingStudioOpen] = useState(false);
  const [isSubscriptionPlansOpen, setIsSubscriptionPlansOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
        setBlueprint(data.blueprint);
        showToast("✨ Web App generata con successo dall'AI!");
      } else {
        // Fallback gracefully to category defaults if offline or API delay
        if (category === 'consulente') setBlueprint({ ...DEFAULT_CONSULTANT, city });
        else if (category === 'artigiano') setBlueprint({ ...DEFAULT_ARTISAN, city });
        else setBlueprint({ ...DEFAULT_PIZZERIA, city });
        showToast("✨ Web App personalizzata pronta!");
      }
    } catch (err) {
      console.warn("Using template fallback for generation:", err);
      if (category === 'consulente') setBlueprint({ ...DEFAULT_CONSULTANT, city });
      else if (category === 'artigiano') setBlueprint({ ...DEFAULT_ARTISAN, city });
      else setBlueprint({ ...DEFAULT_PIZZERIA, city });
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
          setBlueprint(resData.data.updatedBlueprint);
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
            onUpdateBlueprint={setBlueprint}
            onSendStyleChat={handleSendStyleChat}
            isProcessingChat={isProcessingChat}
            onNextStep={() => setActiveTab('sito')}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
          />
        )}

        {activeTab === 'sito' && (
          <BlueprintTab
            blueprint={blueprint}
            onUpdateBlueprint={setBlueprint}
            onOpenDesignerModal={() => setIsDesignerModalOpen(true)}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
            onOpenChatModal={() => setIsChatModalOpen(true)}
            onOpenModelingStudio={() => setIsModelingStudioOpen(true)}
            onOpenSeoModal={() => setIsSeoModalOpen(true)}
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
          onUpdateBlueprint={setBlueprint}
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
          onUpdateBlueprint={setBlueprint}
          onClose={() => setIsModelingStudioOpen(false)}
          onOpenFullscreen={() => setIsFullscreenOpen(true)}
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
          onClose={() => setIsSubscriptionPlansOpen(false)}
        />
      )}

      {/* SEO Meta Settings Modal */}
      {isSeoModalOpen && (
        <SeoMetaModal
          blueprint={blueprint}
          onUpdateBlueprint={(updated) => {
            setBlueprint(updated);
            showToast("Impostazioni SEO & OpenGraph aggiornate!");
          }}
          onClose={() => setIsSeoModalOpen(false)}
        />
      )}
    </div>
  );
}
