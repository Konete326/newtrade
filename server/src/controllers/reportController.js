const { asyncHandler } = require('../utils/asyncHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { generateSalesInsight, generateStockAlert, askJarvis } = require('../services/aiService');

const getDateRange = (period) => {
  const now = new Date();
  const ranges = {
    today: { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date() },
    week: { start: new Date(now.setDate(now.getDate() - 7)), end: new Date() },
    month: { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date() },
    year: { start: new Date(now.getFullYear(), 0, 1), end: new Date() }
  };
  return ranges[period] || ranges.month;
};

const getSalesReport = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const { period = 'month', startDate, endDate } = req.query;
  const range = (startDate && endDate) ? { start: new Date(startDate), end: new Date(endDate) } : getDateRange(period);
  const query = { companyId: req.companyId, isDeleted: false, createdAt: { $gte: range.start, $lte: range.end } };
  const sales = await Sale.find(query).populate('customerId', 'name');
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const cashSales = sales.filter(s => s.saleType === 'CASH').reduce((sum, s) => sum + s.totalAmount, 0);
  const creditSales = sales.filter(s => s.saleType === 'CREDIT').reduce((sum, s) => sum + s.totalAmount, 0);
  res.json({
    success: true, message: 'Sales report fetched',
    data: { totalSales, cashSales, creditSales, transactionCount: sales.length, period, sales }
  });
});

const getStockReport = asyncHandler(async (req, res) => {
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const { lowStockThreshold = 10 } = req.query;
  const products = await Product.find({ companyId: req.companyId, isDeleted: false });
  const lowStock = products.filter(p => p.currentStock <= Number(lowStockThreshold));
  const outOfStock = products.filter(p => p.currentStock <= 0);
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * (p.salePrice || 0)), 0);
  res.json({
    success: true, message: 'Stock report fetched',
    data: { totalProducts: products.length, lowStock, outOfStock, totalStockValue: totalValue }
  });
});

const getExpenseReport = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const { period = 'month' } = req.query;
  const range = getDateRange(period);
  const expenses = await Expense.find({ companyId: req.companyId, isDeleted: false, createdAt: { $gte: range.start, $lte: range.end } });
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const pending = expenses.filter(e => e.approvalStatus === 'PENDING').length;
  res.json({ success: true, message: 'Expense report fetched', data: { totalExpenses, byCategory, pendingApproval: pending, expenses } });
});

const getProfitLoss = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const { period = 'month' } = req.query;
  const range = getDateRange(period);
  const dateFilter = { $gte: range.start, $lte: range.end };
  const sales = await Sale.find({ companyId: req.companyId, isDeleted: false, createdAt: dateFilter });
  const expenses = await Expense.find({ companyId: req.companyId, isDeleted: false, createdAt: dateFilter, approvalStatus: 'APPROVED' });
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.json({ success: true, message: 'P&L fetched', data: { totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses, period } });
});

const getAiInsight = asyncHandler(async (req, res) => {
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const Product = DatabaseManager.getModel(req.companyId, 'ProductModel');
  const { type = 'sales', period = 'month' } = req.query;
  if (type === 'stock') {
    const products = await Product.find({ companyId: req.companyId, isDeleted: false, currentStock: { $lte: 10 } });
    const insight = await generateStockAlert(products);
    return res.json({ success: true, message: 'AI insight generated', data: { insight } });
  }
  const range = getDateRange(period);
  const sales = await Sale.find({ companyId: req.companyId, isDeleted: false, createdAt: { $gte: range.start, $lte: range.end } });
  const insight = await generateSalesInsight(sales, period);
  res.json({ success: true, message: 'AI insight generated', data: { insight } });
});

const askJarvisHandler = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required', data: null });
  const Sale = DatabaseManager.getModel(req.companyId, 'SaleModel');
  const recentSales = await Sale.find({ companyId: req.companyId, isDeleted: false }).sort({ createdAt: -1 }).limit(10);
  const context = { companyId: req.companyId, recentTransactionCount: recentSales.length };
  const response = await askJarvis(prompt, context);
  res.json({ success: true, message: 'Jarvis response', data: { response } });
});

module.exports = { getSalesReport, getStockReport, getExpenseReport, getProfitLoss, getAiInsight, askJarvisHandler };

