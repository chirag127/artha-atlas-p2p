import React, { useState, useMemo } from 'react';
import { calculatePortfolioRisk, calculateDelayedRecovery } from '../../lib/finance/credit-risk';

export default function CreditLossStressCalculator() {
  const [portfolio, setPortfolio] = useState<number>(500000);
  const [contractualRate, setContractualRate] = useState<number>(14.0);
  const [pdRate, setPdRate] = useState<number>(4.0);
  const [recoveryRate, setRecoveryRate] = useState<number>(20.0);
  const [delayMonths, setDelayMonths] = useState<number>(12);
  const [feeRate, setFeeRate] = useState<number>(1.5);

  const riskSummary = useMemo(() => {
    return calculatePortfolioRisk(portfolio, contractualRate, pdRate, recoveryRate, feeRate, 7.0);
  }, [portfolio, contractualRate, pdRate, recoveryRate, feeRate]);

  const delayedRecoveryInfo = useMemo(() => {
    const nominalDefault = portfolio * (pdRate / 100);
    return calculateDelayedRecovery(nominalDefault, recoveryRate, delayMonths, 10.0);
  }, [portfolio, pdRate, recoveryRate, delayMonths]);

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Default, Recovery & Expected Credit Loss (ECL) Stress Engine
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Stress test default clustering, recovery timing haircut, and calculate the exact break-even default rate where returns turn negative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Portfolio Size (₹)
          </label>
          <input
            type="number"
            min="10000"
            max="5000000"
            step="50000"
            value={portfolio}
            onChange={(e) => setPortfolio(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Contractual Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min="6"
            max="30"
            step="0.5"
            value={contractualRate}
            onChange={(e) => setContractualRate(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="8"
            max="24"
            step="0.5"
            value={contractualRate}
            onChange={(e) => setContractualRate(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Probability of Default (PD % of Portfolio)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={pdRate}
            onChange={(e) => setPdRate(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={pdRate}
            onChange={(e) => setPdRate(Number(e.target.value))}
            className="w-full mt-2 accent-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Recovery Rate on Defaulted Loans (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="5"
            value={recoveryRate}
            onChange={(e) => setRecoveryRate(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={recoveryRate}
            onChange={(e) => setRecoveryRate(Number(e.target.value))}
            className="w-full mt-2 accent-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Average Recovery Delay (Months)
          </label>
          <input
            type="number"
            min="1"
            max="36"
            value={delayMonths}
            onChange={(e) => setDelayMonths(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="1"
            max="36"
            step="1"
            value={delayMonths}
            onChange={(e) => setDelayMonths(Number(e.target.value))}
            className="w-full mt-2 accent-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Platform Servicing Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.25"
            value={feeRate}
            onChange={(e) => setFeeRate(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      {/* Stress Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
          <div className="text-xs text-rose-600 dark:text-rose-400 uppercase font-semibold">Expected Credit Loss (ECL)</div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            ₹{riskSummary.expectedCreditLoss.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-rose-500 mt-1">{riskSummary.expectedCreditLossPercentage}% of portfolio capital</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Break-Even Default (Zero Return)</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {riskSummary.breakEvenDefaultRateZeroReturn}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Defaults above this trigger capital loss</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Break-Even Default (vs 7% Bank FD)</div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {riskSummary.breakEvenDefaultRateFdBenchmark}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Defaults above this underperform safe FD</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Time-Value Haircut on Delay</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{delayedRecoveryInfo.timingLossFromDelay.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Loss from {delayMonths}M collection delay</div>
        </div>
      </div>

      {/* Recovery Timing Analysis */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Recovery Timing Reality</h4>
        <p>
          Even if a platform claims an eventual {recoveryRate}% recovery rate, recovering ₹{delayedRecoveryInfo.grossNominalRecovery.toLocaleString('en-IN')} after a {delayMonths}-month lag has an economic present value of only <strong>₹{delayedRecoveryInfo.presentValueOfRecovery.toLocaleString('en-IN')}</strong> (discounted at 10% annual opportunity cost). The delay alone destroys <strong>₹{delayedRecoveryInfo.timingLossFromDelay.toLocaleString('en-IN')}</strong> in economic value.
        </p>
      </div>
    </div>
  );
}
