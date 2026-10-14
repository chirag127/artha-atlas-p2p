# ArthaAtlas P2P — India's Comprehensive Peer-to-Peer Lending Research & Analytics Platform

> **Beyond Interest Rates. Understand Credit Risk.**  
> *An independent educational research platform covering Indian peer-to-peer (NBFC-P2P) lending, RBI regulation, credit underwriting, portfolio returns, borrower defaults, recoveries, taxation, risk analysis, and quantitative lending calculators.*

---

## 1. Project Overview & Identity

- **Official Website Name**: ArthaAtlas P2P
- **Brand Family**: ArthaAtlas India
- **Repository**: [`chirag127/artha-atlas-p2p`](https://github.com/chirag127/artha-atlas-p2p)
- **Live Deployment URL**: [https://chirag127.github.io/artha-atlas-p2p/](https://chirag127.github.io/artha-atlas-p2p/)
- **Author**: Chirag Singhal
- **Contact Email**: [chirag@oriz.in](mailto:chirag@oriz.in)
- **Facebook / Social Handle**: [singhal127](https://facebook.com/singhal127)
- **Support the Research**: [buymeacoffee.com/chirag127](https://buymeacoffee.com/chirag127)

---

## 2. Core Highlights & Platform Features

- **100 Comprehensive Researched Articles**: Complete initial editorial library organized into 10 thematic research series, complete with worked INR examples, LaTeX equations, Mermaid diagrams, and source citations.
- **310-Topic Editorial Roadmap**: Transparent curriculum detailing 100 published articles and 210 future planned research topics with priority ratings and complexity tiers.
- **7 Client-Side Interactive Calculators**:
  1. **Loan Amortisation**: Reducing-balance EMI schedules vs. flat-rate APR breakdown.
  2. **Realised Yield Engine**: Models gross contractual interest minus fees, defaults, cash drag, and income tax.
  3. **Dated Cash Flow Portfolio XIRR**: Newton-Raphson solver for irregular deposits, repayments, and recoveries.
  4. **Credit Loss Stress Testing**: Computes Expected Credit Loss ($ECL = PD \times LGD \times EAD$) and break-even default thresholds.
  5. **Indian P2P Tax Calculator**: Simulates Section 56(2) IFOS tax, Section 57(iii) fee deductions, and alerts users to the Section 36(1)(vii) "Asymmetric Tax Trap".
  6. **Portfolio Concentration & HHI**: Checks RBI's statutory limits (₹50k single borrower, ₹50L aggregate lender, ₹10L CA net worth certificate threshold) and calculates effective borrower count ($N_\text{eff}$).
  7. **Cross-Asset Comparative Matrix**: Side-by-side comparison with Bank FDs, Corporate Bonds, Debt Mutual Funds, T-Bills, and REITs.
- **Statutory Source Register**: Every article references primary statutory instruments, including the RBI Master Directions (2017 & August 16, 2024 circular), Income Tax Act 1961, and DICGC Act.
- **Pagefind Static Full-Text Search**: Instant client-side search across all 122 pages via WebAssembly with zero external dependencies.
- **Fully Responsive Theme**: Premium navy, emerald, and subtle gold design system with automatic light/dark mode and manual toggle.

---

## 3. Technology Stack

- **Framework**: Astro 5.4 (Static Site Generation)
- **Language**: TypeScript 5.7 (Strict mode enabled)
- **UI Islands**: React 19 (Hydrated only for interactive calculators)
- **Styling**: Tailwind CSS 3.4 with custom typography and dark mode support
- **Math Engine**: KaTeX & remark-math
- **Visualizations**: Mermaid.js SVG flowcharts
- **Search**: Pagefind 1.5 WebAssembly static indexer
- **Testing**: Vitest 3.0 (15/15 unit tests passing)
- **Hosting**: GitHub Pages (Zero ongoing hosting costs, zero backend database)

---

## 4. Getting Started & Local Development

### Prerequisites
- Node.js `^20.0.0` or higher
- npm `^10.0.0` or higher

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/chirag127/artha-atlas-p2p.git
cd artha-atlas-p2p
npm install
```

### Development Server
Launch the Astro development server at `http://localhost:4321/artha-atlas-p2p/`:
```bash
npm run dev
```

### Financial Formula Unit Tests
Run the Vitest test suite to verify financial calculations:
```bash
npm run test:unit
```

### Content Validation
Verify all 100 articles against the Zod schema and check source citations:
```bash
npm run validate:content
```

### Production Build & Search Indexing
Compile all 122 static HTML pages and generate the Pagefind search index:
```bash
npm run build
```
The output is generated in `./dist/` ready for static deployment.

---

## 5. Automated GitHub Workflows

The repository includes three production-ready GitHub Actions workflows in `.github/workflows/`:

1. **`deploy.yml`** (Automatic GitHub Pages Deployment):
   - Triggers on every push to `main`.
   - Runs unit tests and content validation gates.
   - Builds static site and compiles the Pagefind search index.
   - Deploys static build artifact directly to GitHub Pages.

2. **`quality.yml`** (CI Quality Gate):
   - Runs on all Pull Requests.
   - Verifies unit tests and content schema integrity before merging.

3. **`generate-articles.yml`** (Scheduled AI Article Generator):
   - Automated workflow for continuing generation of the remaining 210 topics on the roadmap.
   - Operates with strict safety filters: tax and regulatory topics require manual PR approval by default.
   - Uses the official Google Gemini API (requires `GEMINI_API_KEY` GitHub repository secret).

---

## 6. How to Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/chirag127/artha-atlas-p2p`
2. Open **Settings** > **Pages**
3. Under **Build and deployment** > **Source**, select **GitHub Actions**
4. Push your commits to `main`. The deployment workflow will run and deploy the site to:
   **`https://chirag127.github.io/artha-atlas-p2p/`**

---

## 7. Documentation Index

For in-depth technical and financial methodologies, refer to the `docs/` directory:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Technical architecture, directory structure, and design decisions.
- [`docs/REGULATORY_RESEARCH.md`](docs/REGULATORY_RESEARCH.md) — Analysis of RBI Master Directions 2017 & August 16, 2024 circular.
- [`docs/TAXATION.md`](docs/TAXATION.md) — Comprehensive Indian tax guide (Sec 56(2), Sec 57(iii), and the Sec 36(1)(vii) Asymmetric Tax Trap).
- [`docs/DATA_METHODOLOGY.md`](docs/DATA_METHODOLOGY.md) — Formula specifications for EMI, ECL, XIRR, and HHI.
- [`docs/AI_PUBLISHING.md`](docs/AI_PUBLISHING.md) — Governance rules and setup for continuous AI article generation.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — GitHub Pages configuration and custom domain setup.
- [`docs/TESTING.md`](docs/TESTING.md) — Unit testing commands and validation criteria.
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) — Editorial guidelines and frontmatter schema.

---

## 8. Important Statutory Risk Disclosure

> **LEGAL AND REGULATORY RISK WARNING**:
>
> 1. **Unsecured Credit Risk**: Peer-to-Peer lending is an **unsecured investment**. Unlike bank fixed deposits which are insured up to ₹5,00,000 by the Deposit Insurance and Credit Guarantee Corporation (DICGC), **P2P loans carry zero deposit insurance or capital protection**.
> 2. **No First-Loss Default Guarantee (FLDG)**: In accordance with RBI Master Directions updated as of August 16, 2024, NBFC-P2P platforms are strictly prohibited from providing any credit guarantees, FLDGs, or capital protection schemes.
> 3. **Asymmetric Tax Impact**: Under Section 56(2) of the Income Tax Act, 1961, gross interest is taxable at your marginal slab rate. Individual lenders generally **cannot deduct capital losses from defaulted loans** against interest income under Section 57.
> 4. **No Liquidity Guarantees**: Platforms are prohibited from operating pooled early-exit funds. Capital cannot be withdrawn until borrowers complete scheduled repayments.
> 5. **Educational Disclaimer**: ArthaAtlas P2P is an independent educational publication. Nothing published on this website constitutes financial advice, credit rating endorsement, or tax counseling. Consult a SEBI-registered Investment Adviser (RIA) or Chartered Accountant (CA) before investing.

---

## 9. Author & Support

- **Researched & Engineered by**: Chirag Singhal
- **Email**: [chirag@oriz.in](mailto:chirag@oriz.in)
- **Support Independent Research**: [Buy Me a Coffee](https://buymeacoffee.com/chirag127)
- **License**: Content & Code published for open educational research.
