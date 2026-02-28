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
    { ts_code: '600036', name: '招商银行', close: 35.80, pct_chg: 0.56, change: 0.20, vol: 15000000, amount: 5370000000 },
    { ts_code: '000001', name: '平安银行', close: 12.45, pct_chg: -0.72, change: -0.09, vol: 8000000, amount: 996000000 },
  ],
  sectorFlows: [
    { name: '电子', amount: 50000 },
    { name: '医药', amount: 30000 },
    { name: '银行', amount: -20000 },
    { name: '房地产', amount: -15000 },
    { name: '新能源', amount: 25000 },
  ],
  upCount: 45,
  downCount: 12,
  totalAmount: 125000000000,
  lastUpdateTime: new Date().toLocaleString('zh-CN'),
};

function App() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const API_TOKEN = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
      const BOT_ID = '7611010142896996361';
      
      const response = await fetch('https://api.coze.cn/v3/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: BOT_ID,
          user_id: 'dashboard_user',
          query: '返回JSON股票数据',
          stream: false,
        }),
      });

      const responseText = await response.text();
      alert('API响应: ' + responseText.substring(0, 500));
      
      const dataObj = JSON.parse(responseText);
      
      if (dataObj.code !== 0) {
        setError('错误: ' + dataObj.msg);
      } else {
        const messages = dataObj.data?.messages || [];
        let content = '';
        for (const msg of messages) {
          if (msg.role === 'assistant' && msg.content) {
            content = msg.content;
          }
        }
        
        const processed = processCozeData(content);
        if (processed.stocks.length > 0) {
          setData(processed);
        } else {
          setError('未获取到有效数据');
        }
      }
    } catch (err) {
      setError('错误: ' + String(err));
    } finally {
      setIsLoading(false);
    }
  };

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
