# 股票行情 Dashboard 设计方案

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建一个网页版Dashboard，通过调用Coze API执行智能体工作流获取股票数据，并以专业表格和图表形式展示

**Architecture:** 前端使用React+TypeScript+Vite，后端通过Coze API调用Bot工作流获取数据，数据清洗后使用ECharts渲染专业股票行情图表

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, ECharts, Cloudflare Pages

---

## 一、功能需求

### 1.1 核心功能
- 通过Coze API调用Bot工作流获取当日股票数据
- 数据清洗加工，按专业个股行情格式展示
- 支持手动刷新和定时刷新（每天收盘后）
- 专业股票行情表格展示
- 板块资金流向图表
- 大盘指数指标卡片

### 1.2 数据来源
- **API Token:** pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6
- **Bot ID:** 7611010142896996361
- **调用方式:** POST https://api.coze.cn/v3/chat

---

## 二、页面设计

### 2.1 整体布局
```
┌─────────────────────────────────────────────────────────────┐
│  Header: 股票行情 Dashboard        [最后更新时间] [刷新按钮] │
├─────────────────────────────────────────────────────────────┤
│  指标卡片区域 (4列)                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ 上证指数  │ │  深证成指 │ │  涨停家数 │ │  跌停家数 │     │
│  │ 3,456.78 │ │ 11,234.56│ │    45    │ │    12    │     │
│  │ +1.23%   │ │ +0.89%   │ │          │ │          │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    个股行情表格                          ││
│  │  代码  │ 名称  │ 收盘价 │ 涨跌幅 │ 涨跌额 │ 成交量 │ 成交额 ││
│  │ 600519│ 茅台  │1850.00│ +2.35% │+42.50 │ 500万  │ 92.5亿 ││
│  │ 000858│ 五粮液│ 168.50│ -1.20% │ -2.05 │ 200万  │ 33.7亿 ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌───────────────────────────┐│
│  │    板块资金流向(万元)    │ │     涨跌幅分布             ││
│  │  电子: +50,000          │ │   上涨: 1200家(60%)       ││
│  │  医药: +30,000         │ │   下跌: 800家(40%)        ││
│  │  银行: -20,000         │ │                           ││
│  └─────────────────────────┘ └───────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 2.2 配色方案
- 上涨: #FF4D4F (红色)
- 下跌: #52C41A (绿色)
- 背景: #0F0F0F (深色)
- 卡片背景: #1A1A1A
- 文字: #E5E5E5 (主文字), #999999 (次要文字)

---

## 三、技术架构

### 3.1 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | 样式框架 |
| shadcn/ui | latest | UI组件库 |
| ECharts | 5.x | 图表展示 |
| dayjs | latest | 时间处理 |

### 3.2 API调用
```typescript
// Coze API v3
const response = await fetch('https://api.coze.cn/v3/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bot_id: BOT_ID,
    user_id: 'dashboard_user',
    query: '请执行工作流获取今日股票行情数据'
  })
});
```

### 3.3 数据清洗
从Coze返回的原始数据需要清洗为标准格式：
```typescript
interface StockData {
  ts_code: string;    // 股票代码
  name: string;       // 股票名称
  close: number;      // 收盘价
  pct_chg: number;    // 涨跌幅
  change: number;     // 涨跌额
  vol: number;        // 成交量
  amount: number;     // 成交额
}
```

---

## 四、部署方案

### 4.1 部署平台
- **Cloudflare Pages** (免费，无需注册)
- 自动部署推送代码

### 4.2 域名
- 默认为 Cloudflare 分配的子域名
- 可自定义域名（如有需要）

---

## 五、开发计划

### Phase 1: 项目初始化
- 创建Vite+React+TypeScript项目
- 配置Tailwind CSS和shadcn/ui
- 安装ECharts和相关依赖

### Phase 2: 核心功能开发
- Coze API调用封装
- 数据清洗函数编写
- 股票表格组件开发
- 指标卡片组件开发

### Phase 3: 图表展示
- 板块资金流向图
- 涨跌幅分布饼图
- 大盘指数走势图（可选）

### Phase 4: 优化和部署
- 响应式设计优化
- 加载状态处理
- Cloudflare Pages部署

---

## 六、文件结构

```
stock-dashboard/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── StockTable.tsx
│   │   ├── MetricCard.tsx
│   │   ├── SectorFlowChart.tsx
│   │   └── PieChart.tsx
│   ├── services/
│   │   └── cozeApi.ts
│   ├── utils/
│   │   └── dataProcessor.ts
│   ├── types/
│   │   └── stock.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```
