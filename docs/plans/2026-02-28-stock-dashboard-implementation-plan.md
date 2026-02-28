# 股票行情 Dashboard 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建一个网页版Dashboard，通过调用Coze API执行智能体工作流获取股票数据，并以专业表格和图表形式展示

**Architecture:** 前端使用React+TypeScript+Vite，后端通过Coze API调用Bot工作流获取数据，数据清洗后使用ECharts渲染专业股票行情图表

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, ECharts, Cloudflare Pages

---

## Task 1: 初始化项目

**Files:**
- Create: `C:/Users/HUAWEI/code/stock-dashboard/package.json`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/tsconfig.json`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/vite.config.ts`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/tailwind.config.js`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/postcss.config.js`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/index.html`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/main.tsx`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/App.tsx`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/index.css`

### Step 1: 创建 package.json

```json
{
  "name": "stock-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "echarts": "^5.4.3",
    "echarts-for-react": "^3.0.2",
    "dayjs": "^1.11.10",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "lucide-react": "^0.312.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.12"
  }
}
```

### Step 2: 创建 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 3: 创建 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 4: 创建 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        up: '#FF4D4F',
        down: '#52C41A',
        bg: {
          primary: '#0F0F0F',
          card: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}
```

### Step 5: 创建 postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 6: 创建 index.html

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>股票行情 Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 7: 创建 src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 8: 创建 src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
  margin: 0;
  background-color: #0F0F0F;
  color: #E5E5E5;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}
```

### Step 9: 创建 src/App.tsx

```typescript
function App() {
  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <h1 className="text-2xl font-bold text-white mb-6">股票行情 Dashboard</h1>
      <p className="text-gray-400">正在加载数据...</p>
    </div>
  )
}

export default App
```

### Step 10: 创建 tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Task 2: 创建类型定义

**Files:**
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/types/stock.ts`

### Step 1: 创建类型定义

```typescript
export interface StockData {
  ts_code: string;
  name: string;
  close: number;
  pct_chg: number;
  change: number;
  vol: number;
  amount: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  pct_chg: number;
}

export interface SectorFlow {
  name: string;
  amount: number;
}

export interface DashboardData {
  marketIndices: MarketIndex[];
  stocks: StockData[];
  sectorFlows: SectorFlow[];
  upCount: number;
  downCount: number;
  totalAmount: number;
  lastUpdateTime: string;
}
```

---

## Task 3: 创建Coze API服务

**Files:**
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/services/cozeApi.ts`

### Step 1: 创建Coze API服务

```typescript
const API_TOKEN = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
const BOT_ID = '7611010142896996361';
const API_BASE_URL = 'https://api.coze.cn';

interface CozeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CozeResponse {
  code: number;
  msg: string;
  data?: {
    messages: CozeMessage[];
  };
}

export async function fetchStockDataFromCoze(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/v3/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: BOT_ID,
      user_id: 'dashboard_user',
      query: '请执行工作流获取今日股票行情数据，返回完整的股票数据',
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: CozeResponse = await response.json();
  
  if (data.code !== 0) {
    throw new Error(`Coze API error: ${data.msg}`);
  }

  const messages = data.data?.messages || [];
  const lastMessage = messages[messages.length - 1];
  
  if (lastMessage?.role === 'assistant') {
    return lastMessage.content;
  }

  return '';
}
```

---

## Task 4: 创建数据清洗工具

**Files:**
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/utils/dataProcessor.ts`

### Step 1: 创建数据清洗工具

```typescript
import { DashboardData, StockData, MarketIndex, SectorFlow } from '@/types/stock';

interface RawCozeData {
  market_indices?: Array<{ name: string; value: number; pct_chg: number }>;
  stocks?: Array<{
    ts_code: string;
    name: string;
    close: number;
    pct_chg: number;
    change: number;
    vol: number;
    amount: number;
  }>;
  sector_flows?: Array<{ name: string; amount: number }>;
  up_count?: number;
  down_count?: number;
  total_amount?: number;
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[,%亿万元]/g, '')) || 0;
}

function parseVolume(value: string | number | undefined): string {
  if (value === undefined || value === null) return '0';
  if (typeof value === 'number') {
    if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿';
    if (value >= 10000) return (value / 10000).toFixed(2) + '万';
    return value.toString();
  }
  return value;
}

function parseAmount(value: string | number | undefined): string {
  if (value === undefined || value === null) return '0';
  if (typeof value === 'number') {
    if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿';
    if (value >= 10000) return (value / 10000).toFixed(2) + '万';
    return value.toString();
  }
  return value;
}

