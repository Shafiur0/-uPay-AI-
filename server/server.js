// ============================================
// uPay AI - Backend Server
// Minimal Express server for OpenRouter proxy
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateAIResponse } from './services/openrouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50kb' })); // Limit payload size

// ============================================
// Health Check
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
    hasApiKey: !!process.env.OPENROUTER_API_KEY,
  });
});

// ============================================
// AI Context Pipeline Endpoint
// ============================================
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question, context, intent, language } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required and must be a string' });
    }

    if (question.length > 1000) {
      return res.status(400).json({ error: 'Question is too long (max 1000 characters)' });
    }

    // Sanitize — strip any potential injection from context keys
    const safeContext = context && typeof context === 'object' ? context : {};

    const response = await generateAIResponse(
      question.trim(),
      safeContext,
      intent || 'GENERAL_FINANCIAL',
      language || 'en'
    );

    res.json(response);

  } catch (error) {
    console.error('AI Endpoint Error:', error.message);

    // Don't leak internal error details
    const status = error.message.includes('Rate limit') ? 429
      : error.message.includes('API key') ? 503
      : error.message.includes('timed out') ? 504
      : 500;

    res.status(status).json({
      type: 'error',
      title: 'Service Unavailable',
      summary: getUserFriendlyError(error.message),
      evidence: [],
      confidence: 0,
      actions: ['Please try again later'],
    });
  }
});

function getUserFriendlyError(message) {
  if (message.includes('API key')) return 'AI service is not configured. Please check server settings.';
  if (message.includes('Rate limit')) return 'Too many requests. Please wait a moment and try again.';
  if (message.includes('timed out')) return 'The AI service took too long to respond. Please try again.';
  if (message.includes('Model')) return 'The AI model is temporarily unavailable. Please try again later.';
  return 'AI insights are temporarily unavailable. Your wallet and financial dashboard are still available.';
}

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`✅ uPay AI Backend running on http://localhost:${PORT}`);
  console.log(`   Model: ${process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash'}`);
  console.log(`   API Key: ${process.env.OPENROUTER_API_KEY ? '✓ configured' : '✗ missing'}`);
});
