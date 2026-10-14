/**
 * Portfolio Concentration and Risk Budgeting Engine
 * Computes RBI regulatory compliance, Herfindahl-Hirschman Index (HHI),
 * Effective Number of Borrowers (N_eff), and correlated stress scenarios.
 */

export interface BorrowerExposureInput {
  borrowerId: string;
  amount: number;
  riskGrade?: string;
  employmentType?: string;
}

export interface ConcentrationMetrics {
  totalPortfolio: number;
  borrowerCount: number;
  maxBorrowerExposure: number;
  maxBorrowerPercentage: number;
  top5ExposurePercentage: number;
  top10ExposurePercentage: number;
  hhi: number; // 0 to 1
  effectiveBorrowers: number; // 1 / HHI
  isCompliantWithRbiSingleBorrowerCap: boolean; // RBI limit: max ₹50,000
  isCompliantWithRbiAggregateLenderCap: boolean; // RBI limit: max ₹50,00,000
  requiresNetWorthCertificate: boolean; // Over ₹10 Lakh requires CA net worth certificate
  regulatoryViolations: string[];
}

export const RBI_REGULATORY_LIMITS = {
  MAX_SINGLE_BORROWER_EXPOSURE_INR: 50_000,
  MAX_AGGREGATE_LENDER_EXPOSURE_INR: 50_00_000,
  NET_WORTH_CERT_THRESHOLD_INR: 10_00_000,
  MAX_BORROWER_AGGREGATE_LOAN_INR: 10_00_000,
  MAX_LOAN_TENURE_MONTHS: 36,
};

export function analyzeConcentration(exposures: BorrowerExposureInput[]): ConcentrationMetrics {
  if (!exposures || exposures.length === 0) {
    return {
      totalPortfolio: 0,
      borrowerCount: 0,
      maxBorrowerExposure: 0,
      maxBorrowerPercentage: 0,
      top5ExposurePercentage: 0,
      top10ExposurePercentage: 0,
      hhi: 0,
      effectiveBorrowers: 0,
      isCompliantWithRbiSingleBorrowerCap: true,
      isCompliantWithRbiAggregateLenderCap: true,
      requiresNetWorthCertificate: false,
      regulatoryViolations: [],
    };
  }

  const sorted = [...exposures].sort((a, b) => b.amount - a.amount);
  const totalPortfolio = sorted.reduce((sum, item) => sum + item.amount, 0);

  const violations: string[] = [];
  let isCompliantSingle = true;
  let isCompliantAggregate = true;

  if (totalPortfolio > RBI_REGULATORY_LIMITS.MAX_AGGREGATE_LENDER_EXPOSURE_INR) {
    isCompliantAggregate = false;
    violations.push(
      `Total portfolio of ₹${totalPortfolio.toLocaleString('en-IN')} exceeds RBI aggregate lending cap of ₹50,00,000 across all NBFC-P2P platforms.`
    );
  }

  const requiresNetWorthCertificate = totalPortfolio > RBI_REGULATORY_LIMITS.NET_WORTH_CERT_THRESHOLD_INR;

  const maxBorrowerExposure = sorted[0].amount;
  const maxBorrowerPercentage = (maxBorrowerExposure / totalPortfolio) * 100;

  if (maxBorrowerExposure > RBI_REGULATORY_LIMITS.MAX_SINGLE_BORROWER_EXPOSURE_INR) {
    isCompliantSingle = false;
    violations.push(
      `Largest borrower exposure of ₹${maxBorrowerExposure.toLocaleString('en-IN')} exceeds the statutory RBI ceiling of ₹50,000 per borrower.`
    );
  }

  // Top 5 and Top 10 weights
  const top5Total = sorted.slice(0, 5).reduce((sum, item) => sum + item.amount, 0);
  const top10Total = sorted.slice(0, 10).reduce((sum, item) => sum + item.amount, 0);

  const top5ExposurePercentage = (top5Total / totalPortfolio) * 100;
  const top10ExposurePercentage = (top10Total / totalPortfolio) * 100;

  // Herfindahl-Hirschman Index: sum(w_i^2)
  let sumSquaredWeights = 0;
  for (const item of sorted) {
    const weight = item.amount / totalPortfolio;
    sumSquaredWeights += weight * weight;
  }

  const hhi = Math.round(sumSquaredWeights * 10000) / 10000;
  // Effective number of equal borrowers = 1 / HHI
  const effectiveBorrowers = hhi > 0 ? Math.round((1 / hhi) * 10) / 10 : 0;

  return {
    totalPortfolio: Math.round(totalPortfolio * 100) / 100,
    borrowerCount: sorted.length,
    maxBorrowerExposure: Math.round(maxBorrowerExposure * 100) / 100,
    maxBorrowerPercentage: Math.round(maxBorrowerPercentage * 100) / 100,
    top5ExposurePercentage: Math.round(top5ExposurePercentage * 100) / 100,
    top10ExposurePercentage: Math.round(top10ExposurePercentage * 100) / 100,
    hhi,
    effectiveBorrowers,
    isCompliantWithRbiSingleBorrowerCap: isCompliantSingle,
    isCompliantWithRbiAggregateLenderCap: isCompliantAggregate,
    requiresNetWorthCertificate,
    regulatoryViolations: violations,
  };
}
