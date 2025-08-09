import { Home, LineChart, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 p-4 border-r border-gray-800">
      <h2 className="text-xl font-bold mb-6">Bot Dashboard</h2>
      <nav className="space-y-4">
        <a className="flex items-center gap-2 hover:text-green-400 cursor-pointer">
          <Home size={20} /> Overview
        </a>
        <a className="flex items-center gap-2 hover:text-green-400 cursor-pointer">
          <LineChart size={20} /> Live Charts
        </a>
        <a className="flex items-center gap-2 hover:text-green-400 cursor-pointer">
          <Settings size={20} /> Settings
        </a>
      </nav>
    </aside>
  );
}
