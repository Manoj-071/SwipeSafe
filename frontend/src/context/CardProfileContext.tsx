import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CardProfile, PurchaseRecord } from '../types';
import { mockProfiles } from '../data/mockProfiles';
import { evaluatePurchase } from '../lib/verdictEngine';
import type { VerdictResult } from '../lib/verdictEngine';

export type ScreenType =
  | 'welcome'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'onboarding-4'
  | 'home'
  | 'purchase-check'
  | 'verdict'
  | 'payoff-plan'
  | 'nudge';

interface CardProfileContextProps {
  activeProfile: CardProfile | null;
  currentScreen: ScreenType;
  lastCheckAmount: number;
  lastCheckResult: VerdictResult | null;
  navigateTo: (screen: ScreenType) => void;
  onboardUser: (
    limit: number,
    balance: number,
    dueDate: number,
    repaymentPattern: 'full' | 'minimum' | 'depends'
  ) => void;
  checkPurchase: (amount: number) => VerdictResult | null;
  confirmPurchase: () => void;
  cancelPurchase: () => void;
  resetCycle: (paymentType: 'full' | 'minimum' | 'partial') => void;
  loadDemoProfile: (index: number) => void;
  resetAll: () => void;
}

const CardProfileContext = createContext<CardProfileContextProps | undefined>(undefined);

export const CardProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfile, setActiveProfile] = useState<CardProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [lastCheckAmount, setLastCheckAmount] = useState<number>(0);
  const [lastCheckResult, setLastCheckResult] = useState<VerdictResult | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('swipesafe_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CardProfile;
        setActiveProfile(parsed);
        setCurrentScreen('home'); // Skip onboarding if profile exists
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
  }, []);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onboardUser = (
    limit: number,
    balance: number,
    dueDate: number,
    repaymentPattern: 'full' | 'minimum' | 'depends'
  ) => {
    const newProfile: CardProfile = {
      cardLimit: limit,
      outstandingBalance: balance,
      dueDate,
      repaymentPattern,
      apr: 0.36,
      purchaseHistory: []
    };
    setActiveProfile(newProfile);
    localStorage.setItem('swipesafe_profile', JSON.stringify(newProfile));
    navigateTo('home');
  };

  const checkPurchase = (amount: number): VerdictResult | null => {
    if (!activeProfile) return null;
    const result = evaluatePurchase(
      amount,
      activeProfile.cardLimit,
      activeProfile.outstandingBalance,
      activeProfile.repaymentPattern,
      activeProfile.dueDate,
      activeProfile.apr
    );
    setLastCheckAmount(amount);
    setLastCheckResult(result);
    return result;
  };

  const confirmPurchase = () => {
    if (!activeProfile || !lastCheckResult) return;

    const record: PurchaseRecord = {
      amount: lastCheckAmount,
      date: new Date().toISOString(),
      verdict: lastCheckResult.verdict,
      utilizationBefore: lastCheckResult.utilizationBefore,
      utilizationAfter: lastCheckResult.utilizationAfter,
      reasoning: lastCheckResult.reasoning
    };

    const updatedProfile: CardProfile = {
      ...activeProfile,
      outstandingBalance: lastCheckResult.outstandingAfter,
      purchaseHistory: [record, ...activeProfile.purchaseHistory]
    };

    setActiveProfile(updatedProfile);
    localStorage.setItem('swipesafe_profile', JSON.stringify(updatedProfile));
    navigateTo('home');
  };

  const cancelPurchase = () => {
    setLastCheckAmount(0);
    setLastCheckResult(null);
    navigateTo('home');
  };

  const resetCycle = (paymentType: 'full' | 'minimum' | 'partial') => {
    if (!activeProfile) return;

    let paymentAmount = 0;
    const currentOutstanding = activeProfile.outstandingBalance;

    if (paymentType === 'full') {
      paymentAmount = currentOutstanding;
    } else if (paymentType === 'minimum') {
      paymentAmount = Math.min(currentOutstanding, Math.max(250, currentOutstanding * 0.05));
    } else {
      // Partial payment e.g. 50%
      paymentAmount = Math.round(currentOutstanding * 0.50);
    }

    const newOutstanding = Math.max(0, currentOutstanding - paymentAmount);
    
    // Log payment to history
    const record: PurchaseRecord = {
      amount: -paymentAmount,
      date: new Date().toISOString(),
      verdict: 'safe',
      utilizationBefore: currentOutstanding / activeProfile.cardLimit,
      utilizationAfter: newOutstanding / activeProfile.cardLimit,
      reasoning: `Repayment made: ₹${paymentAmount.toLocaleString('en-IN')} (${paymentType === 'full' ? 'Full Payment' : paymentType === 'minimum' ? 'Minimum Payment' : '50% Partial Payment'})`
    };

    const updatedProfile: CardProfile = {
      ...activeProfile,
      outstandingBalance: newOutstanding,
      purchaseHistory: [record, ...activeProfile.purchaseHistory]
    };

    setActiveProfile(updatedProfile);
    localStorage.setItem('swipesafe_profile', JSON.stringify(updatedProfile));
  };

  const loadDemoProfile = (index: number) => {
    const demo = mockProfiles[index];
    if (demo) {
      // Create deep clone of the demo profile
      const clone = JSON.parse(JSON.stringify(demo)) as CardProfile;
      setActiveProfile(clone);
      localStorage.setItem('swipesafe_profile', JSON.stringify(clone));
      navigateTo('home');
    }
  };

  const resetAll = () => {
    setActiveProfile(null);
    setLastCheckAmount(0);
    setLastCheckResult(null);
    localStorage.removeItem('swipesafe_profile');
    navigateTo('welcome');
  };

  return (
    <CardProfileContext.Provider
      value={{
        activeProfile,
        currentScreen,
        lastCheckAmount,
        lastCheckResult,
        navigateTo,
        onboardUser,
        checkPurchase,
        confirmPurchase,
        cancelPurchase,
        resetCycle,
        loadDemoProfile,
        resetAll
      }}
    >
      {children}
    </CardProfileContext.Provider>
  );
};

export const useCardProfile = () => {
  const context = useContext(CardProfileContext);
  if (context === undefined) {
    throw new Error('useCardProfile must be used within a CardProfileProvider');
  }
  return context;
};
