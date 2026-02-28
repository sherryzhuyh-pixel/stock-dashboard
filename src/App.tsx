import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { StockTable } from '@/components/StockTable';
import { SectorFlowChart } from '@/components/SectorFlowChart';
import { DistributionChart } from '@/components/DistributionChart';
import { DashboardData } from '@/types/stock';

const demoData: DashboardData = {
  marketIndices: [
    { name: '上证指数', value: 3456.78, pct_chg: 1.23 },
    { name: '深证成指', value: 12345.67, pct_chg: 0.89 },
  ],
  stocks: [
    { ts_code: '600519', name: '贵州茅台', close: 1850.00, pct_chg: 2.35, change: 42.50, vol: 5000000, amount: 9250000000 },
    { ts_code: '000858', name: '五粮液', close: 168.50, pct_chg: -1.20, change: -2.05, vol: 2000000, amount: 3370000000 },
    { ts_code: '600036', name: '招商银行', close: 35.80, pct_chg: 0.56, change: 0.20, vol: 15000000, amount: 5370000000 },
  ],
  sectorFlows: [
    { name: '电子', amount: 50000 },
    { name: '医药', amount: 30000 },
    { name: '银行', amount: -20000 },
    { name: '新能源', amount: 25000 },
  ],
  upCount: 45,
  downCount: 12,
  totalAmount: 125000000000,
  lastUpdateTime: new Date().toLocaleString('zh-CN'),
};

function App() {
  const [data, setData] = useState<DashboardData>(demoData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData({...demoData, lastUpdateTime: new Date().toLocaleString('zh-CN')});
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAmountDisplay = data.totalAmount >= 100000000 
    ? (data.totalAmount / 100000000).toFixed(2) + '万亿'
    : (data.totalAmount / 10000).toFixed(0) + '亿';

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <Header 
        lastUpdateTime={data.lastUpdateTime} 
        onRefresh={fetchData}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.marketIndices.map((index) => (
          <MetricCard
            key={index.name}
            title={index.name}
            value={index.value}
            pctChange={index.pct_chg}
          />
        ))}
        <MetricCard title="涨停家数" value={data.upCount} />
        <MetricCard title="跌停家数" value={data.downCount} />
        <MetricCard title="成交额" value={totalAmountDisplay} />
      </div>

      <div className="mb-6">
        <StockTable stocks={data.stocks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorFlowChart data={data.sectorFlows} />
        <DistributionChart upCount={data.upCount} downCount={data.downCount} />
      </div>
    </div>
  );
}

export default App;
