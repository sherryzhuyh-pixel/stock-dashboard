import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { StockTable } from '@/components/StockTable';
import { SectorFlowChart } from '@/components/SectorFlowChart';
import { DistributionChart } from '@/components/DistributionChart';
import { processCozeData } from '@/utils/dataProcessor';
import { DashboardData } from '@/types/stock';

const API_TOKEN = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
const BOT_ID = '7611010142896996361';
const API_BASE_URL = 'https://api.coze.cn';

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

async function callCozeAPI(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/v3/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: BOT_ID,
      user_id: 'dashboard_user',
      query: '请返回JSON格式的股票数据，包含market_indices、stocks、sector_flows、up_count、down_count、total_amount',
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.code !== 0) {
    throw new Error(`Coze错误: ${data.msg}`);
  }

  // 获取消息内容
  const messages = data.data?.messages || [];
  let content = '';
  
  for (const msg of messages) {
    if (msg.role === 'assistant' && msg.content) {
      content = msg.content;
    }
  }

  return content;
}

function App() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo('');
    
    try {
      // 直接调用Coze API（绕过代理）
      const rawData = await callCozeAPI();
      console.log('Raw API response:', rawData);
      setDebugInfo('API响应: ' + rawData.substring(0, 1000));
      
      const processedData = processCozeData(rawData);
      console.log('Processed data:', processedData);
      setData(processedData);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取数据失败';
      setError(errMsg);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
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
          错误: {error}
        </div>
      )}

      {debugInfo && (
        <div className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg text-green-400 text-xs overflow-auto">
          <pre>{debugInfo}</pre>
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
