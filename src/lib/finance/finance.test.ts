import { describe, it, expect } from 'vitest';
import {
  calculateReducingAmortisation,
  calculateFlatRateLoan,
  calculateXIRR,
  calculateRealisedYield,
  calculateSingleLoanECL,
  calculatePortfolioRisk,
  calculateDelayedRecovery,
  analyzeConcentration,
  calculateP2PTax,
  compareP2PWithAsset,
  RBI_REGULATORY_LIMITS,
} from './index';

describe('Financial Calculation Engine: Amortisation', () => {
  it('should accurately calculate standard reducing-balance EMI', () => {
    // Principal: ₹1,00,000, 12% p.a., 12 months
    const result = calculateReducingAmortisation(100_000, 12, 12);
    // EMI for 1L @ 12% for 1 yr = ~8884.88
    expect(result.monthlyPayment).toBeCloseTo(8884.88, 1);
    expect(result.totalPayment).toBeCloseTo(106618.55, 0);
    expect(result.schedule.length).toBe(12);
    expect(result.schedule[11].endingBalance).toBe(0);
  });

  it('should handle zero interest gracefully', () => {
    const result = calculateReducingAmortisation(12_000, 0, 12);
    expect(result.monthlyPayment).toBe(1000);
    expect(result.totalInterest).toBe(0);
    expect(result.schedule[11].endingBalance).toBe(0);
  });

  it('should prove Flat Rate loans cost roughly 1.8x the nominal rate in reducing terms', () => {
    // A 10% flat rate for 12 months translates to ~17.9% reducing balance
    const flatResult = calculateFlatRateLoan(100_000, 10, 12);
    expect(flatResult.totalInterest).toBe(10_000);
    expect(flatResult.equivalentReducingRate).toBeGreaterThan(17);
    expect(flatResult.equivalentReducingRate).toBeLessThan(19);
  });
});

describe('Financial Calculation Engine: XIRR', () => {
  it('should calculate correct XIRR for standard annual investment', () => {
    // Invest 100 on Jan 1 2024, receive 112 on Jan 1 2025 -> 12%
    const cashFlows = [
      { date: '2024-01-01', amount: -100 },
      { date: '2025-01-01', amount: 112 },
    ];
    const result = calculateXIRR(cashFlows);
    expect(result.success).toBe(true);
    expect(result.rate).toBeCloseTo(11.97, 1); // 2024 was leap year (366 days)
  });

  it('should reject cash flows without negative or positive flows', () => {
    const invalidFlows = [
      { date: '2024-01-01', amount: 100 },
      { date: '2025-01-01', amount: 112 },
    ];
    const result = calculateXIRR(invalidFlows);
    expect(result.success).toBe(false);
    expect(result.message).toContain('at least one positive and one negative');
  });
});

describe('Financial Calculation Engine: Yield & Cash Drag', () => {
  it('should compute fee, default, and cash drag erosion from gross yield', () => {
    const analysis = calculateRealisedYield({
      capitalInvested: 500_000,
      contractualAnnualRate: 14.0,
      platformFeePercentage: 1.5,
      defaultRatePercentage: 4.0,
      recoveryRatePercentage: 25.0, // LGD = 75%, Net credit loss = 4% * 75% = 3.0%
      idleCashPercentage: 10.0, // 10% idle
      inflationRatePercentage: 5.0,
    });

    expect(analysis.contractualGrossYield).toBe(14.0);
    expect(analysis.feeErosionPercentage).toBe(1.5);
    // Deployed is 90%, default erosion = 3.0% * 0.9 = 2.7%
    expect(analysis.defaultErosionPercentage).toBeCloseTo(2.7, 1);
    expect(analysis.realisedNetYield).toBeLessThan(10.0);
    expect(analysis.realReturnAfterInflation).toBeLessThan(analysis.realisedNetYield);
  });
});

describe('Financial Calculation Engine: Credit Risk & ECL', () => {
  it('should compute single loan ECL: PD * LGD * EAD', () => {
    // EAD = 50,000, PD = 5%, LGD = 80% (Recovery = 20%) -> ECL = 50000 * 0.05 * 0.8 = 2000
    const ecl = calculateSingleLoanECL(50_000, 5.0, 80.0);
    expect(ecl).toBe(2000);
  });

  it('should calculate break-even default rates', () => {
    const risk = calculatePortfolioRisk(1_000_000, 14.0, 3.0, 20.0, 1.0, 7.0);
    expect(risk.expectedCreditLossPercentage).toBeCloseTo(2.4, 1);
    expect(risk.breakEvenDefaultRateZeroReturn).toBeGreaterThan(10);
    expect(risk.breakEvenDefaultRateFdBenchmark).toBeLessThan(risk.breakEvenDefaultRateZeroReturn);
  });

  it('should discount delayed recoveries for time value of money', () => {
    const recovery = calculateDelayedRecovery(10_000, 50.0, 24, 10.0); // 50% recovery delayed by 2 years
    expect(recovery.grossNominalRecovery).toBe(5000);
    // Present value = 5000 / (1.1)^2 = 4132.23
    expect(recovery.presentValueOfRecovery).toBeCloseTo(4132.23, 1);
    expect(recovery.timingLossFromDelay).toBeGreaterThan(800);
  });
});

