/**
 * Indian Income Tax Engine for P2P Lending
 * Analyzes taxation under Section 56(2) (Income from Other Sources),
 * Section 57(iii) (Deductibility of platform fees), and the Asymmetric Tax Trap
 * (non-deductibility of lost principal defaults under Section 36 vs 57).
 */

export interface TaxCalculationInputs {
  grossInterestReceived: number;
  platformFeesPaid: number; // Deductible under Section 57(iii)
  defaultedPrincipalLost: number; // Non-deductible for retail investors under IFOS
  recoveredPrincipalFromDefaults?: number;
  marginalTaxRatePercentage: number; // e.g. 30% (or 5, 10, 15, 20)
  surchargePercentage?: number; // e.g. 10%, 15%, 25%, defaults to 0%
  tdsAlreadyDeducted?: number;
  taxYear?: string; // e.g. 'AY 2025-26 / FY 2024-25'
}

export interface TaxCalculationResult {
  grossInterestReceived: number;
  deductiblePlatformFees: number;
  taxableIncomeUnderSection56: number;
  baseTaxLiability: number;
  cessAmount: number; // 4% Health & Education Cess
  surchargeAmount: number;
  totalTaxLiability: number;
  effectiveTaxRateOnNetInterest: number;
  netTaxPayableAfterTds: number;
  
  // Real Economic Outcomes
  totalDefaultsLost: number;
  trueEconomicProfit: number;
  isAsymmetricTaxTrapTriggered: boolean;
  asymmetricTaxExplanation: string;
  officialProvisions: {
    incomeHead: string;
    interestSection: string;
    expenseSection: string;
    badDebtRestriction: string;
    relevantYear: string;
  };
}

export function calculateP2PTax(inputs: TaxCalculationInputs): TaxCalculationResult {
  const {
    grossInterestReceived,
    platformFeesPaid,
    defaultedPrincipalLost,
    recoveredPrincipalFromDefaults = 0,
    marginalTaxRatePercentage,
    surchargePercentage = 0,
    tdsAlreadyDeducted = 0,
    taxYear = 'AY 2025-26 / FY 2024-25',
  } = inputs;

  // Deductible fees under Section 57(iii) cannot reduce income below 0
  const deductibleFees = Math.min(grossInterestReceived, Math.max(0, platformFeesPaid));
  const taxableIncome = Math.max(0, grossInterestReceived - deductibleFees);

  // Base tax
  const baseTax = taxableIncome * (marginalTaxRatePercentage / 100);
  const surcharge = baseTax * (surchargePercentage / 100);
  // Health & Education cess is 4% on (Base Tax + Surcharge)
  const cess = (baseTax + surcharge) * 0.04;
  const totalTaxLiability = baseTax + surcharge + cess;

  const netTaxPayable = Math.max(0, totalTaxLiability - tdsAlreadyDeducted);

  const effectiveTaxRate = taxableIncome > 0 ? (totalTaxLiability / taxableIncome) * 100 : 0;

  // Economic analysis
  const netDefaults = Math.max(0, defaultedPrincipalLost - recoveredPrincipalFromDefaults);
  const trueEconomicProfit = grossInterestReceived - platformFeesPaid - totalTaxLiability - netDefaults;

  // Asymmetric Tax Trap: Investor lost money or earned negligible profit overall, yet has a positive tax bill
  const isTrap = netDefaults > 0 && (trueEconomicProfit < 0 || totalTaxLiability > (grossInterestReceived - platformFeesPaid - netDefaults));

  let trapExplanation = 'Your net interest income exceeded credit losses, resulting in a positive economic gain after tax.';
  if (trueEconomicProfit < 0 && totalTaxLiability > 0) {
    trapExplanation = `ASYMMETRIC TAX TRAP WARNING: You suffered an economic net loss of -₹${Math.abs(Math.round(trueEconomicProfit)).toLocaleString('en-IN')}, yet you owe ₹${Math.round(totalTaxLiability).toLocaleString('en-IN')} in income tax. Under Section 56/57, lost principal defaults cannot be offset against interest income for retail lenders.`;
  } else if (isTrap) {
    trapExplanation = `ASYMMETRIC TAX BURDEN: While your gross interest was ₹${grossInterestReceived.toLocaleString('en-IN')}, credit defaults absorbed ₹${netDefaults.toLocaleString('en-IN')}. Because the tax department does not permit bad debt write-offs under Section 57(iii), tax is charged on the full ₹${taxableIncome.toLocaleString('en-IN')}, severely eroding your real return.`;
  }

  return {
    grossInterestReceived: Math.round(grossInterestReceived * 100) / 100,
    deductiblePlatformFees: Math.round(deductibleFees * 100) / 100,
    taxableIncomeUnderSection56: Math.round(taxableIncome * 100) / 100,
    baseTaxLiability: Math.round(baseTax * 100) / 100,
    cessAmount: Math.round(cess * 100) / 100,
    surchargeAmount: Math.round(surcharge * 100) / 100,
    totalTaxLiability: Math.round(totalTaxLiability * 100) / 100,
    effectiveTaxRateOnNetInterest: Math.round(effectiveTaxRate * 100) / 100,
    netTaxPayableAfterTds: Math.round(netTaxPayable * 100) / 100,
    totalDefaultsLost: Math.round(netDefaults * 100) / 100,
    trueEconomicProfit: Math.round(trueEconomicProfit * 100) / 100,
    isAsymmetricTaxTrapTriggered: isTrap,
    asymmetricTaxExplanation: trapExplanation,
    officialProvisions: {
      incomeHead: 'Income from Other Sources (IFOS)',
      interestSection: 'Section 56(2) of the Income Tax Act, 1961',
      expenseSection: 'Section 57(iii) (Expenditure wholly and exclusively for earning IFOS)',
      badDebtRestriction: 'Section 36(1)(vii) restricted to business/PGBP; not allowed under Section 57',
      relevantYear: taxYear,
    },
  };
}
