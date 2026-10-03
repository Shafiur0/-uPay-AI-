# Security Policy

## Overview

Security is a top priority for uPay. This document outlines our security practices, vulnerability reporting process, and guidelines for maintaining a secure codebase.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.5.x | ✅ Active |
| < 2.5 | ❌ Not supported |

---

## Reporting a Vulnerability

### How to Report

If you discover a security vulnerability, **please do NOT open a public GitHub issue**. Instead:

1. **Email:** Send details to `security@upay-team.dev`
2. **Subject:** `[SECURITY] Brief description of vulnerability`
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

| Action | Timeline |
|--------|----------|
| Acknowledgment | Within 24 hours |
| Initial assessment | Within 48 hours |
| Status update | Within 7 days |
| Fix deployed | Within 30 days (critical: 72 hours) |

### Severity Classification

| Level | Description | Response Time |
|-------|-------------|--------------|
| **Critical** | Data breach, authentication bypass, remote code execution | 72 hours |
| **High** | Privilege escalation, sensitive data exposure | 7 days |
| **Medium** | Cross-site scripting (XSS), information leakage | 14 days |
| **Low** | Minor information disclosure, best practice violations | 30 days |

---

## Security Measures

### Current Implementation

1. **PIN-Based Authentication**
   - 4-digit PIN required for login
   - PIN required for every financial transaction
   - PIN input fields use `type="password"` masking
   - No PIN stored in plain text in client state

2. **Input Validation**
   - Phone number format validation
   - Amount range validation (minimum/maximum limits)
   - Balance sufficiency checks before transactions
   - XSS prevention through DOM-based rendering

3. **Session Management**
   - Client-side session state
   - Logout clears all session data
   - No sensitive data persisted in localStorage/sessionStorage

4. **UI Security**
   - Balance hide/show toggle
   - No sensitive data in URL parameters
   - PIN input uses `-webkit-text-security: disc`

### Planned Security Enhancements

- [ ] OTP-based two-factor authentication
- [ ] Biometric authentication (fingerprint/face ID)
- [ ] Session timeout with auto-logout
- [ ] Rate limiting on PIN attempts
- [ ] Device fingerprinting and trust management
- [ ] End-to-end encryption for transactions
- [ ] Certificate pinning for API calls
- [ ] Content Security Policy (CSP) headers
- [ ] Subresource Integrity (SRI) for CDN resources
- [ ] Regular security audits and penetration testing

---

## Security Best Practices for Contributors

### Do

- ✅ Validate all user inputs on both client and server
- ✅ Use parameterized queries (when backend is added)
- ✅ Keep dependencies updated
- ✅ Use HTTPS for all external requests
- ✅ Sanitize data before rendering to DOM
- ✅ Use `Content-Security-Policy` headers
- ✅ Follow the principle of least privilege

### Don't

- ❌ Store sensitive data in localStorage or sessionStorage
- ❌ Log sensitive information (PINs, account numbers)
- ❌ Use `eval()` or `innerHTML` with unsanitized user input
- ❌ Hardcode credentials, API keys, or secrets
- ❌ Disable security headers
- ❌ Trust client-side validation alone
- ❌ Expose stack traces or error details to users

---

## Dependency Security

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated
```

We run `npm audit` as part of our CI pipeline and address all critical/high vulnerabilities before deployment.

---

## Acknowledgments

We appreciate responsible disclosure. Security researchers who report valid vulnerabilities will be acknowledged in our security hall of fame (with their permission).
