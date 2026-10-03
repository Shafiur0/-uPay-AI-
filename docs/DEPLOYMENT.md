# Deployment Guide

## Overview

This guide covers deploying the uPay application to various hosting platforms.

---

## Build for Production

### Generate Production Build

```bash
npm run build
```

This creates a `dist/` directory containing:
```
dist/
├── index.html          # Minified HTML
├── assets/
│   ├── index-[hash].js   # Bundled & minified JS
│   └── index-[hash].css  # Bundled & minified CSS
```

### Preview Production Build

```bash
npm run preview
```

Opens at `http://localhost:4173/`

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite projects
- Automatic HTTPS
- Global CDN
- Free tier available

**Steps:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Or connect via GitHub:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Vite and configures build settings
5. Click Deploy

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Or via `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/upay-clone/',  // Your repo name
});
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Select: dist as public directory
# Select: Yes for single-page app

# Build and deploy
npm run build
firebase deploy
```

### Option 5: Docker

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

Build and run:
```bash
docker build -t upay-app .
docker run -p 80:80 upay-app
```

---

## Performance Optimization Checklist

- [x] JavaScript minified (Vite default)
- [x] CSS minified (Vite default)
- [x] Tree-shaking enabled (ES Modules)
- [x] Inline SVG icons (no external requests)
- [ ] Image optimization (when images added)
- [ ] Service Worker for offline support
- [ ] CDN for static assets
- [ ] Gzip/Brotli compression

---

## Post-Deployment Verification

After deploying, verify:

1. **Splash screen** loads and transitions to login
2. **Login** works with demo credentials
3. **All services** navigate correctly
4. **Transactions** process with PIN entry
5. **Responsive** layout on mobile devices
6. **No console errors** in browser DevTools
7. **HTTPS** is active (if applicable)
8. **Fonts** load correctly (Google Fonts CDN)

---

## Custom Domain Setup

### Vercel
```bash
vercel domains add yourdomain.com
```

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

### DNS Records
```
Type    Name    Value
A       @       76.76.21.21        (Vercel)
CNAME   www     your-app.vercel.app
```

---

## Monitoring (Recommended)

| Tool | Purpose |
|------|---------|
| Google Analytics | User tracking |
| Sentry | Error monitoring |
| Lighthouse CI | Performance monitoring |
| UptimeRobot | Uptime monitoring |
