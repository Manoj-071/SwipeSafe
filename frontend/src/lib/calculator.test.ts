import { describe, it, expect } from 'vitest';
import { getDaysLeftInCycle, calculateUtilization, calculateInterestCost, simulateMinimumDueTrap, simulateScoreImpact } from './calculator';
import { evaluatePurchase } from './verdictEngine';

describe('SwipeSafe Calculator Logic', () => {
  describe('getDaysLeftInCycle', () => {
    it('calculates days left when due date is later in the current month', () => {
      const today = new Date(2026, 6, 10); // July 10, 2026 (Month is 0-indexed, so 6 is July)
      const dueDate = 15; // Due on July 15
      const daysLeft = getDaysLeftInCycle(dueDate, today);
      expect(daysLeft).toBe(5);
    });

    it('calculates days left when due date is in the next month (rollover)', () => {
      const today = new Date(2026, 6, 25); // July 25, 2026
      const dueDate = 15; // Due on August 15
      const daysLeft = getDaysLeftInCycle(dueDate, today);
      expect(daysLeft).toBe(21); // July has 31 days. 31 - 25 = 6 days in July + 15 days in August = 21 days
    });

    it('returns 0 when today is the due date', () => {
      const today = new Date(2026, 6, 15); // July 15, 2026
      const dueDate = 15;
      const daysLeft = getDaysLeftInCycle(dueDate, today);
      expect(daysLeft).toBe(0);
    });
  });

  describe('calculateUtilization', () => {
    it('calculates utilization starting from 0%', () => {
      const limit = 10000;
      const outstanding = 0;
      const purchase = 3000;
      const res = calculateUtilization(outstanding, purchase, limit);
      expect(res.oldUtilization).toBe(0);
      expect(res.newOutstanding).toBe(3000);
      expect(res.newUtilization).toBe(0.30);
    });

    it('calculates utilization at key boundary points (exactly 30%, 50%, 90%)', () => {
      const limit = 10000;

      // 30% boundary
      let res = calculateUtilization(2000, 1000, limit);
      expect(res.newUtilization).toBe(0.30);

      // 50% boundary
      res = calculateUtilization(4000, 1000, limit);
      expect(res.newUtilization).toBe(0.50);

      // 90% boundary
      res = calculateUtilization(8000, 1000, limit);
      expect(res.newUtilization).toBe(0.90);
    });
  });

  describe('calculateInterestCost', () => {
    it('returns 0 interest when user pays in full', () => {
      const interest = calculateInterestCost(5000, 'full', 15, 0.36);
      expect(interest).toBe(0);
    });

    it('calculates interest correctly for minimum due payers', () => {
      // Outstanding: ₹10,000, repayment: minimum (expected payment: 5% = ₹500, unpaid: ₹9,500)
      // Days left: 10. Grace period: 20 days. Total days charged: 30
      // APR: 36% (0.36) -> Daily rate: 0.36 / 365
      // Expected interest = 9500 * (0.36 / 365) * 30 = 281.0958... -> rounded to 281.10
      const interest = calculateInterestCost(10000, 'minimum', 10, 0.36);
      expect(interest).toBeCloseTo(281.10, 1);
    });
  });

  describe('simulateMinimumDueTrap', () => {
    it('calculates debt payoff duration and total interest', () => {
      const purchase = 5000;
      const apr = 0.36;
      const res = simulateMinimumDueTrap(purchase, apr);
      
      expect(res.monthsToPay).toBeGreaterThan(0);
      expect(res.totalInterest).toBeGreaterThan(0);
      expect(res.history.length).toBe(res.monthsToPay);
      // Check last record has 0 balance (or very close to it)
      expect(res.history[res.history.length - 1].balanceAfter).toBeLessThan(1);
    });
  });

  describe('simulateScoreImpact', () => {
    it('returns positive score change for low utilization transitions', () => {
      // utilization reduces or stays very low
      const impact = simulateScoreImpact(0.10, 0.05); // delta = -0.05
      expect(impact).toBe(5); // delta * -100 = 5, within +10 clamp
    });

    it('clamping limits score changes', () => {
      // 0% -> 90% (delta = 0.90) -> change = -90 -> clamped to -50
      const impact = simulateScoreImpact(0, 0.90);
      expect(impact).toBe(-50);
    });

    it('calibrates 30% to 50% jump to approx -20 points', () => {
      const impact = simulateScoreImpact(0.30, 0.50); // delta = 0.20 -> change = -20
      expect(impact).toBe(-20);
    });
  });
});

describe('SwipeSafe Verdict Engine Rules', () => {
  const limit = 10000;
  const apr = 0.36;
  const today = new Date(2026, 6, 15); // July 15, 2026
  const dueDate = 30; // 15 days left

  it('blocks purchases exceeding credit limit', () => {
    const res = evaluatePurchase(12000, limit, 0, 'full', dueDate, apr, today);
    expect(res.verdict).toBe('blocked');
    expect(res.reasoning).toContain('exceeds your available credit limit');
  });

  it('triggers SAFE verdict for low utilization and full repayment', () => {
    // New outstanding: 2000 (20% utilization)
    const res = evaluatePurchase(2000, limit, 0, 'full', dueDate, apr, today);
    expect(res.verdict).toBe('safe');
    expect(res.reasoning).toContain('Safe to swipe!');
  });

  it('triggers CAUTION for low utilization but partial/minimum repayment', () => {
    // New outstanding: 2000 (20% utilization), but repayment is depends
    const res = evaluatePurchase(2000, limit, 0, 'depends', dueDate, apr, today);
    expect(res.verdict).toBe('caution');
    expect(res.reasoning).toContain('utilization remains safe');
    expect(res.reasoning).toContain('accumulate interest');
  });

  it('triggers CAUTION for medium utilization (30% - 50%)', () => {
    // New outstanding: 4500 (45% utilization)
    const res = evaluatePurchase(4500, limit, 0, 'full', dueDate, apr, today);
    expect(res.verdict).toBe('caution');
    expect(res.reasoning).toContain('Caution advised');
    expect(res.reasoning).toContain('crossing the recommended 30%');
  });

  it('triggers RISKY for high utilization (> 50%)', () => {
    // New outstanding: 6000 (60% utilization)
    const res = evaluatePurchase(6000, limit, 0, 'minimum', dueDate, apr, today);
    expect(res.verdict).toBe('risky');
    expect(res.reasoning).toContain('High risk!');
    expect(res.reasoning).toContain('debt trap');
  });
});
