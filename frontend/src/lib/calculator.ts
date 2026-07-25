export function getDaysLeftInCycle(dueDate: number, today: Date = new Date()): number {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDay = today.getDate();

  let nextDueYear = year;
  let nextDueMonth = month;

  if (todayDay > dueDate) {
    nextDueMonth = month + 1;
  }

  // Find last day in nextDueMonth to avoid overflows (e.g. February or 30-day months)
  const lastDayOfNextDueMonth = new Date(nextDueYear, nextDueMonth + 1, 0).getDate();
  const targetDay = Math.min(dueDate, lastDayOfNextDueMonth);
  
  const end = new Date(nextDueYear, nextDueMonth, targetDay);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export interface UtilizationResult {
  oldUtilization: number;
  newOutstanding: number;
  newUtilization: number;
}

export function calculateUtilization(
  currentOutstanding: number,
  purchaseAmount: number,
  limit: number
): UtilizationResult {
  const oldUtilization = limit > 0 ? currentOutstanding / limit : 0;
  const newOutstanding = currentOutstanding + purchaseAmount;
  const newUtilization = limit > 0 ? newOutstanding / limit : 0;

  return {
    oldUtilization,
    newOutstanding,
    newUtilization
  };
}

export function calculateInterestCost(
  newOutstanding: number,
  repaymentPattern: 'full' | 'minimum' | 'depends',
  daysLeft: number,
  apr: number = 0.36
): number {
  if (repaymentPattern === 'full') {
    return 0;
  }

  const dailyRate = apr / 365;
  // If pattern is minimum, we pay 5%. If depends, we assume partial e.g. 15% payment.
  const expectedPaymentPercent = repaymentPattern === 'minimum' ? 0.05 : 0.15;
  const expectedPayment = newOutstanding * expectedPaymentPercent;
  const unpaidAmount = Math.max(0, newOutstanding - expectedPayment);

  // Interest grace period adds 20 days to the remaining cycle days
  const daysCharged = daysLeft + 20;
  const interestCost = unpaidAmount * dailyRate * daysCharged;

  return Math.round(interestCost * 100) / 100;
}

export interface TrapSimulationRecord {
  month: number;
  payment: number;
  interestAdded: number;
  balanceAfter: number;
}

export interface TrapSimulationResult {
  monthsToPay: number;
  totalInterest: number;
  history: TrapSimulationRecord[];
  interestAt12Months: number;
}

export function simulateMinimumDueTrap(
  purchaseAmount: number,
  apr: number = 0.36
): TrapSimulationResult {
  let balance = purchaseAmount;
  let totalInterest = 0;
  let monthsToPay = 0;
  const history: TrapSimulationRecord[] = [];
  let interestAt12Months = 0;

  const monthlyRate = apr / 12;

  // Run simulation up to 120 months (10 years)
  while (balance > 0.01 && monthsToPay < 120) {
    const interestAdded = balance * monthlyRate;
    totalInterest += interestAdded;
    monthsToPay++;

    // Minimum due is 5% of outstanding balance or ₹250 (whichever is higher)
    // capped at the outstanding balance + interest
    const minPaymentFormula = Math.max(250, balance * 0.05);
    const payment = Math.min(minPaymentFormula, balance + interestAdded);
    const balanceAfter = Math.max(0, balance + interestAdded - payment);

    history.push({
      month: monthsToPay,
      payment: Math.round(payment * 100) / 100,
      interestAdded: Math.round(interestAdded * 100) / 100,
      balanceAfter: Math.round(balanceAfter * 100) / 100
    });

    if (monthsToPay === 12) {
      interestAt12Months = totalInterest;
    }

    balance = balanceAfter;
  }

  if (monthsToPay < 12) {
    interestAt12Months = totalInterest;
  }

  return {
    monthsToPay,
    totalInterest: Math.round(totalInterest),
    history,
    interestAt12Months: Math.round(interestAt12Months)
  };
}

export function simulateScoreImpact(
  oldUtil: number,
  newUtil: number,
  sensitivity: number = 100
): number {
  const delta = newUtil - oldUtil;
  let scoreChange = -Math.round(delta * sensitivity);

  // Clamp estimated score change to a realistic range: -50 to +10
  scoreChange = Math.max(-50, Math.min(10, scoreChange));

  return scoreChange;
}
