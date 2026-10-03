// ============================================
// uPay AI - Lightweight Intent Detection
// Deterministic keyword/pattern matching first.
// Only uses LLM when interpretation is required.
// ============================================

const INTENT_PATTERNS = {
  // --- Check compound/specific intents FIRST to avoid broader intents swallowing keywords ---
  FORECAST: [
    /forecast/i, /predict/i, /future/i, /next.*month/i, /project/i,
    /bhobisshot/i, /ভবিষ্যত/i, /predict.*spend/i, /future.*spend/i,
  ],
  GOAL_PLANNING: [
    /goal/i, /target/i, /lokkho/i, /লক্ষ্য/i, /afford/i, /can i buy/i,
    /laptop/i, /emergency/i, /plan.*save.*\d/i, /need.*save/i,
    /kinbo/i, /কিনব/i, /কিনতে/i, /saving.*goal/i, /goal.*progress/i,
  ],
  CASH_FLOW: [
    /cash.*flow/i, /balance.*forecast/i, /balance.*end/i, /run.*out/i,
    /enough.*money/i, /month.*end/i, /masher.*shesh/i, /মাসের শেষ/i,
    /taka shesh/i, /টাকা শেষ/i, /tight/i,
  ],
  CASH_OUT_ANALYSIS: [
    /cash.*out/i, /withdraw/i, /atm/i, /agent/i, /taka tola/i, /টাকা তোলা/i,
    /cash dependency/i, /cash usage/i,
  ],
  FINANCIAL_HEALTH: [
    /health/i, /score/i, /overall/i, /financial.*status/i, /how.*doing/i,
    /obostha/i, /অবস্থা/i, /arthik/i, /আর্থিক/i,
  ],
  // --- Broader intents checked AFTER more specific ones ---
  SPENDING_ANALYSIS: [
    /spend/i, /khoroch/i, /খরচ/i, /expense/i, /money go/i, /where.*money/i,
    /category/i, /food spend/i, /shopping/i, /transport/i, /biggest expense/i,
    /kharcha/i, /koto khoroch/i, /taka jay/i, /টাকা যায়/i, /বেশি খরচ/i,
  ],
  TRANSACTION_EXPLANATION: [
    /explain.*transaction/i, /transaction/i, /recent/i, /history/i,
    /what.*bought/i, /lenden/i, /লেনদেন/i,
  ],
  SAVING_PLAN: [
    /save/i, /saving/i, /joma/i, /জমা/i, /bachano/i, /বাঁচানো/i,
    /how.*save/i, /save more/i, /savings plan/i, /improve.*saving/i,
  ],
  FINANCIAL_LITERACY: [
    /learn/i, /teach/i, /explain.*what/i, /tip/i, /advice/i, /suggestion/i,
    /best practice/i, /shikhao/i, /শেখাও/i, /upay/i,
  ],
  GENERAL_FINANCIAL: [
    // Fallback - matches anything
  ],
};

export function detectIntent(question) {
  const normalized = question.trim();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'GENERAL_FINANCIAL') continue;
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return intent;
      }
    }
  }

  return 'GENERAL_FINANCIAL';
}

export function detectLanguage(text) {
  // Check for Bangla Unicode characters
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  // Check for common Banglish patterns
  const banglishWords = ['ami', 'keno', 'taka', 'khoroch', 'masher', 'shesh', 'koto', 'amar', 'kemon', 'kore', 'feli', 'hoy', 'korbo', 'chai', 'jodi', 'thake', 'jabe'];
  const words = text.toLowerCase().split(/\s+/);
  const banglishCount = words.filter(w => banglishWords.includes(w)).length;
  if (banglishCount >= 2 || (banglishCount >= 1 && words.length <= 5)) return 'banglish';
  return 'en';
}
