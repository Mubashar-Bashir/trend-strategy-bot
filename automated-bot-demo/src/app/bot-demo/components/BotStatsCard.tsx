interface BotStatsProps {
  balance: string;
  trades: number;
  winRate: string;
  profit: string;
}

export default function BotStatsCard({ balance, trades, winRate, profit }: BotStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-400">Balance</p>
        <h2 className="text-2xl font-bold">{balance}</h2>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-400">Total Trades</p>
        <h2 className="text-2xl font-bold">{trades}</h2>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-400">Win Rate</p>
        <h2 className="text-2xl font-bold">{winRate}</h2>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-400">Profit</p>
        <h2 className="text-2xl font-bold text-green-400">{profit}</h2>
      </div>
    </div>
  );
}
