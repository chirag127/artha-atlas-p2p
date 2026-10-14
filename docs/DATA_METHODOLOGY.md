# Data Methodology & Quantitative Research Standards

## 1. Research Principles & Primary Sources
All quantitative metrics, legal guidelines, and financial calculations published on ArthaAtlas P2P adhere to the following principles:

1. **Hierarchy of Evidence**:
   - Level 1: Primary statutory legal texts (Acts of Parliament, RBI Master Directions, Notifications, CBDT Circulars).
   - Level 2: Official regulatory inspection reports and quarterly monetary policy disclosures.
   - Level 3: Audited financial statements and regulatory public disclosures submitted by registered NBFC-P2P entities.
   - Level 4: Academic credit risk literature and standardized financial math conventions (Mishkin, Hull, Basel Committee).
   - Disregarded: Promotional platform marketing materials, affiliate blog posts, and unverified social media claims.

2. **No Fabricated Yields**:
   - ArthaAtlas P2P never advertises or publishes synthetic performance rankings.
   - When interactive calculators compute portfolio yields, they explicitly state all input assumptions (e.g. "Assuming 4.5% annual default rate and 30-day recovery lag").

---

## 2. Core Quantitative Formulas

### 2.1 Loan Amortisation (Reducing Balance vs. Flat Rate)
For reducing balance loans, the Monthly Equated Instalment ($EMI$) is calculated using the standard annuity formula:
$$EMI = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$
Where:
- $P$ = Principal loan amount
- $r$ = Monthly interest rate ($\text{Annual Rate} / 12$)
- $n$ = Loan tenure in months

**Flat-Rate Distortion**:
When a platform quotes a "flat rate" $r_\text{flat}$, the borrower pays:
$$EMI_\text{flat} = \frac{P + (P \times r_\text{flat} \times \frac{n}{12})}{n}$$
Because the principal is repaid progressively each month while interest is charged on the initial principal throughout, the true Reducing Balance APR is approximately:
$$APR \approx 1.85 \times r_\text{flat}$$

---

### 2.2 Expected Credit Loss (ECL)
$$ECL = \sum_{i=1}^N PD_i \times LGD_i \times EAD_i$$
Where:
- $PD$ = Probability of Default
- $LGD$ = Loss Given Default ($1 - \text{Recovery Rate}$)
- $EAD$ = Exposure at Default (Outstanding Principal)

---

### 2.3 Portfolio XIRR (Extended Internal Rate of Return)
XIRR is calculated by numerically solving for the annual rate $r$ that sets the net present value of all irregular cash flows to zero:
$$\sum_{j=0}^M \frac{CF_j}{(1+r)^{(d_j - d_0)/365}} = 0$$
Where:
- $CF_j$ = Cash flow at date $d_j$ (negative for investments, positive for repayments/recoveries)
- $d_0$ = Date of initial investment
- Solver Method: High-precision Newton-Raphson iteration with bisection fallback.

---

### 2.4 Concentration Risk: Herfindahl-Hirschman Index (HHI)
$$HHI = \sum_{i=1}^N w_i^2$$
Where $w_i = \frac{EAD_i}{\sum EAD}$ is the percentage exposure to borrower $i$.

The **Effective Number of Independent Borrowers** ($N_\text{eff}$) is defined as:
$$N_\text{eff} = \frac{1}{HHI} = \frac{1}{\sum_{i=1}^N w_i^2}$$
For a perfectly equally weighted portfolio of $N$ loans, $N_\text{eff} = N$. In unevenly distributed portfolios, $N_\text{eff} \ll N$.
