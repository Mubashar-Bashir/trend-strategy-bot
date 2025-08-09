interface Order {
  id: number;
  pair: string;
  type: string;
  profit: string;
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-xl mb-4">Orders</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th>Pair</th>
            <th>Type</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-700">
              <td>{o.pair}</td>
              <td>{o.type}</td>
              <td className={o.profit.startsWith("+") ? "text-green-400" : "text-red-400"}>{o.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
