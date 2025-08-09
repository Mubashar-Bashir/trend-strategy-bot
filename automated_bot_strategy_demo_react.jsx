import React, { useEffect, useState, useRef } from "react";

// Automated Bot Strategy Demo
// Single-file React component (Tailwind CSS assumed available in host environment)
// - Demo simulates realtime price feed, news sentiment, and two strategies (DCA + Grid)
// - Includes UI to configure strategies, start/stop the bot, view simulated P&L and trade log
//
// Fixes applied:
// - Removed a stray "</n" token that caused a JSX parse error.
// - Made priceRef updates via useEffect to avoid updating refs during render.
// - Minor variable shadowing cleanup in setPositions callbacks.
//
// How to use / extend:
// 1) To connect real data, replace the simulatedPriceFeed with a websocket or REST polling
//    (e.g., KuCoin WebSocket / REST or TradingView webhook -> backend -> websocket to this UI).
// 2) For sentiment/news, call a news API (e.g., NewsAPI, GDELT) and run simple sentiment analysis
//    or use a 3rd-party sentiment endpoint. Keep API keys on a backend — never in frontend.
// 3) To place real trades, create a backend service that uses KuCoin API keys to sign requests.
//    The UI should send signed trade intents to that backend, which executes orders and returns fills.
// 4) This demo is strictly educational. Never run real capital without testing on paper first.

