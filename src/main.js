// ============================================
// uPay Clone - Main Application
// ============================================

import './style.css';
import { icons } from './icons.js';
import { appState, userData, transactions, notifications, recentContacts, operators, billCategories, promos, offersData, resetDemoData } from './data.js';
import { renderFinancialCenterPage, renderAskMyMoneyPage, renderFinancialHealthPage, renderSpendingPage, renderCashFlowPage, renderGoalsPage, renderCashOutAnalysisPage, renderLearnPage, renderConsistencyPage, renderInsightsPage } from './financial-ui.js';

const app = document.getElementById('app');

// ============================================
// Utility Functions
// ============================================

function formatCurrency(amount) {
  return '৳' + amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatShortCurrency(amount) {
  return '৳' + amount.toLocaleString('en-BD');
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function generateTxnId() {
  return 'TXN' + Date.now().toString().slice(-8);
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const iconSvg = type === 'success' ? icons.check : type === 'error' ? icons.x : icons.info;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ============================================
// Screen Renderers
// ============================================

function renderSplashScreen() {
  app.innerHTML = `
    <div class="splash-screen" id="splash">
      <div class="splash-logo">${icons.logo}</div>
      <div class="splash-text">uPay</div>
      <div class="splash-subtitle">উপায় - Your Digital Wallet</div>
      <div class="splash-loader"></div>
    </div>
  `;
  
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => {
        appState.currentScreen = 'login';
        render();
      }, 600);
    }
  }, 2500);
}

