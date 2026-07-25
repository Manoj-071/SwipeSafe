# Backend — Pre-Purchase Credit Decision Assistant (Round 1 MVP)

FastAPI backend implementing the calculation engine + verdict engine from the architecture doc.

## Run it

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Interactive API docs (share this with your frontend teammate — every field, type, and example is auto-documented here): **http://localhost:8000/docs**

## Files

| File | Purpose |
|---|---|
| `calculations.py` | Pure math functions: utilization, interest, score-impact, min-due-trap cost. No framework code — fully unit-testable. |
| `verdict.py` | Decision tree that turns calculations into a verdict + plain-English reasoning. |
| `models.py` | Request/response schemas (what the frontend sends/receives). |
| `main.py` | API routes, wires everything together, in-memory storage. |

## API Endpoints

### 1. `POST /onboarding` — one-time setup
```json
// Request
{
  "credit_limit": 100000,
  "current_outstanding": 20000,
  "due_date": "2026-08-15",
  "repayment_habit": "depends"   // "full" | "minimum" | "depends"
}
// Response: ProfileResponse (see below)
```

### 2. `GET /profile` — current stored card state
```json
{
  "credit_limit": 100000,
  "current_outstanding": 20000,
  "due_date": "2026-08-15",
  "repayment_habit": "depends",
  "current_utilization": 0.2,
  "days_left_in_cycle": 21
}
```

### 3. `POST /purchase-check` — the core interaction, just an amount
```json
// Request
{ "amount": 5000 }

// Response
{
  "verdict": "pay_in_full",              // "safe" | "pay_in_full" | "risky"
  "verdict_label": "Pay in full this cycle",
  "verdict_color": "yellow",             // "green" | "yellow" | "red"
  "utilization_before": 0.2,
  "utilization_after": 0.25,
  "utilization_threshold_crossed": false,
  "interest_if_unpaid": 604.11,
  "minimum_due_trap_cost_3mo": 2581.28,
  "estimated_score_impact": -4,
  "reasoning": "Utilization stays healthy (20% → 25%), but if you don't pay this off in full, it could cost you ₹604 in interest. Paying in full avoids that entirely.",
  "payoff_plan": {
    "outstanding_if_purchased": 25000.0,
    "pay_in_full_cost": 0.0,
    "minimum_due_only_3mo_cost": 2581.28,
    "interest_saved_by_paying_full": 604.11
  }
}
```
**This does NOT change stored state** — it's a "what if" check. Call `/purchase-confirm` separately once the user actually goes through with it.

### 4. `POST /purchase-confirm` — user actually made the purchase
```json
// Request
{ "amount": 5000 }
// Response: ProfileResponse, with current_outstanding updated
```

### 5. `POST /payment` — the one recurring tap around the due date
```json
// Request
{ "payment_type": "full" }                              // resets outstanding to 0
{ "payment_type": "minimum" }                            // pays ~5% of outstanding
{ "payment_type": "partial", "partial_amount": 3000 }    // pays a specific amount
// Response: ProfileResponse, with outstanding + due_date (rolled forward 30 days) updated
```

### 6. `GET /nudge-preview` — mock reminder notification
```json
{
  "days_until_due": 21,
  "outstanding": 20000,
  "message": "Your bill is due in 21 days. Outstanding: ₹20,000. Paying in full protects your score and avoids interest."
}
```

## Demo flow for frontend to wire up

1. App opens → call `GET /profile` → if 400 error, show onboarding screen
2. Onboarding screen submits → `POST /onboarding`
3. Home screen shows `GET /profile` data (limit, outstanding, utilization, days left)
4. "About to buy?" screen: user types amount → `POST /purchase-check` → render verdict screen from the response (color, label, reasoning, numbers)
5. If user taps "Yes, I bought it" → `POST /purchase-confirm` with the same amount → refresh home screen
6. "Preview reminder" button anywhere → `GET /nudge-preview`

## Notes / things I deliberately kept simple for MVP

- **In-memory storage, single user, no auth.** Good enough for a hackathon demo. If you want to persist across restarts, swap the `PROFILE` dict in `main.py` for SQLite — the calculation/verdict logic doesn't need to change at all.
- **CORS is wide open** (`allow_origins=["*"]`) so your frontend can hit this from any dev server port without config headaches. Tighten before any real deployment.
- **All numbers are clearly labeled estimates** (especially score impact) — this is intentional, not a bug. Real bureau scoring isn't public, so an honest "estimated" framing is both accurate and actually reassures judges you're not overclaiming.
- Tested end-to-end with curl — small purchase → yellow verdict, large purchase → red verdict, both with sane ₹ numbers. Ready for your frontend to plug into.
