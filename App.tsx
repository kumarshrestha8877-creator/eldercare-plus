import React, { useState } from 'react';
import { 
  Heart, 
  Pill, 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Mic, 
  MessageSquare,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  Inbox,
  Moon,
  Sliders
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { Navbar, AppTab } from './components/Navbar';
import { ElderlyDashboard } from './components/ElderlyDashboard';
import { FamilyDashboard } from './components/FamilyDashboard';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { MedicationManager } from './components/MedicationManager';
import { AppointmentManager } from './components/AppointmentManager';
import { SharedHealthProfile } from './components/SharedHealthProfile';
import { SilentCommunicationModal } from './components/SilentCommunicationModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationHistoryModal } from './components/NotificationHistoryModal';
import { PasscodeModal } from './components/PasscodeModal';
import { VirtualMailboxModal } from './components/VirtualMailboxModal';
import { NightBlindnessModal } from './components/NightBlindnessModal';
import { AccessibilityHubModal } from './components/AccessibilityHubModal';
import { AuthPortal } from './components/AuthPortal';
import { GuidedTourModal } from './components/GuidedTourModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const MainLayout: React.FC = () => {
  const { currentRole, currentUser, isTourOpen, setTourOpen } = useAuth();
  const { t, playChime, settings } = useAccessibility();

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [forceOpenAddMedModal, setForceOpenAddMedModal] = useState(false);

  // Modals state
  const [silentModalOpen, setSilentModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [mailboxModalOpen, setMailboxModalOpen] = useState(false);
  const [nightBlindnessModalOpen, setNightBlindnessModalOpen] = useState(false);
  const [accessibilityHubOpen, setAccessibilityHubOpen] = useState(false);

  const handleTabChange = (tab: AppTab) => {
    playChime('click');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col justify-between selection:bg-elder-green-200">
      
      {/* 1. Unified Accessible Navbar (Single, Clean, Spacious Header) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSilentModal={() => setSilentModalOpen(true)}
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
        onOpenSosModal={() => setSosModalOpen(true)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
        onOpenNotifModal={() => setNotifModalOpen(true)}
        onOpenMailboxModal={() => setMailboxModalOpen(true)}
        onOpenNightBlindnessModal={() => setNightBlindnessModalOpen(true)}
        onOpenAccessibilityHubModal={() => setAccessibilityHubOpen(true)}
        onOpenTourModal={() => setTourOpen(true)}
      />

      {/* 2. Main Content Container (Airy and well-spaced) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <>
            {currentRole === 'elderly' && (
              <ElderlyDashboard
                onOpenSilentModal={() => setSilentModalOpen(true)}
                onOpenVoiceModal={() => setVoiceModalOpen(true)}
                onOpenSosModal={() => setSosModalOpen(true)}
                onOpenPasscodeModal={() => setPasscodeModalOpen(true)}
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}
            {currentRole === 'family' && (
              <FamilyDashboard
                onOpenPasscodeModal={() => setPasscodeModalOpen(true)}
                onOpenSettingsModal={() => setSettingsModalOpen(true)}
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}
            {currentRole === 'caregiver' && (
              <CaregiverDashboard
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}
          </>
        )}

        {activeTab === 'medications' && (
          <MedicationManager forceOpenAddModal={forceOpenAddMedModal} />
        )}

        {activeTab === 'appointments' && <AppointmentManager />}

        {activeTab === 'profile' && <SharedHealthProfile />}
      </main>

      {/* 3. Sleek Floating Quick-Assist Pill (Compact, horizontal, never obscures content) */}
      {currentRole === 'elderly' && (
        <div className="fixed bottom-5 right-5 z-40 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 shadow-xl flex items-center space-x-2 transition-transform hover:scale-105">
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-elder-green-50 hover:bg-elder-green-100 text-elder-green-800 text-xs font-extrabold transition-all"
            title="Open Voice Help"
          >
            <Mic className="w-4 h-4 text-elder-green-600 animate-pulse" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          <button
            onClick={() => setSilentModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-extrabold transition-all"
            title="Open Silent AAC Communication"
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Silent</span>
          </button>

          <button
            onClick={() => setNightBlindnessModalOpen(true)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
              settings.nightBlindnessMode 
                ? 'bg-amber-500 text-black border border-amber-400 font-black' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Night Blindness (Nyctalopia) Mode"
          >
            <Moon className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Night</span>
          </button>
        </div>
      )}

      {/* 4. Modals */}
      <AccessibilityHubModal
        isOpen={accessibilityHubOpen}
        onClose={() => setAccessibilityHubOpen(false)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
        onOpenNightBlindnessModal={() => setNightBlindnessModalOpen(true)}
      />

      <SilentCommunicationModal
        isOpen={silentModalOpen}
        onClose={() => setSilentModalOpen(false)}
      />

      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

      <EmergencySOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onOpenMailbox={() => setMailboxModalOpen(true)}
      />

      <NotificationHistoryModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
      />

      <PasscodeModal
        isOpen={passcodeModalOpen}
        onClose={() => setPasscodeModalOpen(false)}
      />

      <VirtualMailboxModal
        isOpen={mailboxModalOpen}
        onClose={() => setMailboxModalOpen(false)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
      />

      <NightBlindnessModal
        isOpen={nightBlindnessModalOpen}
        onClose={() => setNightBlindnessModalOpen(false)}
      />

      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setTourOpen(false)}
        onNavigateTab={handleTabChange}
        onOpenAddMedicineModal={() => {
          handleTabChange('medications');
          setForceOpenAddMedModal(true);
          setTimeout(() => setForceOpenAddMedModal(false), 500);
        }}
      />

      {/* 5. Professional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-elder-green-700 text-white flex items-center justify-center">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">ElderCare+</span>
            <span>— Healthcare Without Communication or Accessibility Barriers.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMailboxModalOpen(true)}
              className="text-elder-blue-700 font-bold hover:underline flex items-center gap-1"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Virtual Test Mailbox</span>
            </button>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
              WCAG 2.2 AA Compliant
            </span>
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="text-elder-green-800 font-bold hover:underline"
            >
              Supabase & Resend API Setup
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

const RootApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  return <MainLayout />;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <AuthProvider>
          <RootApp />
        </AuthProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;
