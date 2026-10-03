# Changelog

All notable changes to the uPay AI project.

## [3.0.0] - 2026-10-04

### Added

#### Track 03 — Financial Intelligence Platform
- **Financial Center Dashboard** — comprehensive financial overview with health score, spending charts, category analysis, forecasts, goals, and AI insights
- **Ask My Money (AI Copilot)** — conversational AI interface with structured responses, evidence cards, quick actions, language selection, and clear chat
- **Financial Health Score** — transparent 0-100 scoring with 5 explainable dimensions (savings consistency, expense stability, cash-flow stability, goal progress, cash independence)
- **Spending Analytics Page** — monthly trend, category breakdown donut chart, weekly bar chart, spending anomaly alerts, category comparison vs previous month
- **Cash Flow Forecast Page** — 7/14/30-day balance projection, daily burn rate, forecast chart, income vs recurring expenses, month-end pressure detection
- **Savings Goal Copilot** — create/contribute/manage goals, comfortable/target/aggressive savings plans, progress tracking with monthly/weekly/daily breakdowns
- **Cash-Out Analysis Page** — frequency tracking, 6-month trend, average per withdrawal, behavioral observations
- **Personalized Financial Learning** — behavior-triggered educational content (6 lessons), personalized recommendations based on spending patterns
- **Financial Consistency Page** — 6-month behavioral analysis (income/savings/expense consistency), trend charts
- **AI Insights Page** — standalone page for spending anomalies and pattern alerts

#### Financial Engine (Deterministic Calculations)
- `calculateMonthlySpending()` / `calculateMonthlyIncome()` with month parameter
- `calculateSavings()` / `calculateSavingsRate()`
- `calculateCategoryTotals()` / `calculateCategoryVariance()`
- `calculateWeeklySpending()` — 4-week breakdown
- `calculateCashOutFrequency()` / `calculateCashOutTrend()` — 6-month analysis
- `calculateFinancialHealth()` — weighted composite score with explanations
- `calculateGoalProgress()` / `calculateGoalPlans()` — comfortable/target/aggressive plans
- `forecastCashFlow()` — daily burn projection with salary income adjustment
- `detectSpendingAnomalies()` — category variance detection
- `detectMonthEndPressure()` — last-week vs other-weeks comparison
- `detectRecurringExpenses()` — multi-month pattern detection
- `generateSpendingInsights()` — automated insight generation
- `calculateFinancialConsistency()` — 6-month behavioral metrics
- `getFinancialContext()` — intent-based context builder (privacy-aware)

#### AI Architecture
- **Intent Detection** — 10 intent categories with Bangla/Banglish keyword patterns
- **Language Detection** — automatic English/Bangla/Banglish detection
- **Context Pipeline** — intent → targeted data retrieval → minimal context → OpenRouter → validation
- **Structured Output** — JSON responses with title, summary, evidence, confidence, actions
- **Hallucination Protection** — only application-calculated data sent to LLM
- **System Prompts** — centralized in `server/services/prompts.js`

#### Server Enhancements
- Retry logic with exponential backoff (max 2 retries)
- Request timeout (30s) with AbortController
- In-memory rate limiting (20 req/min)
- Response validation and normalization
- User-friendly error messages (never leaks internals)
- Input validation and payload size limits
- Vite proxy configuration for `/api` routes

#### Demo Data
- 80+ transactions across 6 months with deliberate patterns
- Month-specific themes (normal, high food, shopping spike, high cash-out, improved savings, month-end pressure)
- Rich goals with contribution history
- Reset Demo Data button in Profile
- Financial education content (6 personalized lessons)

#### Bangla/Banglish Support
- Language selector in AI chat (English / বাংলা / Banglish)
- Banglish quick action: "Ami keno masher seshe taka shesh kore feli?"
- Language-specific system prompt instructions

### Changed
- Updated import structure for new financial UI modules
- Updated `data.js` with comprehensive demo data and `resetDemoData()`
- Updated AI client to use intent-based context and Vite proxy
- Updated server with enhanced error handling and logging
- Updated profile page with version info and demo reset
- Updated build script (removed tsc requirement for pure JS project)

### Security
- Added `.env`, `.env.local`, `.env.production` to `.gitignore`
- API keys never exposed to frontend JavaScript
- Server-side only OpenRouter calls
- Input sanitization on API endpoints
- Payload size limits (50kb)

## [2.0.0] - Previous

### Added
- Initial uPay MFS clone
- Send Money, Cash Out, Add Money
- Mobile Recharge, Bill Payment
- QR Scanner, Transaction History
- Profile, Notifications, Offers
- Splash screen, Login with demo credentials
- PWA manifest and service worker
- Basic Financial Center and Ask My Money (skeleton)
- Basic OpenRouter integration