export function processCozeData(rawText: string): DashboardData {
  try {
    const cleaned = rawText.replace(/```(?:json)?\n?/g, '').trim();
    const data: RawCozeData = JSON.parse(cleaned);

    const stocks: StockData[] = (data.stocks || []).map(s => ({
      ts_code: s.ts_code,
      name: s.name,
      close: parseNumber(s.close),
      pct_chg: parseNumber(s.pct_chg),
      change: parseNumber(s.change),
      vol: parseNumber(s.vol),
      amount: parseNumber(s.amount),
    }));

    const marketIndices: MarketIndex[] = (data.market_indices || []).map(m => ({
      name: m.name,
      value: parseNumber(m.value),
      pct_chg: parseNumber(m.pct_chg),
    }));

    const sectorFlows: SectorFlow[] = (data.sector_flows || []).map(s => ({
      name: s.name,
      amount: parseNumber(s.amount),
    }));

    return {
      marketIndices,
      stocks,
      sectorFlows,
      upCount: data.up_count || 0,
      downCount: data.down_count || 0,
      totalAmount: data.total_amount || 0,
      lastUpdateTime: new Date().toLocaleString('zh-CN'),
    };
  } catch (error) {
    console.error('Failed to parse Coze data:', error);
    return {
      marketIndices: [],
      stocks: [],
      sectorFlows: [],
      upCount: 0,
      downCount: 0,
      totalAmount: 0,
      lastUpdateTime: new Date().toLocaleString('zh-CN'),
    };
  }
}

export { parseVolume, parseAmount };
```

---

## Task 5: 创建UI组件

**Files:**
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/components/Header.tsx`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/components/MetricCard.tsx`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/components/StockTable.tsx`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/components/SectorFlowChart.tsx`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/components/DistributionChart.tsx`

### Step 1: 创建 Header 组件

```typescript
import { RefreshCw, Clock } from 'lucide-react';

interface HeaderProps {
  lastUpdateTime: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({ lastUpdateTime, onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-white">股票行情 Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span className="text-sm">最后更新: {lastUpdateTime}</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? '加载中...' : '刷新数据'}</span>
        </button>
      </div>
    </header>
  );
}
```

### Step 2: 创建 MetricCard 组件

```typescript
import { MarketIndex } from '@/types/stock';

interface MetricCardProps {
  title: string;
  value: string | number;
  pctChange?: number;
  suffix?: string;
}

export function MetricCard({ title, value, pctChange, suffix = '' }: MetricCardProps) {
  const isPositive = pctChange !== undefined && pctChange >= 0;
  const changeColor = pctChange === undefined ? '' : isPositive ? 'text-up' : 'text-down';

  return (
    <div className="bg-bg-card rounded-lg p-4 border border-gray-800">
      <div className="text-gray-400 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }) : value}
        {suffix && <span className="text-lg font-normal ml-1">{suffix}</span>}
      </div>
      {pctChange !== undefined && (
        <div className={`text-lg font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{pctChange.toFixed(2)}%
        </div>
      )}
    </div>
  );
}
```

### Step 3: 创建 StockTable 组件

```typescript
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
```

### Step 4: 创建 SectorFlowChart 组件

```typescript
import ReactECharts from 'echarts-for-react';
import { SectorFlow } from '@/types/stock';

interface SectorFlowChartProps {
  data: SectorFlow[];
}

export function SectorFlowChart({ data }: SectorFlowChartProps) {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount).slice(0, 10);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const item = params[0];
        const value = item.value;
        const color = value >= 0 ? '#FF4D4F' : '#52C41A';
        return `${item.name}<br/>资金流向: <span style="color:${color}">${value >= 0 ? '+' : ''}${value.toLocaleString()} 万元</span>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#999',
        formatter: (value: number) => {
          if (value >= 10000) return (value / 10000) + '亿';
          return value + '万';
        },
      },
      splitLine: {
        lineStyle: {
          color: '#333',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(d => d.name),
      axisLabel: {
        color: '#E5E5E5',
      },
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map(d => ({
          value: d.amount,
          itemStyle: {
            color: d.amount >= 0 ? '#FF4D4F' : '#52C41A',
          },
        })),
        barWidth: '60%',
      },
    ],
  };

  return (
    <div className="bg-bg-card rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">板块资金流向 (万元)</h2>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}
```

### Step 5: 创建 DistributionChart 组件

```typescript
import ReactECharts from 'echarts-for-react';

interface DistributionChartProps {
  upCount: number;
  downCount: number;
}

export function DistributionChart({ upCount, downCount }: DistributionChartProps) {
  const total = upCount + downCount;
  const upPercent = total > 0 ? ((upCount / total) * 100).toFixed(1) : '0';
  const downPercent = total > 0 ? ((downCount / total) * 100).toFixed(1) : '0';

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}家 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#E5E5E5',
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        data: [
          {
            value: upCount,
            name: `上涨 ${upPercent}%`,
            itemStyle: { color: '#FF4D4F' },
          },
          {
            value: downCount,
            name: `下跌 ${downPercent}%`,
            itemStyle: { color: '#52C41A' },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-bg-card rounded-lg p-4 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">涨跌幅分布</h2>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}
```

---

## Task 6: 集成App主组件

**Files:**
- Modify: `C:/Users/HUAWEI/code/stock-dashboard/src/App.tsx`

### Step 1: 更新 App.tsx

```typescript
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
```

---

## Task 7: 创建部署配置

**Files:**
- Create: `C:/Users/HUAWEI/code/stock-dashboard/src/vite-env.d.ts`
- Create: `C:/Users/HUAWEI/code/stock-dashboard/.gitignore`

### Step 1: 创建 vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

### Step 2: 创建 .gitignore

```
node_modules
dist
.DS_Store
*.log
.env
.env.local
```

---

## 执行说明

### 安装依赖并启动开发服务器

```bash
cd C:/Users/HUAWEI/code/stock-dashboard
npm install
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 部署到 Cloudflare Pages

1. 将代码推送到 GitHub 仓库
2. 登录 Cloudflare Dashboard
3. 创建 Pages 项目，连接 GitHub 仓库
4. 构建命令: `npm run build`
5. 输出目录: `dist`

---

## 计划完成

**Plan complete and saved to `docs/plans/2026-02-28-stock-dashboard-design.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration
2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