describe('Financial Calculation Engine: Portfolio Concentration', () => {
  it('should detect violations of RBI ₹50,000 single borrower cap', () => {
    const exposures = [
      { borrowerId: 'B1', amount: 60_000 },
      { borrowerId: 'B2', amount: 20_000 },
    ];
    const metrics = analyzeConcentration(exposures);
    expect(metrics.isCompliantWithRbiSingleBorrowerCap).toBe(false);
    expect(metrics.regulatoryViolations.length).toBeGreaterThan(0);
  });

  it('should compute HHI and Effective Number of Borrowers (N_eff)', () => {
    // 10 equal borrowers -> HHI = 10 * (0.1)^2 = 0.1 -> N_eff = 10
    const equalBorrowers = Array.from({ length: 10 }, (_, i) => ({
      borrowerId: `B${i}`,
      amount: 10_000,
    }));
    const metrics = analyzeConcentration(equalBorrowers);
    expect(metrics.hhi).toBe(0.1);
    expect(metrics.effectiveBorrowers).toBe(10);
  });

  it('should flag mandatory CA net worth certificate threshold over ₹10 Lakh', () => {
    const exposures = [
      { borrowerId: 'B1', amount: 40_000 },
      { borrowerId: 'B2', amount: 40_000 },
    ];
    const lowMetrics = analyzeConcentration(exposures);
    expect(lowMetrics.requiresNetWorthCertificate).toBe(false);

    const largeExposures = Array.from({ length: 30 }, (_, i) => ({
      borrowerId: `B${i}`,
      amount: 40_000, // Total = 12 Lakh
    }));
    const largeMetrics = analyzeConcentration(largeExposures);
    expect(largeMetrics.requiresNetWorthCertificate).toBe(true);
  });
});

describe('Taxation Engine: Section 56 & The Asymmetric Tax Trap', () => {
  it('should calculate gross interest tax and deduct platform fees under Section 57(iii)', () => {
    const tax = calculateP2PTax({
      grossInterestReceived: 100_000,
      platformFeesPaid: 10_000,
      defaultedPrincipalLost: 0,
      marginalTaxRatePercentage: 30, // 30% slab + 4% cess = 31.2%
    });

    expect(tax.deductiblePlatformFees).toBe(10_000);
    expect(tax.taxableIncomeUnderSection56).toBe(90_000);
    expect(tax.baseTaxLiability).toBe(27_000);
    expect(tax.cessAmount).toBe(1080);
    expect(tax.totalTaxLiability).toBe(28_080);
    expect(tax.isAsymmetricTaxTrapTriggered).toBe(false);
  });

  it('should trigger the Asymmetric Tax Trap when principal loss causes negative net return despite positive tax', () => {
    // Lended 1,00,000, earned 12,000 gross interest, paid 1,000 fee, but lost 15,000 in defaulted principal
    const tax = calculateP2PTax({
      grossInterestReceived: 12_000,
      platformFeesPaid: 1_000,
      defaultedPrincipalLost: 15_000,
      marginalTaxRatePercentage: 30,
    });

    expect(tax.taxableIncomeUnderSection56).toBe(11_000);
    expect(tax.totalTaxLiability).toBe(3432); // 31.2% on 11,000
    // Economic profit = 12,000 - 1,000 - 3432 - 15,000 = -7,432
    expect(tax.trueEconomicProfit).toBe(-7432);
    expect(tax.isAsymmetricTaxTrapTriggered).toBe(true);
    expect(tax.asymmetricTaxExplanation).toContain('ASYMMETRIC TAX TRAP WARNING');
  });
});

describe('Asset Comparison Engine', () => {
  it('should provide comparative analysis against Bank FD', () => {
    const comparison = compareP2PWithAsset('bank-fd', 100_000);
    expect(comparison.p2p.nominalMidYield).toBeGreaterThan(comparison.target.nominalMidYield);
    expect(comparison.target.principalProtection).toContain('DICGC');
    expect(comparison.p2p.defaultRisk).toBe('High');
  });
});
