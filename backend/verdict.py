"""
Verdict Engine — explainable rule-based decision tree.
Deliberately NOT a black-box model: every verdict must be traceable to the numbers.
"""
from calculations import (
    calculate_utilization,
    calculate_interest_cost,
    calculate_minimum_due_trap_cost,
    estimate_score_impact,
    days_left_in_cycle,
    UTILIZATION_HEALTHY_THRESHOLD,
    UTILIZATION_HIGH_THRESHOLD,
)


def build_verdict(credit_limit: float, current_outstanding: float, purchase_amount: float,
                   due_date, repayment_habit: str, today=None) -> dict:

    utilization_before = calculate_utilization(current_outstanding, credit_limit)
    new_outstanding = current_outstanding + purchase_amount
    utilization_after = calculate_utilization(new_outstanding, credit_limit)
    threshold_crossed = utilization_before <= UTILIZATION_HEALTHY_THRESHOLD < utilization_after

    days_left = days_left_in_cycle(due_date, today)

    pays_in_full = repayment_habit == "full"

    # Interest if the new purchase isn't paid off in full by the due date
    interest_if_unpaid = calculate_interest_cost(new_outstanding, days_left)

    # Shock number: cost of falling into a minimum-due pattern from here
    minimum_due_trap_cost = calculate_minimum_due_trap_cost(new_outstanding)

    score_impact = estimate_score_impact(utilization_before, utilization_after)

    # ---- Decision tree ----
    if utilization_after <= UTILIZATION_HEALTHY_THRESHOLD and pays_in_full:
        verdict = "safe"
        verdict_label = "Safe to swipe"
        verdict_color = "green"
        reasoning = (
            f"This purchase takes your utilization from {utilization_before:.0%} to "
            f"{utilization_after:.0%}, staying under the healthy 30% threshold. "
            f"Since you usually pay in full, this shouldn't cost you anything extra."
        )
    elif utilization_after <= UTILIZATION_HEALTHY_THRESHOLD and not pays_in_full:
        verdict = "pay_in_full"
        verdict_label = "Pay in full this cycle"
        verdict_color = "yellow"
        reasoning = (
            f"Utilization stays healthy ({utilization_before:.0%} → {utilization_after:.0%}), "
            f"but if you don't pay this off in full, it could cost you ₹{interest_if_unpaid:,.0f} "
            f"in interest. Paying in full avoids that entirely."
        )
    elif utilization_after <= UTILIZATION_HIGH_THRESHOLD:
        verdict = "pay_in_full"
        verdict_label = "Pay in full this cycle"
        verdict_color = "yellow"
        reasoning = (
            f"This pushes your utilization from {utilization_before:.0%} to {utilization_after:.0%}, "
            f"above the healthy 30% threshold — this alone could cost you roughly {abs(score_impact)} "
            f"credit score points if not corrected. Paying in full this cycle avoids ₹{interest_if_unpaid:,.0f} "
            f"in interest and limits the score impact."
        )
    else:
        verdict = "risky"
        verdict_label = "Risky — consider debit instead"
        verdict_color = "red"
        reasoning = (
            f"This would push your utilization to {utilization_after:.0%} — a significant jump from "
            f"{utilization_before:.0%}. Estimated score impact: {score_impact} points. "
            f"If you fall into paying only the minimum due afterward, this single decision could snowball "
            f"into ~₹{minimum_due_trap_cost:,.0f} in interest over the next 3 months. Consider debit instead."
        )

    payoff_plan = {
        "outstanding_if_purchased": round(new_outstanding, 2),
        "pay_in_full_cost": 0.0,
        "minimum_due_only_3mo_cost": minimum_due_trap_cost,
        "interest_saved_by_paying_full": interest_if_unpaid,
    }

    return {
        "verdict": verdict,
        "verdict_label": verdict_label,
        "verdict_color": verdict_color,
        "utilization_before": round(utilization_before, 4),
        "utilization_after": round(utilization_after, 4),
        "utilization_threshold_crossed": threshold_crossed,
        "interest_if_unpaid": interest_if_unpaid,
        "minimum_due_trap_cost_3mo": minimum_due_trap_cost,
        "estimated_score_impact": score_impact,
        "reasoning": reasoning,
        "payoff_plan": payoff_plan,
    }
