export default function Header() {
  return (
    <header className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Automated Bot Strategy</h1>
      <div className="flex gap-3 items-center">
        <span className="text-sm text-gray-400">Balance: $12,450</span>
        <button className="px-4 py-1 bg-green-600 hover:bg-green-500 rounded">Start Bot</button>
      </div>
    </header>
  );
}
