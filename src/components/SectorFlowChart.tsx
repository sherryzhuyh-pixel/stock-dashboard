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