function renderLoginScreen() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-header">
        <div class="login-logo">${icons.logo}</div>
        <h1>Welcome to uPay</h1>
        <p>Secure mobile financial services</p>
      </div>
      
      <div class="login-body">
        <h2>Login to your account</h2>
        
        <div class="form-group">
          <label>Mobile Number</label>
          <div class="form-input-wrap">
            <span class="input-icon">${icons.phone}</span>
            <span class="phone-prefix">+880</span>
            <input type="tel" class="form-input with-prefix" id="login-phone" placeholder="1XXXXXXXXX" maxlength="10" value="1712345678" />
          </div>
        </div>
        
        <div class="form-group">
          <label>PIN (4 digits)</label>
          <div class="pin-input-group">
            <input type="password" class="pin-input" maxlength="1" id="pin-1" inputmode="numeric" value="1" />
            <input type="password" class="pin-input" maxlength="1" id="pin-2" inputmode="numeric" value="2" />
            <input type="password" class="pin-input" maxlength="1" id="pin-3" inputmode="numeric" value="3" />
            <input type="password" class="pin-input" maxlength="1" id="pin-4" inputmode="numeric" value="4" />
          </div>
        </div>
        
        <button class="btn-primary" id="login-btn">
          Login
          ${icons.arrowRight}
        </button>
        
        <div style="text-align: center; margin-top: 16px;">
          <a href="#" style="color: var(--primary); font-size: 13px; font-weight: 600;">Forgot PIN?</a>
        </div>
        
        <div class="login-lang-toggle" style="margin-top: 24px;">
          <button class="lang-btn active" id="lang-en">English</button>
          <button class="lang-btn" id="lang-bn">বাংলা</button>
        </div>
      </div>
      
      <div class="login-footer">
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Don't have an account?</p>
        <button class="btn-secondary" id="register-btn">
          Open New Account
        </button>
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 16px;">Powered by UCB Fintech Company Ltd.</p>
      </div>
    </div>
  `;
  
  // PIN input auto-focus
  const pinInputs = document.querySelectorAll('.pin-input');
  pinInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        pinInputs[index - 1].focus();
      }
    });
  });
  
  // Login handler
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  
  // Language toggle
  document.getElementById('lang-en').addEventListener('click', () => {
    document.getElementById('lang-en').classList.add('active');
    document.getElementById('lang-bn').classList.remove('active');
    appState.language = 'en';
  });
  document.getElementById('lang-bn').addEventListener('click', () => {
    document.getElementById('lang-bn').classList.add('active');
    document.getElementById('lang-en').classList.remove('active');
    appState.language = 'bn';
  });
  
  // Register button
  document.getElementById('register-btn').addEventListener('click', () => {
    showToast('Registration module coming soon!', 'info');
  });
}

function handleLogin() {
  const phone = document.getElementById('login-phone').value;
  const pin = [1,2,3,4].map(i => document.getElementById(`pin-${i}`).value).join('');
  
  if (phone.length < 10) {
    showToast('Please enter a valid phone number', 'error');
    return;
  }
  
  if (pin.length < 4) {
    showToast('Please enter your 4-digit PIN', 'error');
    return;
  }
  
  // Simulate login
  const btn = document.getElementById('login-btn');
  btn.innerHTML = '<span class="loading-spinner"></span>';
  btn.disabled = true;
  
  setTimeout(() => {
    appState.isLoggedIn = true;
    appState.currentScreen = 'home';
    showToast('Welcome back, ' + userData.name + '!');
    render();
  }, 1500);
}

function renderHomeScreen() {
  const balanceDisplay = appState.balanceVisible 
    ? formatCurrency(userData.balance) 
    : '৳ •••••••';
  
  const eyeIcon = appState.balanceVisible ? icons.eye : icons.eyeOff;
  
  app.innerHTML = `
    <div class="app-container">
      <!-- Top Header with Balance -->
      <div class="top-header">
        <div class="header-row">
          <div class="user-info">
            <div class="user-avatar">${icons.user}</div>
            <div>
              <div class="user-greeting">${getGreeting()} 👋</div>
              <div class="user-name">${userData.name}</div>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" id="search-btn">${icons.search}</button>
            <button class="header-btn" id="notif-btn">
              ${icons.bell}
              <span class="notification-badge">3</span>
            </button>
          </div>
        </div>
        
        <div class="balance-card">
          <div class="balance-label">
            Available Balance
            <button class="balance-toggle" id="balance-toggle">
              ${eyeIcon}
              ${appState.balanceVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <div class="balance-amount">
            <span class="currency">৳</span>
            <span id="balance-value">${appState.balanceVisible ? userData.balance.toLocaleString('en-BD', { minimumFractionDigits: 2 }) : '•••••••'}</span>
          </div>
          <div class="balance-actions">
            <button class="balance-action-btn" data-action="add-money">
              ${icons.addMoney} Add Money
            </button>
            <button class="balance-action-btn" data-action="send-money">
              ${icons.sendMoney} Send Money
            </button>
            <button class="balance-action-btn" data-action="cash-out">
              ${icons.cashOut} Cash Out
            </button>
          </div>
        </div>
      </div>
      
      <!-- Services Grid -->
      <div class="services-grid">
        ${renderServiceItem('financial-center', 'Fin Center', 'health', 'financial-center')}
        ${renderServiceItem('send-money', 'Send Money', 'sendMoney', 'send-money')}
        ${renderServiceItem('cash-out', 'Cash Out', 'cashOut', 'cash-out')}
        ${renderServiceItem('add-money', 'Add Money', 'addMoney', 'add-money')}
        ${renderServiceItem('payment', 'Payment', 'payment', 'payment')}
        ${renderServiceItem('mobile-recharge', 'Recharge', 'mobileRecharge', 'mobile-recharge')}
        ${renderServiceItem('pay-bill', 'Pay Bill', 'payBill', 'pay-bill')}
        ${renderServiceItem('remittance', 'Remittance', 'remittance', 'remittance')}
        ${renderServiceItem('dps', 'DPS', 'dps', 'dps')}
        ${renderServiceItem('qr-pay', 'QR Pay', 'qrPay', 'qr-pay')}
        ${renderServiceItem('toll', 'Toll', 'toll', 'toll')}
        ${renderServiceItem('gov-pay', 'Gov. Pay', 'govPay', 'gov-pay')}
        ${renderServiceItem('prepaid-card', 'Card', 'prepaidCard', 'prepaid-card')}
      </div>
      
      <!-- Promo Section -->
      <div class="promo-section">
        <div class="section-title">
          <span>Special Offers</span>
          <a class="see-all" href="#" id="see-all-offers">See All</a>
        </div>
        <div class="promo-carousel" id="promo-carousel">
          ${promos.map((p, i) => `
            <div class="promo-card ${p.gradient}">
              <span class="promo-badge">${p.badge}</span>
              <h3>${p.title}</h3>
              <p>${p.desc}</p>
            </div>
          `).join('')}
        </div>
        <div class="promo-dots">
          ${promos.map((_, i) => `<div class="promo-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
        </div>
      </div>
      
      <!-- Recent Transactions -->
      <div class="transactions-section">
        <div class="section-title">
          <span>Recent Transactions</span>
          <a class="see-all" href="#" id="see-all-txn">View All</a>
        </div>
        <div class="transaction-list">
          ${transactions.slice(0, 5).map(renderTransactionItem).join('')}
        </div>
      </div>
      
      ${renderBottomNav()}
    </div>
  `;
  
  attachHomeEventListeners();
}

function renderServiceItem(id, name, iconKey, cssClass) {
  return `
    <div class="service-item" data-service="${id}">
      <div class="service-icon ${cssClass}">${icons[iconKey]}</div>
      <span class="service-name">${name}</span>
    </div>
  `;
}

function renderTransactionItem(txn) {
  const isCredit = txn.type === 'credit';
  const iconSvg = isCredit ? icons.arrowDownLeft : icons.arrowUpRight;
  const sign = isCredit ? '+' : '-';
  
  return `
    <div class="transaction-item" data-txn-id="${txn.id}">
      <div class="transaction-icon ${txn.type}">
        ${iconSvg}
      </div>
      <div class="transaction-details">
        <div class="transaction-title">${txn.title}</div>
        <div class="transaction-subtitle">${txn.subtitle}</div>
      </div>
      <div class="transaction-amount">
        <div class="amount ${txn.type}">${sign}${formatShortCurrency(txn.amount)}</div>
        <div class="date">${txn.date}</div>
      </div>
    </div>
  `;
}

function renderBottomNav() {
  return `
    <nav class="bottom-nav">
      <div class="nav-item ${appState.selectedNav === 'home' ? 'active' : ''}" data-nav="home">
        ${icons.home}
        <span>Home</span>
      </div>
      <div class="nav-item ${appState.selectedNav === 'history' ? 'active' : ''}" data-nav="history">
        ${icons.history}
        <span>History</span>
      </div>
      <div class="nav-item qr-scan" data-nav="qr-scanner">
        <div class="qr-btn">${icons.qrCode}</div>
        <span>Scan</span>
      </div>
      <div class="nav-item ${appState.selectedNav === 'offers' ? 'active' : ''}" data-nav="offers">
        ${icons.offers}
        <span>Offers</span>
      </div>
      <div class="nav-item ${appState.selectedNav === 'profile' ? 'active' : ''}" data-nav="profile">
        ${icons.profile}
        <span>Profile</span>
      </div>
    </nav>
  `;
}

// ============================================
// Feature Page Renderers
// ============================================

function renderSendMoneyPage() {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Send Money</h2>
      </div>
      
      <div class="page-body">
        <!-- Receiver -->
        <div class="receiver-section">
          <h3>Send to</h3>
          <div class="form-group">
            <div class="form-input-wrap">
              <span class="input-icon">${icons.phone}</span>
              <input type="tel" class="form-input" id="receiver-phone" placeholder="Enter mobile number" style="padding-left: 46px;" />
            </div>
          </div>
          
          <h3 style="margin-top: 16px;">Recent</h3>
          <div class="recent-contacts">
            ${recentContacts.map(c => `
              <div class="contact-item" data-phone="${c.phone}">
                <div class="contact-avatar" style="background: ${c.color}">${c.name.charAt(0)}</div>
                <span class="contact-name">${c.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Amount -->
        <div class="amount-input-section">
          <h3>Amount</h3>
          <div class="amount-display">
            <span class="currency-symbol">৳</span>
            <input type="number" id="send-amount" placeholder="0.00" />
          </div>
          <div class="quick-amounts">
            <button class="quick-amount-btn" data-amount="100">৳100</button>
            <button class="quick-amount-btn" data-amount="500">৳500</button>
            <button class="quick-amount-btn" data-amount="1000">৳1,000</button>
            <button class="quick-amount-btn" data-amount="5000">৳5,000</button>
          </div>
        </div>
        
        <!-- Reference -->
        <div class="form-group">
          <label>Reference (Optional)</label>
          <div class="form-input-wrap">
            <span class="input-icon">${icons.info}</span>
            <input type="text" class="form-input" id="send-reference" placeholder="e.g., Dinner money" style="padding-left: 46px;" />
          </div>
        </div>
        
        <!-- Charge Info -->
        <div class="charge-info">
          <div class="charge-row">
            <span>Amount</span>
            <span id="charge-amount">৳0.00</span>
          </div>
          <div class="charge-row">
            <span>Charge</span>
            <span>৳0.00 (Free)</span>
          </div>
          <div class="charge-row total">
            <span>Total</span>
            <span id="charge-total">৳0.00</span>
          </div>
        </div>
        
        <button class="btn-primary" id="send-proceed-btn">
          Proceed to Send
        </button>
      </div>
    </div>
  `;
  
  // Event listeners
  document.getElementById('back-btn').addEventListener('click', goHome);
  
  // Contact selection
  document.querySelectorAll('.contact-item').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('receiver-phone').value = el.dataset.phone;
    });
  });
  
  // Quick amounts
  document.querySelectorAll('.quick-amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('send-amount').value = btn.dataset.amount;
      updateChargeDisplay(parseInt(btn.dataset.amount));
    });
  });
  
  // Amount input
  document.getElementById('send-amount').addEventListener('input', (e) => {
    updateChargeDisplay(parseFloat(e.target.value) || 0);
  });
  
  // Proceed
  document.getElementById('send-proceed-btn').addEventListener('click', () => {
    const phone = document.getElementById('receiver-phone').value;
    const amount = parseFloat(document.getElementById('send-amount').value);
    
    if (!phone || phone.length < 11) {
      showToast('Please enter a valid mobile number', 'error');
      return;
    }
    if (!amount || amount < 10) {
      showToast('Minimum send amount is ৳10', 'error');
      return;
    }
    if (amount > userData.balance) {
      showToast('Insufficient balance', 'error');
      return;
    }
    
    showPinEntry('send-money', { phone, amount, reference: document.getElementById('send-reference').value });
  });
}

