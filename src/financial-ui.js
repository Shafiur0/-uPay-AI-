// ============================================
// uPay AI - Financial Center UI
// All Financial Center screens rendered here
// ============================================
import { icons } from './icons.js';
import { appState, userData, transactions, goals, getNextGoalId, financialLessons, resetDemoData } from './data.js';
import {
  calculateFinancialHealth, calculateMonthlySpending, calculateMonthlyIncome,
  calculateSavings, calculateSavingsRate, calculateCategoryTotals,
  calculateCashOutFrequency, calculateCashOutTrend, calculateGoalProgress,
  calculateGoalPlans, forecastCashFlow, calculateWeeklySpending,
  detectSpendingAnomalies, detectMonthEndPressure, generateSpendingInsights,
  calculateFinancialConsistency, calculateCategoryVariance,
  formatCategory, getCategoryColor, getFinancialContext
} from './services/financial/engine.js';
import { askFinancialCopilot } from './services/ai/client.js';

let chatHistory = [];

// ============================================
// Shared Helpers
// ============================================
function fmt(n) { return '৳' + Math.round(n).toLocaleString('en-BD'); }

function renderMiniChart(data, width = 200, height = 60) {
  if (!data || data.length === 0) return '';
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d.value - min) / range) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible">
    <polyline points="${points}" fill="none" stroke="var(--ai-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${data.length > 0 ? (data.length - 1) * step : 0}" cy="${data.length > 0 ? height - ((data[data.length - 1].value - min) / range) * (height - 10) - 5 : 0}" r="4" fill="var(--ai-primary)"/>
  </svg>`;
}

function renderDonutChart(categories, size = 140) {
  const total = Object.values(categories).reduce((s, v) => s + v, 0);
  if (total === 0) return '<div style="text-align:center;color:var(--text-muted);padding:20px;">No spending data</div>';

  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 6);
  let cumAngle = 0;
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;

  let paths = '';
  let legend = '';

  entries.forEach(([cat, val]) => {
    const pct = val / total;
    const angle = pct * 360;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const color = getCategoryColor(cat);

    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" opacity="0.85"/>`;
    legend += `<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:4px;">
      <span style="width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0;"></span>
      <span style="flex:1;color:var(--text-muted);">${formatCategory(cat)}</span>
      <span style="font-weight:600;">${Math.round(pct * 100)}%</span>
    </div>`;

    cumAngle += angle;
  });

  return `<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;justify-content:center;">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${paths}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="var(--bg-secondary, #f8fafc)"/>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">${fmt(total)}</text>
      <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="10" fill="var(--text-muted)">Total</text>
    </svg>
    <div style="min-width:120px;">${legend}</div>
  </div>`;
}

