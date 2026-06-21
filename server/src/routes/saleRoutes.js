const express = require('express');
const router = express.Router();
const { getSales, getSaleById, createSale, deleteSale } = require('../controllers/saleController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getSales);
router.get('/:id', getSaleById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER', 'SALES'), createSale);
router.delete('/:id', rbacMiddleware('ADMIN'), deleteSale);

module.exports = router;
