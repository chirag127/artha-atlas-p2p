import React, { useState } from 'react';
import { ASSET_CLASSES, compareP2PWithAsset } from '../../lib/finance/comparison';

export default function InvestmentComparisonCalculator() {
  const [investedAmount, setInvestedAmount] = useState<number>(200000);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bank-fd');

  const comparison = compareP2PWithAsset(selectedAssetId, investedAmount);
  const targetAsset = ASSET_CLASSES.find((a) => a.id === selectedAssetId) || ASSET_CLASSES[1];

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          P2P Lending vs Alternative Fixed Income & Cash Assets
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rigorous comparison across credit risk, statutory guarantees, liquidity timelines, taxation, and net realised return.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              min="10000"
              max="5000000"
              step="50000"
              value={investedAmount}
              onChange={(e) => setInvestedAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Compare P2P Lending Against:
            </label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold"
            >
              {ASSET_CLASSES.filter((a) => a.id !== 'p2p-lending').map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-side Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* P2P Card */}
        <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              P2P Lending (NBFC-P2P)
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">High Risk</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500">Nominal Headline Yield</div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {comparison.p2p.nominalYieldRange[0]}% – {comparison.p2p.nominalYieldRange[1]}%
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Estimated Net Realised Yield (After ~5% Fees & Defaults)</div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ~{comparison.p2p.realisedEstimatedYield}% p.a.
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Approx. ₹{Math.round(comparison.p2p.estimatedAnnualIncome).toLocaleString('en-IN')} / year pre-tax
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Principal Protection:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{comparison.p2p.principalProtection}</span>
              </div>
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Liquidity:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{comparison.p2p.liquidity}</span>
              </div>
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Taxation:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{comparison.p2p.taxTreatment}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Asset Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {targetAsset.name}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {targetAsset.defaultRisk} Risk
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500">Nominal Headline Yield</div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {targetAsset.nominalYieldRange[0]}% – {targetAsset.nominalYieldRange[1]}%
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Estimated Net Realised Yield (Zero Credit Loss)</div>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                ~{comparison.target.realisedEstimatedYield}% p.a.
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Approx. ₹{Math.round(comparison.target.estimatedAnnualIncome).toLocaleString('en-IN')} / year pre-tax
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Principal Protection:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{targetAsset.principalProtection}</span>
              </div>
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Liquidity:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{targetAsset.liquidity}</span>
              </div>
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Taxation:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">{targetAsset.taxTreatment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tradeoff Conclusion */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">
          The Realised Risk-Return Tradeoff
        </h4>
        <p>
          While P2P lending markets a nominal spread of <strong>+{comparison.yieldDifferenceNominal}%</strong> over {targetAsset.name}, after accounting for platform fees (~1.5%) and credit defaults (~3.5%), the net realised spread narrows to approximately <strong>+{comparison.yieldDifferenceRealised}%</strong>. In exchange for this ~{comparison.yieldDifferenceRealised}% spread, the investor forfeits {targetAsset.principalProtection.toLowerCase()} and assumes full illiquidity and the Asymmetric Tax Trap.
        </p>
      </div>
    </div>
  );
}
