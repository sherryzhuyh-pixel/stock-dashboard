import { useState, useEffect, useCallback } from 'react';

interface HeaderProps {
  lastUpdateTime: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({ lastUpdateTime, onRefresh, isLoading }: HeaderProps) {
  const handleClick = () => {
    alert('按钮被点击了！');
    onRefresh();
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>股票行情 Dashboard</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ color: '#999' }}>
          <span>最后更新: {lastUpdateTime}</span>
        </div>
        <button
          onClick={handleClick}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: isLoading ? '#1d4ed8' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {isLoading ? '加载中...' : '刷新数据'}
        </button>
      </div>
    </header>
  );
}
