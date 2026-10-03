// ============================================
// uPay AI - OpenRouter Service (Server-Side)
// Handles: timeout, retry, rate limits, validation
// ============================================

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT, LANGUAGE_INSTRUCTIONS } from './prompts.js';

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

// Simple in-memory rate limiter
const rateLimiter = {
  requests: [],
  maxPerMinute: 20,
  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < 60000);
    if (this.requests.length >= this.maxPerMinute) return false;
    this.requests.push(now);
    return true;
  }
};

export async function generateAIResponse(question, context, intent, language) {
  if (!API_KEY) {
    throw new Error('OpenRouter API key is not configured. Set OPENROUTER_API_KEY in .env');
  }

  if (!rateLimiter.isAllowed()) {
    throw new Error('Rate limit exceeded. Please try again in a moment.');
  }

  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || '';
  const systemPrompt = SYSTEM_PROMPT + langInstruction;

  const userPrompt = `
User Question: ${question}
Detected Intent: ${intent || 'GENERAL_FINANCIAL'}
User Language: ${language || 'en'}

Relevant Financial Context:
${JSON.stringify(context, null, 2)}
`;

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
          'X-Title': process.env.OPENROUTER_SITE_NAME || 'uPay AI Copilot',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        // Rate limited by OpenRouter — wait and retry
        const retryAfter = parseInt(response.headers.get('retry-after') || '5', 10);
        if (attempt < MAX_RETRIES) {
          await sleep(retryAfter * 1000);
          continue;
        }
        throw new Error('OpenRouter rate limit exceeded. Please try again later.');
      }

      if (response.status === 404) {
        throw new Error(`Model "${MODEL}" is not available. Check OPENROUTER_MODEL in .env`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from OpenRouter');
      }

      const content = data.choices[0].message.content;

      // Attempt to parse as JSON
      try {
        const parsed = JSON.parse(content);
        return validateAndNormalize(parsed);
      } catch (parseErr) {
        // Model returned text instead of JSON — wrap it
        return {
          type: 'financial_insight',
          title: 'Financial Insight',
          summary: content.substring(0, 1000),
          evidence: [],
          confidence: 0.5,
          actions: [],
        };
      }

    } catch (error) {
      lastError = error;

      if (error.name === 'AbortError') {
        lastError = new Error('Request timed out. The AI service took too long to respond.');
      }

      // Retry on transient errors
      if (attempt < MAX_RETRIES && isRetryable(error)) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
    }
  }

  // All retries exhausted
  throw lastError || new Error('AI service unavailable after retries');
}

function validateAndNormalize(data) {
  return {
    type: data.type || 'financial_insight',
    title: typeof data.title === 'string' ? data.title : 'Financial Insight',
    summary: typeof data.summary === 'string' ? data.summary : 'No insight available.',
    evidence: Array.isArray(data.evidence) ? data.evidence.slice(0, 6) : [],
    confidence: typeof data.confidence === 'number' ? Math.min(1, Math.max(0, data.confidence)) : 0.5,
    actions: Array.isArray(data.actions) ? data.actions.slice(0, 5) : [],
  };
}

function isRetryable(error) {
  if (error.name === 'AbortError') return true;
  if (error.message && error.message.includes('429')) return true;
  if (error.message && error.message.includes('500')) return true;
  if (error.message && error.message.includes('503')) return true;
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
