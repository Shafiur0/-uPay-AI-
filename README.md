<div align="center">
  <img src="https://raw.githubusercontent.com/Shafiur0/-uPay-AI-/main/public/favicon.svg" alt="uPay AI Logo" width="120" height="120" />
  
  <h1>💳 uPay AI — Personal Financial Copilot</h1>
  <p><em>Transform your digital wallet from a simple payment tool into an intelligent financial companion.</em></p>

  [![Deploy on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)](https://u-pay-ai.vercel.app/#login)
  [![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/Shafiur0/-uPay-AI-.git)
  [![Track 03](https://img.shields.io/badge/Hackathon-Track_03:_Customer_Innovation-blue)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  <br />

  ### **[🚀 Try the Live Demo on Vercel](https://u-pay-ai.vercel.app/#login)** | **[💻 View Source Code](https://github.com/Shafiur0/-uPay-AI-.git)**

</div>

<br />

> **Track 03: Customer Innovation & Financial Independence**

Transform your digital wallet from a simple payment tool into an intelligent financial companion that helps users understand, plan, and improve their financial behavior. By bridging the gap between raw transaction data and actionable insights, uPay AI fosters **financial literacy and independence**.

## 🎯 Problem

Traditional MFS (Mobile Financial Service) apps show transactions but provide no intelligence. Users can see _where_ their money went, but not _why_ they're always short at month-end, _how_ to save for goals, or _what_ patterns drive their spending.

## 💡 Solution

**uPay AI** adds a financial intelligence layer on top of the existing uPay wallet:

```
Payment → Transaction Data → Financial Understanding → AI Insights → Planning → Goals → Financial Confidence
```

### Key Innovation

- **Ask My Money**: Conversational AI that uses your _actual_ financial data (not generic advice)
- **Deterministic Financial Engine**: All calculations happen in application code — the AI explains, it doesn't calculate
- **Privacy-Aware Context**: Only relevant financial data is sent to the LLM
- **Bangla/Banglish Support**: Ask questions in English, বাংলা, or Banglish

## ✨ Features

### Financial Center
- **Financial Health Score** (0-100) with transparent, explainable metrics
- **Spending Analytics** — category breakdown, weekly trends, anomaly detection
- **Cash Flow Forecast** — 7/14/30-day balance projection with charts
- **Savings Goal Copilot** — create goals, get comfortable/target/aggressive plans
- **Cash-Out Analysis** — track cash dependency patterns
- **AI Insights** — automated spending alerts and pattern detection
- **Financial Consistency** — 6-month behavioral analysis
- **Personalized Learning** — education content triggered by your behavior

### Ask My Money (AI Copilot)
- Natural language financial queries
- Structured JSON responses with evidence cards
- Intent detection → targeted context → OpenRouter → validated output
- Quick action buttons for common questions
- Language selection (English / বাংলা / Banglish)

### Existing Wallet (Preserved)
- Send Money, Cash Out, Add Money
- Mobile Recharge, Bill Payment, QR Payment
- Transaction History with filters
- Profile, Notifications, Offers

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Frontend (Vite + Vanilla JS)    │
│                                             │
│  main.js ── financial-ui.js ── data.js      │
│               │                             │
│  services/financial/engine.js  (calculations)│
│  services/ai/client.js         (API calls)  │
│  services/ai/intent.js         (routing)    │
└──────────────────┬──────────────────────────┘
                   │ /api/ai/ask
┌──────────────────▼──────────────────────────┐
│           Backend (Express.js)               │
│                                             │
│  server.js                                  │
│  services/openrouter.js  (retry, timeout)   │
│  services/prompts.js     (system prompts)   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           OpenRouter API                     │
│           (Configurable Model)               │
└─────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenRouter API key ([openrouter.ai](https://openrouter.ai))

### Installation

```bash
git clone <repo>
cd upay
npm install
```

### Environment Variables

Create a `.env` file:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=google/gemini-2.5-flash
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_SITE_NAME=uPay AI Copilot
PORT=3001
```

### Development

```bash
npm run dev:all    # Starts both frontend (5173) and backend (3001)
```

### Production Build

```bash
npm run build      # Build frontend
npm run server     # Run backend separately
```

## 🔐 Demo Account

Access the **[Live Demo here](https://u-pay-ai.vercel.app/#login)**. Use the following credentials to explore the prototype:

| Field | Value |
|-------|-------|
| Phone | `01712345678` (pre-filled) |
| PIN | `1234` (pre-filled) |

**Reset Demo Data**: Profile → Reset Demo Data button

## 📊 Demo Data

6 months of realistic transaction patterns:

| Month | Pattern |
|-------|---------|
| Month 1 | Normal baseline spending |
| Month 2 | Higher food spending (+28%) |
| Month 3 | Shopping spike (electronics) |
| Month 4 | High cash-out frequency (6 withdrawals) |
| Month 5 | Improved savings behavior |
| Month 6 | Month-end liquidity pressure |

## 🤖 AI Architecture

### Context Pipeline
```
User Question → Intent Detection → Financial Data Retrieval → Context Builder → OpenRouter → Validation → UI
```

### Intent Categories
- `SPENDING_ANALYSIS`, `TRANSACTION_EXPLANATION`, `SAVING_PLAN`
- `GOAL_PLANNING`, `CASH_FLOW`, `FORECAST`, `CASH_OUT_ANALYSIS`
- `FINANCIAL_HEALTH`, `FINANCIAL_LITERACY`, `GENERAL_FINANCIAL`

### Safety
- Server-side API calls only (API key never exposed to browser)
- Rate limiting, timeout handling, retry with backoff
- Structured JSON output with validation
- Hallucination protection via data-only context
- Graceful fallback when AI is unavailable

## 🔒 Security

- API keys stored in `.env` (gitignored)
- Server-side OpenRouter integration only
- Input validation and sanitization
- Payload size limits
- No real financial data or real money movement
- Clearly labeled as prototype/demo

## 📁 Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── .env                    # API keys (gitignored)
├── server/
│   ├── server.js           # Express backend
│   └── services/
│       ├── openrouter.js   # AI provider with retry/timeout
│       └── prompts.js      # Centralized system prompts
├── src/
│   ├── main.js             # App shell, routing, existing features
│   ├── financial-ui.js     # All Financial Center pages
│   ├── data.js             # State, demo data, goals
│   ├── style.css           # Main styles
│   ├── ai-style.css        # AI/financial styles
│   ├── icons.js            # SVG icons
│   └── services/
│       ├── financial/
│       │   └── engine.js   # Deterministic financial calculations
│       └── ai/
│           ├── client.js   # Frontend AI client
│           └── intent.js   # Intent detection
└── docs/                   # Documentation
```

## ⚠️ Known Limitations

- Demo data is simulated (not real financial accounts)
- No persistent storage (data resets on page refresh)
- Charts are inline SVG (not a charting library)
- Single-user prototype
- AI responses depend on OpenRouter availability

## 🗺️ Future Roadmap

- Voice-ready architecture
- Advanced ML forecasting
- Persistent storage with IndexedDB
- Multi-currency support
- Advanced accessibility (screen reader optimization)
- Production authentication

## 📝 License

MIT License — See [LICENSE](LICENSE)

---

**Built for Track 03: Customer Innovation & Financial Independence**

> "The wallet doesn't just show where your money went. It helps you understand what you can do next."
