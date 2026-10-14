/**
 * Portfolio XIRR (Extended Internal Rate of Return) Calculator
 * Solves: sum(CF_i / (1 + r)^((d_i - d_0) / 365)) = 0
 * Uses Newton-Raphson with Bisection fallback.
 */

export interface CashFlow {
  date: string | Date;
  amount: number; // Negative for investment, positive for returns/repayments
}

interface ParsedCashFlow {
  days: number;
  amount: number;
}

export interface XirrResult {
  success: boolean;
  rate: number; // in percentage, e.g. 11.45%
  iterations: number;
  message?: string;
}

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

export function calculateXIRR(cashFlows: CashFlow[], guess: number = 0.1): XirrResult {
  if (!cashFlows || cashFlows.length < 2) {
    return {
      success: false,
      rate: 0,
      iterations: 0,
      message: 'At least two cash flows are required (one investment, one return).',
    };
  }

  // Parse and sort cash flows chronologically
  const parsed: { time: number; amount: number }[] = [];
  let hasPositive = false;
  let hasNegative = false;

  for (const cf of cashFlows) {
    const time = new Date(cf.date).getTime();
    if (isNaN(time)) {
      return {
        success: false,
        rate: 0,
        iterations: 0,
        message: `Invalid date encountered: ${cf.date}`,
      };
    }
    if (cf.amount > 0) hasPositive = true;
    if (cf.amount < 0) hasNegative = true;
    parsed.push({ time, amount: cf.amount });
  }

  if (!hasPositive || !hasNegative) {
    return {
      success: false,
      rate: 0,
      iterations: 0,
      message: 'Cash flows must contain at least one positive and one negative value.',
    };
  }

  parsed.sort((a, b) => a.time - b.time);
  const startTime = parsed[0].time;

  const normalized: ParsedCashFlow[] = parsed.map((cf) => ({
    days: (cf.time - startTime) / MILLISECONDS_IN_DAY,
    amount: cf.amount,
  }));

  // Function to evaluate NPV at rate r
  function npv(r: number): number {
    let sum = 0;
    for (const cf of normalized) {
      sum += cf.amount / Math.pow(1 + r, cf.days / 365);
    }
    return sum;
  }

  // Derivative of NPV with respect to r
  function npvDerivative(r: number): number {
    let sum = 0;
    for (const cf of normalized) {
      if (cf.days === 0) continue;
      const years = cf.days / 365;
      sum -= (years * cf.amount) / Math.pow(1 + r, years + 1);
    }
    return sum;
  }

  // 1. Attempt Newton-Raphson
  let r = guess;
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    // Avoid evaluating at or below -100%
    if (r <= -0.9999) {
      r = -0.999;
    }

    const value = npv(r);
    const deriv = npvDerivative(r);

    if (Math.abs(deriv) < 1e-9) {
      // Derivative too small, switch to bisection
      break;
    }

    const nextR = r - value / deriv;

    if (Math.abs(nextR - r) < tolerance && Math.abs(value) < 1e-5) {
      return {
        success: true,
        rate: Math.round(nextR * 10000) / 100, // Return as percentage with 2 decimals
        iterations: i + 1,
      };
    }

    r = nextR;
  }

  // 2. Bisection Fallback
  let low = -0.999;
  let high = 10.0; // Up to 1000% annual return
  let fLow = npv(low);
  let fHigh = npv(high);

  if (fLow * fHigh > 0) {
    // Check if sign changes in an expanded range
    high = 50.0;
    fHigh = npv(high);
  }

  if (fLow * fHigh <= 0) {
    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2;
      const fMid = npv(mid);

      if (Math.abs(fMid) < 1e-5 || (high - low) / 2 < tolerance) {
        return {
          success: true,
          rate: Math.round(mid * 10000) / 100,
          iterations: maxIterations + iter + 1,
        };
      }

      if (fLow * fMid < 0) {
        high = mid;
        fHigh = fMid;
      } else {
        low = mid;
        fLow = fMid;
      }
    }
  }

  return {
    success: false,
    rate: 0,
    iterations: maxIterations,
    message: 'XIRR did not converge to a unique real root within acceptable tolerance.',
  };
}