function renderBarChart(data, height = 120) {
  if (!data || data.length === 0) return '';
  const max = Math.max(...data.map(d => d.value)) || 1;
  const barWidth = Math.min(40, Math.floor(280 / data.length) - 8);

  return `<div style="display:flex;align-items:flex-end;gap:8px;height:${height}px;padding:0 4px;">
    ${data.map(d => {
      const h = Math.max(4, (d.value / max) * (height - 24));
      return `<div style="display:flex;flex-direction:column;align-items:center;flex:1;">
        <div style="font-size:10px;font-weight:600;margin-bottom:4px;">${fmt(d.value)}</div>
        <div style="width:${barWidth}px;height:${h}px;background:var(--ai-gradient);border-radius:6px 6px 2px 2px;"></div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${d.label}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderProgressBar(pct, color = 'var(--ai-primary)') {
  const p = Math.min(100, Math.max(0, pct));
  return `<div style="width:100%;height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
    <div style="width:${p}%;height:100%;background:${color};border-radius:4px;transition:width 0.6s ease;"></div>
  </div>`;
}

// ============================================
// FINANCIAL CENTER DASHBOARD
// ============================================
export function renderFinancialCenterPage(app, render, attachBottomNavListeners) {
  appState.selectedNav = 'home';
  const health = calculateFinancialHealth(userData, transactions);
  const spending = calculateMonthlySpending(transactions);
  const income = calculateMonthlyIncome(transactions);
  const savings = calculateSavings(transactions);
  const forecast = forecastCashFlow(userData.balance, transactions);
  const categories = calculateCategoryTotals(transactions);
  const insights = generateSpendingInsights(transactions);

  const weeklyData = calculateWeeklySpending(transactions).map(w => ({ label: w.weekLabel, value: w.total }));

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Financial Center</h1>
          <p class="fin-subtitle">Understand your money. Plan your future.</p>
        </div>
      </div>

      <!-- Health Score Card -->
      <div class="health-card" id="card-health" style="cursor:pointer;">
        <div style="font-size:14px;color:var(--text-muted);font-weight:600;margin-bottom:8px;">Financial Health</div>
        <div class="health-score">${health.score} <span style="font-size:20px;color:var(--text-muted);">/ 100</span></div>
        <div class="health-status" style="color:${health.score > 80 ? 'var(--health-excellent)' : health.score > 60 ? 'var(--health-stable)' : 'var(--health-poor)'};">${health.status}</div>
        <div style="width:100%;display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px;border-top:1px solid #f1f5f9;padding-top:16px;">
          <div style="text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);">Savings Consistency</div>
            <div style="font-size:14px;font-weight:700;">${health.metrics.savingsConsistency}%</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:11px;color:var(--text-muted);">Cash-flow Stability</div>
            <div style="font-size:14px;font-weight:700;">${health.metrics.cashFlowStability}%</div>
          </div>
        </div>
        <div style="font-size:10px;color:var(--ai-primary);margin-top:8px;">Tap for detailed breakdown →</div>
      </div>

      <!-- Stats Grid -->
      <div class="fin-grid">
        <div class="fin-stat-card" id="card-spending" style="cursor:pointer;">
          <div class="fin-stat-title">Monthly Spend</div>
          <div class="fin-stat-value" style="color:var(--health-poor);">${fmt(spending)}</div>
          <div style="font-size:10px;color:var(--ai-primary);margin-top:4px;">View analytics →</div>
        </div>
        <div class="fin-stat-card">
          <div class="fin-stat-title">Monthly Income</div>
          <div class="fin-stat-value" style="color:var(--health-excellent);">${fmt(income)}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Savings: ${fmt(savings)}</div>
        </div>
        <div class="fin-stat-card" id="card-forecast" style="cursor:pointer;">
          <div class="fin-stat-title">30-Day Forecast</div>
          <div class="fin-stat-value" style="color:${forecast.in30Days > 0 ? 'var(--text-primary)' : 'var(--health-poor)'};">${fmt(forecast.in30Days)}</div>
          <div style="font-size:10px;color:var(--ai-primary);margin-top:4px;">View cash flow →</div>
        </div>
        <div class="fin-stat-card" id="card-goals" style="cursor:pointer;">
          <div class="fin-stat-title">Active Goals</div>
          <div class="fin-stat-value">${goals.filter(g => g.status === 'active').length}</div>
          <div style="font-size:10px;color:var(--ai-primary);margin-top:4px;">Manage goals →</div>
        </div>
      </div>

      <!-- Spending Chart -->
      <div class="section-title" style="padding:0 20px;"><span>Weekly Spending</span></div>
      <div style="padding:0 20px 20px;">
        <div class="fin-stat-card" style="padding:20px;">
          ${renderBarChart(weeklyData)}
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="section-title" style="padding:0 20px;"><span>Spending by Category</span>
        <a class="see-all" href="#" id="see-spending-detail">Details</a>
      </div>
      <div style="padding:0 20px 20px;">
        <div class="fin-stat-card" style="padding:20px;">
          ${renderDonutChart(categories)}
        </div>
      </div>

      <!-- AI Insights -->
      <div class="section-title" style="padding:0 20px;"><span>AI Insights</span></div>
      <div style="padding:0 20px 20px;display:flex;flex-direction:column;gap:12px;">
        ${insights.length > 0 ? insights.slice(0, 3).map(ins => `
          <div class="chat-insight-card">
            <div class="chat-insight-header">
              ${icons.bot} ${ins.title}
            </div>
            <div class="chat-insight-body">
              <p style="font-size:13px;line-height:1.5;margin:0;">${ins.summary}</p>
              ${ins.evidence.length > 0 ? `
                <div class="chat-insight-metrics" style="margin-top:12px;">
                  ${ins.evidence.map(e => `<div class="metric-box"><label>${e.label}</label><span>${e.value}</span></div>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('') : `
          <div class="chat-insight-card">
            <div class="chat-insight-body" style="text-align:center;padding:24px;">
              <p style="color:var(--text-muted);">Your spending looks stable. Keep it up! 👍</p>
            </div>
          </div>
        `}
      </div>

      <!-- Quick Navigation Cards -->
      <div class="section-title" style="padding:0 20px;"><span>Explore</span></div>
      <div style="padding:0 20px 100px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="fin-nav-card" data-screen="ask-my-money">
          <div style="font-size:24px;margin-bottom:8px;">🤖</div>
          <div style="font-weight:600;font-size:13px;">Ask My Money</div>
          <div style="font-size:11px;color:var(--text-muted);">AI Financial Copilot</div>
        </div>
        <div class="fin-nav-card" data-screen="cash-out-analysis">
          <div style="font-size:24px;margin-bottom:8px;">💵</div>
          <div style="font-weight:600;font-size:13px;">Cash Usage</div>
          <div style="font-size:11px;color:var(--text-muted);">Cash-out analysis</div>
        </div>
        <div class="fin-nav-card" data-screen="learn">
          <div style="font-size:24px;margin-bottom:8px;">📚</div>
          <div style="font-weight:600;font-size:13px;">Learn</div>
          <div style="font-size:11px;color:var(--text-muted);">Financial tips</div>
        </div>
        <div class="fin-nav-card" data-screen="consistency">
          <div style="font-size:24px;margin-bottom:8px;">📊</div>
          <div style="font-weight:600;font-size:13px;">Consistency</div>
          <div style="font-size:11px;color:var(--text-muted);">Behavioral patterns</div>
        </div>
      </div>

      <!-- FAB -->
      <div class="ai-fab" id="ask-my-money-fab" aria-label="Open AI Copilot">${icons.bot}</div>
    </div>
  `;

  // Event listeners
  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'home'; render(); });
  document.getElementById('ask-my-money-fab').addEventListener('click', () => { appState.currentScreen = 'ask-my-money'; render(); });
  document.getElementById('card-health')?.addEventListener('click', () => { appState.currentScreen = 'financial-health'; render(); });
  document.getElementById('card-spending')?.addEventListener('click', () => { appState.currentScreen = 'spending'; render(); });
  document.getElementById('card-forecast')?.addEventListener('click', () => { appState.currentScreen = 'cash-flow'; render(); });
  document.getElementById('card-goals')?.addEventListener('click', () => { appState.currentScreen = 'goals-page'; render(); });
  document.getElementById('see-spending-detail')?.addEventListener('click', (e) => { e.preventDefault(); appState.currentScreen = 'spending'; render(); });

  document.querySelectorAll('.fin-nav-card').forEach(card => {
    card.addEventListener('click', () => { appState.currentScreen = card.dataset.screen; render(); });
  });
}

// ============================================
// FINANCIAL HEALTH PAGE
// ============================================
export function renderFinancialHealthPage(app, render) {
  const health = calculateFinancialHealth(userData, transactions);

  const metricItems = [
    { key: 'savingsConsistency', label: 'Savings Consistency', icon: '💰' },
    { key: 'expenseStability', label: 'Expense Stability', icon: '📉' },
    { key: 'cashFlowStability', label: 'Cash-flow Stability', icon: '🔄' },
    { key: 'goalProgress', label: 'Goal Progress', icon: '🎯' },
    { key: 'cashDependency', label: 'Cash Independence', icon: '💳' },
  ];

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="padding-bottom:70px;">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Financial Health</h1>
          <p class="fin-subtitle">Your financial well-being at a glance</p>
        </div>
      </div>

      <div class="health-card" style="margin-top:-50px;">
        <div class="health-score" style="font-size:56px;">${health.score}</div>
        <div style="font-size:16px;color:var(--text-muted);margin-top:4px;">out of 100</div>
        <div class="health-status" style="font-size:18px;margin-top:8px;color:${health.score > 80 ? 'var(--health-excellent)' : health.score > 60 ? 'var(--health-stable)' : 'var(--health-poor)'};">${health.status}</div>
      </div>

      <div style="padding:0 20px 100px;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">Score Breakdown</h3>
        ${metricItems.map(m => `
          <div class="health-metric-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px;">${m.icon}</span>
                <span style="font-weight:600;font-size:14px;">${m.label}</span>
              </div>
              <span style="font-weight:700;font-size:16px;color:${health.metrics[m.key] > 70 ? 'var(--health-excellent)' : health.metrics[m.key] > 50 ? 'var(--health-stable)' : 'var(--health-poor)'};">${health.metrics[m.key]}%</span>
            </div>
            ${renderProgressBar(health.metrics[m.key], health.metrics[m.key] > 70 ? 'var(--health-excellent)' : health.metrics[m.key] > 50 ? 'var(--health-stable)' : 'var(--health-poor)')}
            <p style="font-size:12px;color:var(--text-muted);margin-top:8px;line-height:1.4;">${health.explanations[m.key]}</p>
          </div>
        `).join('')}

        <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5;margin:0;">
            ℹ️ This score is calculated from your transaction history and provides a general view of your financial behavior. It does not determine loan approval, creditworthiness, or eligibility for any financial product.
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });
}

// ============================================
// SPENDING ANALYTICS PAGE
// ============================================
export function renderSpendingPage(app, render) {
  const currentCats = calculateCategoryTotals(transactions, 0);
  const prevCats = calculateCategoryTotals(transactions, 1);
  const weeklyData = calculateWeeklySpending(transactions).map(w => ({ label: w.weekLabel, value: w.total }));
  const anomalies = detectSpendingAnomalies(transactions);
  const spending = calculateMonthlySpending(transactions);
  const prevSpending = calculateMonthlySpending(transactions, 1);
  const spendingChange = prevSpending > 0 ? Math.round(((spending - prevSpending) / prevSpending) * 100) : 0;

  // Monthly trend
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    monthlyTrend.push({
      label: new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString('default', { month: 'short' }),
      value: calculateMonthlySpending(transactions, i),
    });
  }

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #ef4444 0%, #f97316 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Spending Analytics</h1>
          <p class="fin-subtitle">This month: ${fmt(spending)} ${spendingChange !== 0 ? `(${spendingChange > 0 ? '+' : ''}${spendingChange}%)` : ''}</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        <!-- Monthly Trend -->
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Monthly Spending Trend</div>
          ${renderBarChart(monthlyTrend, 100)}
        </div>

        <!-- Category Breakdown -->
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:16px;">Category Breakdown</div>
          ${renderDonutChart(currentCats, 130)}
        </div>

        <!-- Weekly Breakdown -->
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Weekly Spending</div>
          ${renderBarChart(weeklyData)}
        </div>

        <!-- Spending Alerts -->
        ${anomalies.length > 0 ? `
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Spending Changes</div>
          ${anomalies.map(a => `
            <div class="fin-stat-card" style="padding:16px;margin-bottom:12px;border-left:4px solid ${a.change > 0 ? 'var(--health-poor)' : 'var(--health-excellent)'};">
              <div style="font-weight:600;font-size:13px;">${formatCategory(a.category)} ${a.direction} ${Math.abs(a.change)}%</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">
                Previous avg: ${fmt(a.average)} → Current: ${fmt(a.current)}
              </div>
            </div>
          `).join('')}
        ` : ''}

        <!-- Category Details -->
        <div style="font-weight:600;font-size:14px;margin:16px 0 12px;">All Categories</div>
        ${Object.entries(currentCats).sort((a, b) => b[1] - a[1]).map(([cat, val]) => {
          const prev = prevCats[cat] || 0;
          const change = prev > 0 ? Math.round(((val - prev) / prev) * 100) : 0;
          return `
            <div class="fin-stat-card" style="padding:14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">
              <div style="width:36px;height:36px;border-radius:10px;background:${getCategoryColor(cat)};opacity:0.15;display:flex;align-items:center;justify-content:center;position:relative;">
                <div style="position:absolute;width:10px;height:10px;border-radius:50%;background:${getCategoryColor(cat)};"></div>
              </div>
              <div style="flex:1;">
                <div style="font-weight:600;font-size:13px;">${formatCategory(cat)}</div>
                <div style="font-size:11px;color:var(--text-muted);">${change !== 0 ? `${change > 0 ? '↑' : '↓'} ${Math.abs(change)}% vs last month` : 'Same as last month'}</div>
              </div>
              <div style="font-weight:700;font-size:14px;">${fmt(val)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });
}

// ============================================
// CASH FLOW FORECAST PAGE
// ============================================
export function renderCashFlowPage(app, render) {
  const forecast = forecastCashFlow(userData.balance, transactions);
  const monthEnd = detectMonthEndPressure(transactions);
  const income = calculateMonthlyIncome(transactions);

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Cash Flow</h1>
          <p class="fin-subtitle">Balance forecast for the next 30 days</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        <!-- Current Balance -->
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;text-align:center;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Current Balance</div>
          <div style="font-size:28px;font-weight:800;color:var(--text-primary);">${fmt(forecast.current)}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Daily avg spend: ${fmt(forecast.dailyBurn)}</div>
        </div>

        <!-- Forecast Cards -->
        <div class="fin-grid" style="padding:0;margin-bottom:16px;">
          <div class="fin-stat-card" style="text-align:center;">
            <div class="fin-stat-title">7 Days</div>
            <div class="fin-stat-value" style="color:${forecast.in7Days > 0 ? 'var(--text-primary)' : 'var(--health-poor)'};">${fmt(forecast.in7Days)}</div>
          </div>
          <div class="fin-stat-card" style="text-align:center;">
            <div class="fin-stat-title">14 Days</div>
            <div class="fin-stat-value" style="color:${forecast.in14Days > 0 ? 'var(--text-primary)' : 'var(--health-poor)'};">${fmt(forecast.in14Days)}</div>
          </div>
        </div>
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;text-align:center;">
          <div class="fin-stat-title">30-Day Projected Balance</div>
          <div style="font-size:24px;font-weight:800;color:${forecast.in30Days > 0 ? 'var(--health-excellent)' : 'var(--health-poor)'};">${fmt(forecast.in30Days)}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Includes expected income of ${fmt(forecast.expectedIncome)}</div>
        </div>

        <!-- Forecast Chart -->
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Balance Projection</div>
          ${renderMiniChart(
            forecast.chartData.filter((_, i) => i % 3 === 0).map(p => ({ label: p.date, value: Math.max(0, p.balance) })),
            280, 80
          )}
          <div style="display:flex;justify-content:space-between;margin-top:8px;">
            <span style="font-size:10px;color:var(--text-muted);">Today</span>
            <span style="font-size:10px;color:var(--text-muted);">30 days</span>
          </div>
        </div>

        <!-- Income vs Expenses -->
        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Income vs Expenses</div>
          <div style="display:flex;gap:16px;">
            <div style="flex:1;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Expected Income</div>
              <div style="font-size:16px;font-weight:700;color:var(--health-excellent);">${fmt(income)}</div>
            </div>
            <div style="flex:1;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Est. Recurring</div>
              <div style="font-size:16px;font-weight:700;color:var(--health-poor);">${fmt(forecast.estimatedRecurringExpenses)}</div>
            </div>
          </div>
        </div>

        ${monthEnd.detected ? `
          <div class="fin-stat-card" style="padding:16px;margin-bottom:16px;border-left:4px solid var(--health-stable);background:#fffbeb;">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px;">⚠️ Possible Month-End Pressure</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5;">
              Your spending is usually ${monthEnd.percentAboveAverage}% higher during the final week of the month.
              Based on historical behavior, your balance may become tight toward month-end.
            </p>
          </div>
        ` : ''}

        <div style="padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
          <p style="font-size:11px;color:var(--text-muted);margin:0;line-height:1.4;">
            ⚠️ ${forecast.disclaimer}
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });
}

// ============================================
// GOALS PAGE
// ============================================
export function renderGoalsPage(app, render) {
  const activeGoals = goals.filter(g => g.status === 'active');

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #10b981 0%, #06b6d4 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Savings Goals</h1>
          <p class="fin-subtitle">${activeGoals.length} active goal${activeGoals.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        ${activeGoals.map(goal => {
          const progress = calculateGoalProgress(goal);
          const plans = calculateGoalPlans(goal, transactions);
          return `
            <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
                <div>
                  <div style="font-weight:700;font-size:16px;">${goal.name}</div>
                  <div style="font-size:12px;color:var(--text-muted);">${fmt(goal.current)} / ${fmt(goal.target)}</div>
                </div>
                <div style="font-size:20px;font-weight:800;color:var(--ai-primary);">${Math.round(progress.progress)}%</div>
              </div>
              ${renderProgressBar(progress.progress, 'var(--ai-primary)')}
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:16px;">
                <div style="text-align:center;background:#f8fafc;padding:8px;border-radius:8px;">
                  <div style="font-size:10px;color:var(--text-muted);">Remaining</div>
                  <div style="font-size:13px;font-weight:700;">${fmt(progress.remaining)}</div>
                </div>
                <div style="text-align:center;background:#f8fafc;padding:8px;border-radius:8px;">
                  <div style="font-size:10px;color:var(--text-muted);">Monthly</div>
                  <div style="font-size:13px;font-weight:700;">${fmt(progress.monthlyRequired)}</div>
                </div>
                <div style="text-align:center;background:#f8fafc;padding:8px;border-radius:8px;">
                  <div style="font-size:10px;color:var(--text-muted);">Weekly</div>
                  <div style="font-size:13px;font-weight:700;">${fmt(progress.weeklyRequired)}</div>
                </div>
              </div>

              ${plans.comfortable ? `
                <div style="margin-top:16px;border-top:1px solid #f1f5f9;padding-top:12px;">
                  <div style="font-size:12px;font-weight:600;margin-bottom:8px;">Savings Plans</div>
                  <div style="display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;padding:6px 10px;background:#f0fdf4;border-radius:6px;">
                      <span>☺️ Comfortable</span>
                      <span style="font-weight:600;">${fmt(plans.comfortable.monthly)}/mo → ~${plans.comfortable.months} months</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;padding:6px 10px;background:#eff6ff;border-radius:6px;border:1px solid #bfdbfe;">
                      <span>🎯 On Target</span>
                      <span style="font-weight:600;">${fmt(plans.target.monthly)}/mo → ${plans.target.months} months</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;padding:6px 10px;background:#fef3c7;border-radius:6px;">
                      <span>🚀 Aggressive</span>
                      <span style="font-weight:600;">${fmt(plans.aggressive.monthly)}/mo → ~${plans.aggressive.months} months</span>
                    </div>
                  </div>
                </div>
              ` : ''}

              <div style="display:flex;gap:8px;margin-top:16px;">
                <button class="quick-action-btn goal-contribute-btn" data-goal-id="${goal.id}" style="flex:1;text-align:center;">Add Contribution</button>
              </div>
            </div>
          `;
        }).join('')}

        <button class="btn-primary" id="create-goal-btn" style="width:100%;margin-top:8px;">
          + Create New Goal
        </button>
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });

  document.querySelectorAll('.goal-contribute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const goalId = parseInt(btn.dataset.goalId);
      const amount = prompt('Enter contribution amount (৳):');
      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        const val = parseFloat(amount);
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
          goal.current = Math.min(goal.target, goal.current + val);
          if (!goal.contributions) goal.contributions = [];
          goal.contributions.push({ amount: val, date: new Date().toISOString() });
          render();
        }
      }
    });
  });

  document.getElementById('create-goal-btn')?.addEventListener('click', () => {
    const name = prompt('Goal name:');
    if (!name) return;
    const target = parseFloat(prompt('Target amount (৳):') || '0');
    if (!target || target <= 0) return;
    const months = parseInt(prompt('Target months:') || '6');

    goals.push({
      id: getNextGoalId(),
      name,
      target,
      current: 0,
      targetDate: (() => { const d = new Date(); d.setMonth(d.getMonth() + months); return d.toISOString(); })(),
      createdDate: new Date().toISOString(),
      monthsLeft: months,
      status: 'active',
      contributions: [],
    });
    render();
  });
}

// ============================================
// CASH-OUT ANALYSIS PAGE
// ============================================
export function renderCashOutAnalysisPage(app, render) {
  const current = calculateCashOutFrequency(transactions, 0);
  const trend = calculateCashOutTrend(transactions);

  const trendData = trend.map(t => ({ label: t.monthLabel, value: t.total }));

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #64748b 0%, #475569 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Cash Usage</h1>
          <p class="fin-subtitle">Cash-out patterns and analysis</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        <div class="fin-grid" style="padding:0;margin-bottom:16px;">
          <div class="fin-stat-card" style="text-align:center;">
            <div class="fin-stat-title">Monthly Cash-outs</div>
            <div class="fin-stat-value">${current.count}</div>
          </div>
          <div class="fin-stat-card" style="text-align:center;">
            <div class="fin-stat-title">Total Amount</div>
            <div class="fin-stat-value">${fmt(current.total)}</div>
          </div>
        </div>

        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;text-align:center;">
          <div class="fin-stat-title">Average per Cash-out</div>
          <div style="font-size:24px;font-weight:800;">${fmt(current.average)}</div>
        </div>

        <div class="fin-stat-card" style="padding:20px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">6-Month Trend</div>
          ${renderBarChart(trendData, 100)}
        </div>

        ${current.count >= 4 ? `
          <div class="fin-stat-card" style="padding:16px;margin-bottom:16px;border-left:4px solid var(--health-stable);background:#fffbeb;">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px;">💡 Observation</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5;">
              You've made ${current.count} cash withdrawals this month. Cash withdrawals make spending harder to track.
              Where possible, digital payments can help you maintain better visibility into your spending.
            </p>
          </div>
        ` : ''}

        ${current.transactions.length > 0 ? `
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Recent Cash-outs</div>
          ${current.transactions.slice(0, 5).map(t => `
            <div class="fin-stat-card" style="padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-weight:600;font-size:13px;">${t.title}</div>
                <div style="font-size:11px;color:var(--text-muted);">${new Date(t.date).toLocaleDateString('en-BD')}</div>
              </div>
              <div style="font-weight:700;font-size:14px;color:var(--health-poor);">-${fmt(t.amount)}</div>
            </div>
          `).join('')}
        ` : ''}
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });
}

// ============================================
// LEARN PAGE
// ============================================
export function renderLearnPage(app, render) {
  // Determine which lessons to recommend based on behavior
  const cashOut = calculateCashOutFrequency(transactions, 0);
  const foodVariance = calculateCategoryVariance(transactions, 'food');
  const savingsRate = calculateSavingsRate(transactions, 0);

  const recommended = [];
  if (cashOut.count >= 4) recommended.push('cash-tracking');
  if (foodVariance.change > 20) recommended.push('food-budget');
  if (savingsRate < 15) recommended.push('savings-habit');

  const monthEnd = detectMonthEndPressure(transactions);
  if (monthEnd.detected) recommended.push('month-end');

  const orderedLessons = [
    ...financialLessons.filter(l => recommended.includes(l.id)),
    ...financialLessons.filter(l => !recommended.includes(l.id)),
  ];

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Learn About Your Money</h1>
          <p class="fin-subtitle">Personalized financial education</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        ${recommended.length > 0 ? `
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">📌 Recommended for You</div>
        ` : ''}

        ${orderedLessons.map((lesson, i) => `
          <div class="fin-stat-card learn-card" data-lesson-id="${lesson.id}" style="padding:16px;margin-bottom:12px;cursor:pointer;${i < recommended.length ? 'border-left:4px solid var(--ai-primary);' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:start;">
              <div style="flex:1;">
                <div style="font-weight:600;font-size:14px;line-height:1.3;">${lesson.title}</div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${lesson.duration} • ${formatCategory(lesson.category)}</div>
              </div>
              <span style="font-size:18px;margin-left:8px;">${i < recommended.length ? '⭐' : '📖'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });

  document.querySelectorAll('.learn-card').forEach(card => {
    card.addEventListener('click', () => {
      const lesson = financialLessons.find(l => l.id === card.dataset.lessonId);
      if (lesson) {
        app.innerHTML = `
          <div class="fin-dashboard">
            <div class="fin-header" style="background:linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);padding-bottom:30px;">
              <button class="back-btn" id="lesson-back" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
              <div style="text-align:center;padding-top:10px;">
                <h1 class="fin-title" style="font-size:18px;">${lesson.title}</h1>
                <p class="fin-subtitle">${lesson.duration}</p>
              </div>
            </div>
            <div style="padding:24px;">
              <p style="font-size:15px;line-height:1.8;color:var(--text-primary);">${lesson.content}</p>
            </div>
          </div>
        `;
        document.getElementById('lesson-back').addEventListener('click', () => { appState.currentScreen = 'learn'; render(); });
      }
    });
  });
}

// ============================================
// FINANCIAL CONSISTENCY PAGE
// ============================================
export function renderConsistencyPage(app, render) {
  const consistency = calculateFinancialConsistency(transactions);

  const metrics = [
    { label: 'Income Consistency', value: consistency.incomeConsistency, icon: '💰' },
    { label: 'Savings Consistency', value: consistency.savingsConsistency, icon: '🏦' },
    { label: 'Expense Stability', value: consistency.expenseStability, icon: '📊' },
  ];

  // Monthly income/expense trend
  const months = [];
  for (let i = 5; i >= 0; i--) {
    months.push(new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString('default', { month: 'short' }));
  }

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">Financial Consistency</h1>
          <p class="fin-subtitle">Behavioral patterns over 6 months</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        ${metrics.map(m => `
          <div class="health-metric-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px;">${m.icon}</span>
                <span style="font-weight:600;font-size:14px;">${m.label}</span>
              </div>
              <span style="font-weight:700;font-size:16px;color:${m.value > 70 ? 'var(--health-excellent)' : m.value > 50 ? 'var(--health-stable)' : 'var(--health-poor)'};">${m.value}%</span>
            </div>
            ${renderProgressBar(m.value, m.value > 70 ? 'var(--health-excellent)' : m.value > 50 ? 'var(--health-stable)' : 'var(--health-poor)')}
          </div>
        `).join('')}

        <!-- Income Trend -->
        <div class="fin-stat-card" style="padding:20px;margin-top:16px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Monthly Income</div>
          ${renderBarChart(consistency.monthlyData.incomes.map((v, i) => ({ label: months[i], value: v })).reverse(), 80)}
        </div>

        <!-- Expenses Trend -->
        <div class="fin-stat-card" style="padding:20px;margin-top:12px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:12px;">Monthly Expenses</div>
          ${renderBarChart(consistency.monthlyData.expenses.map((v, i) => ({ label: months[i], value: v })).reverse(), 80)}
        </div>

        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
          <p style="font-size:12px;color:var(--text-muted);line-height:1.5;margin:0;">
            ℹ️ ${consistency.disclaimer}
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });
}

