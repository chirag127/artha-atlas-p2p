/**
 * Asset Comparison Engine
 * Comparative analytics between P2P Lending, Bank Fixed Deposits,
 * Debt Mutual Funds, Corporate Bonds, Treasury Bills, and REITs.
 */

export interface AssetComparisonModel {
  id: string;
  name: string;
  category: string;
  nominalYieldRange: [number, number]; // in percentage, e.g. [6.5, 7.5]
  principalProtection: string;
  defaultRisk: 'Negligible' | 'Very Low' | 'Moderate' | 'High' | 'Very High';
  liquidity: string;
  lockInPeriod: string;
  taxTreatment: string;
  regulatoryAuthority: string;
  keyAdvantage: string;
  keyLimitation: string;
}

export const ASSET_CLASSES: AssetComparisonModel[] = [
  {
    id: 'p2p-lending',
    name: 'NBFC-P2P Lending',
    category: 'Alternative Fixed Income',
    nominalYieldRange: [10.0, 16.0],
    principalProtection: 'None. Platform is strictly an intermediary. No guarantees or credit enhancements permitted by RBI.',
    defaultRisk: 'High',
    liquidity: 'Illiquid until contractual borrower EMI repayments. Post-August 2024 RBI circular, secondary exits and instant liquidity are banned.',
    lockInPeriod: 'Contractual loan tenure (typically 3 to 36 months).',
    taxTreatment: 'Taxed at marginal slab rate under "Income from Other Sources" (Section 56). Principal defaults are non-deductible.',
    regulatoryAuthority: 'Reserve Bank of India (NBFC-P2P Master Directions 2017/2024)',
    keyAdvantage: 'High headline contractual yield in an inflationary environment.',
    keyLimitation: 'Asymmetric tax trap, credit default risk, illiquidity, and cash drag erosion.',
  },
  {
    id: 'bank-fd',
    name: 'Scheduled Bank Fixed Deposit',
    category: 'Traditional Cash & Deposit',
    nominalYieldRange: [6.5, 7.75],
    principalProtection: 'DICGC insured up to ₹5,00,000 per depositor per bank (principal + interest).',
    defaultRisk: 'Negligible',
    liquidity: 'Immediate premature withdrawal available online (usually with 0.5%–1% interest penalty).',
    lockInPeriod: '7 days to 10 years (flexible with premature break).',
    taxTreatment: 'Taxed at marginal slab rate u/s 56. TDS deducted u/s 194A if interest exceeds ₹40,000 (₹50,000 for senior citizens).',
    regulatoryAuthority: 'Reserve Bank of India (Banking Regulation Act, 1949)',
    keyAdvantage: 'Uncompromised capital safety, legal certainty, and instant liquidity.',
    keyLimitation: 'Post-tax returns often struggle to outpace core CPI inflation for 30%+ slab brackets.',
  },
  {
    id: 't-bills-g-secs',
    name: 'Treasury Bills & G-Secs (RBI Retail Direct)',
    category: 'Sovereign Debt',
    nominalYieldRange: [6.7, 7.2],
    principalProtection: 'Sovereign guarantee (Government of India). Zero credit risk.',
    defaultRisk: 'Negligible',
    liquidity: 'Tradable on secondary NDS-OM market via RBI Retail Direct, though retail trading volume can be thin.',
    lockInPeriod: '91/182/364 days for T-Bills; up to 40 years for Dated G-Secs.',
    taxTreatment: 'T-Bill appreciation is taxed at marginal slab rates. G-Sec coupon taxed at slab under IFOS. No TDS on G-Secs.',
    regulatoryAuthority: 'Reserve Bank of India & Ministry of Finance',
    keyAdvantage: 'Absolute zero risk of sovereign default; direct ownership in RBI accounts without intermediary risk.',
    keyLimitation: 'Price volatility during interest rate cycles for longer-duration bonds.',
  },
  {
    id: 'debt-mutual-funds',
    name: 'Debt Mutual Funds (Short Duration / Liquid)',
    category: 'Institutional Fixed Income',
    nominalYieldRange: [6.8, 7.8],
    principalProtection: 'Market-linked. No guarantee. Backed by diversified institutional debt papers (CPs, CDs, NCDs).',
    defaultRisk: 'Very Low to Moderate (depends on credit rating AAA to AA-).',
    liquidity: 'High. Liquid funds offer T+1 redemption (instant redemption up to ₹50,000).',
    lockInPeriod: 'Open-ended (nil to few days exit load).',
    taxTreatment: 'Post-Finance Act 2023, gains from specified mutual funds (<=35% equity) are taxed at marginal slab rates (Section 50AA).',
    regulatoryAuthority: 'Securities and Exchange Board of India (SEBI)',
    keyAdvantage: 'Professional institutional diversification, automated daily compounding, high liquidity, and credit screening.',
    keyLimitation: 'Loss of indexation tax benefit post-March 31, 2023; subject to NAV interest rate risk.',
  },
  {
    id: 'corporate-bonds',
    name: 'Listed Corporate Bonds (Senior Secured NCDs)',
    category: 'Private Credit / Fixed Income',
    nominalYieldRange: [8.5, 11.5],
    principalProtection: 'Asset-backed charge for secured bonds, monitored by SEBI-registered Debenture Trustees.',
    defaultRisk: 'Moderate (depends on credit rating A to BBB).',
    liquidity: 'Listed on NSE/BSE and RFQ platforms, though retail liquidity varies significantly by issuer.',
    lockInPeriod: 'Fixed maturity (typically 1 to 5 years).',
    taxTreatment: 'Coupon taxed at marginal slab rate. Listed bonds held >12 months subject to 12.5% LTCG without indexation.',
    regulatoryAuthority: 'Securities and Exchange Board of India (SEBI OBPP Regulations)',
    keyAdvantage: 'Explicit asset security charge, institutional disclosures, and credit ratings from Crisil/ICRA/Care.',
    keyLimitation: 'Credit downgrade risk, liquidity dry-up during distress, and recovery delays in IBC/NCLT.',
  },
  {
    id: 'reits',
    name: 'Real Estate Investment Trusts (REITs)',
    category: 'Hybrid / Real Estate',
    nominalYieldRange: [6.5, 8.5],
    principalProtection: 'Backed by Grade-A commercial rent-yielding real estate assets (Embassy, Mindspace, Brookfield, Nexus).',
    defaultRisk: 'Low',
    liquidity: 'High. Traded on stock exchanges (NSE/BSE) like equities during market hours.',
    lockInPeriod: 'None (freely tradable in 1-unit lots).',
    taxTreatment: 'Pass-through structure: Dividend/Interest taxed based on SPV tax status; capital gains taxed at 20% (STCG) or 12.5% (LTCG).',
    regulatoryAuthority: 'Securities and Exchange Board of India (SEBI REIT Regulations)',
    keyAdvantage: 'Inflation-hedged lease escalations, dividend distributions (mandatory 90% NDCF payout), and capital appreciation.',
    keyLimitation: 'Market price volatility on stock exchanges and commercial office vacancy risk.',
  },
];