function renderCashOutPage() {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Cash Out</h2>
      </div>
      
      <div class="page-body">
        <div class="receiver-section">
          <h3>Agent Number</h3>
          <div class="form-group">
            <div class="form-input-wrap">
              <span class="input-icon">${icons.phone}</span>
              <input type="tel" class="form-input" id="agent-phone" placeholder="Enter agent number" style="padding-left: 46px;" />
            </div>
          </div>
        </div>
        
        <div class="amount-input-section">
          <h3>Amount</h3>
          <div class="amount-display">
            <span class="currency-symbol">৳</span>
            <input type="number" id="cashout-amount" placeholder="0.00" />
          </div>
          <div class="quick-amounts">
            <button class="quick-amount-btn" data-amount="500">৳500</button>
            <button class="quick-amount-btn" data-amount="1000">৳1,000</button>
            <button class="quick-amount-btn" data-amount="5000">৳5,000</button>
            <button class="quick-amount-btn" data-amount="10000">৳10,000</button>
          </div>
        </div>
        
        <div class="charge-info">
          <div class="charge-row">
            <span>Amount</span>
            <span id="cashout-charge-amount">৳0.00</span>
          </div>
          <div class="charge-row">
            <span>Charge (1.85%)</span>
            <span id="cashout-charge-fee">৳0.00</span>
          </div>
          <div class="charge-row total">
            <span>Total Deduction</span>
            <span id="cashout-charge-total">৳0.00</span>
          </div>
        </div>
        
        <button class="btn-primary" id="cashout-proceed-btn">
          Cash Out
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  
  document.querySelectorAll('.quick-amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amount = parseInt(btn.dataset.amount);
      document.getElementById('cashout-amount').value = amount;
      updateCashOutCharge(amount);
    });
  });
  
  document.getElementById('cashout-amount').addEventListener('input', (e) => {
    updateCashOutCharge(parseFloat(e.target.value) || 0);
  });
  
  document.getElementById('cashout-proceed-btn').addEventListener('click', () => {
    const phone = document.getElementById('agent-phone').value;
    const amount = parseFloat(document.getElementById('cashout-amount').value);
    
    if (!phone || phone.length < 11) {
      showToast('Please enter a valid agent number', 'error');
      return;
    }
    if (!amount || amount < 50) {
      showToast('Minimum cash out is ৳50', 'error');
      return;
    }
    
    const charge = Math.round(amount * 0.0185);
    if (amount + charge > userData.balance) {
      showToast('Insufficient balance', 'error');
      return;
    }
    
    showPinEntry('cash-out', { phone, amount, charge });
  });
}

