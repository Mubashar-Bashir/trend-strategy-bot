import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Bot Dashboard</h1>
        <nav className="flex flex-col space-y-4">
          <a className="hover:text-yellow-400" href="#">Overview</a>
          <a className="hover:text-yellow-400" href="#">Live Charts</a>
          <a className="hover:text-yellow-400" href="#">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
