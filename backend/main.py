"""
Pre-Purchase Credit Decision Assistant — Backend (Round 1 MVP)

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Docs (auto-generated, share this URL with your frontend teammate):
    http://localhost:8000/docs
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

from models import (
    OnboardingRequest, ProfileResponse,
    PurchaseCheckRequest, PurchaseCheckResponse,
    PurchaseConfirmRequest,
    PaymentRequest,
    NudgePreviewResponse,
)
from calculations import calculate_utilization, days_left_in_cycle, MINIMUM_DUE_PERCENT
from verdict import build_verdict

app = FastAPI(title="Pre-Purchase Credit Decision Assistant API", version="0.1.0")

# Allow the frontend (any origin) to call this during the hackathon — tighten later if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory "database" — single demo user, no auth needed for MVP.
# Swap this dict for a real DB later without touching the calculation/verdict logic.
# ---------------------------------------------------------------------------
PROFILE: dict = {}


def _require_profile():
    if not PROFILE:
        raise HTTPException(status_code=400, detail="No profile found. Complete onboarding first.")
    return PROFILE


# ---------------------------------------------------------------------------
# 1. ONBOARDING — happens once
# ---------------------------------------------------------------------------
@app.post("/onboarding", response_model=ProfileResponse)
def onboarding(req: OnboardingRequest):
    if req.current_outstanding > req.credit_limit:
        raise HTTPException(status_code=400, detail="Outstanding cannot exceed credit limit.")

    PROFILE.clear()
    PROFILE.update({
        "credit_limit": req.credit_limit,
        "current_outstanding": req.current_outstanding,
        "due_date": req.due_date,
        "repayment_habit": req.repayment_habit,
    })
    return _profile_response()


@app.get("/profile", response_model=ProfileResponse)
def get_profile():
    _require_profile()
    return _profile_response()


def _profile_response() -> ProfileResponse:
    util = calculate_utilization(PROFILE["current_outstanding"], PROFILE["credit_limit"])
    days_left = days_left_in_cycle(PROFILE["due_date"])
    return ProfileResponse(
        credit_limit=PROFILE["credit_limit"],
        current_outstanding=PROFILE["current_outstanding"],
        due_date=PROFILE["due_date"],
        repayment_habit=PROFILE["repayment_habit"],
        current_utilization=round(util, 4),
        days_left_in_cycle=days_left,
    )


# ---------------------------------------------------------------------------
# 2. PURCHASE CHECK — the core, every-day interaction. Just an amount.
# ---------------------------------------------------------------------------
@app.post("/purchase-check", response_model=PurchaseCheckResponse)
def purchase_check(req: PurchaseCheckRequest):
    profile = _require_profile()

    if req.amount > profile["credit_limit"] - profile["current_outstanding"]:
        raise HTTPException(status_code=400, detail="Purchase exceeds available credit limit.")

    result = build_verdict(
        credit_limit=profile["credit_limit"],
        current_outstanding=profile["current_outstanding"],
        purchase_amount=req.amount,
        due_date=profile["due_date"],
        repayment_habit=profile["repayment_habit"],
    )
    return PurchaseCheckResponse(**result)


# ---------------------------------------------------------------------------
# 3. CONFIRM PURCHASE — user actually goes through with it; outstanding auto-updates
# ---------------------------------------------------------------------------
@app.post("/purchase-confirm", response_model=ProfileResponse)
def purchase_confirm(req: PurchaseConfirmRequest):
    profile = _require_profile()

    if req.amount > profile["credit_limit"] - profile["current_outstanding"]:
        raise HTTPException(status_code=400, detail="Purchase exceeds available credit limit.")

    profile["current_outstanding"] += req.amount
    return _profile_response()


# ---------------------------------------------------------------------------
# 4. PAYMENT — the one recurring tap on/around the due date, resets outstanding
# ---------------------------------------------------------------------------
@app.post("/payment", response_model=ProfileResponse)
def make_payment(req: PaymentRequest):
    profile = _require_profile()
    outstanding = profile["current_outstanding"]

    if req.payment_type == "full":
        profile["current_outstanding"] = 0.0
    elif req.payment_type == "minimum":
        min_due = outstanding * MINIMUM_DUE_PERCENT
        profile["current_outstanding"] = round(outstanding - min_due, 2)
    elif req.payment_type == "partial":
        if req.partial_amount is None:
            raise HTTPException(status_code=400, detail="partial_amount required for partial payments.")
        profile["current_outstanding"] = round(max(outstanding - req.partial_amount, 0), 2)

    # Advance due date by one billing cycle (~30 days) for the demo loop
    from datetime import timedelta
    profile["due_date"] = profile["due_date"] + timedelta(days=30)

    return _profile_response()


# ---------------------------------------------------------------------------
# 5. NUDGE PREVIEW — mock reminder, no real push infra needed for MVP demo
# ---------------------------------------------------------------------------
@app.get("/nudge-preview", response_model=NudgePreviewResponse)
def nudge_preview():
    profile = _require_profile()
    days_left = days_left_in_cycle(profile["due_date"])
    outstanding = profile["current_outstanding"]

    if outstanding <= 0:
        message = "You're all paid up! No dues this cycle. 🎉"
    else:
        message = (
            f"Your bill is due in {days_left} day{'s' if days_left != 1 else ''}. "
            f"Outstanding: ₹{outstanding:,.0f}. Paying in full protects your score and avoids interest."
        )

    return NudgePreviewResponse(
        days_until_due=days_left,
        outstanding=outstanding,
        message=message,
    )


@app.get("/")
def health_check():
    return {"status": "ok", "service": "credit-decision-assistant-backend"}
