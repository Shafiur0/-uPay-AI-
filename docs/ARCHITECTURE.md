# System Architecture

## Overview

uPay is built as a **Single Page Application (SPA)** using vanilla JavaScript with a modular architecture. The app follows a screen-based routing pattern with a centralized state management approach.

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   index.html  │  │  style.css   │  │  main.js   │ │
│  │  (Entry Point)│  │(Design System)│  │ (App Core) │ │
│  └──────┬───────┘  └──────────────┘  └─────┬──────┘ │
│         │                                    │        │
│         └──────────────┬─────────────────────┘        │
│                        ▼                              │
│              ┌─────────────────┐                      │
│              │    #app (Root)   │                      │
│              └────────┬────────┘                      │
│                       │                               │
│         ┌─────────────┼─────────────┐                 │
│         ▼             ▼             ▼                 │
│  ┌────────────┐┌────────────┐┌────────────┐          │
│  │   Screens  ││  Modals    ││   Toast    │          │
│  │ (Renderers)││ (Overlays) ││(Notifications)│       │
│  └────────────┘└────────────┘└────────────┘          │
│                                                      │
├──────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                  │
│  │   icons.js   │  │   data.js    │                  │
│  │  (SVG Icons) │  │ (State/Data) │                  │
│  └──────────────┘  └──────────────┘                  │
└──────────────────────────────────────────────────────┘
```

---

## 🧩 Module Architecture

### Module Dependency Graph

```
main.js (Application Core)
  ├── style.css (Design System)
  ├── icons.js (SVG Icon Library)
  └── data.js (State & Mock Data)
```

### Module Responsibilities

| Module | Responsibility | LOC (approx) |
|--------|---------------|--------------|
| `main.js` | Screen rendering, event handling, routing, business logic | ~800 |
| `style.css` | Design tokens, component styles, animations, responsive | ~1200 |
| `icons.js` | SVG icon definitions as template literals | ~300 |
| `data.js` | Application state, user data, mock data | ~100 |

---

## 🔄 Application Flow

### Screen Lifecycle

```
User Action → State Update → render() → Screen Renderer → DOM Update → Event Binding
```

### Navigation Flow

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Splash  │────▶│  Login   │────▶│     Home     │
│  Screen  │     │  Screen  │     │  Dashboard   │
└──────────┘     └──────────┘     └──────┬───────┘
                                         │
                    ┌────────────────────┬┴──────────────────┐
                    ▼                    ▼                    ▼
             ┌────────────┐      ┌────────────┐       ┌────────────┐
             │ Send Money │      │  Cash Out  │       │ Add Money  │
             └─────┬──────┘      └─────┬──────┘       └─────┬──────┘
                   │                   │                     │
                   └───────────┬───────┘─────────────────────┘
                               ▼
                        ┌────────────┐
                        │ PIN Entry  │
                        └─────┬──────┘
                              ▼
                        ┌────────────┐
                        │  Success   │
                        │   Modal    │
                        └─────┬──────┘
                              ▼
                        ┌────────────┐
                        │    Home    │
                        └────────────┘
```

### Transaction Processing Flow

```
1. User selects service (Send Money / Cash Out / etc.)
2. User enters recipient details
3. User enters amount
4. System calculates charges
5. User clicks "Proceed"
6. System validates input
7. PIN Entry modal appears
8. User enters 4-digit PIN
9. Processing animation (2 seconds)
10. Balance updated
11. Success modal with transaction details
12. User returns to Home
```

---

## 🎨 Design System Architecture

### CSS Custom Properties (Design Tokens)

```
Design Tokens
├── Colors
│   ├── Brand (primary, accent, gradients)
│   ├── Neutral (backgrounds, borders)
│   ├── Text (primary, secondary, muted)
│   └── Status (success, warning, error, info)
├── Typography
│   ├── Font Family (Inter)
│   └── Font Sizes (xs through 3xl)
├── Spacing (xs through 2xl)
├── Border Radius (sm through full)
├── Shadows (sm through xl, brand)
├── Transitions (fast, normal, slow, spring)
└── Layout (max-width, nav height, status bar)
```

### Component Hierarchy

```
App Container
├── Status Bar
├── Top Header
│   ├── User Info (Avatar + Greeting)
│   ├── Header Actions (Search + Notifications)
│   └── Balance Card
│       ├── Balance Display (with toggle)
│       └── Quick Action Buttons
├── Services Grid (4-column)
│   └── Service Items (12 services)
├── Promo Carousel
│   └── Promo Cards (swipeable)
├── Transaction List
│   └── Transaction Items
├── Bottom Navigation
│   ├── Home
│   ├── History
│   ├── QR Scan (floating)
│   ├── Offers
│   └── Profile
└── Overlays
    ├── PIN Entry Modal
    ├── Success Modal
    └── Toast Notifications
```

---

## 🔒 Security Architecture

### Authentication Flow

```
┌──────────┐     ┌───────────────┐     ┌──────────┐
│  Phone   │────▶│ PIN (4-digit) │────▶│  Session  │
│  Number  │     │  Verification │     │  Active   │
└──────────┘     └───────────────┘     └──────────┘
```

### Transaction Security

1. **Input Validation** - All inputs validated before processing
2. **PIN Verification** - Required for every financial transaction
3. **Balance Check** - Sufficient balance verified before deduction
4. **Amount Limits** - Minimum/maximum transaction limits enforced

### Data Flow (Future Backend Integration)

```
Client (SPA) ──── HTTPS ────▶ API Gateway ────▶ Microservices
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │   Auth   │ │ Payment  │ │  User    │
              │ Service  │ │ Service  │ │ Service  │
              └──────────┘ └──────────┘ └──────────┘
                    │             │             │
                    ▼             ▼             ▼
              ┌──────────────────────────────────┐
              │          PostgreSQL DB            │
              └──────────────────────────────────┘
```

---

## 📱 Responsive Design Strategy

| Breakpoint | Target | Max Width |
|-----------|--------|-----------|
| Default | Mobile phones | 430px |
| < 380px | Small phones | Adjusted grid |
| Desktop | Centered container with dark background | 430px container |

The app uses a **mobile-first** approach with the app container centered on larger screens with a max-width of 430px, simulating a mobile device viewport.

---

## ⚡ Performance Considerations

1. **No framework overhead** - Pure vanilla JS, no React/Vue/Angular
2. **SVG icons** - Inline SVGs instead of icon fonts or image files
3. **CSS animations** - GPU-accelerated transforms and opacity
4. **Lazy rendering** - Only active screen rendered at any time
5. **Event delegation** - Minimize event listener count
6. **Minimal reflows** - Batch DOM updates via innerHTML

---

## 🔮 Future Architecture (Planned)

```
Phase 1 (Current): Monolithic SPA with mock data
Phase 2: Add service worker + offline support
Phase 3: Connect to REST API backend
Phase 4: Add WebSocket for real-time notifications
Phase 5: PWA with push notifications
Phase 6: React Native / Flutter mobile app
```
