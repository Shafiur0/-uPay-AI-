# Feature Documentation

## Overview

This document provides detailed specifications for every feature implemented in the uPay mobile financial service application.

---

## 1. Splash Screen

### Description
Animated loading screen displayed when the app first opens.

### Behavior
- Displays uPay logo with bounce animation
- Shows brand name "uPay" and subtitle "উপায় - Your Digital Wallet"
- Loading spinner animation
- Auto-transitions to Login screen after 2.5 seconds with fade-out effect

### Technical Details
- Duration: 2500ms display + 600ms fade transition
- Animations: `splashBounce` (logo), `fadeInUp` (text), `spin` (loader)
- Z-index: 9999 (topmost layer)

---

## 2. Authentication

### 2.1 Login Screen

**Fields:**
| Field | Type | Validation | Default |
|-------|------|-----------|---------|
| Mobile Number | Tel | 10 digits (after +880) | Pre-filled |
| PIN | Password (4 inputs) | 4 digits required | Pre-filled |

**Features:**
- Phone number input with +880 prefix
- 4 individual PIN input fields with auto-focus advance
- Backspace navigation between PIN fields
- Language toggle (English / বাংলা)
- "Forgot PIN?" link
- "Open New Account" button
- Loading spinner on submit
- Input validation with toast error messages

**Flow:**
```
Enter Phone → Enter PIN → Click Login → Validate → Loading (1.5s) → Home Screen
```

---

## 3. Home Dashboard

### 3.1 Header Section
- User avatar with first-letter icon
- Dynamic greeting based on time of day (Morning/Afternoon/Evening)
- User's full name
- Search button
- Notification bell with unread count badge

### 3.2 Balance Card
- **Available Balance** label with show/hide toggle
- Balance amount in BDT (৳) with decimal formatting
- Toggle between visible amount and masked (•••••••)
- Three quick action buttons: Add Money, Send Money, Cash Out
- Glassmorphism design with blur backdrop

### 3.3 Services Grid (4×3)

| Row 1 | Row 2 | Row 3 |
|-------|-------|-------|
| Send Money | Cash Out | Add Money | Payment |
| Recharge | Pay Bill | Remittance | DPS |
| QR Pay | Toll | Gov. Pay | Card |

Each service has:
- Unique gradient icon background
- Service name label
- Tap animation (scale 0.92)
- Navigation to respective service page

### 3.4 Promotional Carousel
- Horizontal scrollable cards
- Snap-to-card scrolling
- Active dot indicator
- 3 promotional cards with different gradients
- Badge labels (LIMITED, NEW, HOT)

### 3.5 Recent Transactions
- Last 5 transactions displayed
- Credit (green ↙) and Debit (red ↗) indicators
- Transaction title, subtitle, amount, and date
- "View All" link to History page

### 3.6 Bottom Navigation
- 5 items: Home, History, Scan (QR), Offers, Profile
- Active state with top accent bar
- QR Scan button elevated with gradient circle
- Fixed position at bottom

---

## 4. Send Money

### Input Fields
| Field | Required | Validation |
|-------|----------|-----------|
| Receiver Phone | Yes | Min 11 digits |
| Amount | Yes | Min ৳10, max ≤ balance |
| Reference | No | Free text |

### Features
- Recent contacts carousel (5 contacts with colored avatars)
- Tap contact to auto-fill phone number
- Quick amount buttons: ৳100, ৳500, ৳1,000, ৳5,000
- Real-time charge calculation display
- **Charge: ৳0.00 (Free)** for send money
- PIN verification required
- Success modal with transaction ID

---

## 5. Cash Out

### Input Fields
| Field | Required | Validation |
|-------|----------|-----------|
| Agent Number | Yes | Min 11 digits |
| Amount | Yes | Min ৳50, max ≤ balance - charge |

### Features
- Quick amount buttons: ৳500, ৳1,000, ৳5,000, ৳10,000
- **Charge: 1.85%** of transaction amount
- Real-time charge and total deduction display
- Balance sufficiency check includes charge amount
- PIN verification required

### Charge Calculation
```
Charge = Amount × 0.0185
Total Deduction = Amount + Charge
```

---

## 6. Add Money

### Input Fields
| Field | Required | Validation |
|-------|----------|-----------|
| Source Type | Yes | Bank Account / Card |
| Bank | Yes | Select from list |
| Amount | Yes | Min ৳100 |

### Available Banks
- United Commercial Bank (UCB)
- Dutch Bangla Bank (DBBL)
- BRAC Bank
- Eastern Bank (EBL)
- City Bank
- Standard Chartered (SCB)

