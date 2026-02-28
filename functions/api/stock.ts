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
        query: '请直接返回JSON格式的股票数据，包含：market_indices(大盘指数)、stocks(个股行情)、sector_flows(板块资金)、up_count(涨停数)、down_count(跌停数)、total_amount(成交额)',
        stream: false,
      }),
    });

    const data = await response.json();
    
    if (data.code !== 0) {
      return new Response(JSON.stringify({ error: data.msg, code: data.code }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 提取消息内容
    const messages = data.data?.messages || [];
    let content = '';
    
    for (const msg of messages) {
      if (msg.role === 'assistant' && msg.content) {
        content = msg.content;
      }
    }

    // 尝试提取JSON
    let jsonData = null;
    if (content) {
      // 尝试提取JSON块
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          jsonData = JSON.parse(jsonMatch[1]);
        } catch (e) {}
      }
      
      // 如果没有json块，尝试直接解析
      if (!jsonData) {
        try {
          jsonData = JSON.parse(content);
        } catch (e) {}
      }
    }

    return new Response(JSON.stringify({ 
      content: content,
      jsonData: jsonData,
      hasMessages: messages.length,
      firstMessageRole: messages[0]?.role
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
