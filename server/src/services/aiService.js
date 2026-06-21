const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const askJarvis = async (prompt, context) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured.');
  const systemInstruction = `You are Jarvis, an AI assistant for Trader Desktop ERP, a B2B/B2C wholesale management system for Pakistani markets. You help with sales analysis, stock insights, and business recommendations. Always respond in a concise, professional manner. Context: ${JSON.stringify(context || {})}`;
  const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
    contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Query: ${prompt}` }] }]
  }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
  const candidates = response.data?.candidates;
  if (!candidates || candidates.length === 0) return 'No response generated.';
  return candidates[0]?.content?.parts?.[0]?.text || 'No response generated.';
};

const generateSalesInsight = async (salesData, period) => {
  const totalSales = salesData.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const topProducts = {};
  salesData.forEach(s => {
    (s.items || []).forEach(item => {
      topProducts[item.name] = (topProducts[item.name] || 0) + item.total;
    });
  });
  const sorted = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const prompt = `Analyze this ${period} sales data: Total sales Rs.${totalSales} across ${salesData.length} transactions. Top 5 products by revenue: ${sorted.map(([n, v]) => `${n}: Rs.${v}`).join(', ')}. Provide 3 actionable business insights.`;
  return askJarvis(prompt, { totalSales, transactionCount: salesData.length, period });
};

const generateStockAlert = async (lowStockProducts) => {
  const prompt = `These products have low stock: ${lowStockProducts.map(p => `${p.name} (${p.currentStock} remaining)`).join(', ')}. Suggest reorder quantities and priority.`;
  return askJarvis(prompt, { productCount: lowStockProducts.length });
};

module.exports = { askJarvis, generateSalesInsight, generateStockAlert };
