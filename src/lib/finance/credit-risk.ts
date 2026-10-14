/**
 * Credit Risk and Default Engine
 * Expected Credit Loss (ECL = PD * LGD * EAD), Break-even default rates,
 * recovery delay discounting, and delinquency stress testing.
 */

export interface LoanExposure {
  loanId: string;
  ead: number; // Exposure at Default (Outstanding balance)
  pd: number;  // Probability of default (0 to 1)
  lgd: number; // Loss given default (0 to 1, where 1 - recoveryRate)
}

export interface PortfolioRiskSummary {
  totalExposure: number;
  expectedCreditLoss: number;
  expectedCreditLossPercentage: number;
  worstCaseLoss: number; // 100% default with 0% recovery
  breakEvenDefaultRateZeroReturn: number;
  breakEvenDefaultRateFdBenchmark: number; // compared to ~7.0% risk-free rate
}

export interface RecoveryScenario {
  nominalDefaultAmount: number;
  recoveryRatePercentage: number;
  recoveryDelayMonths: number;
  discountRatePercentage: number; // Opportunity cost during delay
  grossNominalRecovery: number;
  presentValueOfRecovery: number;
  timingLossFromDelay: number;
  economicLossGivenDefault: number;
}

/**
 * Calculates Expected Credit Loss for a single loan: ECL = PD * LGD * EAD
 */
export function calculateSingleLoanECL(ead: number, pdPercentage: number, lgdPercentage: number): number {
  const pd = pdPercentage / 100;
  const lgd = lgdPercentage / 100;
  return Math.round(ead * pd * lgd * 100) / 100;
}

/**
 * Calculates Portfolio-wide Expected Credit Loss and Stress Scenarios.
 */
export function calculatePortfolioRisk(
  totalPortfolio: number,
  contractualRatePercentage: number,
  averagePdPercentage: number,
  averageRecoveryPercentage: number,
  platformFeePercentage: number = 1.0,
  fdBenchmarkPercentage: number = 7.0
): PortfolioRiskSummary {
  const pd = averagePdPercentage / 100;
  const recovery = averageRecoveryPercentage / 100;
  const lgd = 1 - recovery;
  const rc = contractualRatePercentage / 100;
  const fee = platformFeePercentage / 100;
  const rBenchmark = fdBenchmarkPercentage / 100;

  const expectedCreditLoss = totalPortfolio * pd * lgd;
  const expectedCreditLossPercentage = pd * lgd * 100;

  // Break-even formula for Zero Return:
  // (1 - PD) * rc - PD * (1 - recovery) - fee = 0
  // rc - PD * rc - PD * lgd - fee = 0
  // PD * (rc + lgd) = rc - fee
  // PD* = (rc - fee) / (rc + lgd)
  let breakEvenZero = 0;
  if (rc + lgd > 0) {
    breakEvenZero = Math.max(0, Math.min(100, ((rc - fee) / (rc + lgd)) * 100));
  }

  // Break-even for matching Fixed Deposit:
  // (1 - PD) * rc - PD * lgd - fee = rBenchmark
  // PD * (rc + lgd) = rc - fee - rBenchmark
  let breakEvenFd = 0;
  if (rc + lgd > 0) {
    breakEvenFd = Math.max(0, Math.min(100, ((rc - fee - rBenchmark) / (rc + lgd)) * 100));
  }

  return {
    totalExposure: totalPortfolio,
    expectedCreditLoss: Math.round(expectedCreditLoss * 100) / 100,
    expectedCreditLossPercentage: Math.round(expectedCreditLossPercentage * 100) / 100,
    worstCaseLoss: totalPortfolio,
    breakEvenDefaultRateZeroReturn: Math.round(breakEvenZero * 100) / 100,
    breakEvenDefaultRateFdBenchmark: Math.round(breakEvenFd * 100) / 100,
  };
}

/**
 * Evaluates the financial impact of recovery delays (time value of money on recoveries).
 */
export function calculateDelayedRecovery(
  defaultAmount: number,
  recoveryRatePercentage: number,
  delayMonths: number,
  discountRatePercentage: number = 10.0
): RecoveryScenario {
  const recoveryFraction = recoveryRatePercentage / 100;
  const grossNominalRecovery = defaultAmount * recoveryFraction;

  const years = delayMonths / 12;
  const discountRate = discountRatePercentage / 100;
  const discountFactor = Math.pow(1 + discountRate, years);

  const presentValueOfRecovery = grossNominalRecovery / discountFactor;
  const timingLossFromDelay = grossNominalRecovery - presentValueOfRecovery;
  const economicLossGivenDefault = defaultAmount - presentValueOfRecovery;

  return {
    nominalDefaultAmount: defaultAmount,
    recoveryRatePercentage,
    recoveryDelayMonths: delayMonths,
    discountRatePercentage,
    grossNominalRecovery: Math.round(grossNominalRecovery * 100) / 100,
    presentValueOfRecovery: Math.round(presentValueOfRecovery * 100) / 100,
    timingLossFromDelay: Math.round(timingLossFromDelay * 100) / 100,
    economicLossGivenDefault: Math.round(economicLossGivenDefault * 100) / 100,
  };
}
