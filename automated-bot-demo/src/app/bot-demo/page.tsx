"use client";

import OrdersTable from "./components/OrdersTable";
import TradingChart from "./components/TradingChart";

export default function BotDemo() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🤖 Bot Dashboard</h1>

      {/* Top Navigation */}
      <div className="flex space-x-6 mb-6 border-b border-gray-700 pb-3">
        <button className="hover:text-blue-400">Overview</button>
        <button className="hover:text-blue-400">Live Charts</button>
        <button className="hover:text-blue-400">Settings</button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2 bg-gray-800 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Trading Chart</h2>
          <TradingChart />
        </div>

        {/* Bot Performance */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Bot Performance</h2>
          <div className="space-y-3">
            <p>Total Trades: <span className="font-bold">125</span></p>
            <p>Win Rate: <span className="text-green-400 font-bold">67%</span></p>
            <p>Profit: <span className="text-green-400 font-bold">+$1,250</span></p>
          </div>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg">
            Start Bot
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={[]}/>
      <div className="bg-gray-800 mt-6 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Time</th>
              <th>Pair</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td>12:30</td>
              <td>BTC/USDT</td>
              <td className="text-green-400">BUY</td>
              <td>0.05 BTC</td>
              <td className="text-green-400">+$50</td>
            </tr>
            <tr>
              <td>12:45</td>
              <td>BTC/USDT</td>
              <td className="text-red-400">SELL</td>
              <td>0.05 BTC</td>
              <td className="text-red-400">-$15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
