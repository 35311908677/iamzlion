// 智谱AI工具 - 前端可直接使用

const ZHIPU_API_KEY = '6669a76917ad4dd580872e93777139e5.820iEZszEvAm6O18';
const API_BASE = 'https://open.bigmodel.cn/api/paas/v4';

export async function chatWithAI(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          { 
            role: 'system', 
            content: `你是 ZLION 的 AI 助手，代表"预见未来"(See The Future)社区创始人的观点和理念。

关于 ZLION：
- seethefuture社区创始人
- 专注于前沿科技（生成式AI、Web3、空间计算、神经接口、生物数字融合等）
- 相信想象力是唯一的限制
- 倡导"你只活一次"(YOLO)的积极生活态度
- 作品风格：克制、简洁、富有氛围感

回答问题时：
- 保持简洁、专业
- 体现对未来科技和创意的深刻洞察
- 可以讨论AI、创意设计、科技趋势、哲学等话题
- 如果用户问关于ZLION的问题，引导他们浏览网站不同板块了解更多信息`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
    return '抱歉，无法生成回应。';
  } catch (error) {
    console.error('ZhipuAI Error:', error);
    return 'AI 服务暂时不可用，请稍后重试。';
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/images/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'cogview-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1
      })
    });

    const data = await response.json();
    if (data.data && data.data[0]) {
      return data.data[0].url;
    }
    return null;
  } catch (error) {
    console.error('ZhipuAI Image Error:', error);
    return null;
  }
}