### Features
- Source toggle: Bank Account / Card
- Bank selection dropdown
- Quick amounts: ৳1,000, ৳5,000, ৳10,000, ৳25,000
- **Charge: Free**
- PIN verification required
- Balance increases on success

---

## 7. Mobile Recharge

### Input Fields
| Field | Required | Validation |
|-------|----------|-----------|
| Mobile Number | Yes | Min 11 digits |
| Operator | Yes | Select from grid |
| Type | Yes | Prepaid / Postpaid |
| Amount | Yes | Min ৳10 |

### Supported Operators
| Operator | Short | Brand Color |
|----------|-------|-------------|
| Grameenphone | GP | #00A651 |
| Robi | RB | #ED1C24 |
| Banglalink | BL | #F7941D |
| Airtel | AT | #ED1C24 |
| Teletalk | TT | #00B0F0 |

### Features
- Visual operator selection grid with brand colors
- Prepaid/Postpaid tab toggle
- Quick amounts: ৳19, ৳49, ৳99, ৳149, ৳249, ৳499
- PIN verification required

---

## 8. Pay Bill

### Bill Categories
| Category | Icon | Color |
|----------|------|-------|
| Electricity | ⚡ | #FFB300 |
| Water | 💧 | #2979FF |
| Gas | 🔥 | #FF6D00 |
| Internet | 📶 | #00C853 |
| Telephone | 📞 | #7B1FA2 |
| Credit Card | 💳 | #37474F |

### Input Fields
| Field | Required | Validation |
|-------|----------|-----------|
| Category | Yes | Select from grid |
| Account/Meter No. | Yes | Non-empty |
| Bill Amount | Yes | Min ৳1 |

### Features
- 3×2 category grid with colored icons
- Dynamic form reveals on category selection
- **Convenience Fee: Free**
- PIN verification required

---

## 9. QR Scanner

### Features
- Full-screen dark scanner interface
- Animated scan line (2s loop)
- QR frame with corner markers
- Action buttons: Gallery, Flash, My QR
- Back navigation

---

## 10. Transaction History

### Filter Options
| Filter | Shows |
|--------|-------|
| All | All transactions |
| Send Money | Send money transactions |
| Add Money | Add money transactions |
| Cash Out | Cash out transactions |
| Recharge | Mobile recharge |
| Bill Pay | Bill payments |

### Features
- Horizontal scrollable filter chips
- Active filter highlighting
- Empty state when no results
- 10 mock transactions with varied types
- Credit/Debit visual indicators

---

## 11. Offers & Cashback

### Featured Offer
- Full-width gradient card
- "FEATURED" badge
- Title and description

### Offer Cards (2×2 Grid)
| Offer | Discount | Gradient |
|-------|----------|----------|
| Recharge Cashback | 20% | Purple |
| Food Delivery | ৳100 off | Pink |
| Ride Discount | 15% | Blue |
| Shopping Spree | 10% | Green |

---

## 12. Profile

### Sections
1. **Profile Header** - Avatar, name, phone, account type, account number
2. **Account Group** - Edit Profile, KYC Verification (✅ status), Limits & Charges
3. **Financial Group** - Statement Download, Refer & Earn
4. **Settings Group** - App Settings, Help & Support
5. **Logout Button**
6. **App Version** - v2.5.1, UCB Fintech Company Ltd.

---

## 13. Notifications

### Notification Types
| Type | Color | Use Case |
|------|-------|----------|
| Success | Green | Transaction confirmations |
| Promo | Purple | Offers and promotions |
| Warning | Yellow | Bill reminders |
| Alert | Red | Security alerts |

### Features
- Unread indicator (left border accent)
- Icon colored by notification type
- Timestamp display
- 5 mock notifications

---

## 14. PIN Entry System

### Features
- Full-screen modal overlay
- 4 animated dot indicators
- Number keypad (1-9, 0, backspace)
- Dot fill animation on input
- Auto-submit on 4th digit
- Processing loader (2 seconds)
- Transitions to success modal

---

## 15. Success Modal

### Display Fields
- Success checkmark icon (animated)
- Action-specific title (e.g., "Money Sent!")
- Description with recipient details
- Amount in large format
- Transaction ID (auto-generated)
- Date
- New balance after transaction
- "Done" button → returns to Home

---

## 16. Toast Notifications

### Types
| Type | Color | Icon |
|------|-------|------|
| Success | Green | ✓ |
| Error | Red | ✕ |
| Info | Blue | ℹ |

### Behavior
- Slides down from top
- Auto-dismisses after 3 seconds
- Spring animation (cubic-bezier)
- Only one toast at a time