function renderAddMoneyPage() {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Add Money</h2>
      </div>
      
      <div class="page-body">
        <div class="receiver-section">
          <h3>Source</h3>
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <button class="quick-amount-btn active" style="flex:1; padding: 14px;" data-source="bank">🏦 Bank Account</button>
            <button class="quick-amount-btn" style="flex:1; padding: 14px;" data-source="card">💳 Card</button>
          </div>
          
          <div class="form-group">
            <label>Select Bank</label>
            <div class="form-input-wrap">
              <select class="form-input" id="select-bank" style="padding-left: 16px; cursor: pointer;">
                <option value="">Choose a bank</option>
                <option value="ucb">United Commercial Bank</option>
                <option value="dbbl">Dutch Bangla Bank</option>
                <option value="brac">BRAC Bank</option>
                <option value="ebl">Eastern Bank</option>
                <option value="city">City Bank</option>
                <option value="scb">Standard Chartered</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="amount-input-section">
          <h3>Amount to Add</h3>
          <div class="amount-display">
            <span class="currency-symbol">৳</span>
            <input type="number" id="add-amount" placeholder="0.00" />
          </div>
          <div class="quick-amounts">
            <button class="quick-amount-btn" data-amount="1000">৳1,000</button>
            <button class="quick-amount-btn" data-amount="5000">৳5,000</button>
            <button class="quick-amount-btn" data-amount="10000">৳10,000</button>
            <button class="quick-amount-btn" data-amount="25000">৳25,000</button>
          </div>
        </div>
        
        <div class="charge-info">
          <div class="charge-row">
            <span>Amount</span>
            <span id="add-charge-amount">৳0.00</span>
          </div>
          <div class="charge-row">
            <span>Charge</span>
            <span>৳0.00 (Free)</span>
          </div>
        </div>
        
        <button class="btn-primary" id="add-proceed-btn">
          Add Money
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  
  document.querySelectorAll('[data-source]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-source]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  document.querySelectorAll('.quick-amount-btn[data-amount]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quick-amount-btn[data-amount]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('add-amount').value = btn.dataset.amount;
      document.getElementById('add-charge-amount').textContent = formatShortCurrency(parseInt(btn.dataset.amount));
    });
  });
  
  document.getElementById('add-amount').addEventListener('input', (e) => {
    document.getElementById('add-charge-amount').textContent = formatShortCurrency(parseFloat(e.target.value) || 0);
  });
  
  document.getElementById('add-proceed-btn').addEventListener('click', () => {
    const bank = document.getElementById('select-bank').value;
    const amount = parseFloat(document.getElementById('add-amount').value);
    
    if (!bank) {
      showToast('Please select a bank', 'error');
      return;
    }
    if (!amount || amount < 100) {
      showToast('Minimum add amount is ৳100', 'error');
      return;
    }
    
    showPinEntry('add-money', { bank, amount });
  });
}

