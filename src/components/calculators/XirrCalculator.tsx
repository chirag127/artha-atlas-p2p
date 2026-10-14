import React, { useState, useMemo } from 'react';
import { calculateXIRR, type CashFlow } from '../../lib/finance/xirr';

const PRESETS: Record<string, { name: string; description: string; flows: CashFlow[] }> = {
  standard12m: {
    name: '12-Month Performing Loan',
    description: '₹1,00,000 deployed on Jan 1, 2024, yielding regular monthly reducing EMIs of ₹8,885.',
    flows: [
      { date: '2024-01-01', amount: -100000 },
      { date: '2024-02-01', amount: 8885 },
      { date: '2024-03-01', amount: 8885 },
      { date: '2024-04-01', amount: 8885 },
      { date: '2024-05-01', amount: 8885 },
      { date: '2024-06-01', amount: 8885 },
      { date: '2024-07-01', amount: 8885 },
      { date: '2024-08-01', amount: 8885 },
      { date: '2024-09-01', amount: 8885 },
      { date: '2024-10-01', amount: 8885 },
      { date: '2024-11-01', amount: 8885 },
      { date: '2024-12-01', amount: 8885 },
      { date: '2025-01-01', amount: 8885 },
    ],
  },
  defaultAtM6: {
    name: 'Default at M6 + Delayed Recovery',
    description: 'Borrower pays 5 months, stops paying, and platform recovers 30% after a 9-month legal delay.',
    flows: [
      { date: '2024-01-01', amount: -100000 },
      { date: '2024-02-01', amount: 8885 },
      { date: '2024-03-01', amount: 8885 },
      { date: '2024-04-01', amount: 8885 },
      { date: '2024-05-01', amount: 8885 },
      { date: '2024-06-01', amount: 8885 },
      { date: '2025-03-01', amount: 18000 }, // Partial recovery
    ],
  },
  multiTranche: {
    name: 'Staggered Deployment (Auto-Reinvest)',
    description: 'Initial ₹50,000 deployed, repayments reinvested, subsequent top-ups added.',
    flows: [
      { date: '2024-01-01', amount: -50000 },
      { date: '2024-03-15', amount: -25000 },
      { date: '2024-06-01', amount: 12000 },
      { date: '2024-09-01', amount: 18000 },
      { date: '2024-12-31', amount: 55000 },
    ],
  },
};

export default function XirrCalculator() {
  const [cashFlows, setCashFlows] = useState<CashFlow[]>(PRESETS.standard12m.flows);
  const [newDate, setNewDate] = useState<string>('2025-02-01');
  const [newAmount, setNewAmount] = useState<number>(5000);

  const xirrResult = useMemo(() => {
    return calculateXIRR(cashFlows);
  }, [cashFlows]);

  const loadPreset = (key: string) => {
    if (PRESETS[key]) {
      setCashFlows(PRESETS[key].flows);
    }
  };

  const handleUpdate = (index: number, field: 'date' | 'amount', value: any) => {
    const updated = [...cashFlows];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) : value };
    setCashFlows(updated);
  };

  const handleRemove = (index: number) => {
    if (cashFlows.length <= 2) return;
    setCashFlows(cashFlows.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!newDate) return;
    setCashFlows([...cashFlows, { date: newDate, amount: Number(newAmount) }]);
  };

  const totalInvested = cashFlows.filter((c) => c.amount < 0).reduce((sum, c) => sum + Math.abs(c.amount), 0);
  const totalReceived = cashFlows.filter((c) => c.amount > 0).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Portfolio XIRR (Extended Internal Rate of Return) Calculator
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          The only mathematically valid metric for P2P lending with irregular repayment timing and reinvestment cash flows.
        </p>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs font-semibold text-slate-500 self-center mr-1">Load Preset:</span>
          {Object.entries(PRESETS).map(([key, item]) => (
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

      {/* Result Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200 dark:border-blue-800/60 md:col-span-1">
          <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">Realised XIRR</div>
          <div className="text-3xl font-extrabold font-mono text-blue-700 dark:text-blue-300 mt-1">
            {xirrResult.success ? `${xirrResult.rate}%` : 'N/A'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {xirrResult.success ? `Converged in ${xirrResult.iterations} iterations` : (xirrResult.message || 'Calculation error')}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Capital Deployed</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{totalInvested.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Negative cash outflows</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Recoveries & EMIs</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Net Cash Flow: {totalReceived >= totalInvested ? '+' : ''}₹{(totalReceived - totalInvested).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Cash Flows Table */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Dated Cash Flows</h4>
        <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-sans sticky top-0">
              <tr>
                <th className="px-4 py-2.5">Date (YYYY-MM-DD)</th>
                <th className="px-4 py-2.5">Amount (₹) [Negative = Outflow]</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {cashFlows.map((cf, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={typeof cf.date === 'string' ? cf.date : ''}
                      onChange={(e) => handleUpdate(i, 'date', e.target.value)}
                      className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={cf.amount}
                      onChange={(e) => handleUpdate(i, 'amount', e.target.value)}
                      className={`bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-bold ${
                        cf.amount < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      disabled={cashFlows.length <= 2}
                      onClick={() => handleRemove(i)}
                      className="text-xs text-rose-500 hover:text-rose-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Cash Flow Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500">Add Entry:</span>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
        />
        <input
          type="number"
          placeholder="Amount (e.g. 5000 or -20000)"
          value={newAmount}
          onChange={(e) => setNewAmount(Number(e.target.value))}
          className="px-3 py-1.5 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Cash Flow
        </button>
      </div>
    </div>
  );
}
