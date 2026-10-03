# Development Environment Setup Guide

## Overview

This guide walks you through setting up the uPay development environment from scratch.

---

## Prerequisites

### Required Software

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | 18.0.0 | [nodejs.org](https://nodejs.org) |
| npm | 9.0.0 | Bundled with Node.js |
| Git | 2.30+ | [git-scm.com](https://git-scm.com) |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| VS Code | Code editor |
| Chrome DevTools | Debugging & mobile simulation |
| Postman | API testing (future use) |

---

## Step-by-Step Setup

### 1. Install Node.js

**Windows:**
```bash
# Using winget
winget install OpenJS.NodeJS.LTS

# Or download installer from https://nodejs.org
```

**macOS:**
```bash
# Using Homebrew
brew install node@18
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verify Installation
```bash
node --version   # Should output v18.x.x or higher
npm --version    # Should output 9.x.x or higher
```

### 2. Clone the Repository

```bash
git clone https://github.com/your-org/upay-clone.git
cd upay-clone
```

### 3. Install Dependencies

```bash
npm install
```

This installs:
- **vite** - Build tool and development server

### 4. Start Development Server

```bash
npm run dev
```

Output:
```
VITE v8.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Open in Browser

Navigate to `http://localhost:5173/` in your browser.

---

## Development Workflow

### Hot Module Replacement (HMR)

Vite provides instant HMR. When you save a file:
- **CSS changes** → Injected without page reload
- **JS changes** → Page refreshes automatically
- **HTML changes** → Manual refresh required

### Mobile Testing

**Using Chrome DevTools:**
1. Open DevTools (F12)
2. Click the device toggle icon (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 14, Pixel 7)
4. The app is designed for 430px max-width

**Using your phone:**
```bash
# Start with network access
npm run dev -- --host
```
Then open the Network URL on your phone's browser.

---

## VS Code Configuration

### Recommended Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "css.validate": true,
  "emmet.includeLanguages": {
    "javascript": "html"
  },
  "files.associations": {
    "*.css": "css"
  }
}
```

### Recommended Extensions

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "pranaygp.vscode-css-peek",
    "formulahendry.auto-rename-tag",
    "eamodio.gitlens",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## Project Configuration Files

### `vite.config.js` (if customization needed)
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
  },
});
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `npm install` fails | Delete `node_modules` and `package-lock.json`, run `npm install` again |
| Port 5173 in use | Kill the process: `npx kill-port 5173` or use `npm run dev -- --port 3001` |
| Fonts not loading | Check internet connection (Google Fonts loaded via CDN) |
| Page blank | Check browser console (F12) for JavaScript errors |
| CSS not updating | Hard refresh: Ctrl+Shift+R |

### Reset Development Environment

```bash
# Remove all generated files
rm -rf node_modules dist package-lock.json

# Fresh install
npm install

# Restart server
npm run dev
```

---

## Environment Variables (Future)

When backend integration is added:

```env
# .env.local
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=uPay
VITE_APP_VERSION=2.5.1
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```
