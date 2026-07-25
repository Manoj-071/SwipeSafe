"""
Calculation Engine — pure functions, fully deterministic, no external calls.
This is the core IP of the product. Keep every function independently testable.
"""
from datetime import date

# ---- Tunable constants (realistic Indian credit card ballpark figures) ----
ANNUAL_INTEREST_RATE = 0.42          # ~3.5%/month is typical on Indian cards (36-42% APR)
MINIMUM_DUE_PERCENT = 0.05           # typical minimum due is ~5% of outstanding
UTILIZATION_HEALTHY_THRESHOLD = 0.30
UTILIZATION_HIGH_THRESHOLD = 0.50
SCORE_SENSITIVITY_CONSTANT = 80      # calibrated so a 20-point utilization jump ≈ -16 score points


def days_left_in_cycle(due_date: date, today: date = None) -> int:
    """Derive days remaining until the bill is due. Never asked from the user."""
    today = today or date.today()
    delta = (due_date - today).days
    return max(delta, 0)


def calculate_utilization(outstanding: float, credit_limit: float) -> float:
    """Utilization as a fraction (0.0 - 1.0+)."""
    if credit_limit <= 0:
        return 0.0
    return outstanding / credit_limit


def calculate_interest_cost(unpaid_amount: float, days_charged: int,
                             annual_rate: float = ANNUAL_INTEREST_RATE) -> float:
    """
    Simple daily-rate interest calculation.
    Real card math varies by issuer, but this is a defensible, explainable approximation —
    label it clearly as an estimate in the UI.
    """
    if unpaid_amount <= 0 or days_charged <= 0:
        return 0.0
    daily_rate = annual_rate / 365
    return round(unpaid_amount * daily_rate * days_charged, 2)


def calculate_minimum_due_trap_cost(outstanding: float, months: int = 3,
                                     annual_rate: float = ANNUAL_INTEREST_RATE,
                                     min_due_percent: float = MINIMUM_DUE_PERCENT) -> float:
    """
    'Shock number': total interest paid over N months if the user only ever pays
    the minimum due and keeps spending nothing extra. Demonstrates the debt-trap
    mechanic in one number.
    """
    balance = outstanding
    total_interest = 0.0
    monthly_rate = annual_rate / 12

    for _ in range(months):
        interest = balance * monthly_rate
        total_interest += interest
        balance += interest
        min_payment = max(balance * min_due_percent, 1)
        balance -= min_payment
        if balance < 0:
            balance = 0

    return round(total_interest, 2)


def estimate_score_impact(utilization_before: float, utilization_after: float,
                           sensitivity: float = SCORE_SENSITIVITY_CONSTANT) -> int:
    """
    Simplified, clearly-labeled simulated score impact.
    NOT a real bureau model — directional estimate only, always presented as such in UI.
    """
    delta = utilization_after - utilization_before
    impact = -round(delta * sensitivity)
    # clamp to a believable range
    return max(min(impact, 0), -100)
