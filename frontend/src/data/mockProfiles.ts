import type { CardProfile } from '../types';

export const mockProfiles: CardProfile[] = [
  {
    cardLimit: 100000,
    outstandingBalance: 10000,
    dueDate: 15,
    repaymentPattern: 'full',
    apr: 0.36,
    purchaseHistory: [
      {
        amount: 5000,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        verdict: 'safe',
        utilizationBefore: 0.05,
        utilizationAfter: 0.10,
        reasoning: 'Safe to swipe! Credit utilization remains well below the 30% healthy threshold.'
      },
      {
        amount: 2500,
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        verdict: 'safe',
        utilizationBefore: 0.025,
        utilizationAfter: 0.05,
        reasoning: 'Safe to swipe! Transaction fits comfortably within your monthly budget and limits.'
      }
    ]
  },
  {
    cardLimit: 50000,
    outstandingBalance: 15000,
    dueDate: 20,
    repaymentPattern: 'depends',
    apr: 0.36,
    purchaseHistory: [
      {
        amount: 8000,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        verdict: 'caution',
        utilizationBefore: 0.14,
        utilizationAfter: 0.30,
        reasoning: 'Caution advised. Credit utilization reaches exactly 30% and interest will accrue if unpaid.'
      }
    ]
  },
  {
    cardLimit: 40000,
    outstandingBalance: 22000,
    dueDate: 5,
    repaymentPattern: 'minimum',
    apr: 0.36,
    purchaseHistory: [
      {
        amount: 12000,
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        verdict: 'risky',
        utilizationBefore: 0.25,
        utilizationAfter: 0.55,
        reasoning: 'High risk! Utilization jumped to 55%, exceeding the 50% high-risk line, and will incur significant interest.'
      }
    ]
  }
];
