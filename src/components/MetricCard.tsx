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
