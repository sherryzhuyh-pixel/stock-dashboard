import { StockData } from '@/types/stock';
import { parseVolume, parseAmount } from '@/utils/dataProcessor';

interface StockTableProps {
  stocks: StockData[];
}

export function StockTable({ stocks }: StockTableProps) {
  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="bg-bg-card rounded-lg border border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">个股行情</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900/50 text-gray-400 text-sm">
              <th className="px-4 py-3 text-left">代码</th>
              <th className="px-4 py-3 text-left">名称</th>
              <th className="px-4 py-3 text-right">收盘价</th>
              <th className="px-4 py-3 text-right">涨跌幅</th>
              <th className="px-4 py-3 text-right">涨跌额</th>
              <th className="px-4 py-3 text-right">成交量</th>
              <th className="px-4 py-3 text-right">成交额</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const isPositive = stock.pct_chg >= 0;
              const changeClass = isPositive ? 'text-up' : 'text-down';
              
              return (
                <tr key={stock.ts_code} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-300">{stock.ts_code}</td>
                  <td className="px-4 py-3 text-white font-medium">{stock.name}</td>
                  <td className="px-4 py-3 text-right text-white">{formatNumber(stock.close)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${changeClass}`}>
                    {isPositive ? '+' : ''}{stock.pct_chg.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-3 text-right ${changeClass}`}>
                    {isPositive ? '+' : ''}{formatNumber(stock.change)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{parseVolume(stock.vol)}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{parseAmount(stock.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
