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

---

## 📖 Table of Contents
- [🎯 Problem](#-problem)
- [💡 Solution](#-solution)
- [🛠 Tech Stack](#-tech-stack)
- [✨ Features](#-features)
- [🔐 Demo Account](#-demo-account)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture & AI Pipeline](#️-architecture--ai-pipeline)
- [📁 Project Structure](#-project-structure)
- [🗺️ Roadmap & Limitations](#️-roadmap--limitations)

---

## 🎯 Problem

Traditional MFS (Mobile Financial Service) apps show transactions but provide **no intelligence**. Users can see _where_ their money went, but not _why_ they're always short at month-end, _how_ to save for goals, or _what_ patterns drive their spending.

## 💡 Solution

**uPay AI** adds a financial intelligence layer on top of the existing uPay wallet, acting as a personal financial copilot:

> `Payment → Transaction Data → Financial Understanding → AI Insights → Planning → Goals → Financial Confidence`

### 🔑 Key Innovations
- **Ask My Money**: Conversational AI that uses your _actual_ financial data (not generic advice).
- **Deterministic Financial Engine**: All calculations happen in application code — the AI *explains*, it doesn't calculate.
- **Privacy-Aware Context**: Only relevant financial data is sent to the LLM.
- **Bangla/Banglish Support**: Ask questions naturally in English, বাংলা, or Banglish.

---

## 🛠 Tech Stack

**Frontend:**
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)

**Backend:**
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB)

**AI & Cloud:**
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-blueviolet?style=flat)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=flat&logo=vercel&logoColor=white)

---

## ✨ Features

### 🏦 Financial Center
- **Financial Health Score (0-100)** with transparent, explainable metrics.
- **Spending Analytics** — visual category breakdown, weekly trends, and anomaly detection.
- **Cash Flow Forecast** — 7/14/30-day balance projection with intuitive charts.
- **Savings Goal Copilot** — create goals and receive comfortable/target/aggressive saving plans.
- **Cash-Out Analysis** — track cash dependency patterns to improve digital habits.
- **Personalized AI Insights** — automated spending alerts and educational content triggered by behavior.

### 💬 Ask My Money (AI Copilot)
- Natural language financial queries with quick action buttons.
- Structured JSON responses formatted beautifully into **evidence cards**.
- Seamless language selection (English / বাংলা / Banglish).

### 💳 Existing Wallet Features (Preserved)
- Send Money, Cash Out, Add Money, Mobile Recharge, Bill Payment, QR Payment.
- Advanced Transaction History with dynamic filters.

---

## 🔐 Demo Account

Access the **[Live Demo here](https://u-pay-ai.vercel.app/#login)**. Use the following credentials to explore the prototype:

| Field | Value |
|-------|-------|
| **Phone** | `01712345678` (pre-filled) |
| **PIN** | `1234` (pre-filled) |

> 💡 **Tip:** To reset the 6 months of realistic transaction patterns, navigate to **Profile → Reset Demo Data**.

<details>
<summary><b>View Demo Data Patterns (6 Months)</b></summary>

| Month | Pattern |
|-------|---------|
| Month 1 | Normal baseline spending |
| Month 2 | Higher food spending (+28%) |
| Month 3 | Shopping spike (electronics) |
| Month 4 | High cash-out frequency (6 withdrawals) |
| Month 5 | Improved savings behavior |
| Month 6 | Month-end liquidity pressure |

</details>

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **OpenRouter API Key** ([Get it here](https://openrouter.ai))

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shafiur0/-uPay-AI-.git
   cd -uPay-AI-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_key_here
   OPENROUTER_MODEL=google/gemini-2.5-flash
   OPENROUTER_SITE_URL=http://localhost:5173
   OPENROUTER_SITE_NAME=uPay AI Copilot
   PORT=3001
   ```

4. **Run Development Servers:**
   ```bash
   npm run dev:all    # Starts both Vite frontend (5173) and Express backend (3001)
   ```

---

## 🏗️ Architecture & AI Pipeline

### AI Context Pipeline
`User Question → Intent Detection → Financial Data Retrieval → Context Builder → OpenRouter → Validation → UI`

### System Architecture
```text
┌─────────────────────────────────────────────┐
│              Frontend (Vite + Vanilla JS)   │
│  main.js ── financial-ui.js ── data.js      │
│               │                             │
│  services/financial/engine.js  (math)       │
│  services/ai/client.js         (API)        │
└──────────────────┬──────────────────────────┘
                   │ /api/ai/ask
┌──────────────────▼──────────────────────────┐
│           Backend (Express.js)              │
│  server.js                                  │
│  services/openrouter.js  (retry/timeout)    │
│  services/prompts.js     (prompts)          │
└──────────────────┬──────────────────────────┘
                   ▼
           [ OpenRouter API ]
```

### Security & Safety
- API keys never exposed to browser; all AI integrations are server-side.
- Hallucination protection via strict data-only context and structured JSON validation.

---

## 📁 Project Structure

<details>
<summary><b>Click to expand directory tree</b></summary>

```text
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
</details>

---

## 🗺️ Roadmap & Limitations

**⚠️ Known Limitations (Prototype):**
- Demo data is simulated (not real financial accounts).
- No persistent database (data resets on page refresh).
- AI responses depend on OpenRouter availability.

**🚀 Future Roadmap:**
- 🎙️ Voice-ready architecture for hands-free interactions.
- 📈 Advanced ML forecasting models.
- 💽 Persistent storage with IndexedDB/MongoDB.
- 🌍 Multi-currency support and advanced accessibility.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

> *"The wallet doesn't just show where your money went. It helps you understand what you can do next."*
