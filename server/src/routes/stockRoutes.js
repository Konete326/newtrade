const express = require('express');
const router = express.Router();
const { getStockOverview, adjustStock, transferStock } = require('../controllers/stockController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getStockOverview);
router.post('/adjust', rbacMiddleware('ADMIN', 'MANAGER'), adjustStock);
router.post('/transfer', rbacMiddleware('ADMIN', 'MANAGER'), transferStock);

module.exports = router;
