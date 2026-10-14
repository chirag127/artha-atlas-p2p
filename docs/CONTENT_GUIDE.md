# Editorial Content Guide & Standards

## 1. Editorial Voice & Mission
ArthaAtlas P2P is an **independent, analytical, and educational publication**. We do not market P2P loans, earn referral commissions from NBFC-P2P platforms, or promise guaranteed returns.

### Core Editorial Rules
1. **Never use promotional language**: Avoid phrases like "High-yield passive income", "Safe alternative to FDs", or "Guaranteed 12% returns".
2. **Always model credit risk**: P2P lending is unsecured consumer and small business lending. Borrowers can and do default.
3. **Clarify interest vs. return**: Always distinguish nominal contractual interest from net realised yield after defaults, platform fees, cash drag, and income tax.
4. **Cite primary sources**: Every assertion regarding RBI regulations, tax provisions, or credit reporting must cite official statutory instruments.

---

## 2. Article Frontmatter Schema

Every research article in `src/content/articles/` is an `.mdx` file structured as follows:

```yaml
---
title: "The Mechanics of Loan Amortisation in P2P Lending"
description: "Comprehensive mathematical guide comparing reducing-balance EMI schedules against flat-rate loan offers in Indian P2P marketplaces."
summary: "Understand how principal amortisation works, why flat rates hide nearly double the borrowing cost, and how monthly repayments impact lender reinvestment."
pubDate: 2026-10-14
updatedDate: 2026-10-14
author: "Chirag Singhal"
series: "returns-and-fees"
tags: ["Amortisation", "EMI", "Flat Rate", "APR", "Yield"]
readingTime: "10 min read"
sources: ["rbi-md-2017", "rbi-circular-2024"]
draft: false
---
```

---

## 3. Supported Rich Elements
- **LaTeX Math Equations**: Standard LaTeX expressions enclosed in `$...$` (inline) or `$$...$$` (block) rendered natively by KaTeX.
- **Mermaid Diagrams**: Visual flowcharts illustrating loan lifecycles, escrow flows, and collections procedures.
- **Interactive Calculators**: Interactive React components that allow readers to experiment with formulas in real-time.
- **Tax & Regulatory Callouts**: Styled blockquotes highlighting critical legal nuances.
