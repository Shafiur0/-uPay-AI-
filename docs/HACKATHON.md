# uPay AI — Hackathon Documentation

## Track 03: Customer Innovation & Financial Independence

### Problem Statement

MFS apps in Bangladesh process millions of transactions daily but provide zero financial intelligence. Users can see transaction lists but cannot:
- Understand spending patterns
- Plan savings effectively
- Forecast cash flow
- Get personalized financial education
- Ask questions about their own money

### Solution

**uPay AI** transforms the existing uPay wallet into a Personal Financial Copilot by adding an AI-powered financial intelligence layer that uses real transaction data to provide personalized insights, forecasting, and education.

### Demo Flow

| Step | Action | What to Show |
|------|--------|-------------|
| 1 | Login | Pre-filled demo credentials (1234) |
| 2 | Home | Existing wallet with balance, services |
| 3 | Tap "Fin Center" | Financial Center dashboard |
| 4 | Financial Health | Score 72/100 — explain dimensions |
| 5 | Ask My Money | "Why do I always run out of money before month-end?" |
| 6 | Savings Plan | "I need to save ৳30,000 in six months" |
| 7 | Create Goal | Use the goal copilot |
| 8 | Cash Flow | Show 30-day forecast with chart |
| 9 | Spending | Category analysis with donut chart |
| 10 | Banglish | "Ami keno masher seshe taka shesh kore feli?" |
| 11 | Learn | Personalized financial education |
| 12 | Close | "The wallet helps you understand what you can do next" |

### Track 03 Feature Mapping

| Track Requirement | Implementation |
|-------------------|---------------|
| Customer Innovation | AI Financial Copilot, natural language queries |
| Financial Independence | Goal planning, savings copilot, cash flow forecast |
| Financial Literacy | Personalized learning based on behavior |
| Responsible Finance | Transparent scores, no shaming, user decides |
| Bangla Support | English + বাংলা + Banglish |

### Judging Highlights

1. **Real AI Integration** — Not a mock chatbot; uses OpenRouter with structured JSON output
2. **Deterministic Calculations** — All math done in app code, AI only explains
3. **Privacy-Aware** — Only relevant context sent to LLM based on intent detection
4. **Responsible Design** — Never shames spending, presents options, user decides
5. **Production Architecture** — Server-side API, retry logic, fallback handling
6. **Preserves Existing App** — All wallet features still work
