# Testing & Quality Verification Suite

## 1. Test Architecture Overview

ArthaAtlas P2P enforces three levels of quality verification before any build can be published:
1. **Financial Formula Unit Tests**: Vitest suite covering loan amortisation, reducing vs. flat rate derivations, XIRR convergence, expected credit losses, and statutory concentration limits.
2. **Content Schema & Link Validation**: Node.js script verifying frontmatter integrity, source citations, and MDX syntax across all 100 articles.
3. **Build & Search Indexing Verification**: Production build runner executing Astro static compilation and Pagefind WebAssembly indexing.

---

## 2. Running Test Commands

### 2.1 Financial Formula Tests
Run the Vitest test runner:
```bash
npm run test:unit
```
**Test Coverage**:
- Reducing balance EMI schedules and flat-to-reducing APR conversions.
- XIRR root finding with Newton-Raphson and fallback handling for non-convergent irregular cash flows.
- Expected Credit Loss ($PD \times LGD \times EAD$) and recovery discounting.
- RBI Master Direction statutory limits (₹50k single borrower, ₹50L aggregate lender, ₹10L CA net worth certificate threshold).
- Investment comparative returns and Fisher inflation-adjusted real returns.

### 2.2 Content Validation
Verify all 100 MDX articles against schema rules:
```bash
npm run validate:content
```
**Validation Criteria**:
- Title character length (20 - 100 characters).
- Series ID matching `src/data/taxonomy.ts`.
- Valid source IDs resolving to `src/data/sources.ts`.
- Unescaped syntax check preventing JSX compilation errors.

### 2.3 Full Production Build & Pagefind Indexing
```bash
node scripts/build.mjs
```
Generates all 122 static HTML pages under `dist/` and compiles the static WebAssembly search database in `dist/pagefind/`.
