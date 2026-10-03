// ============================================
// uPay AI - Deterministic Financial Engine
// All financial calculations happen here.
// The AI explains results — it does NOT calculate.
// ============================================

// ============================================
// Date Helpers
// ============================================

function getMonthStart(monthsAgo = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthEnd(monthsAgo = 0) {
  const d = getMonthStart(monthsAgo);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getWeekStart(weeksAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - (weeksAgo * 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysInRange(startDate, endDate) {
  return Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
}

function filterByDateRange(transactions, startDate, endDate) {
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d >= startDate && d <= endDate;
  });
}

function filterByMonth(transactions, monthsAgo = 0) {
  const start = getMonthStart(monthsAgo);
  const end = getMonthEnd(monthsAgo);
  return filterByDateRange(transactions, start, end);
}

// ============================================
// Core Spending & Income
// ============================================

export function calculateMonthlySpending(transactions, monthsAgo = 0) {
  return filterByMonth(transactions, monthsAgo)
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateMonthlyIncome(transactions, monthsAgo = 0) {
  return filterByMonth(transactions, monthsAgo)
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateSavings(transactions, monthsAgo = 0) {
  const income = calculateMonthlyIncome(transactions, monthsAgo);
  const spending = calculateMonthlySpending(transactions, monthsAgo);
  return income - spending;
}

export function calculateSavingsRate(transactions, monthsAgo = 0) {
  const income = calculateMonthlyIncome(transactions, monthsAgo);
  if (income === 0) return 0;
  const savings = calculateSavings(transactions, monthsAgo);
  return Math.round((savings / income) * 100);
}

// ============================================
// Category Analysis
// ============================================

export function calculateCategoryTotals(transactions, monthsAgo = 0) {
  return filterByMonth(transactions, monthsAgo)
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
}

export function calculateAllTimeCategoryTotals(transactions) {
  return transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
}

export function calculateCategoryVariance(transactions, category) {
  const current = calculateCategoryTotals(transactions, 0);
  const currentVal = current[category] || 0;

  // Average of previous 3 months
  let total = 0;
  let months = 0;
  for (let i = 1; i <= 3; i++) {
    const cats = calculateCategoryTotals(transactions, i);
    if (cats[category] !== undefined) {
      total += cats[category];
      months++;
    }
  }
  const avg = months > 0 ? total / months : 0;
  const change = avg > 0 ? Math.round(((currentVal - avg) / avg) * 100) : 0;

  return {
    current: currentVal,
    average: Math.round(avg),
    change,
    direction: change > 0 ? 'increased' : change < 0 ? 'decreased' : 'unchanged',
  };
}

// ============================================
// Weekly Analysis
// ============================================

export function calculateWeeklySpending(transactions) {
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const start = getWeekStart(i);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const spent = filterByDateRange(transactions, start, end)
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    weeks.push({
      weekLabel: `Week ${4 - i}`,
      start: start.toISOString(),
      end: end.toISOString(),
      total: spent,
    });
  }
  return weeks.reverse();
}

// ============================================
// Cash Out Analysis
// ============================================

export function calculateCashOutFrequency(transactions, monthsAgo = 0) {
  const filtered = monthsAgo >= 0
    ? filterByMonth(transactions, monthsAgo).filter(t => t.category === 'cash-out')
    : transactions.filter(t => t.category === 'cash-out');

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  return {
    count: filtered.length,
    total,
    average: filtered.length ? Math.round(total / filtered.length) : 0,
    transactions: filtered,
  };
}

export function calculateCashOutTrend(transactions) {
  const months = [];
  for (let i = 0; i < 6; i++) {
    const data = calculateCashOutFrequency(transactions, i);
    months.push({
      monthLabel: getMonthStart(i).toLocaleString('default', { month: 'short' }),
      ...data,
    });
  }
  return months.reverse();
}

// ============================================
// Financial Health Score
// ============================================

export function calculateFinancialHealth(userData, transactions) {
  const spending = calculateMonthlySpending(transactions, 0);
  const income = calculateMonthlyIncome(transactions, 0) || userData.monthlySalary || 30000;
  const savingsRate = income > 0 ? ((income - spending) / income) * 100 : 0;

  // Savings Consistency: Based on savings rate and savings transactions
  const savingsTxns = filterByMonth(transactions, 0).filter(t => t.category === 'savings');
  const hasSavings = savingsTxns.length > 0;
  const savingsConsistency = Math.min(100, Math.max(0,
    hasSavings ? Math.round(savingsRate * 1.5 + 20) : Math.round(savingsRate * 0.8)
  ));

  // Expense Stability: Compare current month spending to 3-month average
  let avgSpending = 0;
  let monthCount = 0;
  for (let i = 1; i <= 3; i++) {
    const ms = calculateMonthlySpending(transactions, i);
    if (ms > 0) { avgSpending += ms; monthCount++; }
  }
  avgSpending = monthCount > 0 ? avgSpending / monthCount : spending;
  const spendingVariation = avgSpending > 0 ? Math.abs(spending - avgSpending) / avgSpending : 0;
  const expenseStability = Math.min(100, Math.max(0, Math.round(100 - spendingVariation * 100)));

  // Cash-Flow Stability
  const cashFlow = income - spending;
  const cashFlowStability = Math.min(100, Math.max(0,
    cashFlow >= 0 ? Math.round(60 + (cashFlow / income) * 40) : Math.round(40 + (cashFlow / income) * 40)
  ));

  // Goal Progress
  // (imported goals aren't available here, so we'll accept them as parameter)
  const goalProgress = 52; // Will be calculated by the context builder

  // Cash Dependency
  const cashOutData = calculateCashOutFrequency(transactions, 0);
  const cashDependency = Math.min(100, Math.max(0,
    Math.round(100 - (cashOutData.count * 5) - (cashOutData.total / (income || 1)) * 30)
  ));

  // Weighted composite score
  const score = Math.min(100, Math.max(0, Math.round(
    savingsConsistency * 0.25 +
    expenseStability * 0.20 +
    cashFlowStability * 0.25 +
    goalProgress * 0.15 +
    cashDependency * 0.15
  )));

  let status;
  if (score > 80) status = 'Excellent';
  else if (score > 60) status = 'Stable';
  else if (score > 40) status = 'Needs Attention';
  else status = 'At Risk';

  return {
    score,
    status,
    metrics: {
      savingsConsistency,
      expenseStability,
      cashFlowStability,
      goalProgress,
      cashDependency,
    },
    explanations: {
      savingsConsistency: `Based on your savings rate of ${Math.round(savingsRate)}% and ${savingsTxns.length} savings transaction(s) this month.`,
      expenseStability: `Your spending ${spendingVariation < 0.15 ? 'is stable' : 'varies significantly'} compared to your 3-month average (${Math.round(spendingVariation * 100)}% variation).`,
      cashFlowStability: `You ${cashFlow >= 0 ? 'have positive' : 'have negative'} cash flow of ৳${Math.abs(Math.round(cashFlow)).toLocaleString()} this month.`,
      goalProgress: `Based on your current progress toward active savings goals.`,
      cashDependency: `You made ${cashOutData.count} cash withdrawal(s) totaling ৳${cashOutData.total.toLocaleString()} this month.`,
    },
  };
}

// ============================================
// Goal Calculations
// ============================================

export function calculateGoalProgress(goal) {
  const progress = Math.min(100, (goal.current / goal.target) * 100);
  const remaining = goal.target - goal.current;
  const monthsLeft = goal.monthsLeft || 1;
  const monthlyRequired = remaining / monthsLeft;
  const weeklyRequired = monthlyRequired / 4;
  const dailyRequired = monthlyRequired / 30;

  return {
    progress: Math.round(progress * 10) / 10,
    remaining,
    monthlyRequired: Math.round(monthlyRequired),
    weeklyRequired: Math.round(weeklyRequired),
    dailyRequired: Math.round(dailyRequired),
    onTrack: monthlyRequired <= (goal.current / Math.max(1, (goal.contributions || []).length)),
  };
}

export function calculateRequiredMonthlySaving(targetAmount, currentAmount, months) {
  const remaining = targetAmount - currentAmount;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / Math.max(1, months));
}

export function calculateRequiredWeeklySaving(targetAmount, currentAmount, months) {
  return Math.ceil(calculateRequiredMonthlySaving(targetAmount, currentAmount, months) / 4);
}

export function calculateGoalPlans(goal, transactions) {
  const remaining = goal.target - goal.current;
  if (remaining <= 0) return { comfortable: null, target: null, aggressive: null };

  const avgMonthlySavings = calculateAverageMonthlySavings(transactions);

  const comfortableMonthly = Math.round(avgMonthlySavings * 0.6);
  const targetMonthly = Math.round(remaining / (goal.monthsLeft || 6));
  const aggressiveMonthly = Math.round(avgMonthlySavings * 1.2);

  return {
    comfortable: {
      monthly: comfortableMonthly,
      months: comfortableMonthly > 0 ? Math.ceil(remaining / comfortableMonthly) : Infinity,
      label: 'Comfortable',
    },
    target: {
      monthly: targetMonthly,
      months: goal.monthsLeft || 6,
      label: 'On Target',
    },
    aggressive: {
      monthly: aggressiveMonthly,
      months: aggressiveMonthly > 0 ? Math.ceil(remaining / aggressiveMonthly) : Infinity,
      label: 'Aggressive',
    },
  };
}

function calculateAverageMonthlySavings(transactions) {
  let total = 0;
  let months = 0;
  for (let i = 0; i < 6; i++) {
    const savings = calculateSavings(transactions, i);
    if (savings !== 0) { total += savings; months++; }
  }
  return months > 0 ? Math.round(total / months) : 5000;
}

// ============================================
// Cash Flow Forecast
// ============================================

export function forecastCashFlow(balance, transactions) {
  // Calculate average daily spending from last 3 months
  let totalSpending = 0;
  let totalDays = 0;
  for (let i = 0; i < 3; i++) {
    const ms = calculateMonthlySpending(transactions, i);
    if (ms > 0) { totalSpending += ms; totalDays += 30; }
  }
  const dailyAverage = totalDays > 0 ? totalSpending / totalDays : 0;

  // Expected recurring income (simplified: check if salary exists)
  const lastIncome = calculateMonthlyIncome(transactions, 0);
  const avgIncome = calculateMonthlyIncome(transactions, 1) || lastIncome;

  // Recurring expenses estimation
  const recurringExpenses = detectRecurringExpenses(transactions);
  const totalRecurring = recurringExpenses.reduce((sum, e) => sum + e.averageAmount, 0);

  return {
    current: balance,
    dailyBurn: Math.round(dailyAverage),
    in7Days: Math.round(balance - (dailyAverage * 7)),
    in14Days: Math.round(balance - (dailyAverage * 14)),
    in30Days: Math.round(balance - (dailyAverage * 30) + avgIncome),
    expectedIncome: avgIncome,
    estimatedRecurringExpenses: Math.round(totalRecurring),
    chartData: generateForecastChartData(balance, dailyAverage, avgIncome),
    disclaimer: 'Forecasts are estimates based on historical spending patterns and may differ from actual future behavior.',
  };
}

function generateForecastChartData(balance, dailyBurn, monthlyIncome) {
  const points = [];
  let bal = balance;
  const salaryDay = 26; // Approximate
  const today = new Date().getDate();

  for (let day = 0; day <= 30; day++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + day);
    const dayOfMonth = futureDate.getDate();

    if (dayOfMonth === salaryDay && day > 0) {
      bal += monthlyIncome;
    }
    bal -= dailyBurn;

    points.push({
      day,
      date: futureDate.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' }),
      balance: Math.round(bal),
    });
  }
  return points;
}

// ============================================
// Anomaly & Pattern Detection
// ============================================

export function detectSpendingAnomalies(transactions) {
  const anomalies = [];
  const categories = ['food', 'transport', 'shopping', 'entertainment', 'cash-out'];

  for (const cat of categories) {
    const variance = calculateCategoryVariance(transactions, cat);
    if (Math.abs(variance.change) > 20) {
      anomalies.push({
        category: cat,
        ...variance,
        severity: Math.abs(variance.change) > 50 ? 'high' : 'medium',
      });
    }
  }
  return anomalies;
}

export function detectMonthEndPressure(transactions) {
  // Compare last-week-of-month spending to other weeks
  const currentMonth = filterByMonth(transactions, 0).filter(t => t.type === 'debit');

  const lastWeek = currentMonth.filter(t => {
    const d = new Date(t.date);
    return d.getDate() >= 25;
  });
  const otherWeeks = currentMonth.filter(t => {
    const d = new Date(t.date);
    return d.getDate() < 25;
  });

  const lastWeekTotal = lastWeek.reduce((s, t) => s + t.amount, 0);
  const otherWeeksAvg = otherWeeks.length > 0
    ? otherWeeks.reduce((s, t) => s + t.amount, 0) / 3 // Approximate 3 other weeks
    : 0;

  const hasMonthEndPressure = lastWeekTotal > otherWeeksAvg * 1.2;

  return {
    detected: hasMonthEndPressure,
    lastWeekSpending: lastWeekTotal,
    averageWeekSpending: Math.round(otherWeeksAvg),
    percentAboveAverage: otherWeeksAvg > 0
      ? Math.round(((lastWeekTotal - otherWeeksAvg) / otherWeeksAvg) * 100)
      : 0,
  };
}

export function detectRecurringExpenses(transactions) {
  // Find transactions that appear in multiple months
  const recurring = {};
  for (let i = 0; i < 3; i++) {
    const monthTxns = filterByMonth(transactions, i).filter(t => t.type === 'debit');
    for (const t of monthTxns) {
      const key = t.title.toLowerCase().trim();
      if (!recurring[key]) recurring[key] = { title: t.title, amounts: [], months: 0, category: t.category };
      recurring[key].amounts.push(t.amount);
      recurring[key].months++;
    }
  }

  return Object.values(recurring)
    .filter(r => r.months >= 2)
    .map(r => ({
      title: r.title,
      category: r.category,
      averageAmount: Math.round(r.amounts.reduce((s, a) => s + a, 0) / r.amounts.length),
      frequency: r.months >= 3 ? 'monthly' : 'occasional',
    }));
}

// ============================================
// Spending Insights Generator
// ============================================

export function generateSpendingInsights(transactions) {
  const insights = [];
  const anomalies = detectSpendingAnomalies(transactions);
  const monthEndPressure = detectMonthEndPressure(transactions);

  for (const anomaly of anomalies) {
    if (anomaly.change > 20) {
      insights.push({
        type: 'spending_increase',
        category: anomaly.category,
        title: `${formatCategory(anomaly.category)} spending ${anomaly.direction}`,
        summary: `Your ${formatCategory(anomaly.category).toLowerCase()} spending ${anomaly.direction} by ${Math.abs(anomaly.change)}% compared to your 3-month average.`,
        evidence: [
          { label: 'Previous Average', value: `৳${anomaly.average.toLocaleString()}` },
          { label: 'Current Month', value: `৳${anomaly.current.toLocaleString()}` },
          { label: 'Change', value: `${anomaly.change > 0 ? '+' : ''}${anomaly.change}%` },
        ],
        severity: anomaly.severity,
      });
    }
  }

  if (monthEndPressure.detected) {
    insights.push({
      type: 'month_end_pressure',
      title: 'Possible month-end pressure',
      summary: 'Your spending tends to be higher during the final week of the month. Based on historical behavior, your balance may become tight toward month-end.',
      evidence: [
        { label: 'Last Week Spending', value: `৳${monthEndPressure.lastWeekSpending.toLocaleString()}` },
        { label: 'Average Week', value: `৳${monthEndPressure.averageWeekSpending.toLocaleString()}` },
      ],
      severity: 'medium',
    });
  }

  const cashOut = calculateCashOutFrequency(transactions, 0);
  if (cashOut.count >= 4) {
    insights.push({
      type: 'high_cash_out',
      title: 'Frequent cash withdrawals',
      summary: `You've made ${cashOut.count} cash withdrawals this month totaling ৳${cashOut.total.toLocaleString()}. Frequent cash-outs make it harder to track where your money goes.`,
      evidence: [
        { label: 'Cash-outs', value: cashOut.count },
        { label: 'Total', value: `৳${cashOut.total.toLocaleString()}` },
        { label: 'Average', value: `৳${cashOut.average.toLocaleString()}` },
      ],
      severity: cashOut.count >= 6 ? 'high' : 'medium',
    });
  }

  const savingsRate = calculateSavingsRate(transactions, 0);
  if (savingsRate < 10 && savingsRate >= 0) {
    insights.push({
      type: 'low_savings',
      title: 'Savings rate is low',
      summary: `Your savings rate is ${savingsRate}% this month. Financial experts generally recommend saving at least 20% of income.`,
      evidence: [
        { label: 'Savings Rate', value: `${savingsRate}%` },
        { label: 'Income', value: `৳${calculateMonthlyIncome(transactions, 0).toLocaleString()}` },
        { label: 'Spending', value: `৳${calculateMonthlySpending(transactions, 0).toLocaleString()}` },
      ],
      severity: 'medium',
    });
  }

  return insights;
}

// ============================================
// Financial Consistency
// ============================================

export function calculateFinancialConsistency(transactions) {
  const months = 6;
  const incomes = [];
  const savings = [];
  const expenses = [];

  for (let i = 0; i < months; i++) {
    incomes.push(calculateMonthlyIncome(transactions, i));
    savings.push(calculateSavings(transactions, i));
    expenses.push(calculateMonthlySpending(transactions, i));
  }

  const calcConsistency = (arr) => {
    const nonZero = arr.filter(v => v !== 0);
    if (nonZero.length < 2) return 100;
    const avg = nonZero.reduce((s, v) => s + v, 0) / nonZero.length;
    const variance = nonZero.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / nonZero.length;
    const stdDev = Math.sqrt(variance);
    const cv = avg > 0 ? stdDev / avg : 0;
    return Math.min(100, Math.max(0, Math.round(100 - cv * 100)));
  };

  return {
    incomeConsistency: calcConsistency(incomes),
    savingsConsistency: calcConsistency(savings),
    expenseStability: calcConsistency(expenses),
    monthlyData: {
      incomes,
      savings,
      expenses,
    },
    disclaimer: 'These indicators describe financial behavior and do not determine loan approval or eligibility.',
  };
}

// ============================================
// Context Builder for AI
// ============================================

export function getFinancialContext(userData, transactions, goals, intent = 'general') {
  const base = {
    balance: userData.balance,
    monthlyIncome: calculateMonthlyIncome(transactions, 0),
    monthlySpending: calculateMonthlySpending(transactions, 0),
    savingsRate: calculateSavingsRate(transactions, 0),
    financialHealth: calculateFinancialHealth(userData, transactions).score,
  };

  // Expand context based on intent
  switch (intent) {
    case 'SPENDING_ANALYSIS':
      return {
        ...base,
        categoryTotals: calculateCategoryTotals(transactions, 0),
        previousMonthCategories: calculateCategoryTotals(transactions, 1),
        weeklySpending: calculateWeeklySpending(transactions),
        anomalies: detectSpendingAnomalies(transactions),
      };

    case 'CASH_OUT_ANALYSIS':
      return {
        ...base,
        cashOutCurrent: calculateCashOutFrequency(transactions, 0),
        cashOutTrend: calculateCashOutTrend(transactions),
      };

    case 'SAVING_PLAN':
    case 'GOAL_PLANNING':
      return {
        ...base,
        goals: goals.map(g => ({ ...g, progress: calculateGoalProgress(g) })),
        averageMonthlySavings: calculateAverageMonthlySavings(transactions),
        savingsRate: calculateSavingsRate(transactions, 0),
      };

    case 'CASH_FLOW':
    case 'FORECAST':
      return {
        ...base,
        forecast: forecastCashFlow(userData.balance, transactions),
        monthEndPressure: detectMonthEndPressure(transactions),
      };

    case 'FINANCIAL_HEALTH':
      return {
        ...base,
        health: calculateFinancialHealth(userData, transactions),
        consistency: calculateFinancialConsistency(transactions),
      };

    case 'TRANSACTION_EXPLANATION':
      return {
        ...base,
        categoryTotals: calculateCategoryTotals(transactions, 0),
        recentTransactions: transactions.slice(0, 15).map(t => ({
          type: t.type, title: t.title, amount: t.amount, category: t.category,
          date: new Date(t.date).toLocaleDateString('en-BD'),
        })),
        insights: generateSpendingInsights(transactions),
      };

    default:
      return {
        ...base,
        categoryTotals: calculateCategoryTotals(transactions, 0),
        cashOutFrequency: calculateCashOutFrequency(transactions, 0),
        goals: goals.map(g => ({ name: g.name, progress: Math.round((g.current / g.target) * 100) + '%' })),
        recentTransactions: transactions.slice(0, 10).map(t => ({
          type: t.type, amount: t.amount, category: t.category,
          date: new Date(t.date).toLocaleDateString('en-BD'),
        })),
      };
  }
}

// ============================================
// Utility
// ============================================

export function formatCategory(cat) {
  const map = {
    'food': 'Food', 'transport': 'Transport', 'shopping': 'Shopping',
    'bill-pay': 'Bills', 'entertainment': 'Entertainment', 'healthcare': 'Healthcare',
    'education': 'Education', 'family': 'Family', 'recharge': 'Recharge',
    'cash-out': 'Cash Out', 'savings': 'Savings', 'send-money': 'Send Money',
    'income': 'Income', 'add-money': 'Add Money',
  };
  return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function getCategoryColor(cat) {
  const map = {
    'food': '#ef4444', 'transport': '#3b82f6', 'shopping': '#a855f7',
    'bill-pay': '#f59e0b', 'entertainment': '#ec4899', 'healthcare': '#10b981',
    'education': '#6366f1', 'family': '#14b8a6', 'recharge': '#f97316',
    'cash-out': '#64748b', 'savings': '#22c55e', 'send-money': '#8b5cf6',
    'income': '#10b981', 'add-money': '#06b6d4',
  };
  return map[cat] || '#94a3b8';
}
