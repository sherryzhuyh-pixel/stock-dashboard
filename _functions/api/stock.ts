export async function onRequestPost(context) {
  const { request } = context;
  
  const API_TOKEN = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
  const BOT_ID = '7611010142896996361';
  const API_BASE_URL = 'https://api.coze.cn';

  const maxRetries = 30; // 最多等待30次
  const retryInterval = 5000; // 每次等待5秒

  async function waitForCompletion(conversationId: string, chatId: string): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      
      const statusResponse = await fetch(
        `${API_BASE_URL}/v3/chat/${conversationId}/messages?chat_id=${chatId}`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const statusData = await statusResponse.json();
      
      if (statusData.code !== 0) {
        throw new Error(`检查状态失败: ${statusData.msg}`);
      }

      const messages = statusData.data?.messages || [];
      
      // 查找完成的消息
      for (const msg of messages) {
        if (msg.role === 'assistant' && msg.type === 'text' && msg.content) {
          return msg.content;
        }
        
        // 检查是否显示完成
        if (msg.status === 'completed') {
          return msg.content || '';
        }
      }
    }
    
    throw new Error('等待超时，工作流未完成');
  }

  try {
    // 1. 创建对话
    const createResponse = await fetch(`${API_BASE_URL}/v1/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
      }),
    });

    const createData = await createResponse.json();
    
    if (createData.code !== 0) {
      return new Response(JSON.stringify({ error: '创建对话失败: ' + createData.msg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const conversationId = createData.data?.id;
    
    // 2. 发送消息触发工作流
    const chatResponse = await fetch(`${API_BASE_URL}/v3/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        conversation_id: conversationId,
        user_id: 'dashboard_user',
        query: '请执行工作流获取今日股票行情数据，返回JSON格式',
        stream: false,
      }),
    });

    const chatData = await chatResponse.json();
    
    if (chatData.code !== 0) {
      return new Response(JSON.stringify({ error: '发送消息失败: ' + chatData.msg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const chatId = chatData.data?.chat_id;

    // 3. 等待工作流完成（最多等待约2.5分钟）
    const content = await waitForCompletion(conversationId, chatId);

    return new Response(JSON.stringify({ 
      content: content,
      status: 'completed'
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