function renderMobileRechargePage() {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Mobile Recharge</h2>
      </div>
      
      <div class="page-body">
        <div class="receiver-section">
          <h3>Mobile Number</h3>
          <div class="form-group">
            <div class="form-input-wrap">
              <span class="input-icon">${icons.phone}</span>
              <input type="tel" class="form-input" id="recharge-phone" placeholder="Enter mobile number" style="padding-left: 46px;" />
            </div>
          </div>
        </div>
        
        <div class="amount-input-section" style="padding-bottom: 8px;">
          <h3>Select Operator</h3>
          <div class="operator-grid">
            ${operators.map((op, i) => `
              <div class="operator-card ${i === 0 ? 'active' : ''}" data-operator="${op.short}">
                <div class="op-logo" style="background: ${op.color}">${op.short}</div>
                <div class="op-name">${op.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="amount-input-section">
          <h3>Type</h3>
          <div class="recharge-tabs">
            <button class="recharge-tab active" data-type="prepaid">Prepaid</button>
            <button class="recharge-tab" data-type="postpaid">Postpaid</button>
          </div>
          
          <h3>Amount</h3>
          <div class="amount-display">
            <span class="currency-symbol">৳</span>
            <input type="number" id="recharge-amount" placeholder="0" />
          </div>
          <div class="quick-amounts">
            <button class="quick-amount-btn" data-amount="19">৳19</button>
            <button class="quick-amount-btn" data-amount="49">৳49</button>
            <button class="quick-amount-btn" data-amount="99">৳99</button>
            <button class="quick-amount-btn" data-amount="149">৳149</button>
            <button class="quick-amount-btn" data-amount="249">৳249</button>
            <button class="quick-amount-btn" data-amount="499">৳499</button>
          </div>
        </div>
        
        <button class="btn-primary" id="recharge-proceed-btn">
          Recharge Now
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  
  document.querySelectorAll('.operator-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.operator-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
  
  document.querySelectorAll('.recharge-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.recharge-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
  
  document.querySelectorAll('.quick-amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('recharge-amount').value = btn.dataset.amount;
    });
  });
  
  document.getElementById('recharge-proceed-btn').addEventListener('click', () => {
    const phone = document.getElementById('recharge-phone').value;
    const amount = parseFloat(document.getElementById('recharge-amount').value);
    const operator = document.querySelector('.operator-card.active')?.dataset.operator;
    
    if (!phone || phone.length < 11) {
      showToast('Please enter a valid mobile number', 'error');
      return;
    }
    if (!amount || amount < 10) {
      showToast('Minimum recharge is ৳10', 'error');
      return;
    }
    
    showPinEntry('recharge', { phone, amount, operator });
  });
}

function renderPayBillPage() {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Pay Bill</h2>
      </div>
      
      <div class="page-body">
        <div class="section-title" style="padding: 0; margin-bottom: 16px;">
          <span>Select Category</span>
        </div>
        
        <div class="bill-categories">
          ${billCategories.map(cat => `
            <div class="bill-category" data-bill="${cat.name}">
              <div class="icon" style="background: ${cat.color}">
                ${icons[cat.icon]}
              </div>
              <span class="name">${cat.name}</span>
            </div>
          `).join('')}
        </div>
        
        <div id="bill-form" class="hidden">
          <div class="receiver-section">
            <h3 id="bill-category-title">Bill Details</h3>
            <div class="form-group">
              <label>Account / Meter Number</label>
              <div class="form-input-wrap">
                <span class="input-icon">${icons.info}</span>
                <input type="text" class="form-input" id="bill-account" placeholder="Enter account number" style="padding-left: 46px;" />
              </div>
            </div>
          </div>
          
          <div class="amount-input-section">
            <h3>Bill Amount</h3>
            <div class="amount-display">
              <span class="currency-symbol">৳</span>
              <input type="number" id="bill-amount" placeholder="0.00" />
            </div>
          </div>
          
          <div class="charge-info">
            <div class="charge-row">
              <span>Bill Amount</span>
              <span id="bill-display-amount">৳0.00</span>
            </div>
            <div class="charge-row">
              <span>Convenience Fee</span>
              <span>৳0.00 (Free)</span>
            </div>
          </div>
          
          <button class="btn-primary" id="bill-proceed-btn">
            Pay Bill
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  
  let selectedCategory = '';
  
  document.querySelectorAll('.bill-category').forEach(cat => {
    cat.addEventListener('click', () => {
      selectedCategory = cat.dataset.bill;
      document.getElementById('bill-category-title').textContent = selectedCategory + ' Bill';
      document.getElementById('bill-form').classList.remove('hidden');
      cat.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  document.getElementById('bill-amount')?.addEventListener('input', (e) => {
    document.getElementById('bill-display-amount').textContent = formatShortCurrency(parseFloat(e.target.value) || 0);
  });
  
  // Use event delegation for the proceed button
  document.addEventListener('click', function handler(e) {
    if (e.target.id === 'bill-proceed-btn' || e.target.closest('#bill-proceed-btn')) {
      const account = document.getElementById('bill-account').value;
      const amount = parseFloat(document.getElementById('bill-amount').value);
      
      if (!account) {
        showToast('Please enter account number', 'error');
        return;
      }
      if (!amount || amount < 1) {
        showToast('Please enter bill amount', 'error');
        return;
      }
      
      showPinEntry('bill-pay', { category: selectedCategory, account, amount });
      document.removeEventListener('click', handler);
    }
  });
}

function renderQRScannerPage() {
  app.innerHTML = `
    <div class="qr-scanner-page">
      <div class="page-header" style="background: transparent; position: absolute; top: 0; left: 0; right: 0; z-index: 10;">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>QR Payment</h2>
      </div>
      
      <div class="qr-scanner-overlay">
        <div class="qr-frame">
          <div class="bottom-left"></div>
          <div class="bottom-right"></div>
          <div class="qr-scan-line"></div>
        </div>
        <p class="qr-text">Align QR code within the frame to scan</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 8px;">Point your camera at a merchant QR code</p>
        
        <div style="display: flex; gap: 24px; margin-top: 40px;">
          <button style="background: rgba(255,255,255,0.15); border: none; border-radius: 16px; padding: 16px 24px; color: white; font-size: 13px; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">📷</span>
            Gallery
          </button>
          <button style="background: rgba(255,255,255,0.15); border: none; border-radius: 16px; padding: 16px 24px; color: white; font-size: 13px; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">💡</span>
            Flash
          </button>
          <button style="background: rgba(255,255,255,0.15); border: none; border-radius: 16px; padding: 16px 24px; color: white; font-size: 13px; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 8px;" id="my-qr-btn">
            <span style="font-size: 24px;">📱</span>
            My QR
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  document.getElementById('my-qr-btn').addEventListener('click', () => {
    showToast('Showing your QR code...', 'info');
  });
}

function renderHistoryPage() {
  appState.selectedNav = 'history';
  
  app.innerHTML = `
    <div class="page-screen" style="animation: none;">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Transaction History</h2>
      </div>
      
      <div class="filter-chips">
        <button class="filter-chip active" data-filter="all">All</button>
        <button class="filter-chip" data-filter="send-money">Send Money</button>
        <button class="filter-chip" data-filter="add-money">Add Money</button>
        <button class="filter-chip" data-filter="cash-out">Cash Out</button>
        <button class="filter-chip" data-filter="recharge">Recharge</button>
        <button class="filter-chip" data-filter="bill-pay">Bill Pay</button>
      </div>
      
      <div class="transactions-section">
        <div class="transaction-list" id="txn-list">
          ${transactions.map(renderTransactionItem).join('')}
        </div>
      </div>
      
      ${renderBottomNav()}
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const filter = chip.dataset.filter;
      const filtered = filter === 'all' ? transactions : transactions.filter(t => t.category === filter);
      
      document.getElementById('txn-list').innerHTML = filtered.length 
        ? filtered.map(renderTransactionItem).join('')
        : `<div class="empty-state">
            ${icons.history}
            <h3>No Transactions</h3>
            <p>No transactions found for this filter</p>
          </div>`;
    });
  });
  
  attachBottomNavListeners();
}

function renderOffersPage() {
  appState.selectedNav = 'offers';
  
  app.innerHTML = `
    <div class="page-screen" style="animation: none;">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Offers & Cashback</h2>
      </div>
      
      <div style="padding: 16px;">
        <!-- Featured Offer -->
        <div class="promo-card gradient-1" style="margin-bottom: 16px; min-height: 160px;">
          <span class="promo-badge">FEATURED</span>
          <h3 style="font-size: 22px;">Mega Cashback Week!</h3>
          <p>Get up to 50% cashback on all transactions.<br>Valid till 10th October.</p>
        </div>
      </div>
      
      <div class="section-title">
        <span>All Offers</span>
      </div>
      
      <div class="offers-grid">
        ${offersData.map(offer => `
          <div class="offer-card">
            <div class="offer-card-image" style="background: ${offer.gradient}">
              <span class="discount">${offer.discount}</span>
            </div>
            <div class="offer-card-body">
              <h4>${offer.title}</h4>
              <p>${offer.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${renderBottomNav()}
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  attachBottomNavListeners();
}

function renderProfilePage() {
  appState.selectedNav = 'profile';
  
  app.innerHTML = `
    <div class="page-screen" style="animation: none;">
      <div class="profile-header">
        <div class="profile-avatar">${icons.user}</div>
        <h2>${userData.name}</h2>
        <p>+880 ${userData.phone} • ${userData.accountType}</p>
        <p style="font-size: 11px; opacity: 0.7; margin-top: 4px;">Account: ${userData.accountNo}</p>
      </div>
      
      <div class="profile-menu">
        <div class="profile-menu-group">
          <div class="profile-menu-item" data-menu="edit-profile">
            <div class="menu-icon" style="background: linear-gradient(135deg, #1565C0, #42A5F5);">${icons.user}</div>
            <div class="menu-text">
              <h4>Edit Profile</h4>
              <p>Update your personal information</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
          <div class="profile-menu-item" data-menu="kyc">
            <div class="menu-icon" style="background: linear-gradient(135deg, #00897B, #26C6DA);">${icons.shield}</div>
            <div class="menu-text">
              <h4>KYC Verification</h4>
              <p>${userData.kycVerified ? '✅ Verified' : 'Pending verification'}</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
          <div class="profile-menu-item" data-menu="limits">
            <div class="menu-icon" style="background: linear-gradient(135deg, #EF6C00, #FFB74D);">${icons.info}</div>
            <div class="menu-text">
              <h4>Limits & Charges</h4>
              <p>View transaction limits and fees</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
        </div>
        
        <div class="profile-menu-group">
          <div class="profile-menu-item" data-menu="statement">
            <div class="menu-icon" style="background: linear-gradient(135deg, #7B1FA2, #E040FB);">${icons.download}</div>
            <div class="menu-text">
              <h4>Statement</h4>
              <p>Download your account statement</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
          <div class="profile-menu-item" data-menu="referral">
            <div class="menu-icon" style="background: linear-gradient(135deg, #AD1457, #F06292);">${icons.offers}</div>
            <div class="menu-text">
              <h4>Refer & Earn</h4>
              <p>Invite friends and earn rewards</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
        </div>
        
        <div class="profile-menu-group">
          <div class="profile-menu-item" data-menu="settings">
            <div class="menu-icon" style="background: linear-gradient(135deg, #37474F, #78909C);">${icons.settings}</div>
            <div class="menu-text">
              <h4>Settings</h4>
              <p>App preferences, PIN change</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
          <div class="profile-menu-item" data-menu="help">
            <div class="menu-icon" style="background: linear-gradient(135deg, #2E7D32, #66BB6A);">${icons.helpCircle}</div>
            <div class="menu-text">
              <h4>Help & Support</h4>
              <p>FAQs, Contact us, Live chat</p>
            </div>
            <div class="menu-arrow">${icons.chevronRight}</div>
          </div>
        </div>
        
        <button class="logout-btn" id="logout-btn">
          ${icons.logOut}
          Logout
        </button>
        
        <button class="reset-demo-btn" id="reset-demo-btn">
          🔄 Reset Demo Data
        </button>
        
        <p style="text-align: center; font-size: 11px; color: var(--text-muted); margin-top: 16px;">
          uPay AI v3.0 • Track 03: Customer Innovation<br>
          Hackathon Demo — Not a real financial service
        </p>
      </div>
      
      ${renderBottomNav()}
    </div>
  `;
  
  document.getElementById('back-btn')?.addEventListener('click', goHome);
  
  document.querySelectorAll('.profile-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      showToast(`${item.querySelector('h4').textContent} - Coming soon!`, 'info');
    });
  });
  
  document.getElementById('logout-btn').addEventListener('click', () => {
    appState.isLoggedIn = false;
    appState.currentScreen = 'login';
    appState.selectedNav = 'home';
    showToast('Logged out successfully');
    render();
  });
  
  document.getElementById('reset-demo-btn')?.addEventListener('click', () => {
    resetDemoData();
    showToast('Demo data has been reset!');
    render();
  });
  
  attachBottomNavListeners();
}

function renderNotificationsPage() {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>Notifications</h2>
      </div>
      
      <div class="notification-list">
        ${notifications.map(notif => {
          let iconColor, bgColor;
          switch(notif.type) {
            case 'success': iconColor = '#00C853'; bgColor = 'rgba(0,200,83,0.1)'; break;
            case 'promo': iconColor = '#7B1FA2'; bgColor = 'rgba(123,31,162,0.1)'; break;
            case 'warning': iconColor = '#FFB300'; bgColor = 'rgba(255,179,0,0.1)'; break;
            case 'alert': iconColor = '#FF1744'; bgColor = 'rgba(255,23,68,0.1)'; break;
            default: iconColor = '#2979FF'; bgColor = 'rgba(41,121,255,0.1)';
          }
          
          return `
            <div class="notification-item ${notif.unread ? 'unread' : ''}">
              <div class="notif-icon" style="background: ${bgColor}; color: ${iconColor};">
                ${icons.bell}
              </div>
              <div class="notif-content">
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
                <span class="notif-time">${notif.time}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
}

function renderGenericServicePage(title, description) {
  app.innerHTML = `
    <div class="page-screen">
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.arrowLeft}</button>
        <h2>${title}</h2>
      </div>
      
      <div class="page-body">
        <div class="empty-state" style="margin-top: 60px;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
            <span style="font-size: 48px;">🚀</span>
          </div>
          <h3>${title}</h3>
          <p>${description}</p>
          <button class="btn-primary" style="margin-top: 24px; max-width: 250px; margin-left: auto; margin-right: auto;" id="generic-back">
            Go Back
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('back-btn').addEventListener('click', goHome);
  document.getElementById('generic-back').addEventListener('click', goHome);
}

// ============================================
// PIN Entry & Success Modal
// ============================================

function showPinEntry(action, data) {
  const overlay = document.createElement('div');
  overlay.className = 'pin-modal';
  overlay.id = 'pin-modal';
  
  let pinValue = '';
  
  overlay.innerHTML = `
    <div class="pin-modal-header">
      <h3>Enter Your PIN</h3>
      <p>Enter 4-digit PIN to confirm</p>
    </div>
    
    <div class="pin-modal-body">
      <div class="pin-dots">
        <div class="pin-dot" id="dot-0"></div>
        <div class="pin-dot" id="dot-1"></div>
        <div class="pin-dot" id="dot-2"></div>
        <div class="pin-dot" id="dot-3"></div>
      </div>
      
      <div class="pin-keypad">
        ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pin-key" data-key="${n}">${n}</button>`).join('')}
        <button class="pin-key empty"></button>
        <button class="pin-key" data-key="0">0</button>
        <button class="pin-key backspace" data-key="back">${icons.backspace}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  overlay.querySelectorAll('.pin-key').forEach(key => {
    key.addEventListener('click', () => {
      const keyVal = key.dataset.key;
      
      if (keyVal === 'back') {
        if (pinValue.length > 0) {
          pinValue = pinValue.slice(0, -1);
          document.getElementById(`dot-${pinValue.length}`).classList.remove('filled');
        }
      } else if (pinValue.length < 4) {
        document.getElementById(`dot-${pinValue.length}`).classList.add('filled');
        pinValue += keyVal;
        
        if (pinValue.length === 4) {
          setTimeout(() => processTransaction(action, data, overlay), 300);
        }
      }
    });
  });
}

function processTransaction(action, data, pinModal) {
  pinModal.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column;">
      <div class="splash-loader" style="border-color: rgba(230,57,70,0.2); border-top-color: var(--primary); width: 50px; height: 50px;"></div>
      <p style="margin-top: 20px; color: var(--text-secondary); font-weight: 600;">Processing...</p>
    </div>
  `;
  
  setTimeout(() => {
    pinModal.remove();
    
    // Update balance
    if (action === 'add-money') {
      userData.balance += data.amount;
    } else {
      const totalDeduct = data.amount + (data.charge || 0);
      userData.balance -= totalDeduct;
    }
    
    // Show success
    showSuccessModal(action, data);
  }, 2000);
}

function showSuccessModal(action, data) {
  const titles = {
    'send-money': 'Money Sent!',
    'cash-out': 'Cash Out Successful!',
    'add-money': 'Money Added!',
    'recharge': 'Recharge Successful!',
    'bill-pay': 'Bill Paid!',
  };
  
  const descs = {
    'send-money': `Sent to ${data.phone}`,
    'cash-out': `Cash out via agent ${data.phone}`,
    'add-money': 'Added to your uPay wallet',
    'recharge': `Recharged ${data.phone}`,
    'bill-pay': `${data.category} bill paid`,
  };
  
  const txnId = generateTxnId();
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon success">
        <svg viewBox="0 0 24 24" fill="none" stroke="#00C853" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 40px; height: 40px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h3>${titles[action] || 'Success!'}</h3>
      <p>${descs[action] || 'Transaction completed'}</p>
      <div class="modal-amount">${formatCurrency(data.amount)}</div>
      
      <div class="modal-details">
        <div class="detail-row">
          <span>Transaction ID</span>
          <span>${txnId}</span>
        </div>
        <div class="detail-row">
          <span>Date</span>
          <span>${new Date().toLocaleDateString('en-BD')}</span>
        </div>
        <div class="detail-row">
          <span>New Balance</span>
          <span>${formatCurrency(userData.balance)}</span>
        </div>
      </div>
      
      <button class="btn-primary" id="success-done-btn">
        Done
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  document.getElementById('success-done-btn').addEventListener('click', () => {
    overlay.remove();
    appState.currentScreen = 'home';
    appState.selectedNav = 'home';
    render();
  });
}

// ============================================
// Helper Update Functions
// ============================================

function updateChargeDisplay(amount) {
  const amountEl = document.getElementById('charge-amount');
  const totalEl = document.getElementById('charge-total');
  if (amountEl) amountEl.textContent = formatCurrency(amount);
  if (totalEl) totalEl.textContent = formatCurrency(amount); // Send money is free
}

function updateCashOutCharge(amount) {
  const charge = Math.round(amount * 0.0185);
  const amountEl = document.getElementById('cashout-charge-amount');
  const feeEl = document.getElementById('cashout-charge-fee');
  const totalEl = document.getElementById('cashout-charge-total');
  
  if (amountEl) amountEl.textContent = formatCurrency(amount);
  if (feeEl) feeEl.textContent = formatCurrency(charge);
  if (totalEl) totalEl.textContent = formatCurrency(amount + charge);
}

// ============================================
// Navigation
// ============================================

function goHome() {
  appState.currentScreen = 'home';
  appState.selectedNav = 'home';
  render();
}

function attachHomeEventListeners() {
  // Balance toggle
  document.getElementById('balance-toggle')?.addEventListener('click', () => {
    appState.balanceVisible = !appState.balanceVisible;
    renderHomeScreen();
  });
  
  // Notification button
  document.getElementById('notif-btn')?.addEventListener('click', () => {
    appState.currentScreen = 'notifications';
    render();
  });
  
  // Search button
  document.getElementById('search-btn')?.addEventListener('click', () => {
    showToast('Search coming soon!', 'info');
  });
  
  // Balance action buttons
  document.querySelectorAll('.balance-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.currentScreen = btn.dataset.action;
      render();
    });
  });
  
  // Service items
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      appState.currentScreen = item.dataset.service;
      render();
    });
  });
  
  // See all links
  document.getElementById('see-all-offers')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.currentScreen = 'offers';
    appState.selectedNav = 'offers';
    render();
  });
  
  document.getElementById('see-all-txn')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.currentScreen = 'history';
    appState.selectedNav = 'history';
    render();
  });
  
  // Promo carousel scroll tracking
  const carousel = document.getElementById('promo-carousel');
  if (carousel) {
    carousel.addEventListener('scroll', () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.firstElementChild?.offsetWidth || 1;
      const activeIndex = Math.round(scrollLeft / cardWidth);
      
      document.querySelectorAll('.promo-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    });
  }
  
  attachBottomNavListeners();
}

function attachBottomNavListeners() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const nav = item.dataset.nav;
      appState.selectedNav = nav;
      appState.currentScreen = nav;
      render();
    });
  });
}

// ============================================
// Main Render Function
// ============================================

function render(skipHistory = false) {
  if (!skipHistory && appState.currentScreen !== 'splash') {
    const currentHash = window.location.hash.substring(1);
    if (currentHash !== appState.currentScreen) {
      window.history.pushState({ screen: appState.currentScreen, nav: appState.selectedNav }, '', `#${appState.currentScreen}`);
    }
  }

  switch (appState.currentScreen) {
    case 'splash':
      renderSplashScreen();
      break;
    case 'login':
      renderLoginScreen();
      break;
    case 'home':
      renderHomeScreen();
      break;
    case 'financial-center':
      renderFinancialCenterPage(app, render, attachBottomNavListeners);
      break;
    case 'ask-my-money':
      renderAskMyMoneyPage(app, render);
      break;
    case 'financial-health':
      renderFinancialHealthPage(app, render);
      break;
    case 'spending':
      renderSpendingPage(app, render);
      break;
    case 'cash-flow':
      renderCashFlowPage(app, render);
      break;
    case 'goals-page':
      renderGoalsPage(app, render);
      break;
    case 'cash-out-analysis':
      renderCashOutAnalysisPage(app, render);
      break;
    case 'learn':
      renderLearnPage(app, render);
      break;
    case 'consistency':
      renderConsistencyPage(app, render);
      break;
    case 'insights':
      renderInsightsPage(app, render);
      break;
    case 'send-money':
      renderSendMoneyPage();
      break;
    case 'cash-out':
      renderCashOutPage();
      break;
    case 'add-money':
      renderAddMoneyPage();
      break;
    case 'mobile-recharge':
      renderMobileRechargePage();
      break;
    case 'pay-bill':
      renderPayBillPage();
      break;
    case 'qr-scanner':
    case 'qr-pay':
      renderQRScannerPage();
      break;
    case 'history':
      renderHistoryPage();
      break;
    case 'offers':
      renderOffersPage();
      break;
    case 'profile':
      renderProfilePage();
      break;
    case 'notifications':
      renderNotificationsPage();
      break;
    case 'payment':
      renderGenericServicePage('Payment', 'Merchant payment service. Scan QR or enter merchant number to make instant payments.');
      break;
    case 'remittance':
      renderGenericServicePage('Remittance', 'Receive international remittance directly to your uPay wallet from anywhere in the world.');
      break;
    case 'dps':
      renderGenericServicePage('DPS', 'Start a Deposit Pension Scheme and grow your savings with attractive interest rates.');
      break;
    case 'toll':
      renderGenericServicePage('Toll Payment', 'Pay highway tolls including Padma Bridge, Bangabandhu Bridge easily from your uPay wallet.');
      break;
    case 'gov-pay':
      renderGenericServicePage('Government Payment', 'Pay traffic fines, land taxes, e-porcha, DNCC holding tax, e-mutation & more.');
      break;
    case 'prepaid-card':
      renderGenericServicePage('Prepaid Card', 'Get your uPay Prepaid Card for online shopping and international payments.');
      break;
    default:
      renderHomeScreen();
  }
}

// ============================================
// Initialize App
// ============================================

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.screen) {
    appState.currentScreen = e.state.screen;
    if (e.state.nav) {
      appState.selectedNav = e.state.nav;
    }
  } else {
    const hash = window.location.hash.substring(1);
    if (hash) {
      appState.currentScreen = hash;
    } else {
      appState.currentScreen = appState.isLoggedIn ? 'home' : 'splash';
    }
  }
  render(true);
});

if (window.location.hash) {
  appState.currentScreen = window.location.hash.substring(1);
}

render();
