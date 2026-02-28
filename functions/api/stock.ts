export async function onRequestPost(context) {
  const { request } = context;
  
  const API_TOKEN = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
  const BOT_ID = '7611010142896996361';
  const API_BASE_URL = 'https://api.coze.cn';

  try {
    const response = await fetch(`${API_BASE_URL}/v3/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user_id: 'dashboard_user',
        query: '请执行工作流获取今日股票行情数据，返回JSON格式',
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `API request failed: ${response.status}`, details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (data.code !== 0) {
      return new Response(JSON.stringify({ error: data.msg, code: data.code }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取所有消息内容
    const messages = data.data?.messages || [];
    let content = '';
    
    // 遍历所有消息，找到最后一个assistant的消息
    for (const msg of messages) {
      if (msg.role === 'assistant' && msg.content) {
        content = msg.content;
      }
    }

    return new Response(JSON.stringify({ 
      content,
      messageCount: messages.length,
      raw: data
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
