import { getDaysLeftInCycle, calculateUtilization, calculateInterestCost, simulateMinimumDueTrap, simulateScoreImpact } from './calculator';

export interface VerdictResult {
  verdict: 'safe' | 'caution' | 'risky' | 'blocked';
  utilizationBefore: number;
  utilizationAfter: number;
  outstandingBefore: number;
  outstandingAfter: number;
  interestCost: number;
  minimumDueTrapCost: number;
  monthsToPayTrap: number;
  scoreImpact: number;
  reasoning: string;
  daysLeft: number;
}

export function evaluatePurchase(
  purchaseAmount: number,
  cardLimit: number,
  outstandingBalance: number,
  repaymentPattern: 'full' | 'minimum' | 'depends',
  dueDate: number,
  apr: number = 0.36,
  today: Date = new Date()
): VerdictResult {
  const daysLeft = getDaysLeftInCycle(dueDate, today);
  const { oldUtilization, newOutstanding, newUtilization } = calculateUtilization(
    outstandingBalance,
    purchaseAmount,
    cardLimit
  );

  const interestCost = calculateInterestCost(newOutstanding, repaymentPattern, daysLeft, apr);
  const trapRes = simulateMinimumDueTrap(purchaseAmount, apr);
  const scoreImpact = simulateScoreImpact(oldUtilization, newUtilization);

  const formattedAmount = purchaseAmount.toLocaleString('en-IN');
  const formattedLimit = cardLimit.toLocaleString('en-IN');
  const formattedInterest = Math.round(interestCost).toLocaleString('en-IN');
  const formattedTrapCost = Math.round(trapRes.totalInterest).toLocaleString('en-IN');

  let verdict: 'safe' | 'caution' | 'risky' | 'blocked';
  let reasoning = '';

  if (newOutstanding > cardLimit) {
    verdict = 'blocked';
    reasoning = `This purchase of ₹${formattedAmount} exceeds your available credit limit. Swiping this card will put you over-limit (Outstanding: ₹${newOutstanding.toLocaleString('en-IN')} / ₹${formattedLimit}), leading to transaction decline or heavy penalty fees.`;
  } else if (newUtilization <= 0.30 && repaymentPattern === 'full') {
    verdict = 'safe';
    reasoning = `Safe to swipe! Your credit utilization will rise from ${Math.round(oldUtilization * 100)}% to ${Math.round(newUtilization * 100)}%, which remains within the healthy 30% limit. Because you pay your bill in full, you will incur ₹0 interest cost and build positive credit history.`;
  } else if (newUtilization <= 0.30) {
    verdict = 'caution';
    reasoning = `Your utilization remains safe at ${Math.round(newUtilization * 100)}%, but because you don't pay your bill in full, this purchase will immediately accumulate interest. You will pay around ₹${formattedInterest} in interest cost this cycle. Consider paying in full to save this cash!`;
  } else if (newUtilization <= 0.50) {
    verdict = 'caution';
    reasoning = `Caution advised. This purchase pushes your utilization from ${Math.round(oldUtilization * 100)}% to ${Math.round(newUtilization * 100)}%, crossing the recommended 30% healthy threshold. This could temporarily drop your credit score by ${Math.abs(scoreImpact)} points and cost you ₹${formattedInterest} in interest if you don't pay in full.`;
  } else {
    verdict = 'risky';
    reasoning = `High risk! Your utilization will jump to ${Math.round(newUtilization * 100)}%, exceeding the critical 50% limit. Your credit score could drop by ${Math.abs(scoreImpact)} points. If you only make the minimum payment, this single ₹${formattedAmount} swipe will trigger a debt trap, costing you ₹${formattedTrapCost} in interest over ${trapRes.monthsToPay} months!`;
  }

  return {
    verdict,
    utilizationBefore: oldUtilization,
    utilizationAfter: newUtilization,
    outstandingBefore: outstandingBalance,
    outstandingAfter: newOutstanding,
    interestCost,
    minimumDueTrapCost: trapRes.totalInterest,
    monthsToPayTrap: trapRes.monthsToPay,
    scoreImpact,
    reasoning,
    daysLeft
  };
}
