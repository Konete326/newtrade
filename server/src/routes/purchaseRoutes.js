const express = require('express');
const router = express.Router();
const { getPurchases, getPurchaseById, createPurchase, deletePurchase } = require('../controllers/purchaseController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getPurchases);
router.get('/:id', getPurchaseById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER'), createPurchase);
router.delete('/:id', rbacMiddleware('ADMIN'), deletePurchase);

module.exports = router;
