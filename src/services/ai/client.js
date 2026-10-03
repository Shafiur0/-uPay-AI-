// ============================================
// uPay AI - AI Client Service
// Frontend → Backend API → OpenRouter
// ============================================

import { getFinancialContext } from '../financial/engine.js';
import { detectIntent, detectLanguage } from './intent.js';
import { userData, transactions, goals } from '../../data.js';

const API_URL = import.meta.env.PROD 
  ? 'https://upay-ai-backend.onrender.com/api/ai/ask'
  : '/api/ai/ask';

export async function askFinancialCopilot(question) {
  try {
    // Step 1: Detect intent deterministically
    const intent = detectIntent(question);
    const language = detectLanguage(question);

    // Step 2: Build targeted financial context (privacy-aware)
    const context = getFinancialContext(userData, transactions, goals, intent);

    // Step 3: Call backend (which calls OpenRouter)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context,
        intent,
        language,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API Error:', response.status, errText);
      throw new Error(`AI service returned ${response.status}`);
    }

    const data = await response.json();

    // Step 4: Validate response structure
    return validateAIResponse(data);

  } catch (error) {
    console.error('AI Client Error:', error);

    // Graceful fallback — app continues working without AI
    return {
      type: 'error',
      title: 'Service Unavailable',
      summary: 'AI insights are temporarily unavailable. Your wallet and financial dashboard are still available.',
      evidence: [],
      confidence: 0,
      actions: ['Please try again later'],
    };
  }
}

function validateAIResponse(data) {
  // Ensure required fields exist
  if (!data || typeof data !== 'object') {
    return fallbackResponse('Received invalid response format.');
  }

  return {
    type: data.type || 'financial_insight',
    title: data.title || 'Financial Insight',
    summary: data.summary || data.message || 'No summary available.',
    evidence: Array.isArray(data.evidence) ? data.evidence : [],
    confidence: typeof data.confidence === 'number' ? data.confidence : 0.5,
    actions: Array.isArray(data.actions) ? data.actions : [],
  };
}

function fallbackResponse(reason) {
  return {
    type: 'fallback',
    title: 'Insight',
    summary: reason,
    evidence: [],
    confidence: 0,
    actions: [],
  };
}
