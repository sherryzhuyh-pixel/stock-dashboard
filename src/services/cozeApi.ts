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
