import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { StockTable } from '@/components/StockTable';
import { SectorFlowChart } from '@/components/SectorFlowChart';
import { DistributionChart } from '@/components/DistributionChart';
import { fetchStockDataFromCoze } from '@/services/cozeApi';
import { processCozeData } from '@/utils/dataProcessor';
import { DashboardData } from '@/types/stock';

const demoData: DashboardData = {
  marketIndices: [
    { name: '上证指数', value: 3456.78, pct_chg: 1.23 },
    { name: '深证成指', value: 12345.67, pct_chg: 0.89 },
  ],
  stocks: [
    { ts_code: '600519', name: '贵州茅台', close: 1850.00, pct_chg: 2.35, change: 42.50, vol: 5000000, amount: 9250000000 },
    { ts_code: '000858', name: '五粮液', close: 168.50, pct_chg: -1.20, change: -2.05, vol: 2000000, amount: 3370000000 },
  ],
  sectorFlows: [
    { name: '电子', amount: 50000 },
    { name: '医药', amount: 30000 },
  ],
  upCount: 45,
  downCount: 12,
  totalAmount: 125000000000,
  lastUpdateTime: new Date().toLocaleString('zh-CN'),
};

function App() {
  const [data, setData] = useState<DashboardData>(demoData);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStatusMsg('正在获取股票数据...');
    
    try {
      const rawData = await fetchStockDataFromCoze();
      console.log('Raw data:', rawData);
      
      if (rawData) {
        const processed = processCozeData(rawData);
        if (processed.stocks.length > 0) {
          setData(processed);
          setStatusMsg('数据更新完成');
        } else {
          // 使用原始文本作为调试信息
          setError('未能解析数据: ' + rawData.substring(0, 300));
        }
      } else {
        setError('未获取到数据');
      }
    } catch (err) {
      setError('错误: ' + String(err));
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalAmountDisplay = data.totalAmount >= 100000000 
    ? (data.totalAmount / 100000000).toFixed(2) + '万亿'
    : (data.totalAmount / 10000).toFixed(0) + '亿';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F0F0F', padding: '24px' }}>
      <Header 
        lastUpdateTime={data.lastUpdateTime} 
        onRefresh={fetchData}
        isLoading={isLoading}
      />

      {statusMsg && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(30, 58, 138, 0.3)', border: '1px solid rgba(59, 130, 246, 0.5)', borderRadius: '8px', color: '#60a5fa' }}>
          {statusMsg}
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(127, 29, 29, 0.3)', border: '1px solid rgba(185, 28, 28, 0.5)', borderRadius: '8px', color: '#f87171', fontSize: '12px', overflow: 'auto' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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

      <div style={{ marginBottom: '24px' }}>
        <StockTable stocks={data.stocks} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <SectorFlowChart data={data.sectorFlows} />
        <DistributionChart upCount={data.upCount} downCount={data.downCount} />
      </div>
    </div>
  );
}

export default App;