export default function AutomatedBotDemo() {
  // simulation state
  const [running, setRunning] = useState(false);
  const [balance, setBalance] = useState(0.00079543); // BTC example starting balance
  const [usdtBalance, setUsdtBalance] = useState(0); // if converting
  const [price, setPrice] = useState(60000); // simulated BTC price in USD
  const priceRef = useRef(price);

  useEffect(() => {
    priceRef.current = price;
  }, [price]);

  const [log, setLog] = useState([]);
  const [positions, setPositions] = useState([]);

  // strategy config
  const [dcaConfig, setDcaConfig] = useState({ enabled: true, allocationPct: 30, intervalMins: 60, buyDropPct: 3 });
  const [gridConfig, setGridConfig] = useState({ enabled: true, minPrice: 58000, maxPrice: 62000, grids: 8, allocationPct: 20 });

  // sentiment (simulated)
  const [sentiment, setSentiment] = useState({ score: 0, tag: "Neutral" });

  // simulated news headlines store
  const [news, setNews] = useState([
    { t: new Date().toLocaleTimeString(), title: "Market stable — accumulation continues" },
  ]);

  // helper append log
  function appendLog(message) {
    setLog((prev) => [{ t: new Date().toLocaleTimeString(), message }, ...prev].slice(0, 200));
  }

  // Simple price simulator (random walk + periodic trends)
  useEffect(() => {
    let id;
    if (running) {
      id = setInterval(() => {
        setPrice((p) => {
          // small random movement
          const drift = Math.sin(Date.now() / 100000) * 30; // slow wave
          const rnd = (Math.random() - 0.5) * 200; // volatility
          const next = Math.max(1000, Math.round(p + drift + rnd));
          return next;
        });
      }, 2000);

      // simulated news & sentiment updates
      const newsId = setInterval(() => {
        const s = Math.round((Math.random() - 0.4) * 10); // bias slightly positive
        const tag = s > 2 ? "Positive" : s < -2 ? "Negative" : "Neutral";
        setSentiment({ score: s, tag });
        setNews((n) => [
          { t: new Date().toLocaleTimeString(), title: `Simulated news — sentiment ${tag} (${s})` },
          ...n,
        ].slice(0, 20));
      }, 8000);

      return () => {
        clearInterval(id);
        clearInterval(newsId);
      };
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [running]);

  // Reaction engine: decide to buy/sell based on configured strategies
  useEffect(() => {
    if (!running) return;
    const engine = setInterval(() => {
      const p = priceRef.current;
      // DCA: buy when price drops by threshold from last buy or from start
      if (dcaConfig.enabled) {
        const recentBuy = positions.filter((x) => x.strategy === "DCA");
        const lastBuyPrice = recentBuy.length ? recentBuy[0].price : null;
        const refPrice = lastBuyPrice ?? p * 1.03; // if no buy yet, set reference slightly above
        const dropPct = ((refPrice - p) / refPrice) * 100;
        if (dropPct >= dcaConfig.buyDropPct) {
          // execute buy
          const alloc = (dcaConfig.allocationPct / 100) * balance; // btc amount
          executeBuy("DCA", alloc, p);
        }
      }

      // Grid: buy/sell on grid lines
      if (gridConfig.enabled) {
        const { minPrice, maxPrice, grids } = gridConfig;
        const step = (maxPrice - minPrice) / Math.max(1, grids - 1);
        for (let i = 0; i < grids; i++) {
          const level = Math.round(minPrice + i * step);
          // if price crosses below a grid level and we have allocation to buy
          const existing = positions.find((pos) => pos.strategy === "GRID" && pos.gridLevel === level);
          if (p <= level && !existing) {
            const alloc = ((gridConfig.allocationPct / 100) * balance) / grids;
            executeBuy("GRID", alloc, p, { gridLevel: level });
          }
          // if price crosses above a grid level and we hold at that level → sell
          if (p >= level && existing && !existing.sold) {
            executeSell(existing, p);
          }
        }
      }

      // Sentiment-based quick scalp: positive news + momentum → small buy
      if (sentiment.score >= 3 && Math.random() > 0.6) {
        const alloc = (0.01 * balance); // tiny allocation
        executeBuy("NEWS_SCALP", alloc, p);
      }
    }, 3000);

    return () => clearInterval(engine);
  }, [running, dcaConfig, gridConfig, positions, sentiment, balance]);

  // buys/sells (simulated fills)
  function executeBuy(strategy, btcAmount, priceUsd, meta = {}) {
    if (!btcAmount || btcAmount <= 0) return;
    // reduce balance and add position
    setBalance((b) => Math.max(0, Number((b - btcAmount).toFixed(8))));
    const pos = {
      id: Math.random().toString(36).slice(2, 9),
      strategy,
      price: priceUsd,
      btc: btcAmount,
      meta,
      t: new Date().toLocaleTimeString(),
      sold: false,
    };
    setPositions((prev) => [pos, ...prev]);
    appendLog(`BUY ${btcAmount.toFixed(8)} BTC @ $${priceUsd} via ${strategy}`);
  }

  function executeSell(position, priceUsd) {
    if (!position || position.sold) return;
    // mark sold and credit balance with pnl in btc equivalent simplified
    const pnlUsd = (priceUsd - position.price) * position.btc;
    // Convert USD pnl to BTC at current price (approx)
    const pnlBtc = priceUsd !== 0 ? pnlUsd / priceUsd : 0;
    setBalance((b) => Number((b + position.btc + pnlBtc).toFixed(8)));
    setPositions((prev) => prev.map((pos) => (pos.id === position.id ? { ...pos, sold: true, sellPrice: priceUsd, sellT: new Date().toLocaleTimeString() } : pos)));
    appendLog(`SELL ${position.btc.toFixed(8)} BTC @ $${priceUsd} (pos ${position.id})`);
  }

  // manual buy/sell for UI controls
  function manualBuy() {
    executeBuy("MANUAL", (0.02 * balance), priceRef.current);
  }
  function manualSell(positionId) {
    const pos = positions.find((p) => p.id === positionId && !p.sold);
    if (pos) executeSell(pos, priceRef.current);
  }

  // CSV export of log
  function downloadLog() {
    const rows = log.map((r) => `${r.t},"${r.message.replace(/"/g, '""') || ""}"`).join("\n");
    const blob = new Blob(["Time,Message\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bot_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Automated Bot Strategy — Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Simulated BTC Price</div>
              <div className="text-3xl font-mono">${price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Sentiment: <span className="font-semibold">{sentiment.tag} ({sentiment.score})</span></div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Starting BTC</div>
              <div className="text-xl font-bold">{(0.00079543).toFixed(8)} BTC</div>
              <div className="text-sm text-gray-500">Available:</div>
              <div className="text-lg">{balance.toFixed(8)} BTC</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded">
              <div className="font-semibold">DCA Strategy</div>
              <label className="text-xs">Allocation %</label>
              <input type="range" min="5" max="80" value={dcaConfig.allocationPct} onChange={(e) => setDcaConfig({ ...dcaConfig, allocationPct: Number(e.target.value) })} />
              <div className="text-sm">{dcaConfig.allocationPct}% | Buy drop {dcaConfig.buyDropPct}%</div>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setDcaConfig({ ...dcaConfig, enabled: !dcaConfig.enabled })}>{dcaConfig.enabled ? 'Disable' : 'Enable'}</button>
              </div>
            </div>

            <div className="p-3 border rounded">
              <div className="font-semibold">Grid Strategy</div>
              <label className="text-xs">Min/Max</label>
              <div className="flex gap-2 items-center">
                <input className="w-1/2 p-1 border rounded" value={gridConfig.minPrice} onChange={(e) => setGridConfig({ ...gridConfig, minPrice: Number(e.target.value) })} />
                <input className="w-1/2 p-1 border rounded" value={gridConfig.maxPrice} onChange={(e) => setGridConfig({ ...gridConfig, maxPrice: Number(e.target.value) })} />
              </div>
              <label className="text-xs">Grids: {gridConfig.grids}</label>
              <input type="range" min="2" max="20" value={gridConfig.grids} onChange={(e) => setGridConfig({ ...gridConfig, grids: Number(e.target.value) })} />
              <div className="mt-2"><button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setGridConfig({ ...gridConfig, enabled: !gridConfig.enabled })}>{gridConfig.enabled ? 'Disable' : 'Enable'}</button></div>
            </div>

            <div className="p-3 border rounded">
              <div className="font-semibold">Quick Controls</div>
              <div className="flex gap-2 mt-2">
                <button className={`px-4 py-2 rounded ${running ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`} onClick={() => setRunning((r) => !r)}>{running ? 'Stop Bot' : 'Start Bot'}</button>
                <button className="px-3 py-2 border rounded" onClick={manualBuy}>Manual Buy</button>
                <button className="px-3 py-2 border rounded" onClick={() => { setPositions([]); setBalance(0.00079543); setLog([]); }}>Reset</button>
              </div>

              <div className="mt-3 text-xs text-gray-600">Notes: This demo does simulated trades. To run real trades connect via secure backend with KuCoin API keys and signed requests.</div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Positions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr><th>ID</th><th>Strategy</th><th>BTC</th><th>Buy Price</th><th>Sell Price</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {positions.map((p) => (
                    <tr key={p.id} className={`border-t ${p.sold ? 'bg-gray-50' : ''}`}>
                      <td className="py-2">{p.id}</td>
                      <td>{p.strategy}{p.meta?.gridLevel ? ` (G:${p.meta.gridLevel})` : ''}</td>
                      <td>{p.btc.toFixed(8)}</td>
                      <td>${p.price}</td>
                      <td>{p.sold ? `$${p.sellPrice}` : '-'}</td>
                      <td>{!p.sold && <button className="px-2 py-1 border rounded" onClick={() => manualSell(p.id)}>Sell</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div className="font-semibold">News & Sentiment</div>
            <div><button className="px-2 py-1 border rounded" onClick={() => downloadLog()}>Export Log</button></div>
          </div>

          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {news.map((n, idx) => (
              <div key={idx} className="border-b pb-2">
                <div className="text-xs text-gray-400">{n.t}</div>
                <div className="text-sm">{n.title}</div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="font-semibold">Activity Log</div>
            <div className="max-h-44 overflow-y-auto text-xs text-gray-700 mt-2">
              {log.map((l, i) => (<div key={i} className="py-1 border-b"><span className="text-xs text-gray-400">{l.t}</span> — <span>{l.message}</span></div>))}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Integration Tips:
            <ul className="list-disc ml-4">
              <li>Use a backend to call KuCoin REST / WebSocket APIs and send data securely to this UI.</li>
              <li>For news & sentiment, use NewsAPI / Twitter + a sentiment model. Keep keys server-side.</li>
              <li>Backtest strategies thoroughly. Use paper trading mode before real trades.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <div className="font-semibold">How to turn this demo into a real bot (high level)</div>
        <ol className="list-decimal ml-6 mt-2">
          <li>Build a backend (Node/Express, Python/Flask) that holds your API keys and executes signed orders on KuCoin.</li>
          <li>Backend subscribes to KuCoin WebSocket for live prices and order fills (or receives TradingView webhooks).</li>
          <li>Backend runs the decision engine (your strategies) or receives signals from this UI; it must sign and place orders.</li>
          <li>Keep a robust logging + alerting system (Discord/Telegram) for important events and failures.</li>
          <li>Start with very small sizes and paper-trade for days/weeks before scaling capital.</li>
        </ol>
      </div>
    </div>
  );
}
