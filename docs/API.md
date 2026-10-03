# API Documentation

## Base URL

- Development: `http://localhost:3001`
- Frontend proxy: `/api/*` → `http://localhost:3001/api/*` (via Vite)

## Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "model": "google/gemini-2.5-flash",
  "hasApiKey": true
}
```

### POST /api/ai/ask

Main AI endpoint. Accepts a financial question with context and returns a structured insight.

**Request:**
```json
{
  "question": "Why am I spending more this month?",
  "context": {
    "balance": 12500,
    "monthlyIncome": 45000,
    "monthlySpending": 28000,
    "categoryTotals": { "food": 6198, "transport": 1500 }
  },
  "intent": "SPENDING_ANALYSIS",
  "language": "en"
}
```

**Response (200):**
```json
{
  "type": "financial_insight",
  "title": "Spending Increase Detected",
  "summary": "Your spending increased 15% this month...",
  "evidence": [
    { "label": "Current Month", "value": "৳28,000" },
    { "label": "Previous Month", "value": "৳24,300" }
  ],
  "confidence": 0.85,
  "actions": [
    "Review food spending",
    "Set a weekly budget"
  ]
}
```

**Error Responses:**
- `400` — Missing or invalid question
- `429` — Rate limit exceeded
- `500` — Internal server error
- `503` — API key not configured
- `504` — Request timed out

**Error Body:**
```json
{
  "type": "error",
  "title": "Service Unavailable",
  "summary": "User-friendly error message",
  "evidence": [],
  "confidence": 0,
  "actions": ["Please try again later"]
}
```

## Security

- API key is NEVER sent to or accessible from the frontend
- All OpenRouter calls happen server-side
- Request payloads limited to 50KB
- Rate limited to 20 requests/minute
