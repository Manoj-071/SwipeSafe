import React from 'react';
import { CardProfileProvider, useCardProfile } from './context/CardProfileContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingLimit } from './screens/OnboardingLimit';
import { OnboardingBalance } from './screens/OnboardingBalance';
import { OnboardingDueDate } from './screens/OnboardingDueDate';
import { OnboardingRepayment } from './screens/OnboardingRepayment';
import { HomeScreen } from './screens/HomeScreen';
import { PurchaseCheckInput } from './screens/PurchaseCheckInput';
import { VerdictScreen } from './screens/VerdictScreen';
import { PayoffPlanScreen } from './screens/PayoffPlanScreen';
import { NudgePreviewScreen } from './screens/NudgePreviewScreen';
import { DemoModeSelector } from './components/DemoModeSelector';

const ScreenRenderer: React.FC = () => {
  const { currentScreen } = useCardProfile();

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'onboarding-1':
      return <OnboardingLimit />;
    case 'onboarding-2':
      return <OnboardingBalance />;
    case 'onboarding-3':
      return <OnboardingDueDate />;
    case 'onboarding-4':
      return <OnboardingRepayment />;
    case 'home':
      return <HomeScreen />;
    case 'purchase-check':
      return <PurchaseCheckInput />;
    case 'verdict':
      return <VerdictScreen />;
    case 'payoff-plan':
      return <PayoffPlanScreen />;
    case 'nudge':
      return <NudgePreviewScreen />;
    default:
      return <WelcomeScreen />;
  }
};

function App() {
  return (
    <CardProfileProvider>
      <div className="relative min-h-screen bg-slate-50 w-full flex items-center justify-center p-0 md:p-4">
        {/* Mobile Device Frame styling in desktop, full screen in mobile */}
        <div className="w-full md:max-w-md md:rounded-[40px] md:shadow-2xl md:border-8 md:border-slate-800 bg-white overflow-hidden md:min-h-[812px] relative flex flex-col">
          <ScreenRenderer />
        </div>
        <DemoModeSelector />
      </div>
    </CardProfileProvider>
  );
}

export default App;
