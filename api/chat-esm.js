import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 在模块加载时读取环境变量
let API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  try {
    const envPath = join(process.cwd(), '.env.local');
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      const match = content.match(/DEEPSEEK_API_KEY=(.+)/);
      if (match) {
        API_KEY = match[1].trim();
        console.log('Loaded API key from .env.local');
      }
    }
  } catch (e) {
    console.error('Failed to load .env.local:', e);
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.json({
      status: 'ready',
      hasKey: !!API_KEY,
      keyLength: API_KEY ? API_KEY.length : 0
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'API Key not configured',
      help: 'Check .env.local file'
    });
  }
  
  try {
    const { messages } = req.body;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ 
        error: 'DeepSeek API error',
        details: error
      });
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
}