// ============================================
// ASK MY MONEY — AI CHAT
// ============================================
export function renderAskMyMoneyPage(app, render) {
  const loadingMessages = [
    'Analyzing your spending...',
    'Checking recent transactions...',
    'Comparing your spending pattern...',
    'Preparing your financial insight...',
  ];

  app.innerHTML = `
    <div class="ai-chat-screen">
      <div class="ai-chat-header">
        <button class="back-btn" id="ai-back-btn" style="background:transparent;" aria-label="Go back">${icons.arrowLeft}</button>
        <div style="flex:1;">
          <h2 style="font-size:16px;margin:0;display:flex;align-items:center;gap:8px;">
            <span style="color:var(--ai-primary);">${icons.bot}</span>
            Ask My Money
          </h2>
          <p style="font-size:12px;color:var(--text-muted);margin:0;">uPay AI Financial Copilot</p>
        </div>
        <div style="display:flex;gap:8px;">
          <select id="ai-lang-select" style="background:var(--ai-bg);border:1px solid #e2e8f0;border-radius:8px;padding:4px 8px;font-size:12px;cursor:pointer;">
            <option value="en" ${appState.language === 'en' ? 'selected' : ''}>English</option>
            <option value="bn" ${appState.language === 'bn' ? 'selected' : ''}>বাংলা</option>
            <option value="banglish" ${appState.language === 'banglish' ? 'selected' : ''}>Banglish</option>
          </select>
          <button id="ai-clear-btn" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:4px 8px;" title="Clear chat">Clear</button>
        </div>
      </div>

      <div class="ai-chat-body" id="chat-body">
        <div class="chat-msg ai">
          Hi ${userData.name.split(' ')[0]}! 👋 I'm your financial copilot. I can help you understand your spending, plan goals, forecast your cash flow, and more. Ask me anything about your finances!
        </div>
        ${chatHistory.map(msg =>
          msg.role === 'user'
            ? `<div class="chat-msg user">${msg.content}</div>`
            : renderStructuredAIResponse(msg.data)
        ).join('')}
      </div>

      <div class="quick-actions" id="quick-actions">
        <button class="quick-action-btn">Why am I spending more?</button>
        <button class="quick-action-btn">Where does my money go?</button>
        <button class="quick-action-btn">Create a savings plan</button>
        <button class="quick-action-btn">Explain my transactions</button>
        <button class="quick-action-btn">Forecast my balance</button>
        <button class="quick-action-btn">How can I save more?</button>
        <button class="quick-action-btn">Analyze my cash-outs</button>
        <button class="quick-action-btn">Ami keno masher seshe taka shesh kore feli?</button>
      </div>

      <div class="chat-input-area">
        <input type="text" class="chat-input" id="ai-chat-input" placeholder="Ask about your finances..." aria-label="Type your question" />
        <button class="chat-send-btn" id="ai-send-btn" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;

  const chatBody = document.getElementById('chat-body');
  chatBody.scrollTop = chatBody.scrollHeight;

  document.getElementById('ai-back-btn').addEventListener('click', () => {
    appState.currentScreen = 'financial-center';
    render();
  });

  document.getElementById('ai-lang-select').addEventListener('change', (e) => {
    appState.language = e.target.value;
  });

  document.getElementById('ai-clear-btn').addEventListener('click', () => {
    chatHistory = [];
    render();
  });

  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-btn');

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Hide quick actions after first message
    const qa = document.getElementById('quick-actions');
    if (qa) qa.style.display = 'none';

    // Add user message
    chatHistory.push({ role: 'user', content: text });
    chatBody.innerHTML += `<div class="chat-msg user">${escapeHtml(text)}</div>`;
    input.value = '';

    // Add loading indicator with contextual message
    const typingId = 'typing-' + Date.now();
    const loadMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    chatBody.innerHTML += `
      <div class="chat-msg ai" id="${typingId}">
        <div class="typing-indicator">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${loadMsg}</div>
      </div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const aiResponse = await askFinancialCopilot(text);
      document.getElementById(typingId)?.remove();
      chatHistory.push({ role: 'ai', data: aiResponse });
      chatBody.innerHTML += renderStructuredAIResponse(aiResponse);
    } catch (err) {
      document.getElementById(typingId)?.remove();
      const fallback = { type: 'error', title: 'Error', summary: 'Something went wrong. Please try again.', evidence: [], actions: ['Retry'] };
      chatHistory.push({ role: 'ai', data: fallback });
      chatBody.innerHTML += renderStructuredAIResponse(fallback);
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });

  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderStructuredAIResponse(data) {
  if (!data || data.error || !data.summary) {
    return `<div class="chat-msg ai">Sorry, I couldn't process that request at the moment. Please try again.</div>`;
  }

  let html = `
  <div class="chat-insight-card" style="margin-top:0;align-self:flex-start;max-width:92%;">
    <div class="chat-insight-header">
      ${icons.bot} ${escapeHtml(data.title || 'Financial Insight')}
      ${data.confidence ? `<span style="margin-left:auto;font-size:10px;font-weight:400;color:var(--text-muted);">${Math.round(data.confidence * 100)}% confidence</span>` : ''}
    </div>
    <div class="chat-insight-body">
      <p style="font-size:14px;line-height:1.6;margin:0;">${data.summary}</p>
  `;

  if (data.evidence && data.evidence.length > 0) {
    html += `<div class="chat-insight-metrics" style="margin-top:12px;">`;
    data.evidence.forEach(ev => {
      html += `<div class="metric-box"><label>${escapeHtml(String(ev.label))}</label><span>${escapeHtml(String(ev.value))}</span></div>`;
    });
    html += `</div>`;
  }

  if (data.actions && data.actions.length > 0) {
    html += `<div style="margin-top:16px;border-top:1px solid #f1f5f9;padding-top:12px;">`;
    data.actions.forEach(action => {
      html += `<div style="font-size:13px;color:var(--ai-primary);margin-bottom:6px;display:flex;align-items:flex-start;gap:6px;">
        <span style="margin-top:2px;">💡</span> ${escapeHtml(action)}
      </div>`;
    });
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
}

// ============================================
// INSIGHTS PAGE (stand-alone)
// ============================================
export function renderInsightsPage(app, render) {
  const insights = generateSpendingInsights(transactions);

  app.innerHTML = `
    <div class="fin-dashboard">
      <div class="fin-header" style="background:linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);">
        <button class="back-btn" id="fin-back-btn" aria-label="Go back" style="position:absolute;top:16px;left:16px;color:white;">${icons.arrowLeft}</button>
        <div style="text-align:center;padding-top:10px;">
          <h1 class="fin-title">AI Insights</h1>
          <p class="fin-subtitle">${insights.length} insight${insights.length !== 1 ? 's' : ''} based on your data</p>
        </div>
      </div>

      <div style="padding:20px;margin-top:-20px;position:relative;z-index:10;">
        ${insights.length > 0 ? insights.map(ins => `
          <div class="chat-insight-card" style="margin-bottom:16px;">
            <div class="chat-insight-header">
              ${ins.severity === 'high' ? '🔴' : '🟡'} ${ins.title}
            </div>
            <div class="chat-insight-body">
              <p style="font-size:14px;line-height:1.5;margin:0;">${ins.summary}</p>
              ${ins.evidence.length > 0 ? `
                <div class="chat-insight-metrics" style="margin-top:12px;">
                  ${ins.evidence.map(e => `<div class="metric-box"><label>${e.label}</label><span>${e.value}</span></div>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('') : `
          <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:48px;margin-bottom:16px;">✅</div>
            <h3 style="margin-bottom:8px;">All Good!</h3>
            <p style="color:var(--text-muted);">No significant spending anomalies detected this month.</p>
          </div>
        `}
      </div>
    </div>
  `;

  document.getElementById('fin-back-btn').addEventListener('click', () => { appState.currentScreen = 'financial-center'; render(); });
}
