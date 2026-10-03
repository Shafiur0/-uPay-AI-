# Contributing to uPay

Thank you for your interest in contributing to uPay! This document provides guidelines and instructions for contributing to this project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Branch Strategy](#branch-strategy)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- A modern code editor (VS Code recommended)

### Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/upay-clone.git
cd upay-clone

# 3. Add upstream remote
git remote add upstream https://github.com/your-org/upay-clone.git

# 4. Install dependencies
npm install

# 5. Start the development server
npm run dev
```

### Recommended VS Code Extensions

- ESLint
- Prettier
- CSS Peek
- Live Server
- GitLens

---

## 🔄 Development Workflow

### 1. Sync with upstream

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make your changes

- Write clean, well-documented code
- Follow the [Coding Standards](#coding-standards)
- Test your changes thoroughly

### 4. Commit your changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

---

## 📏 Coding Standards

### JavaScript

- Use **ES2022+** features (modules, arrow functions, template literals)
- Use `const` by default, `let` when reassignment is needed, never `var`
- Use meaningful variable and function names (camelCase)
- Functions should do one thing and do it well
- Maximum function length: 50 lines (prefer shorter)
- Add JSDoc comments for all exported functions

```javascript
// ✅ Good
/**
 * Formats a number as Bangladeshi Taka currency.
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return '৳' + amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ❌ Bad
function fmt(a) {
  return '৳' + a;
}
```

### CSS

- Use **CSS Custom Properties** (variables) for all design tokens
- Follow **BEM-like naming** for component classes
- Mobile-first responsive design
- Keep specificity low; avoid `!important`
- Group related properties together

```css
/* ✅ Good */
.balance-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);

  /* Visual */
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);

  /* Animation */
  transition: var(--transition-normal);
}

/* ❌ Bad */
.card {
  display: flex;
  background: rgba(255, 255, 255, 0.12);
  padding: 24px;
  border-radius: 20px !important;
}
```

### HTML

- Use semantic HTML5 elements
- All interactive elements must have unique `id` attributes
- Include proper `aria-*` attributes for accessibility
- Keep nesting depth under 6 levels

### File Organization

- One module per file
- Related code grouped in the same module
- Export only what's needed
- Keep files under 500 lines (split if larger)

---

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring (no feature/bug changes) |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Other changes (non-code) |

### Examples

```bash
feat(send-money): add contact search functionality
fix(balance): correct currency formatting for large amounts
docs(readme): update setup instructions
style(css): standardize spacing variables
refactor(main): extract PIN entry into separate module
perf(rendering): optimize transaction list rendering
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] Self-reviewed the code changes
- [ ] Added/updated documentation as needed
- [ ] No console errors or warnings
- [ ] Tested on multiple screen sizes (mobile, tablet, desktop)
- [ ] Tested on Chrome, Firefox, and Edge browsers
- [ ] All existing features still work correctly

### PR Title Format

Follow the same convention as commits:

```
feat(scope): description of changes
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Screenshots (if applicable)
Add screenshots showing the changes.

## Testing Done
Describe how you tested your changes.

## Checklist
- [ ] My code follows the coding standards
- [ ] I have performed a self-review
- [ ] I have tested on mobile viewport
- [ ] I have updated documentation
```

### Review Process

1. At least **1 team member** must approve the PR
2. All CI checks must pass
3. No merge conflicts with `main`
4. Team lead approval required for architectural changes

---

## 🐛 Issue Guidelines

### Bug Reports

Use the following template:

```markdown
**Bug Description:** Clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:** What should happen

**Actual Behavior:** What actually happens

**Screenshots:** If applicable

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Screen Size: 375x812
```

### Feature Requests

```markdown
**Feature Description:** Clear description of the proposed feature

**Use Case:** Why is this feature needed?

**Proposed Solution:** How should it work?

**Alternatives Considered:** Other approaches evaluated

**Additional Context:** Any mockups, screenshots, or references
```

---

## 🌿 Branch Strategy

```
main
  └── develop
        ├── feature/send-money-enhancement
        ├── feature/biometric-login
        ├── fix/balance-display-bug
        └── hotfix/security-patch
```

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready code | - |
| `develop` | Integration branch | `main` |
| `feature/*` | New features | `develop` |
| `fix/*` | Bug fixes | `develop` |
| `hotfix/*` | Critical production fixes | `main` + `develop` |

---

## ❓ Questions?

If you have questions about contributing, feel free to:

1. Open a GitHub Discussion
2. Reach out to the team lead
3. Check existing issues and PRs

Thank you for contributing to uPay! 🙏
