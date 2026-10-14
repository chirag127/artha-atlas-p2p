import React, { useState, useMemo } from 'react';
import { calculateP2PTax } from '../../lib/taxation/p2p-tax';

export default function P2PTaxCalculator() {
  const [grossInterest, setGrossInterest] = useState<number>(120000);
  const [platformFees, setPlatformFees] = useState<number>(12000);
  const [defaultsLost, setDefaultsLost] = useState<number>(35000);
  const [recoveries, setRecoveries] = useState<number>(5000);
  const [taxSlab, setTaxSlab] = useState<number>(30);
  const [surcharge, setSurcharge] = useState<number>(0);
  const [tdsDeducted, setTdsDeducted] = useState<number>(0);

  const taxResult = useMemo(() => {
    return calculateP2PTax({
      grossInterestReceived: grossInterest,
      platformFeesPaid: platformFees,
      defaultedPrincipalLost: defaultsLost,
      recoveredPrincipalFromDefaults: recoveries,
      marginalTaxRatePercentage: taxSlab,
      surchargePercentage: surcharge,
      tdsAlreadyDeducted: tdsDeducted,
    });
  }, [grossInterest, platformFees, defaultsLost, recoveries, taxSlab, surcharge, tdsDeducted]);

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
            Income Tax Act, 1961
          </span>
          <span className="text-xs text-slate-500">AY 2025-26 / FY 2024-25</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          P2P Taxation & Asymmetric Tax Trap Calculator
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate Section 56(2) taxable interest, Section 57(iii) fee deductions, and expose how non-deductible principal defaults create disproportionate tax bills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Gross Interest Received (₹)
          </label>
          <input
            type="number"
            min="0"
            step="5000"
            value={grossInterest}
            onChange={(e) => setGrossInterest(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <span className="text-xs text-slate-500 mt-1 block">Total interest credited in FY</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Platform Fees Paid (₹) — Sec 57(iii)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={platformFees}
            onChange={(e) => setPlatformFees(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">Deductible under Section 57(iii)</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Defaulted Loan Principal (₹)
          </label>
          <input
            type="number"
            min="0"
            step="5000"
            value={defaultsLost}
            onChange={(e) => setDefaultsLost(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <span className="text-xs text-rose-600 dark:text-rose-400 mt-1 block">NOT deductible for retail lenders</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Recoveries from Defaults (₹)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={recoveries}
            onChange={(e) => setRecoveries(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <span className="text-xs text-slate-500 mt-1 block">Principal recovered by platform</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Marginal Tax Slab Rate (%)
          </label>
          <select
            value={taxSlab}
            onChange={(e) => setTaxSlab(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          >
            <option value="5">5% (Low Bracket)</option>
            <option value="10">10% (New Regime ₹6L–9L)</option>
            <option value="15">15% (New Regime ₹9L–12L)</option>
            <option value="20">20% (Old/New Bracket)</option>
            <option value="30">30% (Highest Slab Bracket)</option>
          </select>
          <span className="text-xs text-slate-500 mt-1 block">+ 4% Health & Education Cess</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            TDS Already Deducted (₹)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={tdsDeducted}
            onChange={(e) => setTdsDeducted(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <span className="text-xs text-slate-500 mt-1 block">TDS credit in Form 26AS/AIS</span>
        </div>
      </div>

      {/* Tax Result Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Taxable Income u/s 56(2)</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{taxResult.taxableIncomeUnderSection56.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Gross Interest - Sec 57(iii) Fees</div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
          <div className="text-xs text-rose-600 dark:text-rose-400 uppercase font-semibold">Total Tax Liability</div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            ₹{taxResult.totalTaxLiability.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-rose-500 mt-1">Includes 4% Cess ({taxResult.effectiveTaxRateOnNetInterest.toFixed(1)}% eff.)</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Net Defaults Suffered</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{taxResult.totalDefaultsLost.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Defaults minus Recoveries</div>
        </div>

        <div className={`p-4 rounded-xl border ${
          taxResult.trueEconomicProfit >= 0
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
            : 'bg-rose-100 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
        }`}>
          <div className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400">True Economic Gain/Loss</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${
            taxResult.trueEconomicProfit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
          }`}>
            {taxResult.trueEconomicProfit >= 0 ? '+' : ''}₹{taxResult.trueEconomicProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">After Fees, Tax & Defaults</div>
        </div>
      </div>

      {/* Asymmetric Tax Trap Explainer Box */}
      <div className={`p-5 rounded-2xl border mb-6 ${
        taxResult.isAsymmetricTaxTrapTriggered
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60'
          : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50'
      }`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{taxResult.isAsymmetricTaxTrapTriggered ? '🚨' : 'ℹ️'}</span>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {taxResult.isAsymmetricTaxTrapTriggered
                ? 'The Asymmetric Tax Trap in Action'
                : 'Tax Classification Commentary'}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {taxResult.asymmetricTaxExplanation}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <span className="bg-white/80 dark:bg-navy-850 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                Charging: Sec 56(2) IFOS
              </span>
              <span className="bg-white/80 dark:bg-navy-850 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                Deductions: Sec 57(iii) wholly & exclusively
              </span>
              <span className="bg-white/80 dark:bg-navy-850 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                Bad Debts: Sec 36(1)(vii) barred for IFOS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
