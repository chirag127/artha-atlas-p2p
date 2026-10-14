/**
 * Gross, Net, and Realised Yield Engine with Cash Drag & Inflation Adjustment.
 */

export interface YieldAnalysisInputs {
  capitalInvested: number;
  contractualAnnualRate: number; // in percentage, e.g. 13%
  platformFeePercentage: number; // in percentage of interest or capital, e.g. 1.5%
  defaultRatePercentage: number; // percentage of principal defaulting, e.g. 3.5%
  recoveryRatePercentage: number; // percentage of defaulted amount recovered, e.g. 25%
  idleCashPercentage: number; // percentage of portfolio sitting idle, e.g. 10%
  idleCashReturnRate?: number; // e.g., 3.0% in savings account, defaults to 0%
  inflationRatePercentage?: number; // e.g., 5.5% CPI
}

export interface YieldAnalysisResult {
  contractualGrossYield: number;
  feeErosionPercentage: number;
  defaultErosionPercentage: number;
  cashDragErosionPercentage: number;
  realisedNetYield: number;
  realisedNetAnnualIncome: number;
  realReturnAfterInflation: number;
  grossInterestEarned: number;
  platformFeesPaid: number;
  netCreditLoss: number;
}

/**
 * Calculates comprehensive yield breakdown from contractual rate to realised return.
 */
export function calculateRealisedYield(inputs: YieldAnalysisInputs): YieldAnalysisResult {
  const {
    capitalInvested,
    contractualAnnualRate,
    platformFeePercentage,
    defaultRatePercentage,
    recoveryRatePercentage,
    idleCashPercentage,
    idleCashReturnRate = 0,
    inflationRatePercentage = 0,
  } = inputs;

  const deployedFraction = Math.max(0, 1 - idleCashPercentage / 100);
  const idleFraction = Math.min(1, Math.max(0, idleCashPercentage / 100));

  // Gross interest if 100% was deployed
  const potentialGrossYield = contractualAnnualRate;

  // Deployed interest + idle return
  const grossYield = (contractualAnnualRate * deployedFraction) + (idleCashReturnRate * idleFraction);
  const cashDragErosion = potentialGrossYield - grossYield;

  // Platform fee impact
  const feeErosion = platformFeePercentage;

  // Default impact: Net credit loss = DefaultRate * (1 - RecoveryRate)
  const netCreditLossRate = (defaultRatePercentage / 100) * (1 - recoveryRatePercentage / 100) * 100;
  const defaultErosion = netCreditLossRate * deployedFraction;

  // Realised Net Yield before tax
  const realisedNetYield = Math.max(-100, grossYield - feeErosion - defaultErosion);

  // Income figures in INR
  const grossInterestEarned = capitalInvested * (grossYield / 100);
  const platformFeesPaid = capitalInvested * (feeErosion / 100);
  const netCreditLoss = capitalInvested * (defaultErosion / 100);
  const realisedNetAnnualIncome = capitalInvested * (realisedNetYield / 100);

  // Fisher Equation for Real Return: (1 + r_nom) / (1 + pi) - 1
  const rNom = realisedNetYield / 100;
  const pi = inflationRatePercentage / 100;
  const realReturn = ((1 + rNom) / (1 + pi) - 1) * 100;

  return {
    contractualGrossYield: Math.round(contractualAnnualRate * 100) / 100,
    feeErosionPercentage: Math.round(feeErosion * 100) / 100,
    defaultErosionPercentage: Math.round(defaultErosion * 100) / 100,
    cashDragErosionPercentage: Math.round(cashDragErosion * 100) / 100,
    realisedNetYield: Math.round(realisedNetYield * 100) / 100,
    realisedNetAnnualIncome: Math.round(realisedNetAnnualIncome * 100) / 100,
    realReturnAfterInflation: Math.round(realReturn * 100) / 100,
    grossInterestEarned: Math.round(grossInterestEarned * 100) / 100,
    platformFeesPaid: Math.round(platformFeesPaid * 100) / 100,
    netCreditLoss: Math.round(netCreditLoss * 100) / 100,
  };
}
