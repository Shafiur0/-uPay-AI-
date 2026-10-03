# AI Architecture

## Context Pipeline

```
User Question
     ↓
Intent Detection (deterministic keywords)
     ↓
Language Detection (Bangla/Banglish/English)
     ↓
Financial Data Retrieval (intent-specific)
     ↓
Context Builder (minimal relevant data)
     ↓
OpenRouter API (server-side only)
     ↓
JSON Validation
     ↓
UI Rendering (structured cards)
```

## Intent Detection

File: `src/services/ai/intent.js`

| Intent | Triggers |
|--------|----------|
| SPENDING_ANALYSIS | spend, khoroch, খরচ, money go, category |
| TRANSACTION_EXPLANATION | explain, transaction, history, লেনদেন |
| SAVING_PLAN | save, joma, জমা, improve saving |
| GOAL_PLANNING | goal, target, afford, laptop, লক্ষ্য |
| CASH_FLOW | cash flow, run out, month end, মাসের শেষ |
| FORECAST | forecast, predict, future, ভবিষ্যত |
| CASH_OUT_ANALYSIS | cash out, withdraw, ATM, টাকা তোলা |
| FINANCIAL_HEALTH | health, score, overall, আর্থিক |
| FINANCIAL_LITERACY | learn, teach, tip, advice, শেখাও |

## Hallucination Protection

1. Application code performs ALL financial calculations
2. Only calculated results are sent to the LLM as context
3. LLM's role is explanation and suggestion, not computation
4. Structured JSON output is validated before display
5. If invalid, falls back to deterministic output
6. App never crashes due to AI failure

## Model Configuration

- Model configurable via `OPENROUTER_MODEL` env var
- Default: `google/gemini-2.5-flash`
- Temperature: 0.3 (low creativity, high accuracy)
- Max tokens: 1024
- Response format: `json_object`

## Safety

- System prompt prohibits inventing data
- Prohibits shaming, manipulation, lending decisions
- Requires distinguishing data vs estimates vs suggestions
- Forecasts labeled as estimates
