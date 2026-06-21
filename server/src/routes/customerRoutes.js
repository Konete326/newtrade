const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerLedger } = require('../controllers/customerController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/ledger', rbacMiddleware('ADMIN', 'MANAGER'), getCustomerLedger);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER'), createCustomer);
router.put('/:id', rbacMiddleware('ADMIN', 'MANAGER'), updateCustomer);
router.delete('/:id', rbacMiddleware('ADMIN'), deleteCustomer);

module.exports = router;
