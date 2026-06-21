const express = require('express');
const router = express.Router();
const { getPayments, getPaymentById, createPayment, deletePayment } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER'), createPayment);
router.delete('/:id', rbacMiddleware('ADMIN'), deletePayment);

module.exports = router;
