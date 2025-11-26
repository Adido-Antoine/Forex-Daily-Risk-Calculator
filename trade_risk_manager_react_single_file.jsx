import React, { useState, useMemo } from 'react';

export default function TradeRiskManager() {
  const [funds, setFunds] = useState(1000);
  const [numTrades, setNumTrades] = useState(5);
  const [dailyRiskPct, setDailyRiskPct] = useState(2);
  const [riskReward, setRiskReward] = useState(2);
  const [pipSize, setPipSize] = useState(0.0001); // pip size for most pairs
  const [entryPrice, setEntryPrice] = useState(0);
  const [notes, setNotes] = useState('');

  // Suggested max trades for the day based on risk
  const suggestedMaxTrades = useMemo(() => Math.min(Math.floor(100 / dailyRiskPct), 10), [dailyRiskPct]);

  // Calculations
  const dailyRiskAmount = useMemo(() => funds * (dailyRiskPct / 100), [funds, dailyRiskPct]);
  const perTradeRisk = useMemo(() => (numTrades > 0 ? dailyRiskAmount / numTrades : 0), [dailyRiskAmount, numTrades]);
  const slPips = useMemo(() => perTradeRisk > 0 ? perTradeRisk / (pipSize * funds) : 0, [perTradeRisk, pipSize, funds]);
  const tpPips = useMemo(() => slPips * riskReward, [slPips, riskReward]);

  const slPrice = useMemo(() => entryPrice && slPips ? +(entryPrice - slPips * pipSize).toFixed(5) : 0, [entryPrice, slPips, pipSize]);
  const tpPrice = useMemo(() => entryPrice && tpPips ? +(entryPrice + tpPips * pipSize).toFixed(5) : 0, [entryPrice, tpPips, pipSize]);

  const lossIfLoseAll = dailyRiskAmount;
  const balanceIfLoseAll = funds - dailyRiskAmount;
  const gainPerTrade = perTradeRisk * riskReward;
  const totalGainIfWinAll = gainPerTrade * numTrades;
  const balanceIfWinAll = funds + totalGainIfWinAll;

  const tradeLines = Array.from({ length: numTrades }, (_, i) => ({
    trade: i + 1,
    riskAmount: perTradeRisk,
    slPips,
    tpPips,
    rewardAmount: gainPerTrade
  }));

  const bestPractices = [
    "Always define your risk per trade before entering a position.",
    "Stick to your daily maximum number of trades.",
    "Use proper risk:reward ratio for all trades.",
    "Avoid revenge trading after a loss.",
    "Keep a trading journal for each trade.",
    "Follow your SL and TP rules strictly.",
    "Focus on quality setups rather than quantity.",
    "Stay informed about major market news and events.",
    "Take breaks to avoid emotional trading.",
    "Continuously review and learn from past trades."
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Trade Risk Manager</h1>
          <p className="text-sm text-slate-500">Plan daily risk, per-trade risk, SL/TP prices and suggested trades. Enter your own price to auto-calculate SL/TP.</p>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <div>
              <label className="text-sm font-medium">Entry Price (Manual)</label>
              <input type="number" step="0.00001" className="mt-1 w-full border rounded px-3 py-2" value={entryPrice} onChange={e => setEntryPrice(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-sm font-medium">Total Funds (USD)</label>
              <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={funds} onChange={e => setFunds(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-sm font-medium">Number of trades</label>
              <input type="number" min={1} className="mt-1 w-full border rounded px-3 py-2" value={numTrades} onChange={e => setNumTrades(Math.max(1, Number(e.target.value) || 1))} />
              <p className="text-xs text-slate-500 mt-1">Suggested max trades based on risk: {suggestedMaxTrades}</p>
            </div>
            <div>
              <label className="text-sm font-medium">% of funds willing to risk (daily)</label>
              <input type="number" min={0} max={100} className="mt-1 w-full border rounded px-3 py-2" value={dailyRiskPct} onChange={e => setDailyRiskPct(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-sm font-medium">Risk:Reward (1:R)</label>
              <input type="number" min={0.1} step={0.1} className="mt-1 w-full border rounded px-3 py-2" value={riskReward} onChange={e => setRiskReward(Number(e.target.value) || 0.1)} />
            </div>
            <div>
              <label className="text-sm font-medium">Pip Size (e.g., 0.0001 for most pairs)</label>
              <input type="number" step={0.00001} className="mt-1 w-full border rounded px-3 py-2" value={pipSize} onChange={e => setPipSize(Number(e.target.value) || 0.0001)} />
            </div>
            <div>
              <label className="text-sm font-medium">Notes (optional)</label>
              <textarea className="mt-1 w-full border rounded px-3 py-2" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </section>

          <section className="space-y-4">
            <div className="bg-slate-50 rounded p-4">
              <h2 className="text-lg font-medium">Summary</h2>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>Daily risk amount</div><div className="text-right font-semibold">{dailyRiskAmount.toFixed(2)}</div>
                <div>Per-trade risk</div><div className="text-right font-semibold">{perTradeRisk.toFixed(2)}</div>
                <div>SL (pips)</div><div className="text-right font-semibold">{slPips.toFixed(1)}</div>
                <div>TP (pips)</div><div className="text-right font-semibold">{tpPips.toFixed(1)}</div>
                <div>SL Price</div><div className="text-right font-semibold">{slPrice}</div>
                <div>TP Price</div><div className="text-right font-semibold">{tpPrice}</div>
                <div>Loss if all lose</div><div className="text-right font-semibold">-{lossIfLoseAll.toFixed(2)}</div>
                <div>Balance if all lose</div><div className="text-right font-semibold">{balanceIfLoseAll.toFixed(2)}</div>
                <div>Gain if all win</div><div className="text-right font-semibold">+{totalGainIfWinAll.toFixed(2)}</div>
                <div>Balance if all win</div><div className="text-right font-semibold">{balanceIfWinAll.toFixed(2)}</div>
              </div>
            </div>

            <div className="bg-white rounded p-4 border">
              <h3 className="font-medium">Per-Trade Plan</h3>
              <div className="mt-3 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500">
                    <tr>
                      <th>Trade</th>
                      <th>Risk Amount</th>
                      <th>SL (pips)</th>
                      <th>TP (pips)</th>
                      <th>Reward Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeLines.map(t => (
                      <tr key={t.trade} className="border-t">
                        <td>#{t.trade}</td>
                        <td>{t.riskAmount.toFixed(2)}</td>
                        <td>{t.slPips.toFixed(1)}</td>
                        <td>{t.tpPips.toFixed(1)}</td>
                        <td>+{t.rewardAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 rounded p-4 border mt-4">
              <h3 className="font-medium text-blue-700">Best Daily Trading Practices</h3>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-blue-800">
                {bestPractices.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
