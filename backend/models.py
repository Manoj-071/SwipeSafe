"""
Pydantic models — the request/response schemas the frontend talks to.
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date


class OnboardingRequest(BaseModel):
    credit_limit: float = Field(..., gt=0, description="Card's credit limit in ₹")
    current_outstanding: float = Field(0, ge=0, description="What they currently owe, 0 if starting fresh")
    due_date: date = Field(..., description="Next/usual bill due date")
    repayment_habit: Literal["full", "minimum", "depends"] = Field(
        ..., description="'full' = pays in full, 'minimum' = pays minimum due, 'depends' = mixed"
    )


class ProfileResponse(BaseModel):
    credit_limit: float
    current_outstanding: float
    due_date: date
    repayment_habit: str
    current_utilization: float
    days_left_in_cycle: int


class PurchaseCheckRequest(BaseModel):
    amount: float = Field(..., gt=0, description="The purchase amount being considered")


class PurchaseCheckResponse(BaseModel):
    verdict: Literal["safe", "pay_in_full", "risky"]
    verdict_label: str
    verdict_color: Literal["green", "yellow", "red"]

    utilization_before: float
    utilization_after: float
    utilization_threshold_crossed: bool

    interest_if_unpaid: float
    minimum_due_trap_cost_3mo: float

    estimated_score_impact: int  # negative number = points likely lost

    reasoning: str
    payoff_plan: dict


class PurchaseConfirmRequest(BaseModel):
    amount: float = Field(..., gt=0)


class PaymentRequest(BaseModel):
    payment_type: Literal["full", "minimum", "partial"]
    partial_amount: Optional[float] = Field(None, description="Required only if payment_type == 'partial'")


class NudgePreviewResponse(BaseModel):
    days_until_due: int
    outstanding: float
    message: str
