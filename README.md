# SwipeSafe — Pre-Purchase Credit Decision Assistant

**InnovaHack Chapter-1 | Open Innovation Track | Round 1 Submission**

> Should you swipe? SwipeSafe tells you *before* you do — with real ₹ numbers, not vague warnings.

---

## 🚩 The Problem

People swipe credit cards without understanding the real cost of that single decision — interest charges if not paid in full, the hit to their credit utilization and score, and hidden fees. This leads first-time cardholders straight into debt traps, simply because no existing tool gives them a clear answer **at the moment it matters: right before they buy.**

Existing apps (CRED, bank apps, credit score simulators) are all **retrospective** — they tell you what already happened. Nothing gives a real-time, pre-purchase verdict.

## 💡 Our Solution

SwipeSafe is a **pre-purchase decision assistant**. Before you buy, enter the amount — that's it — and instantly get:

- ✅ **A clear verdict**: *Safe to swipe* / *Pay in full this cycle* / *Risky — use debit instead*
- 📊 **Utilization impact** — before vs. after, and whether it crosses the healthy 30% threshold
- 💰 **Real interest cost** in ₹ if not paid in full — not a vague warning
- 📉 **Estimated credit score impact** — a simple, clearly-labeled simulated model
- 🧾 **A plain-English "why"** behind every verdict
- 🔔 **Post-purchase nudges** with an actual payoff plan before the due date

### Why this wins on "narrow input"
Most first-time cardholders don't know terms like "utilization" or "billing cycle days." So we ask for everything **once**, during a 30-second onboarding (limit, due date, current balance, repayment habit in plain language) — and every day after that, the only thing you type is **the purchase amount.** Outstanding balance updates automatically after each swipe; days-left-in-cycle is derived from your due date, never re-asked.

---

## 🏗️ Architecture

```
Frontend (React + TypeScript + Vite)
  ├─ Onboarding flow (one-time)
  ├─ Home screen (live card state)
  ├─ Purchase check (amount → verdict)
  ├─ Verdict + reasoning screen
  ├─ Payoff plan screen
  └─ Nudge preview screen
       │
       ▼
  Client-side Calculation + Verdict Engine (TypeScript)
  ├─ Utilization calculator
  ├─ Interest cost calculator
  ├─ Minimum-due debt-trap simulator
  └─ Simplified score-impact model
```

**Round 1 runs fully client-side** — all calculations happen locally in the browser (nothing about your spending ever leaves your device), which also makes the demo fully reliable with zero network/API dependency risk.

A parallel **FastAPI backend** (`/backend`) implements the identical calculation and verdict logic in Python, built and tested independently, as the foundation for the next phase — persistent accounts, multi-device sync, and real transaction ingestion.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Recharts |
| State/Persistence | React Context + localStorage |
| Backend (future phase) | Python, FastAPI, Pydantic |
| Testing | Vitest (16 unit tests on core calculation logic) |

---

## 🚀 Running the Project

### Frontend (the live demo)
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:5173`. Works fully standalone — no backend required.

### Backend (future-phase preview)
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive API docs at `http://localhost:8000/docs`.

---

## 🎬 Demo Flow

The app includes a built-in **Demo Panel** (bottom-right corner) with 3 pre-loaded profiles covering all three verdict tiers, so the full range of outcomes can be shown instantly:

1. **Safe Case** — low utilization, pays in full → 🟢 Safe to swipe
2. **Caution Case** — mid utilization, mixed repayment → 🟡 Pay in full this cycle
3. **Risky Case** — high utilization, minimum-due payer → 🔴 Risky, consider debit

---

## 👥 Team

- **Team Name:** Quantum Coders
- **Team Leader:** Manoj B
- **Team Member:** Lingesh R
- **Team Member:** Elango D
- **Track:** Open Innovation
- **Round 1 Submission:** https://swipe-safe.vercel.app/

---

## 📌 What's Next (Beyond Round 1)
- Real bank/SMS transaction ingestion (linking to the FinTech-domain "leak detector" concept)
- Persistent multi-device accounts via the FastAPI backend
- Push notification infrastructure for real due-date nudges
- Bureau-partnered real score-impact data (replacing the simulated model)
