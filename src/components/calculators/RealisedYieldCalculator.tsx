import React, { useState, useMemo } from 'react';
import { calculateRealisedYield } from '../../lib/finance/yield';

export default function RealisedYieldCalculator() {
  const [capital, setCapital] = useState<number>(200000);
  const [contractualRate, setContractualRate] = useState<number>(14.0);
  const [platformFee, setPlatformFee] = useState<number>(1.5);
  const [defaultRate, setDefaultRate] = useState<number>(3.5);
  const [recoveryRate, setRecoveryRate] = useState<number>(25.0);
  const [idleCash, setIdleCash] = useState<number>(8.0);
  const [inflation, setInflation] = useState<number>(5.5);

  const result = useMemo(() => {
    return calculateRealisedYield({
      capitalInvested: capital,
      contractualAnnualRate: contractualRate,
      platformFeePercentage: platformFee,
      defaultRatePercentage: defaultRate,
      recoveryRatePercentage: recoveryRate,
      idleCashPercentage: idleCash,
      inflationRatePercentage: inflation,
    });
  }, [capital, contractualRate, platformFee, defaultRate, recoveryRate, idleCash, inflation]);

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Gross vs Realised Yield Waterfall
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Observe how advertised double-digit rates erode through fees, defaults, cash drag, and inflation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Capital Invested (₹)
          </label>
          <input
            type="number"
            min="10000"
            max="5000000"
            step="10000"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Contractual Rate (% p.a.)
          </label>
          <input
            type="number"
            min="5"
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
            Platform Servicing Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.25"
            value={platformFee}
            onChange={(e) => setPlatformFee(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="0"
            max="4"
            step="0.25"
            value={platformFee}
            onChange={(e) => setPlatformFee(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Borrower Default Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={defaultRate}
            onChange={(e) => setDefaultRate(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={defaultRate}
            onChange={(e) => setDefaultRate(Number(e.target.value))}
            className="w-full mt-2 accent-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Expected Recovery on Defaults (%)
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
            Idle Cash Drag (% in Escrow)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="1"
            value={idleCash}
            onChange={(e) => setIdleCash(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
          />
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={idleCash}
            onChange={(e) => setIdleCash(Number(e.target.value))}
            className="w-full mt-2 accent-amber-600"
          />
        </div>
      </div>

      {/* Yield Waterfall Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Contractual Gross</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {result.contractualGrossYield}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Quoted borrower rate</div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
          <div className="text-xs text-rose-600 dark:text-rose-400 uppercase font-semibold">Total Leakage</div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            -{(result.feeErosionPercentage + result.defaultErosionPercentage + result.cashDragErosionPercentage).toFixed(2)}%
          </div>
          <div className="text-xs text-rose-500 mt-1">Fees + Defaults + Drag</div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Realised Net Yield</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
            {result.realisedNetYield}%
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Pre-tax nominal outcome</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
          <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">Real Return (Post-CPI)</div>
          <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-1">
            {result.realReturnAfterInflation}%
          </div>
          <div className="text-xs text-blue-500 mt-1">Adjusted for {inflation}% inflation</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-sans">
            <tr>
              <th className="px-4 py-3">Cash-Flow Component</th>
              <th className="px-4 py-3">Effective Impact (% p.a.)</th>
              <th className="px-4 py-3">Annual Amount (₹)</th>
              <th className="px-4 py-3">Mechanism</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
            <tr>
              <td className="px-4 py-2.5 font-bold font-sans">Contractual Gross Income</td>
              <td className="px-4 py-2.5 text-blue-600 dark:text-blue-400 font-bold">+{result.contractualGrossYield}%</td>
              <td className="px-4 py-2.5 font-bold">₹{((capital * contractualRate) / 100).toLocaleString('en-IN')}</td>
              <td className="px-4 py-2.5 text-slate-500 font-sans">Scheduled borrower repayments</td>
            </tr>
            <tr className="bg-rose-50/40 dark:bg-rose-950/10">
              <td className="px-4 py-2.5 font-sans">Platform Servicing & Origination</td>
              <td className="px-4 py-2.5 text-rose-600 dark:text-rose-400">-{result.feeErosionPercentage}%</td>
              <td className="px-4 py-2.5 text-rose-600 dark:text-rose-400">-₹{result.platformFeesPaid.toLocaleString('en-IN')}</td>
              <td className="px-4 py-2.5 text-slate-500 font-sans">Platform commission & collections</td>
            </tr>
            <tr className="bg-rose-50/40 dark:bg-rose-950/10">
              <td className="px-4 py-2.5 font-sans">Net Unrecovered Credit Loss</td>
              <td className="px-4 py-2.5 text-rose-600 dark:text-rose-400">-{result.defaultErosionPercentage}%</td>
              <td className="px-4 py-2.5 text-rose-600 dark:text-rose-400">-₹{result.netCreditLoss.toLocaleString('en-IN')}</td>
              <td className="px-4 py-2.5 text-slate-500 font-sans">Default Rate × (1 - Recovery Rate)</td>
            </tr>
            <tr className="bg-amber-50/40 dark:bg-amber-950/10">
              <td className="px-4 py-2.5 font-sans">Escrow Cash Drag (Idle Capital)</td>
              <td className="px-4 py-2.5 text-amber-600 dark:text-amber-400">-{result.cashDragErosionPercentage}%</td>
              <td className="px-4 py-2.5 text-amber-600 dark:text-amber-400">-₹{((capital * result.cashDragErosionPercentage) / 100).toLocaleString('en-IN')}</td>
              <td className="px-4 py-2.5 text-slate-500 font-sans">Capital awaiting deployment</td>
            </tr>
            <tr className="bg-emerald-50 dark:bg-emerald-950/30 font-bold">
              <td className="px-4 py-3 font-sans text-emerald-800 dark:text-emerald-200">Net Annual Realised Return</td>
              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">+{result.realisedNetYield}%</td>
              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">₹{result.realisedNetAnnualIncome.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-emerald-700 dark:text-emerald-300 font-sans">Actual pre-tax investor cash pocketed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
