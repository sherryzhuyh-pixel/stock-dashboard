const API_TOKEN = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
const BOT_ID = '7611010142896996361';

export async function fetchStockDataFromCoze(): Promise<string> {
  const response = await fetch('https://api.coze.cn/v3/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: BOT_ID,
      user_id: 'dashboard_user',
      additional_messages: [{
        role: 'user',
        content: '返回JSON格式股票数据，包含上证指数、深证成指、涨停数、跌停数、成交额、个股行情(代码、名称、收盘价、涨跌幅)',
        content_type: 'text'
      }],
      stream: true
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          
          // Check for message content
          if (data.type === 'answer' && data.content) {
            fullContent += data.content;
          }
          
          // Check for completed event
          if (data.event === 'conversation.chat.completed') {
            return fullContent;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullContent;
}
