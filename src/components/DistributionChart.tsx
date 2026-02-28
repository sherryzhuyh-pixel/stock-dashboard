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
