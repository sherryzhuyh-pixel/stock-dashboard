export async function fetchStockDataFromCoze(): Promise<string> {
  // 通过Cloudflare Pages Function代理调用
  const response = await fetch('/api/stock', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data.content || '';
}
