import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { StockTable } from '@/components/StockTable';
import { SectorFlowChart } from '@/components/SectorFlowChart';
import { DistributionChart } from '@/components/DistributionChart';
import { fetchStockDataFromCoze } from '@/services/cozeApi';
import { processCozeData } from '@/utils/dataProcessor';
import { DashboardData } from '@/types/stock';

const defaultData: DashboardData = {
  marketIndices: [
    { name: '上证指数', value: 0, pct_chg: 0 },
    { name: '深证成指', value: 0, pct_chg: 0 },
  ],
  stocks: [],
  sectorFlows: [],
  upCount: 0,
  downCount: 0,
  totalAmount: 0,
  lastUpdateTime: '',
};

function App() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rawData = await fetchStockDataFromCoze();
      const processedData = processCozeData(rawData);
      setData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() >= 16 && now.getHours() < 17) {
        fetchData();
      }
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalAmountDisplay = data.totalAmount >= 100000000 
    ? (data.totalAmount / 100000000).toFixed(2) + '万亿'
    : (data.totalAmount / 10000).toFixed(0) + '亿';

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <Header 
        lastUpdateTime={data.lastUpdateTime || '未更新'} 
        onRefresh={fetchData}
        isLoading={isLoading}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
          {error}
        </div>
      )}

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
