/**
 * Loan Amortisation Library
 * Handles Reducing Balance EMI, Flat Rate calculations, and full monthly schedules.
 */

export interface AmortisationScheduleItem {
  month: number;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
  totalInterestPaidToDate: number;
}

export interface AmortisationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  schedule: AmortisationScheduleItem[];
}

export interface FlatRateResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  nominalFlatRate: number;
  equivalentReducingRate: number;
}

/**
 * Calculates Reducing Balance EMI and full amortization schedule.
 * Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where r = annualRate / 12, n = tenureMonths
 */
export function calculateReducingAmortisation(
  principal: number,
  annualRatePercentage: number,
  tenureMonths: number,
  originationFee: number = 0
): AmortisationResult {
  if (principal <= 0 || tenureMonths <= 0) {
    throw new Error('Principal and tenure must be positive numbers');
  }

  const annualRate = annualRatePercentage / 100;
  const monthlyRate = annualRate / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  // Round monthly payment to 2 decimal places for realism
  monthlyPayment = Math.round(monthlyPayment * 100) / 100;

  const schedule: AmortisationScheduleItem[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const beginningBalance = balance;
    let interest = beginningBalance * monthlyRate;
    interest = Math.round(interest * 100) / 100;

    let principalRepayment = monthlyPayment - interest;
    
    // Adjust last month for fractional rounding differences
    if (month === tenureMonths || principalRepayment > balance) {
      principalRepayment = balance;
      monthlyPayment = principalRepayment + interest;
    }

    balance = Math.max(0, beginningBalance - principalRepayment);
    totalInterest += interest;

    schedule.push({
      month,
      beginningBalance: Math.round(beginningBalance * 100) / 100,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalRepayment * 100) / 100,
      interest,
      endingBalance: Math.round(balance * 100) / 100,
      totalInterestPaidToDate: Math.round(totalInterest * 100) / 100,
    });
  }

  const totalPayment = principal + totalInterest + originationFee;
  // Effective Annual Rate (EAR) = (1 + r/12)^12 - 1
  const effectiveAnnualRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

  return {
    monthlyPayment: schedule.length > 0 ? schedule[0].payment : 0,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveAnnualRate: Math.round(effectiveAnnualRate * 100) / 100,
    schedule,
  };
}

/**
 * Calculates Flat Rate Loan metrics and derives the equivalent Reducing Balance APR.
 * In Flat Rate, total interest = Principal * FlatRate * (Tenure/12).
 * Monthly EMI = (Principal + Total Interest) / Tenure.
 */
export function calculateFlatRateLoan(
  principal: number,
  flatRatePercentage: number,
  tenureMonths: number
): FlatRateResult {
  if (principal <= 0 || tenureMonths <= 0) {
    throw new Error('Principal and tenure must be positive numbers');
  }

  const years = tenureMonths / 12;
  const totalInterest = principal * (flatRatePercentage / 100) * years;
  const totalPayment = principal + totalInterest;
  const monthlyPayment = totalPayment / tenureMonths;

  // Approximate equivalent reducing rate using Newton-Raphson
  // Solve for r_m such that: P = EMI * [1 - (1 + r_m)^(-n)] / r_m
  let rMonthly = (flatRatePercentage / 100) / 6; // initial guess (roughly 1.8x flat rate)
  for (let iter = 0; iter < 50; iter++) {
    const factor = Math.pow(1 + rMonthly, -tenureMonths);
    const f = (monthlyPayment * (1 - factor)) / rMonthly - principal;
    const fPrime = monthlyPayment * ((tenureMonths * rMonthly * Math.pow(1 + rMonthly, -tenureMonths - 1) - (1 - factor)) / (rMonthly * rMonthly));
    
    const diff = f / fPrime;
    rMonthly -= diff;
    if (Math.abs(diff) < 1e-8) break;
  }

  const equivalentReducingRate = rMonthly * 12 * 100;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    nominalFlatRate: flatRatePercentage,
    equivalentReducingRate: Math.round(equivalentReducingRate * 100) / 100,
  };
}
