"use client";

import React, { useState, useEffect } from "react";

interface Strategy {
  name: string;
  description: string;
}

const AutomatedBotStrategyDemo: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [botLog, setBotLog] = useState<string[]>([]);

  useEffect(() => {
    // Simulating fetch of strategies from API
    setStrategies([
      { name: "Mean Reversion", description: "Buy low, sell high" },
      { name: "Momentum", description: "Follow the trend" },
      { name: "Arbitrage", description: "Exploit price differences" },
    ]);
  }, []);

  const runBot = () => {
    if (!selectedStrategy) {
      alert("Please select a strategy first!");
      return;
    }

    const newLog = `Bot started with strategy: ${selectedStrategy}`;
    setBotLog((prev) => [...prev, newLog]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Automated Bot Strategy Demo</h1>

      <h3>Select Strategy</h3>
      <select
        value={selectedStrategy ?? ""}
        onChange={(e) => setSelectedStrategy(e.target.value)}
      >
        <option value="">-- Select Strategy --</option>
        {strategies.map((strategy) => (
          <option key={strategy.name} value={strategy.name}>
            {strategy.name}
          </option>
        ))}
      </select>

      <button
        onClick={runBot}
        style={{
          display: "block",
          marginTop: "10px",
          padding: "8px 12px",
          background: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Run Bot
      </button>

      <h3>Bot Logs</h3>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "150px",
          overflowY: "scroll",
        }}
      >
        {botLog.length === 0 && <p>No logs yet</p>}
        {botLog.map((log, idx) => (
          <p key={idx}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default AutomatedBotStrategyDemo;
