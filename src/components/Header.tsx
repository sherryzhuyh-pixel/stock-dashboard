import { useState, useEffect } from 'react';
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
          onClick={() => {
            console.log('Refresh button clicked');
            onRefresh();
          }}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors cursor-pointer"
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? '加载中...' : '刷新数据'}</span>
        </button>
      </div>
    </header>
  );
}
