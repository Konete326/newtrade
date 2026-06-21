const express = require('express');
const router = express.Router();
const { getSalesReport, getStockReport, getExpenseReport, getProfitLoss, getAiInsight, askJarvisHandler } = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/sales', rbacMiddleware('ADMIN', 'MANAGER'), getSalesReport);
router.get('/stock', rbacMiddleware('ADMIN', 'MANAGER'), getStockReport);
router.get('/expenses', rbacMiddleware('ADMIN', 'MANAGER'), getExpenseReport);
router.get('/profit-loss', rbacMiddleware('ADMIN', 'MANAGER'), getProfitLoss);
router.get('/ai/insight', rbacMiddleware('ADMIN', 'MANAGER'), getAiInsight);
router.post('/ai/jarvis', rbacMiddleware('ADMIN', 'MANAGER'), askJarvisHandler);

module.exports = router;
