import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BotStats() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Bot Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span>Total Trades</span>
          <span>125</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Win Rate</span>
          <span>67%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Profit</span>
          <span className="text-green-400">+$1,250</span>
        </div>
      </CardContent>
    </Card>
  );
}