export function compareP2PWithAsset(assetId: string, investedAmount: number = 100_000) {
  const p2p = ASSET_CLASSES.find((a) => a.id === 'p2p-lending')!;
  const target = ASSET_CLASSES.find((a) => a.id === assetId) || ASSET_CLASSES[1];

  const p2pMidYield = (p2p.nominalYieldRange[0] + p2p.nominalYieldRange[1]) / 2;
  const targetMidYield = (target.nominalYieldRange[0] + target.nominalYieldRange[1]) / 2;

  // Assume P2P suffers 1.5% platform fee and 3.5% net default loss
  const p2pRealisedYield = p2pMidYield - 1.5 - 3.5;
  const targetRealisedYield = targetMidYield; // Bank FD or T-Bill has 0 credit loss

  return {
    investedAmount,
    p2p: {
      ...p2p,
      nominalMidYield: p2pMidYield,
      realisedEstimatedYield: p2pRealisedYield,
      estimatedAnnualIncome: (investedAmount * p2pRealisedYield) / 100,
    },
    target: {
      ...target,
      nominalMidYield: targetMidYield,
      realisedEstimatedYield: targetRealisedYield,
      estimatedAnnualIncome: (investedAmount * targetRealisedYield) / 100,
    },
    yieldDifferenceNominal: Math.round((p2pMidYield - targetMidYield) * 100) / 100,
    yieldDifferenceRealised: Math.round((p2pRealisedYield - targetRealisedYield) * 100) / 100,
  };
}
