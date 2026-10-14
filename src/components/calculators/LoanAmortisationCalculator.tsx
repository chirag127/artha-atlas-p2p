import React, { useState, useMemo } from 'react';
import { calculateReducingAmortisation, calculateFlatRateLoan } from '../../lib/finance/amortisation';

export default function LoanAmortisationCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(12);
  const [tenure, setTenure] = useState<number>(12);
  const [isFlatRate, setIsFlatRate] = useState<boolean>(false);
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  const reducingResult = useMemo(() => {
    try {
      return calculateReducingAmortisation(principal, rate, tenure);
    } catch {
      return null;
    }
  }, [principal, rate, tenure]);

  const flatResult = useMemo(() => {
    try {
      return calculateFlatRateLoan(principal, rate, tenure);
    } catch {
      return null;
    }
  }, [principal, rate, tenure]);

  const activeEmi = isFlatRate ? (flatResult?.monthlyPayment || 0) : (reducingResult?.monthlyPayment || 0);
  const activeInterest = isFlatRate ? (flatResult?.totalInterest || 0) : (reducingResult?.totalInterest || 0);
  const activeTotal = isFlatRate ? (flatResult?.totalPayment || 0) : (reducingResult?.totalPayment || 0);

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Loan Amortisation & EMI Calculator</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quantify reducing-balance interest versus flat-rate marketing quotes.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsFlatRate(false)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              !isFlatRate
                ? 'bg-white dark:bg-navy-850 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Reducing Balance
          </button>
          <button
            type="button"
            onClick={() => setIsFlatRate(true)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isFlatRate
                ? 'bg-white dark:bg-navy-850 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Flat Rate Quote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Principal Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
            <input
              type="number"
              min="1000"
              max="1000000"
              step="5000"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(1000, Number(e.target.value)))}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Annual Interest Rate ({isFlatRate ? 'Flat % p.a.' : 'Reducing % p.a.'})
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="48"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-slate-400">%</span>
          </div>
          <input
            type="range"
            min="6"
            max="36"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Tenure (Months) — RBI Cap: 36M
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="36"
              value={tenure}
              onChange={(e) => setTenure(Math.min(36, Math.max(1, Number(e.target.value))))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-slate-400">M</span>
          </div>
          <input
            type="range"
            min="3"
            max="36"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Monthly EMI</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{activeEmi.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Over {tenure} equal instalments
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Interest Paid</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            ₹{activeInterest.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {((activeInterest / principal) * 100).toFixed(1)}% of original principal
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Cash Outflow</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{activeTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Principal + Interest
          </div>
        </div>
      </div>

      {/* Flat Rate Warning Banner */}
      {isFlatRate && flatResult && (
        <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Flat Rate Truth: Equivalent Reducing APR is {flatResult.equivalentReducingRate}%
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-1 leading-relaxed">
                When a borrower or platform quotes a &ldquo;{rate}% Flat Rate&rdquo;, interest is continuously calculated on the full initial principal throughout the tenure even as principal is being repaid. In true reducing-balance terms (the standard for bank loans), this loan costs <strong>{flatResult.equivalentReducingRate}% p.a.</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Amortisation Schedule */}
      {reducingResult && !isFlatRate && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Amortisation Schedule Preview</h4>
            <button
              type="button"
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showFullSchedule ? 'Collapse Schedule' : `View All ${tenure} Months`}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Beginning Balance</th>
                  <th className="px-4 py-3">Instalment (EMI)</th>
                  <th className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Principal Repaid</th>
                  <th className="px-4 py-3 text-amber-600 dark:text-amber-400">Interest Paid</th>
                  <th className="px-4 py-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-slate-800 dark:text-slate-200">
                {(showFullSchedule ? reducingResult.schedule : reducingResult.schedule.slice(0, 5)).map((item) => (
                  <tr key={item.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold">M{item.month}</td>
                    <td className="px-4 py-2.5">₹{item.beginningBalance.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 font-bold">₹{item.payment.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">₹{item.principal.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 text-amber-600 dark:text-amber-400">₹{item.interest.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5">₹{item.endingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showFullSchedule && tenure > 5 && (
            <div className="text-center py-2 text-xs text-slate-400 italic">
              Showing first 5 of {tenure} months. Click &ldquo;View All&rdquo; to inspect complete schedule.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
