# ArthaAtlas P2P — Architectural Specification

## 1. Executive Summary & Design Philosophy
**ArthaAtlas P2P** is an independent, non-commercial educational and quantitative research platform analyzing the Indian Peer-to-Peer (NBFC-P2P) lending landscape.

Unlike commercial aggregator portals or platform-sponsored blogs that market P2P loans as high-yield "alternative fixed deposits" with "12-14% assured returns," ArthaAtlas P2P models P2P lending strictly as **unsecured, high-risk consumer credit**.

The architecture adheres to three core design principles:
1. **Zero-Backend Statically Generated Architecture**: Hosted entirely on GitHub Pages without a dynamic server, databases, or third-party cookies.
2. **Zero-Knowledge Client-Side Financial Computing**: All calculators execute in-browser via TypeScript, ensuring zero user financial data ever leaves the local device.
3. **Evidence-Based Quantitative Rigor**: Every article, formula, and calculator derives from primary statutory sources (RBI Master Directions 2017 & August 2024 amendments, Income Tax Act 1961, and credit bureau data structures).

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Astro SSG | `^5.4.2` | Ultra-fast static site generation with content collections |
| **Language** | TypeScript | `^5.7.0` | Strict typing for financial formulas, schemas, and components |
| **UI Components** | React Islands | `^19.0.0` | Client-hydrated interactive financial calculators |
| **Styling** | Tailwind CSS | `^3.4.17` | Responsive editorial design system (Dark & Light themes) |
| **Math Typesetting** | KaTeX + remark-math | Latest | High-fidelity mathematical rendering of credit & yield equations |
| **Diagrams** | Mermaid.js | Native SVG | Workflow, escrow architecture, and legal remedy flowcharts |
| **Search Engine** | Pagefind | `^1.5.2` | WebAssembly-powered static full-text search with zero network hops |
| **Testing** | Vitest | `^3.0.0` | High-precision numerical unit testing of financial calculations |

---

## 3. Directory Structure

```
artha-atlas-p2p/
├── .github/
│   └── workflows/
│       ├── deploy.yml             # GitHub Pages deployment pipeline
│       ├── quality.yml            # CI test & schema verification gates
│       └── generate-articles.yml  # Scheduled AI roadmap article generator
├── public/
│   ├── favicon.svg                # Emerald & Navy geometric logo
│   └── robots.txt                 # Search engine crawling directives
├── scripts/
│   ├── build.mjs                  # Build runner + Pagefind indexer + Windows lock handler
│   ├── validate-content.mjs       # Comprehensive MDX schema & link validation
│   └── generate-scheduled-article.mjs # Roadmap automation script
├── src/
│   ├── components/
│   │   ├── calculators/           # 7 Interactive React financial tools
│   │   │   ├── LoanAmortisationCalculator.tsx
│   │   │   ├── RealisedYieldCalculator.tsx
│   │   │   ├── XirrCalculator.tsx
│   │   │   ├── CreditLossStressCalculator.tsx
│   │   │   ├── P2PTaxCalculator.tsx
│   │   │   ├── PortfolioConcentrationCalculator.tsx
│   │   │   └── InvestmentComparisonCalculator.tsx
│   │   ├── layout/                # Base layout, Header, Footer
│   │   └── search/                # Pagefind SearchModal component
│   ├── content/
│   │   └── articles/              # 100 Comprehensive MDX research articles
│   │       ├── p2p-fundamentals/
│   │       ├── rbi-regulation/
│   │       ├── credit-risk/
│   │       ├── returns-and-fees/
│   │       ├── defaults-and-recoveries/
│   │       ├── portfolio-analytics/
│   │       ├── taxation/
│   │       ├── platform-research/
│   │       ├── compare-investments/
│   │       └── investor-behaviour/
│   ├── data/
│   │   ├── sources.ts             # Central statutory source register
│   │   ├── taxonomy.ts            # Thematic research taxonomy
│   │   └── roadmap.ts             # 310-topic editorial roadmap
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Master HTML wrapper with SEO & dark mode
│   │   └── ArticleLayout.astro    # Long-form reading layout with sidebar & TOC
│   ├── lib/
│   │   ├── finance/               # Core financial math library (tested)
│   │   │   ├── amortisation.ts
│   │   │   ├── xirr.ts
│   │   │   ├── yield.ts
│   │   │   ├── credit-risk.ts
│   │   │   ├── concentration.ts
│   │   │   ├── comparison.ts
│   │   │   └── finance.test.ts
│   │   ├── taxation/
│   │   │   └── p2p-tax.ts         # Indian Income Tax Act calculator
│   │   └── urls.ts                # Base URL path formatting helper
│   ├── pages/                     # 14 Static routes + dynamic MDX router
│   └── styles/
│       └── global.css             # Tailwind directives & typography
├── docs/                          # Comprehensive technical documentation
├── astro.config.mjs               # Astro configuration with GitHub Pages subpath
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Key Architectural Subsystems

### 4.1 Content Architecture & Validation Pipeline
All 100 articles are managed as Astro Content Collections in `src/content/articles/` with a rigorous Zod schema:
- Strict frontmatter: `title`, `description`, `summary`, `pubDate`, `updatedDate`, `author`, `series`, `tags`, `readingTime`, `sources`, `draft`.
- Markdown parser with Math plugin support (`remark-math`, `rehype-katex`).
- Standalone validator script (`npm run validate:content`) ensuring:
  1. Title and description length standards for SEO.
  2. Matching series IDs against `src/data/taxonomy.ts`.
  3. Every cited source ID exists in `src/data/sources.ts`.
  4. Complete absence of unescaped MDX syntax errors.

### 4.2 Financial Calculation Engine
Located in `src/lib/finance/`, this decoupled pure TypeScript library has **100% unit test coverage** via Vitest:
- **Newton-Raphson XIRR Solver**: Handles irregular dates, partial years, and non-convergent cash flows with bisection fallback.
- **Reducing-Balance vs. Flat Rate APR**: Mathematically derives the hidden ~1.85x cost multiplier in flat-rate loans.
- **Expected Credit Loss (ECL)**: Computes $ECL = \sum PD_i \times LGD_i \times EAD_i$ and discount-adjusted recoveries.
- **Statutory Limits & Concentration**: Enforces RBI's ₹50,000 single-borrower cap and ₹50,00,000 aggregate lender ceiling, calculating Herfindahl-Hirschman Index (HHI) and $N_\text{eff}$.

### 4.3 Static Search (Pagefind)
Search operates completely client-side without external cloud indexing services:
- During build, Pagefind analyzes all generated static HTML files.
- Generates chunked WebAssembly search indexes under `dist/pagefind/`.
- Search queries load lightweight index shards on demand, achieving sub-10ms keyword lookups across all 100 articles and 14 research hubs.
