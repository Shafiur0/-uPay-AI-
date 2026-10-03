// ============================================
// uPay Clone - Application State & Data
// ============================================

export const appState = {
  currentScreen: 'splash', // splash, login, home, financial-center, ask-my-money, spending, cash-flow, goals-page, insights, learn, consistency, cash-out-analysis, etc.
  isLoggedIn: false,
  balanceVisible: true,
  pin: '',
  selectedNav: 'home',
  language: 'en', // 'en', 'bn', 'banglish'
};

const INITIAL_BALANCE = 12500.50;

export const userData = {
  name: 'Demo User',
  phone: '01712345678',
  accountNo: 'UPY-2024-0087421',
  balance: INITIAL_BALANCE,
  avatar: null,
  kycVerified: true,
  accountType: 'Personal',
  joinDate: '2024-01-15',
  monthlySalary: 45000,
};

// ============================================
// 6 Months of Demo Transaction Data
// ============================================

const getPastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

let nextId = 1;
const tx = (type, title, subtitle, amount, daysAgo, category) => ({
  id: nextId++,
  type,
  title,
  subtitle,
  amount,
  date: getPastDate(daysAgo),
  category,
});

export let transactions = [
  // ============================================
  // MONTH 6 (Current) — Month-end Liquidity Pressure
  // ============================================
  tx('debit', 'Food Panda', 'Order #FP29384', 850, 1, 'food'),
  tx('debit', 'Uber', 'Ride to office', 320, 1, 'transport'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 2000, 2, 'cash-out'),
  tx('debit', 'Chaldal Grocery', 'Weekly groceries', 1800, 3, 'food'),
  tx('debit', 'Pathao', 'Ride home', 180, 3, 'transport'),
  tx('debit', 'Daraz Shopping', 'Order #99283 - Headphones', 4500, 4, 'shopping'),
  tx('debit', 'Food Panda', 'Order #FP9921', 600, 5, 'food'),
  tx('debit', 'Cash Out - ATM', 'Agent: 01888222333', 3000, 6, 'cash-out'),
  tx('debit', 'Pathao', 'Ride', 150, 7, 'transport'),
  tx('debit', 'Netflix', 'Monthly subscription', 550, 8, 'entertainment'),
  tx('debit', 'Grameenphone', 'Recharge', 299, 9, 'recharge'),
  tx('debit', 'Food Panda', 'Order #FP10122', 720, 10, 'food'),
  tx('credit', 'Add Money from Bank', 'UCB Bank ****4521', 15000, 12, 'add-money'),
  tx('debit', 'DESCO Bill', 'Account: 12345678', 2350, 14, 'bill-pay'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01666999888', 1500, 15, 'cash-out'),
  tx('debit', 'Star Cineplex', 'Movie tickets x2', 1200, 16, 'entertainment'),
  tx('debit', 'Pharmacy', 'Medicine', 450, 17, 'healthcare'),
  tx('debit', 'Uber', 'Airport pickup', 650, 18, 'transport'),
  tx('debit', 'Send Money', 'To: 01876543210 (Rafiq)', 2000, 19, 'send-money'),
  tx('debit', 'Shwapno', 'Groceries', 1350, 20, 'food'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01777444555', 2500, 22, 'cash-out'),
  tx('debit', 'Tuition Payment', 'Academy fee', 5000, 24, 'education'),
  tx('debit', 'Food Panda', 'Order #FP8823', 480, 25, 'food'),
  tx('credit', 'Salary', 'Tech Corp Ltd.', 45000, 26, 'income'),

  // ============================================
  // MONTH 5 — Improved Savings
  // ============================================
  tx('credit', 'Salary', 'Tech Corp Ltd.', 45000, 31, 'income'),
  tx('debit', 'Transfer to DPS', 'Monthly savings', 10000, 32, 'savings'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 5000, 34, 'cash-out'),
  tx('debit', 'Chaldal Grocery', 'Weekly groceries', 1650, 35, 'food'),
  tx('debit', 'Food Panda', 'Order #FP7712', 550, 37, 'food'),
  tx('debit', 'Uber', 'Office commute', 280, 38, 'transport'),
  tx('debit', 'Pathao', 'Ride', 200, 39, 'transport'),
  tx('debit', 'Food Panda', 'Order #FP7890', 1200, 40, 'food'),
  tx('debit', 'DESCO Bill', 'Account: 12345678', 1900, 42, 'bill-pay'),
  tx('debit', 'Grameenphone', 'Recharge', 199, 43, 'recharge'),
  tx('debit', 'Send Money', 'To: 01987654321 (Karim)', 1500, 44, 'send-money'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01888222333', 3000, 46, 'cash-out'),
  tx('debit', 'Pharmacy', 'Medicine', 320, 48, 'healthcare'),
  tx('debit', 'Shwapno', 'Groceries', 1100, 50, 'food'),
  tx('debit', 'Pathao', 'Ride', 170, 52, 'transport'),
  tx('credit', 'Freelance Payment', 'Fiverr', 8000, 53, 'income'),
  tx('debit', 'Transfer to DPS', 'Extra savings', 5000, 55, 'savings'),
  tx('debit', 'Family Support', 'Sent to parents', 5000, 56, 'family'),

  // ============================================
  // MONTH 4 — High Cash-Out Frequency
  // ============================================
  tx('credit', 'Salary', 'Tech Corp Ltd.', 45000, 61, 'income'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 8000, 62, 'cash-out'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01888222333', 5000, 65, 'cash-out'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01666999888', 4000, 68, 'cash-out'),
  tx('debit', 'Cash Out - ATM', 'Agent: 01777444555', 3000, 71, 'cash-out'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 2500, 74, 'cash-out'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01888222333', 2000, 77, 'cash-out'),
  tx('debit', 'Food Panda', 'Order #FP6633', 780, 63, 'food'),
  tx('debit', 'Shwapno', 'Groceries', 1400, 66, 'food'),
  tx('debit', 'Uber', 'Ride', 350, 67, 'transport'),
  tx('debit', 'DESCO Bill', 'Account: 12345678', 2100, 70, 'bill-pay'),
  tx('debit', 'Grameenphone', 'Recharge', 149, 72, 'recharge'),
  tx('debit', 'Send Money', 'To: 01876543210 (Rafiq)', 3000, 76, 'send-money'),
  tx('debit', 'Family Support', 'Sent to parents', 5000, 80, 'family'),
  tx('debit', 'Transfer to DPS', 'Savings', 3000, 82, 'savings'),

  // ============================================
  // MONTH 3 — Shopping Spike
  // ============================================
  tx('credit', 'Salary', 'Tech Corp Ltd.', 45000, 91, 'income'),
  tx('debit', 'Gadget & Gear', 'Samsung earbuds', 12000, 92, 'shopping'),
  tx('debit', 'Bata', 'New shoes', 3500, 94, 'shopping'),
  tx('debit', 'Aarong', 'Clothes', 4200, 96, 'shopping'),
  tx('debit', 'Daraz Shopping', 'Phone case + charger', 1800, 98, 'shopping'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 5000, 93, 'cash-out'),
  tx('debit', 'Food Panda', 'Order #FP5544', 680, 95, 'food'),
  tx('debit', 'Chaldal Grocery', 'Groceries', 1500, 97, 'food'),
  tx('debit', 'Uber', 'Ride', 420, 99, 'transport'),
  tx('debit', 'DESCO Bill', 'Account: 12345678', 2200, 100, 'bill-pay'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01888222333', 3000, 102, 'cash-out'),
  tx('debit', 'Family Support', 'Sent to parents', 5000, 105, 'family'),
  tx('debit', 'Transfer to DPS', 'Savings', 3000, 110, 'savings'),
  tx('debit', 'Send Money', 'To: 01987654321 (Karim)', 1000, 112, 'send-money'),

  // ============================================
  // MONTH 2 — Higher Food Spending
  // ============================================
  tx('credit', 'Salary', 'Tech Corp Ltd.', 45000, 121, 'income'),
  tx('debit', 'Food Panda', 'Order #FP4400', 1100, 122, 'food'),
  tx('debit', 'Food Panda', 'Order #FP4401', 950, 124, 'food'),
  tx('debit', 'Chaldal Grocery', 'Large grocery order', 2800, 126, 'food'),
  tx('debit', 'Restaurant - Kacchi Bhai', 'Dinner with friends', 2200, 128, 'food'),
  tx('debit', 'Food Panda', 'Order #FP4500', 780, 130, 'food'),
  tx('debit', 'Shwapno', 'Groceries', 1600, 133, 'food'),
  tx('debit', 'Food Panda', 'Order #FP4550', 650, 136, 'food'),
  tx('debit', 'Uber', 'Ride', 300, 123, 'transport'),
  tx('debit', 'Pathao', 'Ride', 250, 127, 'transport'),
  tx('debit', 'DESCO Bill', 'Account: 12345678', 2400, 130, 'bill-pay'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 5000, 125, 'cash-out'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01888222333', 3000, 132, 'cash-out'),
  tx('debit', 'Grameenphone', 'Recharge', 249, 135, 'recharge'),
  tx('debit', 'Transfer to DPS', 'Savings', 5000, 138, 'savings'),
  tx('debit', 'Family Support', 'Sent to parents', 5000, 140, 'family'),
  tx('debit', 'Send Money', 'To: 01876543210 (Rafiq)', 1500, 142, 'send-money'),

  // ============================================
  // MONTH 1 — Normal Spending (Baseline)
  // ============================================
  tx('credit', 'Salary', 'Tech Corp Ltd.', 45000, 151, 'income'),
  tx('credit', 'Freelance Payment', 'Upwork', 5000, 155, 'income'),
  tx('debit', 'Food Panda', 'Order #FP3300', 550, 152, 'food'),
  tx('debit', 'Chaldal Grocery', 'Groceries', 1300, 154, 'food'),
  tx('debit', 'Food Panda', 'Order #FP3350', 620, 158, 'food'),
  tx('debit', 'Shwapno', 'Groceries', 950, 162, 'food'),
  tx('debit', 'Uber', 'Ride', 280, 153, 'transport'),
  tx('debit', 'Pathao', 'Ride', 190, 157, 'transport'),
  tx('debit', 'Uber', 'Ride', 350, 161, 'transport'),
  tx('debit', 'DESCO Bill', 'Account: 12345678', 1850, 156, 'bill-pay'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01555666777', 5000, 159, 'cash-out'),
  tx('debit', 'Cash Out - Agent', 'Agent: 01888222333', 3000, 165, 'cash-out'),
  tx('debit', 'Grameenphone', 'Recharge', 199, 160, 'recharge'),
  tx('debit', 'Transfer to DPS', 'Savings', 8000, 163, 'savings'),
  tx('debit', 'Family Support', 'Sent to parents', 5000, 167, 'family'),
  tx('debit', 'Send Money', 'To: 01987654321 (Karim)', 2000, 170, 'send-money'),
  tx('debit', 'Pharmacy', 'Medicine', 280, 168, 'healthcare'),
];

// Sort by date descending
transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

// ============================================
// Goals
// ============================================

export let goals = [
  {
    id: 1,
    name: 'Laptop',
    target: 30000,
    current: 12000,
    targetDate: (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString(); })(),
    createdDate: getPastDate(60),
    monthsLeft: 6,
    status: 'active',
    contributions: [
      { amount: 5000, date: getPastDate(60) },
      { amount: 4000, date: getPastDate(30) },
      { amount: 3000, date: getPastDate(5) },
    ]
  },
  {
    id: 2,
    name: 'Emergency Fund',
    target: 50000,
    current: 20000,
    targetDate: (() => { const d = new Date(); d.setMonth(d.getMonth() + 12); return d.toISOString(); })(),
    createdDate: getPastDate(120),
    monthsLeft: 12,
    status: 'active',
    contributions: [
      { amount: 8000, date: getPastDate(120) },
      { amount: 5000, date: getPastDate(90) },
      { amount: 4000, date: getPastDate(60) },
      { amount: 3000, date: getPastDate(30) },
    ]
  }
];

let goalIdCounter = 3;
export function getNextGoalId() { return goalIdCounter++; }

// ============================================
// Store original data for reset
// ============================================
const originalTransactions = JSON.parse(JSON.stringify(transactions));
const originalGoals = JSON.parse(JSON.stringify(goals));

export function resetDemoData() {
  userData.balance = INITIAL_BALANCE;
  userData.name = 'Demo User';
  transactions.length = 0;
  transactions.push(...JSON.parse(JSON.stringify(originalTransactions)));
  goals.length = 0;
  goals.push(...JSON.parse(JSON.stringify(originalGoals)));
  goalIdCounter = 3;
}

// ============================================
// Static Data
// ============================================

export const notifications = [
  { id: 1, title: 'Send Money Successful', message: 'You have sent ৳500.', time: '2 hours ago', type: 'success', unread: true },
  { id: 2, title: 'Financial Insight', message: 'Your food spending is up 28% this month.', time: '5 hours ago', type: 'info', unread: true },
  { id: 3, title: 'Goal Progress', message: 'Laptop fund reached 40%! Keep going 💪', time: '1 day ago', type: 'info', unread: true },
  { id: 4, title: 'Cash-Out Alert', message: 'You\'ve made 4 cash-outs this month.', time: '2 days ago', type: 'warning', unread: false },
  { id: 5, title: 'Salary Received', message: '৳45,000 received from Tech Corp Ltd.', time: '3 days ago', type: 'success', unread: false },
];

export const recentContacts = [
  { name: 'Rafiq', phone: '01876543210', color: '#E63946' },
  { name: 'Karim', phone: '01987654321', color: '#7B1FA2' },
  { name: 'Nusrat', phone: '01711223344', color: '#00897B' },
  { name: 'Rahim', phone: '01622334455', color: '#EF6C00' },
];

export const operators = [
  { name: 'Grameenphone', short: 'GP', color: '#00A651' },
  { name: 'Robi', short: 'RB', color: '#ED1C24' },
  { name: 'Banglalink', short: 'BL', color: '#F7941D' },
  { name: 'Teletalk', short: 'TT', color: '#0072BC' },
];

export const billCategories = [
  { name: 'Electricity', icon: 'electricity', color: '#FFB300' },
  { name: 'Water', icon: 'water', color: '#2979FF' },
  { name: 'Gas', icon: 'gas', color: '#FF7043' },
  { name: 'Internet', icon: 'internet', color: '#26C6DA' },
];

export const promos = [
  { title: 'Cashback Fest 🎉', desc: 'Get 20% cashback on Mobile Recharge', badge: 'LIMITED', gradient: 'gradient-1' },
  { title: 'Refer & Earn 🤝', desc: 'Invite friends & earn ৳50 each!', badge: 'NEW', gradient: 'gradient-2' },
];

export const offersData = [
  { title: 'Recharge Cashback', desc: '20% back on ৳99+ recharge', discount: '20%', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { title: 'Food Panda Deal', desc: '৳100 off on ৳500+ orders', discount: '৳100', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { title: 'Bill Pay Bonus', desc: 'Pay bills & win prizes', discount: 'WIN', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
];

// ============================================
// Financial Education Content
// ============================================
export const financialLessons = [
  {
    id: 'cash-tracking',
    title: 'Why Cash Withdrawals Make Spending Harder to Track',
    duration: '2 min read',
    category: 'cash-out',
    triggerCondition: 'highCashOut',
    content: `When you withdraw cash, it leaves your digital wallet and becomes invisible to spending analytics. This means you lose insight into where that money actually goes. Consider using digital payments where possible — not because cash is bad, but because digital transactions give you a clearer picture of your spending habits.`,
  },
  {
    id: 'food-budget',
    title: 'How to Create a Realistic Food Budget',
    duration: '3 min read',
    category: 'food',
    triggerCondition: 'highFoodSpending',
    content: `A good food budget starts with understanding your current spending. Look at your average over 3 months, then set a target that's realistic — not extreme. Try meal planning for the week, use grocery lists, and track eating-out separately from groceries. Small changes compound over time.`,
  },
  {
    id: 'savings-habit',
    title: 'The Power of Consistent Small Savings',
    duration: '2 min read',
    category: 'savings',
    triggerCondition: 'lowSavings',
    content: `You don't need to save large amounts to build wealth. Saving ৳100 every day adds up to ৳36,500 in a year. The key is consistency. Set up automatic transfers right after payday, before you start spending. Even ৳500/month is better than nothing.`,
  },
  {
    id: 'month-end',
    title: 'Beating the Month-End Cash Crunch',
    duration: '3 min read',
    category: 'planning',
    triggerCondition: 'monthEndPressure',
    content: `Many people spend more in the first two weeks after payday and run short at month-end. Try the "4-envelope" method: divide your monthly spending budget into 4 weekly portions. This ensures you have roughly equal spending power throughout the month.`,
  },
  {
    id: 'emergency-fund',
    title: 'Building Your Emergency Fund',
    duration: '3 min read',
    category: 'savings',
    triggerCondition: 'noEmergencyFund',
    content: `An emergency fund is money set aside for unexpected expenses — medical bills, urgent repairs, or job loss. Aim for 3-6 months of essential expenses. Start small: even ৳5,000 is a meaningful cushion. Keep it separate from your regular spending money.`,
  },
  {
    id: 'digital-payments',
    title: 'Benefits of Going Digital with Payments',
    duration: '2 min read',
    category: 'general',
    triggerCondition: 'default',
    content: `Digital payments through apps like uPay offer automatic record-keeping, instant transfers, cashback rewards, and better security than carrying cash. They also make it easier to track your spending patterns and set financial goals.`,
  },
];
