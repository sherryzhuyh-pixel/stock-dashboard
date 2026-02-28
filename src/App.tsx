import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { StockTable } from '@/components/StockTable';
import { SectorFlowChart } from '@/components/SectorFlowChart';
import { DistributionChart } from '@/components/DistributionChart';
import { processCozeData } from '@/utils/dataProcessor';
import { DashboardData } from '@/types/stock';

const defaultData: DashboardData = {
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
  const [data, setData] = useState<DashboardData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMsg('正在触发工作流...');
    
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.error) {
        setError('错误: ' + result.error);
        setStatusMsg('');
      } else if (result.content) {
        setStatusMsg('正在处理数据...');
        const processed = processCozeData(result.content);
        
        if (processed.stocks.length > 0) {
          setData(processed);
          setStatusMsg('数据更新完成');
        } else {
          setError('未获取到有效数据: ' + result.content.substring(0, 300));
          setStatusMsg('');
        }
      } else {
        setError('无响应内容');
        setStatusMsg('');
      }
    } catch (err) {
      setError('请求失败: ' + String(err));
      setStatusMsg('');
    } finally {
      setIsLoading(false);
      // 3秒后清除状态消息
      setTimeout(() => setStatusMsg(''), 3000);
    }
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

      {statusMsg && (
        <div className="mb-4 p-4 bg-blue-900/30 border border-blue-800 rounded-lg text-blue-400">
          {statusMsg}
        </div>
      )}

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
