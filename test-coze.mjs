import { CozeAPI } from '@coze/api';

const token = 'pat_JywfrvYDax64ufuRY3vxLt5GhR1AxOs5uGkVuX9mzduy22DJ7rOJ1CcBruxzOJs6';
const botId = '7611010142896996361';

const coze = new CozeAPI({
  token,
  baseUrl: 'https://api.coze.cn',
});

async function test() {
  try {
    const chat = await coze.chat.createAndPoll({
      bot_id: botId,
      user_id: 'test_user',
      messages: [{ role: 'user', content: '返回JSON股票数据' }],
    });
    
    console.log('Status:', chat.chat.status);
    console.log('Messages count:', chat.messages.length);
    for (const msg of chat.messages) {
      console.log(`${msg.role}: ${msg.content?.substring(0, 200)}`);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
