import React, { useState, useMemo } from 'react';
import { analyzeConcentration, type BorrowerExposureInput, RBI_REGULATORY_LIMITS } from '../../lib/finance/concentration';

const CONCENTRATION_PRESETS: Record<string, { name: string; description: string; data: BorrowerExposureInput[] }> = {
  equalDistribution: {
    name: 'Granular Diversified (50 Borrowers)',
    description: '₹2,50,000 distributed equally into 50 loans of ₹5,000 each.',
    data: Array.from({ length: 50 }, (_, i) => ({
      borrowerId: `B-${i + 1}`,
      amount: 5000,
    })),
  },
  lopsidedIllusion: {
    name: 'The Illusion of Diversification (Lopsided)',
    description: '1 giant borrower of ₹45,000 + 40 micro-borrowers of ₹1,000 each (Total ₹85,000).',
    data: [
      { borrowerId: 'B-DOMINANT', amount: 45000 },
      ...Array.from({ length: 40 }, (_, i) => ({
        borrowerId: `B-MICRO-${i + 1}`,
        amount: 1000,
      })),
    ],
  },
  regulatoryViolation: {
    name: 'Statutory RBI Ceiling Violation',
    description: 'Contains a loan of ₹65,000 which breaches the statutory RBI ₹50,000 single borrower cap.',
    data: [
      { borrowerId: 'B-BREACH', amount: 65000 },
      { borrowerId: 'B-2', amount: 30000 },
      { borrowerId: 'B-3', amount: 20000 },
    ],
  },
};

export default function PortfolioConcentrationCalculator() {
  const [borrowers, setBorrowers] = useState<BorrowerExposureInput[]>(CONCENTRATION_PRESETS.lopsidedIllusion.data);

  const metrics = useMemo(() => {
    return analyzeConcentration(borrowers);
  }, [borrowers]);

  const loadPreset = (key: string) => {
    if (CONCENTRATION_PRESETS[key]) {
      setBorrowers(CONCENTRATION_PRESETS[key].data);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Portfolio Concentration & RBI Statutory Compliance Checker
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detect regulatory exposure breaches and compute the Herfindahl-Hirschman Index (HHI) to measure the true Effective Number of Borrowers (N_eff).
        </p>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs font-semibold text-slate-500 self-center mr-1">Load Preset:</span>
          {Object.entries(CONCENTRATION_PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPreset(key)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors font-medium"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regulatory Violation Alerts */}
      {metrics.regulatoryViolations.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800">
          <div className="flex items-start gap-3">
            <span className="text-rose-600 text-xl">⚠️</span>
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Statutory RBI Master Direction Violation Detected
              </h4>
              <ul className="mt-1 list-disc list-inside text-xs text-rose-800 dark:text-rose-300/90 space-y-1">
                {metrics.regulatoryViolations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Portfolio</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{metrics.totalPortfolio.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">{metrics.borrowerCount} Nominal Loans</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Max Single Exposure</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${
            metrics.isCompliantWithRbiSingleBorrowerCap ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
          }`}>
            ₹{metrics.maxBorrowerExposure.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.maxBorrowerPercentage.toFixed(1)}% of total portfolio (RBI Cap: ₹50,000)
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
          <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">Effective Borrowers (N_eff)</div>
          <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-1">
            {metrics.effectiveBorrowers}
          </div>
          <div className="text-xs text-blue-500 mt-1">
            True independent exposures (1 / HHI)
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Top 5 Concentration</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {metrics.top5ExposurePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Weight held by 5 largest loans</div>
        </div>
      </div>

      {/* Educational Explainer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">
          Why Effective Number of Borrowers (N_eff) Matters:
        </h4>
        <p>
          You may have {metrics.borrowerCount} loans in your portfolio, but because exposure is unevenly distributed, your portfolio behaves as if it only has <strong>{metrics.effectiveBorrowers} equally weighted borrowers</strong>. If your largest borrower defaults, {metrics.maxBorrowerPercentage.toFixed(1)}% of your entire invested capital is wiped out in a single event.
        </p>
      </div>
    </div>
  );
}
